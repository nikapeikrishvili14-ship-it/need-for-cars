"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { cars, getCar } from "@/data/cars";
import { site } from "@/data/site";
import type { Locale } from "@/i18n/routing";
import { formatMoney, useMoney } from "@/lib/currency";
import { deliveryFee, getCity } from "@/lib/delivery";
import { daysBetween, isEmail, isPhone, useForm, useToday, type Errors } from "@/lib/form";
import { sendToOwner, type SendResult } from "@/lib/web3forms";
import { toLines } from "@/lib/whatsapp";
import BookingEstimate, { type EstimateLine } from "./BookingEstimate";
import AskUs from "./AskUs";
import {
  Field,
  FormAlert,
  FormSection,
  Honeypot,
  SendError,
  SubmitButton,
  SuccessPanel,
  WhatsAppCta,
  fieldA11y,
  inputClass,
} from "./form/FormParts";

const CUSTOM = "custom";

type Values = {
  name: string;
  phone: string;
  email: string;
  car: string;
  pickupDate: string;
  returnDate: string;
  pickupLocation: string;
  pickupAddress: string;
  dropoffLocation: string;
  dropoffAddress: string;
  driverAge: string;
  experience: string;
  flightNumber: string;
  message: string;
  honeypot: string;
};

// Checks run in on-screen order: the first error found is the field focused on submit
function validate(v: Values, today: string): Errors<Values> {
  const e: Errors<Values> = {};
  if (!v.car) e.car = "required";

  if (!v.pickupDate) e.pickupDate = "required";
  else if (today && v.pickupDate < today) e.pickupDate = "pastDate";
  if (!v.returnDate) e.returnDate = "required";
  else if (v.pickupDate && v.returnDate <= v.pickupDate) e.returnDate = "returnAfterPickup";

  if (!v.pickupLocation) e.pickupLocation = "required";
  else if (v.pickupLocation === CUSTOM && !v.pickupAddress.trim()) e.pickupAddress = "required";
  if (!v.dropoffLocation) e.dropoffLocation = "required";
  else if (v.dropoffLocation === CUSTOM && !v.dropoffAddress.trim()) e.dropoffAddress = "required";

  const age = Number(v.driverAge);
  const exp = Number(v.experience);
  if (!v.driverAge) e.driverAge = "required";
  else if (!Number.isInteger(age) || age < 18 || age > 99) e.driverAge = "age";
  if (v.experience === "") e.experience = "required";
  else if (!Number.isInteger(exp) || exp < 0 || exp > 80) e.experience = "experience";
  else if (!e.driverAge && exp > age - 16) e.experience = "experienceVsAge";

  if (!v.name.trim()) e.name = "required";
  if (!v.phone.trim()) e.phone = "required";
  else if (!isPhone(v.phone)) e.phone = "phone";
  if (v.email.trim() && !isEmail(v.email)) e.email = "email";
  return e;
}

export default function BookingForm() {
  const t = useTranslations("booking");
  const tf = useTranslations("form");
  const td = useTranslations("delivery");
  const tCar = useTranslations("car");
  const locale = useLocale() as Locale;
  const tp = useTranslations("price");
  const money = useMoney();
  // Plain-text price for <option> labels (they can't contain <Price>)
  const optionPrice = (usd: number, per?: "day") => {
    const { text, approx } = money(usd);
    return [approx && tp("approx"), text, per && tp("perDay")].filter(Boolean).join(" ");
  };
  const today = useToday();

  // Pre-select the car from /book?car=[slug]
  const requestedCar = useSearchParams().get("car") ?? "";
  const initial: Values = {
    name: "",
    phone: "",
    email: "",
    car: getCar(requestedCar) ? requestedCar : "",
    pickupDate: "",
    returnDate: "",
    pickupLocation: "",
    pickupAddress: "",
    dropoffLocation: "",
    dropoffAddress: "",
    driverAge: "",
    experience: "",
    flightNumber: "",
    message: "",
    honeypot: "",
  };

  const form = useForm(initial, (v) => validate(v, today));
  const { values: v, set, touch, errorFor } = form;
  const [status, setStatus] = useState<"idle" | "sending" | SendResult>("idle");

  const car = getCar(v.car);
  const carName = car ? `${car.brand} ${car.model}` : "";
  const days = daysBetween(v.pickupDate, v.returnDate);

  // ----- Locations -----
  const locationName = (id: string, address: string, lang: Locale = locale) =>
    id === CUSTOM ? address.trim() || t("fields.custom") : (getCity(id)?.name[lang] ?? "");
  // Option labels show the full rule: "Tbilisi Airport — +$50 · free from 3 days"
  const locationOption = (id: string) => {
    const city = getCity(id);
    if (!city) return td("askUs");
    if (city.deliveryFee === 0) return td("free");
    const fee = `+${optionPrice(city.deliveryFee)}`;
    return city.freeFromDays ? `${fee} · ${td("freeFrom", { days: city.freeFromDays })}` : fee;
  };

  // ----- Estimate (all in USD; <Price> converts for display) -----
  // A place's fee covers delivering the car there and collecting it there, so
  // returning it where it was picked up adds nothing. Hotel/home addresses and
  // returns in another region have no fixed price: those lines say "ask us"
  // and stay out of the total.
  // TODO(owner): confirm the delivery fee also covers collecting the car at the same place
  const lines: EstimateLine[] = [];
  if (car && days > 0) {
    lines.push({ label: t("estimate.rental", { car: carName, days: t("days", { count: days }) }), usd: car.pricePerDay * days });

    const placeLine = (id: string, address: string, key: "pickupFee" | "dropoffFee"): EstimateLine | undefined => {
      const label = t(`estimate.${key}`, { place: locationName(id, address) });
      if (id === CUSTOM) return { label };
      const city = getCity(id);
      if (!city || city.deliveryFee === 0) return undefined;
      const fee = deliveryFee(city, days);
      return fee > 0 ? { label, usd: fee } : { label, usd: 0, free: true };
    };

    const pickup = v.pickupLocation ? placeLine(v.pickupLocation, v.pickupAddress, "pickupFee") : undefined;
    if (pickup) lines.push(pickup);

    // Two hotel/home addresses may differ, so a custom drop-off always gets its own line
    if (v.dropoffLocation && (v.dropoffLocation !== v.pickupLocation || v.dropoffLocation === CUSTOM)) {
      const from = getCity(v.pickupLocation);
      const to = getCity(v.dropoffLocation);
      if (from && to && from.region !== to.region) {
        lines.push({ label: t("estimate.otherCity", { place: to.name[locale] }) });
      } else {
        const dropoff = placeLine(v.dropoffLocation, v.dropoffAddress, "dropoffFee");
        if (dropoff) lines.push(dropoff);
      }
    }
  }
  const totalUsd = lines.reduce((sum, line) => sum + (line.usd ?? 0), 0);
  const askLines = lines.filter((line) => line.usd === undefined).map((line) => line.label);

  // ----- WhatsApp message in the visitor's language -----
  const whatsappText = [
    t("whatsappIntro"),
    "",
    toLines([
      [t("fields.car"), carName],
      [t("fields.pickupDate"), v.pickupDate],
      [t("fields.returnDate"), v.returnDate && days ? `${v.returnDate} (${t("days", { count: days })})` : v.returnDate],
      [t("fields.pickupLocation"), v.pickupLocation && locationName(v.pickupLocation, v.pickupAddress)],
      [t("fields.dropoffLocation"), v.dropoffLocation && locationName(v.dropoffLocation, v.dropoffAddress)],
      [t("fields.driverAge"), v.driverAge],
      [t("fields.experience"), v.experience],
      [t("fields.flightNumber"), v.flightNumber],
      [tf("fields.name"), v.name],
      [tf("fields.phone"), v.phone],
      [tf("fields.email"), v.email],
      [tf("fields.message"), v.message],
      [t("estimate.total"), totalUsd > 0 ? formatMoney(totalUsd, "USD", locale) : undefined],
    ]),
  ].join("\n");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    form.attemptSubmit();
    const firstInvalid = Object.keys(form.errors)[0];
    if (firstInvalid) {
      document.getElementById(firstInvalid)?.focus();
      return;
    }

    setStatus("sending");
    // Email to the owner — field names in English on purpose (owner-facing, not site UI)
    const result = await sendToOwner(
      `Booking request: ${carName}, ${v.pickupDate} → ${v.returnDate}`,
      {
        name: v.name,
        phone: v.phone,
        email: v.email,
        car: carName,
        "pickup date": v.pickupDate,
        "return date": v.returnDate,
        days: String(days),
        "pickup location": locationName(v.pickupLocation, v.pickupAddress, "en"),
        "drop-off location": locationName(v.dropoffLocation, v.dropoffAddress, "en"),
        "driver age": v.driverAge,
        "driving experience (years)": v.experience,
        "flight number": v.flightNumber || "—",
        message: v.message || "—",
        "estimated total (USD, normal daily price)": formatMoney(totalUsd, "USD", "en"),
        "price on request (not in the total)": askLines.join("; ") || "—",
        "site language": locale,
      },
      v.honeypot,
    );
    setStatus(result);
  }

  if (status === "success") {
    return (
      <SuccessPanel
        whatsappText={whatsappText}
        onReset={() => {
          form.reset();
          setStatus("idle");
        }}
      />
    );
  }

  const locationSelect = (key: "pickupLocation" | "dropoffLocation", addressKey: "pickupAddress" | "dropoffAddress") => (
    <>
      <Field id={key} label={t(`fields.${key}`)} error={errorFor(key)}>
        <select
          {...fieldA11y(key, errorFor(key))}
          value={v[key]}
          onChange={(e) => set(key, e.target.value)}
          onBlur={() => touch(key)}
          className={inputClass}
        >
          <option value="">{tf("select")}</option>
          {site.cities.map((city) => (
            <option key={city.id} value={city.id}>
              {city.name[locale]} — {locationOption(city.id)}
            </option>
          ))}
          <option value={CUSTOM}>
            {t("fields.custom")} — {locationOption(CUSTOM)}
          </option>
        </select>
      </Field>
      {v[key] === CUSTOM && (
        <Field id={addressKey} label={t("fields.customAddress")} error={errorFor(addressKey)}>
          <input
            {...fieldA11y(addressKey, errorFor(addressKey))}
            type="text"
            autoComplete="street-address"
            placeholder={t("fields.customAddressPlaceholder")}
            value={v[addressKey]}
            onChange={(e) => set(addressKey, e.target.value)}
            onBlur={() => touch(addressKey)}
            className={inputClass}
          />
        </Field>
      )}
    </>
  );

  const textInput = (
    key: "name" | "phone" | "email" | "flightNumber",
    label: string,
    type: string,
    autoComplete: string,
    extra?: { optional?: boolean; hint?: string },
  ) => (
    <Field id={key} label={label} error={errorFor(key)} optional={extra?.optional} hint={extra?.hint}>
      <input
        {...fieldA11y(key, errorFor(key), Boolean(extra?.hint))}
        type={type}
        autoComplete={autoComplete}
        value={v[key]}
        onChange={(e) => set(key, e.target.value)}
        onBlur={() => touch(key)}
        className={inputClass}
      />
    </Field>
  );

  return (
    <form noValidate onSubmit={onSubmit} className="relative grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,380px)] lg:items-start lg:gap-8">
      <Honeypot value={v.honeypot} onChange={(val) => set("honeypot", val)} />

      <div className="space-y-8 border border-line bg-surface p-5 sm:p-8">
        <FormSection title={t("sections.trip")}>
          <Field id="car" label={t("fields.car")} error={errorFor("car")} className="sm:col-span-2">
            <select
              {...fieldA11y("car", errorFor("car"))}
              value={v.car}
              onChange={(e) => set("car", e.target.value)}
              onBlur={() => touch("car")}
              className={inputClass}
            >
              <option value="">{tf("select")}</option>
              {cars.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.brand} {c.model} — {optionPrice(c.pricePerDay, "day")}
                </option>
              ))}
            </select>
          </Field>
          <Field id="pickupDate" label={t("fields.pickupDate")} error={errorFor("pickupDate")}>
            <input
              {...fieldA11y("pickupDate", errorFor("pickupDate"))}
              type="date"
              min={today || undefined}
              value={v.pickupDate}
              onChange={(e) => set("pickupDate", e.target.value)}
              onBlur={() => touch("pickupDate")}
              className={inputClass}
            />
          </Field>
          <Field id="returnDate" label={t("fields.returnDate")} error={errorFor("returnDate")}>
            <input
              {...fieldA11y("returnDate", errorFor("returnDate"))}
              type="date"
              min={v.pickupDate || today || undefined}
              value={v.returnDate}
              onChange={(e) => set("returnDate", e.target.value)}
              onBlur={() => touch("returnDate")}
              className={inputClass}
            />
          </Field>
        </FormSection>

        <FormSection title={t("sections.locations")}>
          {locationSelect("pickupLocation", "pickupAddress")}
          {locationSelect("dropoffLocation", "dropoffAddress")}
          {textInput("flightNumber", t("fields.flightNumber"), "text", "off", {
            optional: true,
            hint: t("fields.flightHint"),
          })}
        </FormSection>

        <FormSection title={t("sections.driver")}>
          <Field id="driverAge" label={t("fields.driverAge")} error={errorFor("driverAge")}>
            <input
              {...fieldA11y("driverAge", errorFor("driverAge"))}
              type="number"
              inputMode="numeric"
              min={18}
              max={99}
              value={v.driverAge}
              onChange={(e) => set("driverAge", e.target.value)}
              onBlur={() => touch("driverAge")}
              className={inputClass}
            />
          </Field>
          <Field id="experience" label={t("fields.experience")} error={errorFor("experience")}>
            <input
              {...fieldA11y("experience", errorFor("experience"))}
              type="number"
              inputMode="numeric"
              min={0}
              max={80}
              value={v.experience}
              onChange={(e) => set("experience", e.target.value)}
              onBlur={() => touch("experience")}
              className={inputClass}
            />
          </Field>
          {/* Age and experience are info for the owner; the rules depend on the car */}
          <div className="text-sm sm:col-span-2">
            <AskUs topic={carName ? `${tCar("requirements")} — ${carName}` : tCar("requirements")}>
              <span className="text-muted">{tCar("requirementsText")}</span>
            </AskUs>
          </div>
        </FormSection>

        <FormSection title={t("sections.contact")}>
          {textInput("name", tf("fields.name"), "text", "name")}
          {textInput("phone", tf("fields.phone"), "tel", "tel")}
          {textInput("email", tf("fields.email"), "email", "email", { optional: true })}
          <Field id="message" label={tf("fields.message")} optional className="sm:col-span-2">
            <textarea
              {...fieldA11y("message")}
              rows={4}
              value={v.message}
              onChange={(e) => set("message", e.target.value)}
              className={inputClass}
            />
          </Field>
        </FormSection>
      </div>

      <aside className="space-y-4 lg:sticky lg:top-24">
        <BookingEstimate days={car ? days : 0} lines={lines} totalUsd={totalUsd} />

        {form.submitAttempted && !form.isValid && <FormAlert>{tf("errors.fixFields")}</FormAlert>}
        {(status === "missing-key" || status === "failed") && <SendError result={status} />}

        <SubmitButton sending={status === "sending"} />

        <div className="space-y-3 border-t border-line pt-4">
          <p className="text-sm text-muted">{tf("whatsapp.prefer")}</p>
          <WhatsAppCta text={whatsappText} />
        </div>
      </aside>
    </form>
  );
}

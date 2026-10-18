"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import type { CarType } from "@/data/cars";
import { useCurrency } from "@/lib/currency";
import { fleet } from "@/lib/fleet";
import { isEmail, isPhone, useForm, useToday, type Errors } from "@/lib/form";
import { sendToOwner, type SendResult } from "@/lib/web3forms";
import {
  Field,
  FormAlert,
  Honeypot,
  SendError,
  SubmitButton,
  SuccessPanel,
  fieldA11y,
  inputClass,
} from "./form/FormParts";

type Values = {
  name: string;
  phone: string;
  email: string;
  dateFrom: string;
  dateTo: string;
  carType: "any" | CarType;
  budget: string;
  message: string;
  honeypot: string;
};

const initial: Values = {
  name: "",
  phone: "",
  email: "",
  dateFrom: "",
  dateTo: "",
  carType: "any",
  budget: "",
  message: "",
  honeypot: "",
};

function validate(v: Values, today: string): Errors<Values> {
  const e: Errors<Values> = {};
  if (!v.name.trim()) e.name = "required";
  if (!v.phone.trim()) e.phone = "required";
  else if (!isPhone(v.phone)) e.phone = "phone";
  if (v.email.trim() && !isEmail(v.email)) e.email = "email";
  if (v.dateFrom && today && v.dateFrom < today) e.dateFrom = "pastDate";
  if (v.dateTo && v.dateFrom && v.dateTo <= v.dateFrom) e.dateTo = "returnAfterPickup";
  if (v.budget && !(Number(v.budget) > 0)) e.budget = "number";
  return e;
}

export default function FindCarForm() {
  const t = useTranslations("findACar.fields");
  const tf = useTranslations("form");
  const tc = useTranslations("car.types");
  const locale = useLocale();
  const currency = useCurrency();
  const today = useToday();

  const form = useForm(initial, (v) => validate(v, today));
  const { values: v, set, touch, errorFor } = form;
  const [status, setStatus] = useState<"idle" | "sending" | SendResult>("idle");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    form.attemptSubmit();
    const firstInvalid = Object.keys(form.errors)[0];
    if (firstInvalid) {
      document.getElementById(firstInvalid)?.focus();
      return;
    }
    setStatus("sending");
    // Owner-facing email — field names in English on purpose
    const result = await sendToOwner(
      `Find-a-car request from ${v.name}`,
      {
        name: v.name,
        phone: v.phone,
        email: v.email,
        "dates from": v.dateFrom || "—",
        "dates to": v.dateTo || "—",
        "car type": v.carType,
        "budget per day": v.budget ? `${v.budget} ${currency}` : "—",
        message: v.message || "—",
        "site language": locale,
      },
      v.honeypot,
    );
    setStatus(result);
  }

  if (status === "success") {
    return (
      <SuccessPanel
        onReset={() => {
          form.reset();
          setStatus("idle");
        }}
      />
    );
  }

  const input = (
    key: "name" | "phone" | "email" | "dateFrom" | "dateTo" | "budget",
    label: string,
    props: React.InputHTMLAttributes<HTMLInputElement>,
    optional?: boolean,
  ) => (
    <Field id={key} label={label} error={errorFor(key)} optional={optional}>
      <input
        {...fieldA11y(key, errorFor(key))}
        {...props}
        value={v[key]}
        onChange={(e) => set(key, e.target.value)}
        onBlur={() => touch(key)}
        className={inputClass}
      />
    </Field>
  );

  return (
    <form noValidate onSubmit={onSubmit} className="relative space-y-6 border border-line bg-surface p-5 sm:p-8">
      <Honeypot value={v.honeypot} onChange={(val) => set("honeypot", val)} />

      <div className="grid gap-5 sm:grid-cols-2">
        {input("name", tf("fields.name"), { type: "text", autoComplete: "name" })}
        {input("phone", tf("fields.phone"), { type: "tel", autoComplete: "tel" })}
        {input("email", tf("fields.email"), { type: "email", autoComplete: "email" }, true)}

        <Field id="carType" label={t("carType")}>
          <select
            {...fieldA11y("carType")}
            value={v.carType}
            onChange={(e) => set("carType", e.target.value as Values["carType"])}
            className={inputClass}
          >
            <option value="any">{t("anyType")}</option>
            {fleet.types.map((type) => (
              <option key={type} value={type}>
                {tc(type)}
              </option>
            ))}
          </select>
        </Field>

        {input("dateFrom", tf("fields.dateFrom"), { type: "date", min: today || undefined }, true)}
        {input("dateTo", tf("fields.dateTo"), { type: "date", min: v.dateFrom || today || undefined }, true)}
        {input(
          "budget",
          t("budget", { currency }),
          { type: "number", inputMode: "numeric", min: 1 },
          true,
        )}
      </div>

      <Field id="message" label={t("message")} optional>
        <textarea
          {...fieldA11y("message")}
          rows={5}
          placeholder={t("messagePlaceholder")}
          value={v.message}
          onChange={(e) => set("message", e.target.value)}
          className={inputClass}
        />
      </Field>

      {form.submitAttempted && !form.isValid && <FormAlert>{tf("errors.fixFields")}</FormAlert>}
      {(status === "missing-key" || status === "failed") && <SendError result={status} />}

      <SubmitButton sending={status === "sending"} className="sm:max-w-xs" />
    </form>
  );
}

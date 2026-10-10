"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { isEmail, isPhone, useForm, type Errors } from "@/lib/form";
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
  message: string;
  honeypot: string;
};

const initial: Values = { name: "", phone: "", email: "", message: "", honeypot: "" };

function validate(v: Values): Errors<Values> {
  const e: Errors<Values> = {};
  if (!v.name.trim()) e.name = "required";
  if (!v.phone.trim()) e.phone = "required";
  else if (!isPhone(v.phone)) e.phone = "phone";
  if (v.email.trim() && !isEmail(v.email)) e.email = "email";
  if (!v.message.trim()) e.message = "required";
  return e;
}

export default function ContactForm() {
  const tf = useTranslations("form");
  const locale = useLocale();
  const form = useForm(initial, validate);
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
    const result = await sendToOwner(
      `Website message from ${v.name}`,
      { name: v.name, phone: v.phone, email: v.email, message: v.message, "site language": locale },
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

  const input = (key: "name" | "phone" | "email", type: string, autoComplete: string, optional?: boolean) => (
    <Field id={key} label={tf(`fields.${key}`)} error={errorFor(key)} optional={optional}>
      <input
        {...fieldA11y(key, errorFor(key))}
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
    <form noValidate onSubmit={onSubmit} className="relative space-y-5">
      <Honeypot value={v.honeypot} onChange={(val) => set("honeypot", val)} />
      {input("name", "text", "name")}
      <div className="grid gap-5 sm:grid-cols-2">
        {input("phone", "tel", "tel")}
        {input("email", "email", "email", true)}
      </div>
      <Field id="message" label={tf("fields.message")} error={errorFor("message")}>
        <textarea
          {...fieldA11y("message", errorFor("message"))}
          rows={5}
          value={v.message}
          onChange={(e) => set("message", e.target.value)}
          onBlur={() => touch("message")}
          className={inputClass}
        />
      </Field>

      {form.submitAttempted && !form.isValid && <FormAlert>{tf("errors.fixFields")}</FormAlert>}
      {(status === "missing-key" || status === "failed") && <SendError result={status} />}

      <SubmitButton sending={status === "sending"} />
    </form>
  );
}

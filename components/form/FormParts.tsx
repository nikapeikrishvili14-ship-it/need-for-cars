"use client";

import { useTranslations } from "next-intl";
import { site } from "@/data/site";
import type { ErrorKey } from "@/lib/form";
import type { SendResult } from "@/lib/web3forms";
import { whatsappUrl } from "@/lib/whatsapp";
import WhatsAppIcon from "../WhatsAppIcon";

// text-base (16px) on inputs stops iOS Safari from zooming in on focus
export const inputClass =
  "block w-full border bg-night px-3.5 py-3 text-base text-fg placeholder:text-muted/60 transition-colors outline-none focus:border-accent focus:shadow-glow aria-[invalid=true]:border-red-500 border-line [color-scheme:dark]";

/** Props that link an input to its label, hint and error message */
export function fieldA11y(id: string, error?: ErrorKey, hint?: boolean) {
  const describedBy = [error && `${id}-error`, hint && `${id}-hint`].filter(Boolean).join(" ");
  return {
    id,
    name: id,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": describedBy || undefined,
  } as const;
}

type FieldProps = {
  id: string;
  label: string;
  error?: ErrorKey;
  optional?: boolean;
  hint?: string;
  className?: string;
  children: React.ReactNode;
};

export function Field({ id, label, error, optional, hint, className = "", children }: FieldProps) {
  const t = useTranslations("form");
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium">
        {label}
        {optional && <span className="ml-1.5 text-xs font-normal text-muted">({t("optional")})</span>}
      </label>
      {children}
      {hint && (
        <p id={`${id}-hint`} className="mt-1.5 text-xs text-muted">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-sm text-red-400">
          {t(`errors.${error}`)}
        </p>
      )}
    </div>
  );
}

/** Section of a long form with a slanted accent heading */
export function FormSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset className="min-w-0 border-t border-line pt-6 first:border-0 first:pt-0">
      <legend className="float-left mb-5 flex w-full items-center gap-3 font-heading text-lg font-bold italic">
        <span className="slant h-4 w-1.5 bg-accent" aria-hidden="true" />
        {title}
      </legend>
      <div className="clear-left grid gap-5 sm:grid-cols-2">{children}</div>
    </fieldset>
  );
}

/**
 * Spam trap: hidden from people (off-screen, not focusable, ignored by screen
 * readers), but bots that fill every field will fill it.
 */
export function Honeypot({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const t = useTranslations("form");
  return (
    <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
      <label>
        {t("honeypot")}
        <input
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </label>
    </div>
  );
}

export function SubmitButton({ sending, className = "" }: { sending: boolean; className?: string }) {
  const t = useTranslations("form");
  return (
    <button
      type="submit"
      disabled={sending}
      className={`slant block w-full bg-accent py-3.5 font-semibold text-night transition-shadow hover:shadow-glow disabled:cursor-wait disabled:opacity-70 ${className}`}
    >
      <span className="unslant">{sending ? t("sending") : t("submit")}</span>
    </button>
  );
}

export function WhatsAppCta({ text, className = "" }: { text: string; className?: string }) {
  const t = useTranslations("form.whatsapp");
  return (
    <a
      href={whatsappUrl(text)}
      target="_blank"
      rel="noopener noreferrer"
      className={`slant flex items-center justify-center border border-[#25D366]/60 py-3 font-semibold text-[#25D366] transition hover:bg-[#25D366] hover:text-night ${className}`}
    >
      <span className="unslant flex items-center gap-2">
        <WhatsAppIcon size={20} />
        {t("send")}
      </span>
    </a>
  );
}

export function FormAlert({ children }: { children: React.ReactNode }) {
  return (
    <p role="alert" className="border border-red-500/50 bg-red-500/10 px-4 py-3 text-sm text-red-300">
      {children}
    </p>
  );
}

/** Error shown when sending failed or the Web3Forms key isn't configured */
export function SendError({ result }: { result: Exclude<SendResult, "success"> }) {
  const t = useTranslations("form.status");
  return <FormAlert>{result === "missing-key" ? t("missingKey", { phone: site.contacts.phone }) : t("failed")}</FormAlert>;
}

export function SuccessPanel({
  whatsappText,
  onReset,
}: {
  /** If set, offers to send the same details on WhatsApp */
  whatsappText?: string;
  onReset: () => void;
}) {
  const t = useTranslations("form");
  return (
    <div role="status" className="border border-accent/50 bg-surface p-6 shadow-glow sm:p-10">
      <p className="font-heading text-3xl font-black text-accent italic">{t("status.successTitle")}</p>
      <p className="mt-3 text-muted">{t("status.successText")}</p>
      {whatsappText && (
        <div className="mt-8 max-w-sm space-y-3">
          <p className="text-sm">{t("whatsapp.afterSubmit")}</p>
          <WhatsAppCta text={whatsappText} />
        </div>
      )}
      <button type="button" onClick={onReset} className="mt-8 text-sm font-semibold text-accent hover:underline">
        {t("status.again")}
      </button>
    </div>
  );
}

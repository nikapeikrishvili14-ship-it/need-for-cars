"use client";

import { useState, useSyncExternalStore } from "react";

/** Validation errors are message keys under "form.errors" in messages/*.json */
export type ErrorKey =
  | "required"
  | "email"
  | "phone"
  | "pastDate"
  | "returnAfterPickup"
  | "age"
  | "experience"
  | "experienceVsAge"
  | "number";

export type Errors<T> = Partial<Record<keyof T, ErrorKey>>;

/**
 * Minimal form state: values, per-field errors from `validate`, and
 * "show errors" once a field was left (blur) or a submit was attempted.
 */
export function useForm<T extends Record<string, unknown>>(initial: T, validate: (values: T) => Errors<T>) {
  const [values, setValues] = useState<T>(initial);
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});
  const [submitAttempted, setSubmitAttempted] = useState(false);

  const errors = validate(values);
  const isValid = Object.keys(errors).length === 0;

  return {
    values,
    errors,
    isValid,
    submitAttempted,
    set: <K extends keyof T>(key: K, value: T[K]) => setValues((v) => ({ ...v, [key]: value })),
    touch: (key: keyof T) => setTouched((t) => ({ ...t, [key]: true })),
    /** Error to display for a field (hidden until blur or submit attempt) */
    errorFor: (key: keyof T) => (submitAttempted || touched[key] ? errors[key] : undefined),
    attemptSubmit: () => setSubmitAttempted(true),
    reset: () => {
      setValues(initial);
      setTouched({});
      setSubmitAttempted(false);
    },
  };
}

export const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

/** Accepts +, spaces, dashes, dots, brackets; needs 7–15 digits */
export const isPhone = (v: string) => {
  if (!/^[+\d\s\-().]+$/.test(v.trim())) return false;
  const digits = v.replace(/\D/g, "").length;
  return digits >= 7 && digits <= 15;
};

const noSubscribe = () => () => {};

/**
 * Today's date on the client, "" during static rendering. Pages are built in
 * advance, so a date computed at build time would be stale (and mismatch on hydration).
 */
export function useToday(): string {
  return useSyncExternalStore(noSubscribe, todayISO, () => "");
}

/** Today's date in the visitor's timezone as YYYY-MM-DD (for <input type="date">) */
export function todayISO(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/** Whole days between two YYYY-MM-DD dates (0 if missing or not after) */
export function daysBetween(from: string, to: string): number {
  if (!from || !to) return 0;
  const ms = Date.parse(`${to}T00:00:00Z`) - Date.parse(`${from}T00:00:00Z`);
  return Number.isFinite(ms) && ms > 0 ? Math.round(ms / 86_400_000) : 0;
}

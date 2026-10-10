"use client";

import { useSyncExternalStore } from "react";
import { site } from "@/data/site";
import type { CurrencyCode } from "@/data/types";

export const currencies: CurrencyCode[] = ["USD", "GEL", "EUR"];

const STORAGE_KEY = "nfc-currency";
const listeners = new Set<() => void>();

function read(): CurrencyCode {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && (currencies as string[]).includes(saved)) return saved as CurrencyCode;
  } catch {}
  return site.baseCurrency;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function setCurrency(code: CurrencyCode) {
  try {
    localStorage.setItem(STORAGE_KEY, code);
  } catch {}
  listeners.forEach((l) => l());
}

/** Currently selected display currency (remembered in this browser). */
export function useCurrency(): CurrencyCode {
  return useSyncExternalStore(subscribe, read, () => site.baseCurrency);
}

/** Converts a USD amount with the fixed rates from data/site.ts. */
export function convertFromUsd(usd: number, code: CurrencyCode): number {
  return Math.round(usd * site.currencyRates[code]);
}

export function formatMoney(amount: number, code: CurrencyCode, locale: string): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: code,
    maximumFractionDigits: 0,
  }).format(amount);
}

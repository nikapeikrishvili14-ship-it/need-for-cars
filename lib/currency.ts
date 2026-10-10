"use client";

import { useSyncExternalStore } from "react";
import { useLocale } from "next-intl";
import { site } from "@/data/site";
import type { CurrencyCode } from "@/data/types";
import { convertFromUsd, formatMoney } from "./money";

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

// Re-exported so existing client imports keep working
export { convertFromUsd, formatMoney };

type Money = { text: string; approx: boolean };

/** Formatter for USD amounts in the visitor's selected currency (for lists/loops). */
export function useMoney(): (usd: number) => Money {
  const code = useCurrency();
  const locale = useLocale();
  return (usd) => ({
    text: formatMoney(convertFromUsd(usd, code), code, locale),
    approx: code !== site.baseCurrency,
  });
}

/** A USD amount formatted in the visitor's selected currency. */
export function usePrice(usd: number): Money {
  return useMoney()(usd);
}

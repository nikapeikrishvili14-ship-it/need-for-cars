"use client";

import { useSyncExternalStore } from "react";
import { useLocale } from "next-intl";
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

// Fixed symbols: locale data varies (e.g. Russian ICU shows GEL as "ლ"), and
// server vs browser differences would cause hydration mismatches.
const symbols: Record<CurrencyCode, string> = { USD: "$", GEL: "₾", EUR: "€" };

export function formatMoney(amount: number, code: CurrencyCode, locale: string): string {
  // Intl decides number grouping and symbol position per language; we pick the symbol
  const parts = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: code,
    maximumFractionDigits: 0,
  }).formatToParts(amount);

  return parts
    .map((part, i) => {
      if (part.type === "currency") return symbols[code];
      // A prefix symbol sits right against the number ("₾945", not "₾ 945")
      if (part.type === "literal" && parts[i - 1]?.type === "currency" && i === 1) return "";
      return part.value;
    })
    .join("");
}

/** A USD amount formatted in the visitor's selected currency. */
export function usePrice(usd: number): { text: string; approx: boolean } {
  const code = useCurrency();
  const locale = useLocale();
  return {
    text: formatMoney(convertFromUsd(usd, code), code, locale),
    approx: code !== site.baseCurrency,
  };
}

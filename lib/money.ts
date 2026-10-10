import { site } from "@/data/site";
import type { CurrencyCode } from "@/data/types";

// Pure number/money helpers — no React, so server components can use them too.
// The client-side currency switch lives in lib/currency.ts.

/** Converts a USD amount with the fixed rates from data/site.ts. */
export function convertFromUsd(usd: number, code: CurrencyCode): number {
  return Math.round(usd * site.currencyRates[code]);
}

// Prices are formatted by hand, not with Intl's currency style: locale data
// differs between Node (which renders the static HTML) and browsers — e.g. for
// Georgian, Node gives "350 US$" and Chrome "$350" — and any difference breaks
// React hydration. Fixed symbols, positions and separators are the same everywhere.
const symbols: Record<CurrencyCode, string> = { USD: "$", GEL: "₾", EUR: "€" };

const NBSP = " ";

/** Per language: thousands separator, and whether the symbol follows the number */
const styles: Record<string, { group: string; symbolAfter: boolean }> = {
  en: { group: ",", symbolAfter: false }, // $1,450
  ka: { group: NBSP, symbolAfter: true }, // 1 450 $
  ru: { group: NBSP, symbolAfter: true }, // 1 450 $
};

/**
 * A decimal like 4.2 with the language's separator ("4.2" / "4,2"), without
 * Intl: Chrome has no Georgian number data and would print "4.2" where the
 * server printed "4,2", breaking hydration.
 */
export function formatDecimal(value: number, locale: string): string {
  const text = String(value);
  return locale === "en" ? text : text.replace(".", ",");
}

export function formatMoney(amount: number, code: CurrencyCode, locale: string): string {
  const { group, symbolAfter } = styles[locale] ?? styles.en;
  const rounded = Math.round(amount);
  const digits = Math.abs(rounded).toString().replace(/\B(?=(\d{3})+(?!\d))/g, group);
  const sign = rounded < 0 ? "-" : "";
  return symbolAfter ? `${sign}${digits}${NBSP}${symbols[code]}` : `${sign}${symbols[code]}${digits}`;
}

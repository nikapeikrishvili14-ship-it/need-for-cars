import { site } from "@/data/site";
import type { CurrencyCode } from "@/data/types";

// Pure money helpers — no React, so server components can use them too.
// The client-side currency switch lives in lib/currency.ts.

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

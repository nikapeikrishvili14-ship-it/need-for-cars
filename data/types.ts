import type { Locale } from "@/i18n/routing";

/** Text that exists in every site language. */
export type Localized = Record<Locale, string>;

export type CurrencyCode = "USD" | "GEL" | "EUR";

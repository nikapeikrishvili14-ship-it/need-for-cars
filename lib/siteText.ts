import { site, type FaqGroup } from "@/data/site";
import type { Locale } from "@/i18n/routing";
import { formatMoney } from "./money";

/** FAQ page order */
export const faqGroups: FaqGroup[] = ["booking", "payment", "delivery", "requirements"];

function list(locale: Locale, items: string[]): string {
  return new Intl.ListFormat(locale, { type: "conjunction" }).format(items);
}

/** "Tbilisi, Tbilisi Airport, Kutaisi Airport and Batumi" — from site.cities, in the page language */
export function cityList(locale: Locale): string {
  return list(locale, site.cities.map((c) => c.name[locale]));
}

/**
 * "Tbilisi (free), Tbilisi Airport ($50, free from 3 days) …" — every delivery
 * place with its fee and free-delivery rule. `free` and `freeFrom` are the
 * translated delivery.free / delivery.freeFrom messages.
 */
export function deliveryRulesText(
  locale: Locale,
  labels: { free: string; freeFrom: (days: number) => string },
): string {
  return list(
    locale,
    site.cities.map((city) => {
      const fee =
        city.deliveryFee === 0
          ? labels.free
          : [formatMoney(city.deliveryFee, "USD", locale), city.freeFromDays && labels.freeFrom(city.freeFromDays)]
              .filter(Boolean)
              .join(", ");
      return `${city.name[locale]} (${fee})`;
    }),
  );
}

/**
 * Fills the tokens owner-written text may use (see FaqItem in data/site.ts),
 * so the refund time and delivery places always match the data. Amounts are
 * in USD, the base currency, because this text also feeds Google's structured data.
 */
export function fillSiteTokens(
  text: string,
  locale: Locale,
  tokens: { refundTime: string; deliveryRules: string },
): string {
  return text
    .replaceAll("{refundTime}", tokens.refundTime)
    .replaceAll("{deliveryRules}", tokens.deliveryRules)
    .replaceAll("{cities}", cityList(locale));
}

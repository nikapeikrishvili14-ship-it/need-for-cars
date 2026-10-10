import { site, type FaqGroup } from "@/data/site";
import type { Locale } from "@/i18n/routing";
import { formatMoney } from "./money";

/** FAQ page order */
export const faqGroups: FaqGroup[] = ["booking", "payment", "delivery", "requirements"];

/** "Tbilisi, Tbilisi Airport, Batumi and Kutaisi" — from site.cities, in the page language */
export function cityList(locale: Locale): string {
  return new Intl.ListFormat(locale, { type: "conjunction" }).format(site.cities.map((c) => c.name[locale]));
}

/**
 * Fills the tokens owner-written text may use (see FaqItem in data/site.ts),
 * so amounts, refund time and cities always match the data. Amounts are in
 * USD, the base currency, because this text also feeds Google's structured data.
 * `refundTime` is the translated price.refundTime message for site.depositRefundDays.
 */
export function fillSiteTokens(text: string, locale: Locale, refundTime: string): string {
  return text
    .replaceAll("{deposit}", formatMoney(site.deposit, "USD", locale))
    .replaceAll("{refundTime}", refundTime)
    .replaceAll("{customFee}", formatMoney(site.customAddressFee, "USD", locale))
    .replaceAll("{cities}", cityList(locale));
}

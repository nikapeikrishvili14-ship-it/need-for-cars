"use client";

import { useTranslations } from "next-intl";
import { site } from "@/data/site";
import { useCurrency } from "@/lib/currency";
import Price from "./Price";

/**
 * One row of the estimate. Without `usd` the price is "ask us" and the row
 * isn't counted in the total; `free` marks a fee waived by a free-delivery rule.
 */
export type EstimateLine = { label: string; usd?: number; free?: boolean };

type Props = {
  days: number;
  lines: EstimateLine[];
  totalUsd: number;
};

// Live price panel at the normal daily price. Deposit is shown on its own and
// never added to the total.
export default function BookingEstimate({ days, lines, totalUsd }: Props) {
  const t = useTranslations("booking.estimate");
  const tb = useTranslations("booking");
  const tp = useTranslations("price");
  const td = useTranslations("delivery");
  const refund = tp("refundTime", { days: site.depositRefundDays });
  const approx = useCurrency() !== site.baseCurrency;
  const hasAsk = lines.some((line) => line.usd === undefined);

  return (
    <section aria-labelledby="estimate-title" className="border border-line bg-surface p-5 sm:p-6">
      <h2 id="estimate-title" className="flex items-center gap-3 text-xl font-black italic">
        <span className="slant h-4 w-1.5 bg-accent" aria-hidden="true" />
        {t("title")}
      </h2>

      {days === 0 ? (
        <p className="mt-4 text-sm text-muted">{t("chooseDates")}</p>
      ) : (
        <div aria-live="polite">
          <p className="mt-1 text-sm text-muted">{tb("days", { count: days })}</p>
          <dl className="mt-4 space-y-2.5 text-sm">
            {lines.map((line) => (
              <div key={line.label} className="flex items-baseline justify-between gap-4">
                <dt className="text-muted">{line.label}</dt>
                <dd className="text-right">
                  {line.usd === undefined ? (
                    <span className="whitespace-nowrap text-fg/80 italic">{td("askUs")}</span>
                  ) : line.free ? (
                    <span className="font-semibold text-accent">{td("free")}</span>
                  ) : (
                    <Price usd={line.usd} />
                  )}
                </dd>
              </div>
            ))}
          </dl>
          <div className="mt-4 flex items-baseline justify-between gap-4 border-t border-line pt-4">
            <span className="font-semibold">{t("total")}</span>
            <Price usd={totalUsd} className="font-heading text-3xl font-black text-accent italic" />
          </div>
          {hasAsk && <p className="mt-2 text-xs text-muted">{t("askNote")}</p>}
        </div>
      )}

      <p className="mt-5 border-l-2 border-accent pl-3 text-sm text-fg/85">{tp("longRental")}</p>

      <div className="mt-5 border border-dashed border-line p-3.5 text-sm">
        <div className="flex items-baseline justify-between gap-4">
          <span>{t("deposit")}</span>
          <span className="whitespace-nowrap text-fg/80 italic">{td("askUs")}</span>
        </div>
        <p className="mt-1.5 text-xs text-muted">{t("depositNote", { refund })}</p>
      </div>

      <p className="mt-4 text-xs text-muted">
        {t("note")}
        {approx && ` ${t("approxNote")}`}
      </p>
    </section>
  );
}

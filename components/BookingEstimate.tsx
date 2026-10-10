"use client";

import { useTranslations } from "next-intl";
import { site } from "@/data/site";
import { useCurrency } from "@/lib/currency";
import Price from "./Price";

export type EstimateLine = { label: string; usd: number };

type Props = {
  days: number;
  lines: EstimateLine[];
  totalUsd: number;
};

// Live price panel. Deposit is shown on its own and never added to the total.
export default function BookingEstimate({ days, lines, totalUsd }: Props) {
  const t = useTranslations("booking.estimate");
  const tb = useTranslations("booking");
  const approx = useCurrency() !== site.baseCurrency;

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
                <dd>
                  <Price usd={line.usd} />
                </dd>
              </div>
            ))}
          </dl>
          <div className="mt-4 flex items-baseline justify-between gap-4 border-t border-line pt-4">
            <span className="font-semibold">{t("total")}</span>
            <Price usd={totalUsd} className="font-heading text-3xl font-black text-accent italic" />
          </div>
        </div>
      )}

      <div className="mt-5 border border-dashed border-line p-3.5 text-sm">
        <div className="flex items-baseline justify-between gap-4">
          <span>{t("deposit")}</span>
          <Price usd={site.deposit} className="font-semibold" />
        </div>
        <p className="mt-1.5 text-xs text-muted">{t("depositNote")}</p>
      </div>

      <p className="mt-4 text-xs text-muted">
        {t("note")}
        {approx && ` ${t("approxNote")}`}
      </p>
    </section>
  );
}

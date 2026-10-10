"use client";

import { useTranslations } from "next-intl";
import { usePrice } from "@/lib/currency";

type Props = {
  /** Amount in USD */
  usd: number;
  perDay?: boolean;
  className?: string;
};

// Every price on the site goes through here so the currency switch updates it.
// Converted (non-USD) amounts get an "approx." mark.
export default function Price({ usd, perDay = false, className = "" }: Props) {
  const t = useTranslations("price");
  const { text, approx } = usePrice(usd);

  return (
    <span className={`whitespace-nowrap ${className}`}>
      {approx && <span className="mr-1 text-[0.65em] font-normal text-muted">{t("approx")}</span>}
      <span>{text}</span>
      {perDay && <span className="ml-1 text-[0.65em] font-normal text-muted">{t("perDay")}</span>}
    </span>
  );
}

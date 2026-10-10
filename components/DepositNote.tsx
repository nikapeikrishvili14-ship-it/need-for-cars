"use client";

import { useTranslations } from "next-intl";
import { site } from "@/data/site";
import { usePrice } from "@/lib/currency";

// Deposit sentence with the amount in the selected currency
export default function DepositNote({ className = "" }: { className?: string }) {
  const t = useTranslations();
  const { text, approx } = usePrice(site.deposit);
  const amount = approx ? `${text} (${t("price.approx")})` : text;

  return <p className={className}>{t("car.deposit", { amount })}</p>;
}

import { useTranslations } from "next-intl";
import { site } from "@/data/site";

// "Deposit depends on the car — ask us. Paid by card or cash, refunded …"
export default function DepositNote({ className = "" }: { className?: string }) {
  const t = useTranslations("price");
  const refund = t("refundTime", { days: site.depositRefundDays });

  return <p className={className}>{t("deposit", { refund })}</p>;
}

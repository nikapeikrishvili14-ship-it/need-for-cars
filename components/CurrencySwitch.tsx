"use client";

import { useTranslations } from "next-intl";
import { currencies, setCurrency, useCurrency } from "@/lib/currency";

export default function CurrencySwitch() {
  const t = useTranslations("switchers");
  const current = useCurrency();

  return (
    <div role="group" aria-label={t("currency")} className="flex items-center text-sm">
      {currencies.map((code) => {
        const active = code === current;
        return (
          <button
            key={code}
            type="button"
            onClick={() => setCurrency(code)}
            aria-pressed={active}
            className={`px-2 py-1 font-semibold transition-colors ${
              active ? "text-accent" : "text-muted hover:text-fg"
            }`}
          >
            {code}
          </button>
        );
      })}
    </div>
  );
}

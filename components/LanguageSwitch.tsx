"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

// Short labels shown in the switch; full names for screen readers
const labels = {
  en: { short: "EN", full: "English" },
  ka: { short: "ქარ", full: "ქართული" },
  ru: { short: "RU", full: "Русский" },
} as const;

export default function LanguageSwitch() {
  const t = useTranslations("switchers");
  const current = useLocale();
  const pathname = usePathname();

  return (
    <nav aria-label={t("language")} className="flex items-center text-sm">
      {routing.locales.map((locale) => {
        const active = locale === current;
        return (
          <Link
            key={locale}
            // Keep the same page (incl. /cars/[slug]) when switching language
            href={pathname}
            locale={locale}
            lang={locale}
            hrefLang={locale}
            aria-label={labels[locale].full}
            aria-current={active ? "true" : undefined}
            className={`px-2 py-1 font-semibold transition-colors ${
              active ? "text-accent" : "text-muted hover:text-fg"
            }`}
          >
            {labels[locale].short}
          </Link>
        );
      })}
    </nav>
  );
}

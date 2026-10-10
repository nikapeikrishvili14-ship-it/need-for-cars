import { getLocale, getTranslations } from "next-intl/server";
import { site } from "@/data/site";
import type { Locale } from "@/i18n/routing";
import NavLinks from "./NavLinks";
import Logo from "./Logo";

export default async function Footer() {
  const t = await getTranslations("footer");
  const locale = (await getLocale()) as Locale;
  const { contacts } = site;

  return (
    <footer className="mt-16 border-t border-line bg-surface">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4 lg:px-8">
        <div className="space-y-4">
          <Logo className="w-32" />
          <p className="max-w-xs text-sm text-muted">{t("tagline")}</p>
        </div>

        <div>
          <h2 className="mb-4 text-sm font-bold tracking-wide text-fg uppercase italic">{t("explore")}</h2>
          <NavLinks className="space-y-2 text-sm" />
        </div>

        <div>
          <h2 className="mb-4 text-sm font-bold tracking-wide text-fg uppercase italic">{t("contact")}</h2>
          <ul className="space-y-2 text-sm text-muted">
            <li>
              <a href={`tel:${contacts.phone.replace(/\s/g, "")}`} className="hover:text-fg">
                {contacts.phone}
              </a>
            </li>
            <li>
              <a href={`mailto:${contacts.email}`} className="hover:text-fg">
                {contacts.email}
              </a>
            </li>
            <li>{contacts.address[locale]}</li>
          </ul>
        </div>

        <div>
          <h2 className="mb-4 text-sm font-bold tracking-wide text-fg uppercase italic">{t("hours")}</h2>
          <p className="text-sm text-muted">{contacts.hours[locale]}</p>
        </div>
      </div>

      <div className="border-t border-line">
        <p className="mx-auto max-w-7xl px-4 py-6 text-xs text-muted lg:px-8">
          {t("rights", { year: new Date().getFullYear() })}
        </p>
      </div>
    </footer>
  );
}

import { getLocale, getTranslations } from "next-intl/server";
import { site } from "@/data/site";
import type { Locale } from "@/i18n/routing";
import NavLinks from "./NavLinks";
import Logo from "./Logo";

const AGENCY_URL = "https://gnscales.com";

export default async function Footer() {
  const t = await getTranslations("footer");
  const locale = (await getLocale()) as Locale;
  const { contacts } = site;

  return (
    <footer className="mt-16 border-t border-line bg-surface">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4 lg:px-8">
        <div className="space-y-4">
          <Logo className="w-32" lazy />
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
        {/* Phones: credit under the copyright; wider screens: on the right.
            The right padding keeps both clear of the floating WhatsApp button
            (6rem from the screen edge), shrinking back to 2rem on very wide screens. */}
        <div
          className="mx-auto flex max-w-7xl flex-col gap-1.5 py-6 pl-4 text-xs text-muted sm:flex-row sm:items-center sm:justify-between sm:gap-6 lg:pl-8"
          style={{ paddingRight: "max(2rem, calc(6rem - max(0px, (100vw - 80rem) / 2)))" }}
        >
          <p>{t("rights", { year: new Date().getFullYear() })}</p>
          <p>
            {t.rich("credit", {
              link: (chunks) => (
                <a
                  href={AGENCY_URL}
                  target="_blank"
                  rel="noopener"
                  className="text-fg/80 transition-colors hover:text-accent"
                >
                  {chunks}
                </a>
              ),
            })}
          </p>
        </div>
      </div>
    </footer>
  );
}

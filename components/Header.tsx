import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import Logo from "./Logo";
import NavLinks from "./NavLinks";
import LanguageSwitch from "./LanguageSwitch";
import CurrencySwitch from "./CurrencySwitch";
import MobileMenu from "./MobileMenu";

export default async function Header() {
  const t = await getTranslations("nav");

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-night/90 backdrop-blur">
      <div className="relative mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 px-4 lg:px-8">
        <Logo className="w-24 lg:w-28" />

        <nav aria-label={t("main")} className="hidden lg:block">
          <NavLinks className="flex items-center gap-7 text-sm font-medium" />
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <LanguageSwitch />
          <span className="h-4 w-px bg-line" aria-hidden="true" />
          <CurrencySwitch />
          <Link
            href="/book"
            className="slant ml-2 bg-accent px-5 py-2 text-sm font-semibold text-night transition-shadow hover:shadow-glow"
          >
            <span className="unslant">{t("book")}</span>
          </Link>
        </div>

        <MobileMenu />
      </div>
    </header>
  );
}

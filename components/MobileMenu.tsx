"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import NavLinks from "./NavLinks";
import LanguageSwitch from "./LanguageSwitch";
import CurrencySwitch from "./CurrencySwitch";

export default function MobileMenu() {
  const t = useTranslations("nav");
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? t("close") : t("menu")}
        className="flex h-10 w-10 items-center justify-center text-fg"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          {open ? (
            <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          ) : (
            <path d="M5 7h14M3 12h14M5 17h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          )}
        </svg>
      </button>

      {open && (
        <div
          id="mobile-menu"
          className="absolute inset-x-0 top-full border-b border-line bg-night/95 px-4 pt-4 pb-6 backdrop-blur"
        >
          <NavLinks
            className="flex flex-col"
            linkClassName="block py-3 font-heading text-xl font-bold italic"
            onNavigate={close}
          />
          <div className="mt-4 flex items-center justify-between border-t border-line pt-4">
            <LanguageSwitch />
            <CurrencySwitch />
          </div>
          <Link
            href="/book"
            onClick={close}
            className="slant mt-6 block bg-accent py-3 text-center font-semibold text-night shadow-glow"
          >
            {t("book")}
          </Link>
        </div>
      )}
    </div>
  );
}

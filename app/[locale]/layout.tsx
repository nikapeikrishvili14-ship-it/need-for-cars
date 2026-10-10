import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { site } from "@/data/site";
import { fontVariables } from "@/lib/fonts";
import { siteUrl } from "@/lib/seo";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import MotionProvider from "@/components/MotionProvider";

// Only /en, /ka, /ru exist — everything is prerendered at build time
export const dynamicParams = false;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

// Defaults for every page; each page adds its own title, description,
// canonical/hreflang links and sharing preview (lib/seo.ts)
export async function generateMetadata({ params }: LayoutProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return {
    metadataBase: new URL(siteUrl),
    title: { default: t("title"), template: `%s | ${site.name}` },
    description: t("description"),
    applicationName: site.name,
  };
}

export const viewport: Viewport = {
  themeColor: "#0B0B0D",
  colorScheme: "dark",
};

export default async function LocaleLayout({ children, params }: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  // Enables static rendering for next-intl (no request headers in static export)
  setRequestLocale(locale);
  const t = await getTranslations("nav");

  return (
    <html lang={locale} className={fontVariables}>
      {/* Browser extensions (e.g. Grammarly) add attributes to <body> before hydration */}
      <body suppressHydrationWarning className="flex min-h-dvh flex-col bg-night font-sans text-fg antialiased">
        {/* First Tab stop: keyboard users can jump past the navigation */}
        <a
          href="#main"
          className="slant fixed top-3 left-4 z-60 -translate-y-24 bg-accent px-4 py-2 font-semibold text-night transition-transform focus:translate-y-0"
        >
          <span className="unslant">{t("skip")}</span>
        </a>
        <NextIntlClientProvider>
          <MotionProvider>
            <Header />
            <main id="main" tabIndex={-1} className="flex-1 outline-none">
              {children}
            </main>
            <Footer />
            <WhatsAppButton />
          </MotionProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

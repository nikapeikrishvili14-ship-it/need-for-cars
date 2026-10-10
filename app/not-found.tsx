import { getTranslations } from "next-intl/server";
import { fontVariables } from "@/lib/fonts";
import { routing } from "@/i18n/routing";

// Global 404 (becomes out/404.html). It sits outside [locale], so it uses the
// default language. Uses a plain <a> since next-intl's Link needs a locale route.
export default async function NotFound() {
  const t = await getTranslations({ locale: routing.defaultLocale, namespace: "notFound" });

  return (
    <html lang={routing.defaultLocale} className={fontVariables}>
      <body className="flex min-h-dvh flex-col items-center justify-center gap-6 bg-night px-4 font-sans text-fg antialiased">
        <p className="font-heading text-7xl font-black italic text-accent">404</p>
        <h1 className="text-2xl font-bold italic">{t("title")}</h1>
        <a
          href={`/${routing.defaultLocale}/`}
          className="slant bg-accent px-6 py-3 font-semibold text-night"
        >
          {t("back")}
        </a>
      </body>
    </html>
  );
}

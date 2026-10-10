import type { Metadata, Viewport } from "next";
import { getTranslations } from "next-intl/server";
import { fontVariables } from "@/lib/fonts";
import { routing, type Locale } from "@/i18n/routing";
import { site } from "@/data/site";
import StudioBackdrop from "@/components/garage/StudioBackdrop";
import { slantButton } from "@/components/SlantLink";

// Next.js adds <meta name="robots" content="noindex"> to this page by itself
export const metadata: Metadata = {
  title: `404 | ${site.name}`,
};

export const viewport: Viewport = { themeColor: "#0B0B0D", colorScheme: "dark" };

// Picks the language before first paint: /ka/... or /ru/... in the address,
// otherwise the browser's language, otherwise English (also the no-JS view).
const pickLanguage = `(function(){var l=${JSON.stringify(routing.locales)},s=location.pathname.split("/")[1],n=(navigator.languages||[navigator.language||""]).map(function(x){return x.slice(0,2)}),p=l.indexOf(s)>-1?s:n.filter(function(x){return l.indexOf(x)>-1})[0]||"${routing.defaultLocale}";var h=document.documentElement;h.lang=p;h.setAttribute("data-nf",p)})()`;

// Show only the block for the picked language
const css = routing.locales
  .map((l) => `html[data-nf="${l}"] [data-nf-lang]:not([data-nf-lang="${l}"]){display:none}`)
  .join("");

// Global 404 (becomes out/404.html, served by the host for any unknown URL).
// A static site has one 404 file for all languages, so it holds all three and
// a tiny script shows the right one. Plain <a> links: next-intl's Link needs a
// locale route.
export default async function NotFound() {
  const blocks = await Promise.all(
    routing.locales.map(async (locale) => ({
      locale,
      t: await getTranslations({ locale, namespace: "notFound" }),
    })),
  );

  return (
    <html lang={routing.defaultLocale} data-nf={routing.defaultLocale} className={fontVariables} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: pickLanguage }} />
        <style dangerouslySetInnerHTML={{ __html: css }} />
      </head>
      <body suppressHydrationWarning className="relative isolate min-h-dvh overflow-hidden bg-night font-sans text-fg antialiased">
        <StudioBackdrop lampOn horizon={74} />
        {blocks.map(({ locale, t }) => (
          <NotFoundBlock key={locale} locale={locale} title={t("title")} text={t("text")} back={t("back")} cars={t("cars")} />
        ))}
      </body>
    </html>
  );
}

function NotFoundBlock({ locale, title, text, back, cars }: { locale: Locale } & Record<"title" | "text" | "back" | "cars", string>) {
  const home = `/${locale}/`;
  return (
    <main
      data-nf-lang={locale}
      lang={locale}
      className="relative mx-auto flex min-h-dvh max-w-3xl flex-col items-center justify-center px-4 py-16 text-center"
    >
      <a href={home} className="mb-12 block w-32">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/brand/logo-wordmark.png" alt={site.name} width={480} height={177} className="h-auto w-full" />
      </a>
      <p
        aria-hidden="true"
        className="font-heading text-[8rem] leading-none font-black text-accent italic drop-shadow-[0_0_32px_rgb(255_90_31/0.45)] sm:text-[11rem]"
      >
        404
      </p>
      <span className="slant mt-2 block h-1.5 w-24 bg-accent shadow-glow" aria-hidden="true" />
      <h1 className="mt-8 text-3xl font-black italic sm:text-4xl">{title}</h1>
      <p className="mt-4 max-w-md text-muted">{text}</p>
      <div className="mt-10 flex flex-wrap justify-center gap-3">
        <a href={home} className={slantButton("primary", "lg")}>
          <span className="unslant">{back}</span>
        </a>
        <a href={`/${locale}/cars/`} className={slantButton("ghost", "lg")}>
          <span className="unslant">{cars}</span>
        </a>
      </div>
    </main>
  );
}

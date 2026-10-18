import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { routing, type Locale } from "@/i18n/routing";
import { site } from "@/data/site";
import type { Car } from "@/data/cars";

/** Fixed pages (path without locale) → their key under meta.pages in messages/*.json. Feeds metadata and sitemap.xml. */
export const staticPages = {
  "/cars": "cars",
  "/book": "book",
  "/find-a-car": "findACar",
  "/about": "about",
  "/faq": "faq",
  "/contact": "contact",
} as const;

export type StaticPath = keyof typeof staticPages;

const envUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/+$/, "");

/** Live site address, no trailing slash. TODO(owner): set NEXT_PUBLIC_SITE_URL in .env.local (see .env.example) */
export const siteUrl = envUrl || "https://example.com";

/** True while NEXT_PUBLIC_SITE_URL is missing (app/sitemap.ts warns during the build) */
export const siteUrlMissing = !envUrl;

/** Open Graph locale codes */
const ogLocales: Record<Locale, string> = { en: "en_US", ka: "ka_GE", ru: "ru_RU" };

/**
 * Site path for a page in one language, with the trailing slash the static
 * export uses (next.config.ts → trailingSlash): ("ka", "/cars") → "/ka/cars/".
 */
export function localePath(locale: Locale, path: string): string {
  return `/${locale}${path === "/" ? "" : path}/`;
}

/** Absolute URL for a site path */
export function absoluteUrl(path: string): string {
  return `${siteUrl}${path}`;
}

/** hreflang map for a page: every language plus x-default → English */
export function languageAlternates(path: string): Record<string, string> {
  const languages: Record<string, string> = {};
  for (const locale of routing.locales) languages[locale] = absoluteUrl(localePath(locale, path));
  languages["x-default"] = absoluteUrl(localePath(routing.defaultLocale, path));
  return languages;
}

type PageMeta = {
  locale: Locale;
  /** Path without locale, e.g. "/" or "/cars/toyota-gr-supra" */
  path: string;
  title: string;
  description: string;
  /** Use the title as-is instead of adding " | Need For Cars" (home page) */
  absoluteTitle?: boolean;
  /** Sharing image; defaults to the language's garage card (/[locale]/og.png) */
  image?: { url: string; width?: number; height?: number; alt: string };
  /** Default image alt text (meta.ogImageAlt) */
  imageAlt: string;
};

/**
 * Full metadata for one page: title, description, canonical URL, hreflang
 * alternates and the Open Graph / Twitter sharing preview.
 * Next.js replaces (not merges) openGraph/twitter between layout and page,
 * so every page builds the complete set here.
 */
export function pageMetadata({ locale, path, title, description, absoluteTitle, image, imageAlt }: PageMeta): Metadata {
  const url = absoluteUrl(localePath(locale, path));
  const fullTitle = absoluteTitle ? title : `${title} | ${site.name}`;
  const img = image ?? { url: absoluteUrl(`/${locale}/og.png`), width: 1200, height: 630, alt: imageAlt };

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: url, languages: languageAlternates(path) },
    openGraph: {
      type: "website",
      siteName: site.name,
      url,
      title: fullTitle,
      description,
      locale: ogLocales[locale],
      alternateLocale: routing.locales.filter((l) => l !== locale).map((l) => ogLocales[l]),
      images: [img],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [{ url: img.url, alt: img.alt }],
    },
  };
}

/**
 * Image types the share-card renderer (lib/og.tsx) can draw. It can't draw
 * WebP/AVIF, so a car with only WebP photos shares the cover photo file itself.
 */
export function canDraw(path: string | undefined): path is string {
  return !!path && /\.(png|jpe?g|svg)$/i.test(path);
}

/** Sharing image for a car page: its drawn garage card, or the cover photo as-is */
export function carShareImage(locale: Locale, car: Car, alt: string): NonNullable<PageMeta["image"]> {
  if (canDraw(car.stage) || canDraw(car.photos[0])) {
    return { url: absoluteUrl(`/${locale}/cars/${car.slug}/og.png`), width: 1200, height: 630, alt };
  }
  return { url: absoluteUrl(car.photos[0]), alt };
}

/** Metadata for one of the fixed pages, text from meta.pages.* */
export async function staticPageMetadata(locale: string, path: StaticPath): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "meta" });
  const key = staticPages[path];
  return pageMetadata({
    locale: locale as Locale,
    path,
    title: t(`pages.${key}.title`),
    description: t(`pages.${key}.description`),
    imageAlt: t("ogImageAlt"),
  });
}

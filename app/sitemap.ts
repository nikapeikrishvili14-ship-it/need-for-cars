import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { cars } from "@/data/cars";
import { absoluteUrl, languageAlternates, localePath, siteUrlMissing, staticPages } from "@/lib/seo";

// out/sitemap.xml — every page in every language, each listing its translations
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  if (siteUrlMissing) {
    console.warn("⚠ NEXT_PUBLIC_SITE_URL is not set — canonical URLs, sitemap and sharing previews use https://example.com");
  }
  const paths = ["/", ...Object.keys(staticPages), ...cars.map((car) => `/cars/${car.slug}`)];
  return paths.flatMap((path) =>
    routing.locales.map((locale) => ({
      url: absoluteUrl(localePath(locale, path)),
      changeFrequency: path === "/" || path === "/cars" ? ("weekly" as const) : ("monthly" as const),
      priority: path === "/" ? 1 : path.startsWith("/cars") ? 0.8 : 0.6,
      alternates: { languages: languageAlternates(path) },
    })),
  );
}

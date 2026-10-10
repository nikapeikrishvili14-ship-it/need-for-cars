import { routing, type Locale } from "@/i18n/routing";
import { siteCard } from "@/lib/og";

// Sharing preview for every page in this language → out/[locale]/og.png.
// A route named og.png (not opengraph-image) so the static export writes a
// real .png file that any host serves with the right content type.
export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function GET(_request: Request, { params }: RouteContext<"/[locale]/og.png">) {
  const { locale } = await params;
  return siteCard(locale as Locale);
}

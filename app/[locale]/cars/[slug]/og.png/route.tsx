import { routing, type Locale } from "@/i18n/routing";
import { cars, getCar } from "@/data/cars";
import { carCard } from "@/lib/og";

// Sharing preview for one car page → out/[locale]/cars/[slug]/og.png
export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => cars.map((car) => ({ locale, slug: car.slug })));
}

export async function GET(_request: Request, { params }: RouteContext<"/[locale]/cars/[slug]/og.png">) {
  const { locale, slug } = await params;
  const car = getCar(slug);
  if (!car) return new Response("Not found", { status: 404 });
  return carCard(locale as Locale, car);
}

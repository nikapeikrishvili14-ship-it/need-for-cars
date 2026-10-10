import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { cars, getCar } from "@/data/cars";
import PageTitle from "@/components/PageTitle";

// Only cars listed in data/cars.ts get a page
export const dynamicParams = false;

// Combined with the parent [locale] params → one page per car per language
export function generateStaticParams() {
  return cars.map((car) => ({ slug: car.slug }));
}

export async function generateMetadata({ params }: PageProps<"/[locale]/cars/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const car = getCar(slug);
  return car ? { title: `${car.brand} ${car.model}` } : {};
}

export default async function CarPage({ params }: PageProps<"/[locale]/cars/[slug]">) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const car = getCar(slug);
  if (!car) notFound();

  return (
    <PageTitle>
      {car.brand} {car.model}
    </PageTitle>
  );
}

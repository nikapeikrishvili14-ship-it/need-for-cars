import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import type { Car } from "@/data/cars";
import { pageMetadata } from "@/lib/seo";
import { autoRentalSchema } from "@/lib/schema";
import JsonLd from "@/components/JsonLd";
import HomeHero from "@/components/home/HomeHero";
import CarSelector from "@/components/home/CarSelector";
import WhyUs from "@/components/home/WhyUs";
import HowItWorks from "@/components/home/HowItWorks";
import DeliveryCities from "@/components/home/DeliveryCities";
import Reviews from "@/components/home/Reviews";
import FinalCta from "@/components/home/FinalCta";

export async function generateMetadata({ params }: PageProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return pageMetadata({
    locale: locale as Locale,
    path: "/",
    title: t("title"),
    absoluteTitle: true,
    description: t("description"),
    imageAlt: t("ogImageAlt"),
  });
}

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("meta");
  const tCar = await getTranslations("car");
  const labels = {
    type: (car: Car) => tCar(`types.${car.type}`),
    colour: (car: Car) => tCar(`colours.${car.colour}`),
    fuel: (car: Car) => tCar(`fuels.${car.specs.fuel}`),
    transmission: (car: Car) => tCar(`transmissions.${car.transmission}`),
  };

  return (
    <>
      <JsonLd data={autoRentalSchema(locale as Locale, t("description"), labels)} />
      <HomeHero />
      {/* Same base tone as the hero and no edge, so the two read as one garage.
          On desktop it fills one screen (CarSelector sizes the car to fit). */}
      <section
        id="garage"
        aria-labelledby="garage-title"
        className="relative scroll-mt-16 overflow-hidden bg-night pt-6 pb-16 lg:flex lg:min-h-[calc(100svh-4rem)] lg:flex-col lg:justify-center lg:py-6"
      >
        {/* Lamp light fades in from the base tone, matching the hero's bottom fade */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 z-1 h-24 bg-linear-to-b from-night to-transparent"
        />
        <div className="mx-auto w-full max-w-7xl px-4 lg:px-8">
          <CarSelector />
        </div>
      </section>
      <WhyUs />
      <HowItWorks />
      <DeliveryCities />
      <Reviews />
      <FinalCta />
    </>
  );
}

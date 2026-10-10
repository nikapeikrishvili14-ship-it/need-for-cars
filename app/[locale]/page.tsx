import { setRequestLocale } from "next-intl/server";
import HomeHero from "@/components/home/HomeHero";
import Section from "@/components/home/Section";
import CarSelector from "@/components/home/CarSelector";
import WhyUs from "@/components/home/WhyUs";
import HowItWorks from "@/components/home/HowItWorks";
import DeliveryCities from "@/components/home/DeliveryCities";
import Reviews from "@/components/home/Reviews";
import FinalCta from "@/components/home/FinalCta";

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <HomeHero />
      <Section tone="surface" labelledBy="garage-title">
        <CarSelector />
      </Section>
      <WhyUs />
      <HowItWorks />
      <DeliveryCities />
      <Reviews />
      <FinalCta />
    </>
  );
}

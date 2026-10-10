import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { staticPageMetadata } from "@/lib/seo";
import PageTitle from "@/components/PageTitle";
import CarCatalogue from "@/components/CarCatalogue";

export async function generateMetadata({ params }: PageProps<"/[locale]/cars">): Promise<Metadata> {
  const { locale } = await params;
  return staticPageMetadata(locale, "/cars");
}

export default async function CarsPage({ params }: PageProps<"/[locale]/cars">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("pages.cars");

  return (
    <>
      <PageTitle>{t("title")}</PageTitle>
      <CarCatalogue />
    </>
  );
}

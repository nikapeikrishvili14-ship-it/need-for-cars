import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import PageTitle from "@/components/PageTitle";
import CarCatalogue from "@/components/CarCatalogue";

export async function generateMetadata({ params }: PageProps<"/[locale]/cars">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pages.cars" });
  return { title: t("title") };
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

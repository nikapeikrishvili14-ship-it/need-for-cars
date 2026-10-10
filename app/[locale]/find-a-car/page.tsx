import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import PageTitle from "@/components/PageTitle";

export async function generateMetadata({ params }: PageProps<"/[locale]/find-a-car">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pages.findACar" });
  return { title: t("title") };
}

export default async function FindACarPage({ params }: PageProps<"/[locale]/find-a-car">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("pages.findACar");

  return <PageTitle>{t("title")}</PageTitle>;
}

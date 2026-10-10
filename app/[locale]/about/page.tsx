import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import PageTitle from "@/components/PageTitle";

export async function generateMetadata({ params }: PageProps<"/[locale]/about">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pages.about" });
  return { title: t("title") };
}

export default async function AboutPage({ params }: PageProps<"/[locale]/about">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("pages.about");

  return <PageTitle>{t("title")}</PageTitle>;
}

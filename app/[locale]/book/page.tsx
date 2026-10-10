import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import PageTitle from "@/components/PageTitle";

export async function generateMetadata({ params }: PageProps<"/[locale]/book">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pages.book" });
  return { title: t("title") };
}

export default async function BookPage({ params }: PageProps<"/[locale]/book">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("pages.book");

  return <PageTitle>{t("title")}</PageTitle>;
}

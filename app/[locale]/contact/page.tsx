import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import PageTitle from "@/components/PageTitle";

export async function generateMetadata({ params }: PageProps<"/[locale]/contact">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pages.contact" });
  return { title: t("title") };
}

export default async function ContactPage({ params }: PageProps<"/[locale]/contact">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("pages.contact");

  return <PageTitle>{t("title")}</PageTitle>;
}

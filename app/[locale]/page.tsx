import { getTranslations, setRequestLocale } from "next-intl/server";
import PageTitle from "@/components/PageTitle";

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("pages.home");

  return <PageTitle>{t("title")}</PageTitle>;
}

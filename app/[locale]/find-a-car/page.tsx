import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import PageTitle from "@/components/PageTitle";
import FindCarForm from "@/components/FindCarForm";

export async function generateMetadata({ params }: PageProps<"/[locale]/find-a-car">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pages.findACar" });
  return { title: t("title") };
}

export default async function FindACarPage({ params }: PageProps<"/[locale]/find-a-car">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  return (
    <>
      <PageTitle intro={t("findACar.intro")}>{t("pages.findACar.title")}</PageTitle>
      <div className="mx-auto max-w-3xl px-4 lg:px-8">
        <FindCarForm />
      </div>
    </>
  );
}

import { Suspense } from "react";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import PageTitle from "@/components/PageTitle";
import BookingForm from "@/components/BookingForm";

export async function generateMetadata({ params }: PageProps<"/[locale]/book">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pages.book" });
  return { title: t("title") };
}

export default async function BookPage({ params }: PageProps<"/[locale]/book">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  return (
    <>
      <PageTitle intro={t("booking.intro")}>{t("pages.book.title")}</PageTitle>
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        {/* BookingForm reads ?car= from the URL, which only exists in the browser
            in a static export — so it renders client-side inside Suspense */}
        <Suspense fallback={<FormSkeleton />}>
          <BookingForm />
        </Suspense>
      </div>
    </>
  );
}

function FormSkeleton() {
  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,380px)] lg:gap-8" aria-hidden="true">
      <div className="h-192 animate-pulse border border-line bg-surface" />
      <div className="h-80 animate-pulse border border-line bg-surface" />
    </div>
  );
}

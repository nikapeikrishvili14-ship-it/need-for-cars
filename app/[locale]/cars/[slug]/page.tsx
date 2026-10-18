import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ChevronLeft } from "lucide-react";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { cars, getCar } from "@/data/cars";
import { site } from "@/data/site";
import { carShareImage, pageMetadata } from "@/lib/seo";
import { formatDecimal, formatMoney } from "@/lib/money";
import CarGallery from "@/components/CarGallery";
import StatBars from "@/components/StatBars";
import Price from "@/components/Price";
import DepositNote from "@/components/DepositNote";
import AskUs from "@/components/AskUs";
import TunedBadge from "@/components/TunedBadge";

// Only cars listed in data/cars.ts get a page
export const dynamicParams = false;

// Combined with the parent [locale] params → one page per car per language
export function generateStaticParams() {
  return cars.map((car) => ({ slug: car.slug }));
}

export async function generateMetadata({ params }: PageProps<"/[locale]/cars/[slug]">): Promise<Metadata> {
  const { locale: param, slug } = await params;
  const locale = param as Locale;
  const car = getCar(slug);
  if (!car) return {};
  const t = await getTranslations({ locale, namespace: "meta.car" });
  const tCar = await getTranslations({ locale, namespace: "car" });
  const name = `${car.brand} ${car.model}`;
  return pageMetadata({
    locale,
    path: `/cars/${car.slug}`,
    title: t("title", { car: name }),
    description: t("description", {
      car: name,
      price: formatMoney(car.pricePerDay, "USD", locale),
      hp: tCar("units.hp", { value: car.specs.hp }),
      seconds: tCar("units.seconds", { value: formatDecimal(car.specs.acceleration, locale) }),
    }),
    image: carShareImage(locale, car, t("imageAlt", { car: name })),
    imageAlt: t("imageAlt", { car: name }),
  });
}

export default async function CarPage({ params }: PageProps<"/[locale]/cars/[slug]">) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const car = getCar(slug);
  if (!car) notFound();

  const t = await getTranslations("car");
  const tPrice = await getTranslations("price");
  const name = `${car.brand} ${car.model}`;
  const documents = site.rentalTerms.find((term) => term.id === "documents");

  const specs: { label: string; value: React.ReactNode }[] = [
    { label: t("specs.engine"), value: car.specs.engine },
    {
      label: t("specs.power"),
      value: (
        <>
          {car.specs.tuned && <TunedBadge label={t("tuned")} className="mr-2" />}
          {t("units.hp", { value: car.specs.hp })}
        </>
      ),
    },
    { label: t("specs.acceleration"), value: t("units.seconds", { value: formatDecimal(car.specs.acceleration, locale) }) },
    { label: t("specs.topSpeed"), value: t("units.kmh", { value: car.specs.topSpeed }) },
    { label: t("specs.transmission"), value: t(`transmissions.${car.transmission}`) },
    { label: t("specs.drive"), value: car.specs.drive },
    { label: t("specs.fuel"), value: t(`fuels.${car.specs.fuel}`) },
    { label: t("specs.seats"), value: car.seats },
    { label: t("specs.colour"), value: t(`colours.${car.colour}`) },
    // Year only when known
    ...(car.year ? [{ label: t("specs.year"), value: car.year }] : []),
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 pt-6 lg:px-8 lg:pt-10">
      <Link href="/cars" className="inline-flex items-center gap-1 text-sm text-muted transition-colors hover:text-accent">
        <ChevronLeft size={16} aria-hidden="true" />
        {t("back")}
      </Link>

      <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:gap-12">
        <CarGallery photos={car.photos} alt={name} />

        {/* Summary + booking box */}
        <div className="flex flex-col gap-6">
          <div>
            <span className="slant inline-block bg-accent/10 px-3 py-1 text-xs font-semibold tracking-wide text-accent uppercase">
              <span className="unslant">{t(`types.${car.type}`)}</span>
            </span>
            <p className="mt-4 text-sm font-medium tracking-widest text-muted uppercase">{car.brand}</p>
            <h1 className="text-4xl leading-tight font-black italic sm:text-5xl">{car.model}</h1>
            <p className="mt-4 text-muted">{car.description[locale as Locale]}</p>
          </div>

          <div className="border border-line bg-surface p-5 sm:p-6">
            <Price usd={car.pricePerDay} per="day" className="font-heading text-4xl font-black italic" />
            <p className="mt-3 border-l-2 border-accent pl-3 text-sm text-fg/85">{tPrice("longRental")}</p>

            <h2 className="mt-6 text-sm font-bold tracking-widest text-muted uppercase">{t("requirements")}</h2>
            <div className="mt-3 space-y-2 text-sm">
              <AskUs topic={`${t("requirements")} — ${name}`}>{t("requirementsText")}</AskUs>
              {documents?.text && (
                <p>
                  <span className="text-muted">{documents.title[locale as Locale]}:</span> {documents.text[locale as Locale]}
                </p>
              )}
            </div>

            <div className="mt-6 space-y-2 border-t border-line pt-4 text-sm text-muted">
              <DepositNote />
              <p className="flex items-center gap-2 text-fg">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="shrink-0 text-accent">
                  <path d="M8 1.5 2.5 3.5v4c0 3.3 2.3 6 5.5 7 3.2-1 5.5-3.7 5.5-7v-4L8 1.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                  <path d="m5.5 8 1.8 1.8L10.5 6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {t("insurance")}
              </p>
            </div>

            <Link
              href={{ pathname: "/book", query: { car: car.slug } }}
              className="slant mt-6 block bg-accent py-3.5 text-center font-semibold text-night transition-shadow hover:shadow-glow-strong"
            >
              <span className="unslant">{t("book")}</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-12 grid gap-8 lg:mt-16 lg:grid-cols-2 lg:gap-12">
        <section className="border border-line bg-surface p-5 sm:p-6">
          <h2 className="text-2xl font-black italic">{t("performance")}</h2>
          <p className="mt-1 mb-6 text-xs text-muted">
            {t("performanceNote")}
            {car.specs.tuned && <span className="mt-1 block">{t("tunedNote")}</span>}
          </p>
          <StatBars car={car} />
        </section>

        <section className="border border-line bg-surface p-5 sm:p-6">
          <h2 className="mb-4 text-2xl font-black italic">{t("specs.title")}</h2>
          <table className="w-full text-sm">
            <tbody>
              {specs.map((row) => (
                <tr key={row.label} className="border-b border-line last:border-0">
                  <th scope="row" className="py-3 pr-4 text-left font-normal text-muted">
                    {row.label}
                  </th>
                  <td className="py-3 text-right font-semibold">{row.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </div>
  );
}

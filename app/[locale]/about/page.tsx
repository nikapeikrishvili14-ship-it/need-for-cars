import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { cars } from "@/data/cars";
import { site } from "@/data/site";
import { cityList } from "@/lib/siteText";
import { staticPageMetadata } from "@/lib/seo";
import StudioBackdrop from "@/components/garage/StudioBackdrop";
import CarModel from "@/components/garage/CarModel";
import SlantLink from "@/components/SlantLink";
import AskUs from "@/components/AskUs";
import Section, { SectionHeading } from "@/components/home/Section";
import DeliveryCities from "@/components/home/DeliveryCities";

export async function generateMetadata({ params }: PageProps<"/[locale]/about">): Promise<Metadata> {
  const { locale } = await params;
  return staticPageMetadata(locale, "/about");
}

export default async function AboutPage({ params }: PageProps<"/[locale]/about">) {
  const { locale: param } = await params;
  setRequestLocale(param);
  const locale = param as Locale;
  const t = await getTranslations("about");
  const tPages = await getTranslations("pages.about");
  const tCar = await getTranslations("car");
  const tNav = await getTranslations("nav");
  const tHero = await getTranslations("home.hero");
  const tPrice = await getTranslations("price");
  const refund = tPrice("refundTime", { days: site.depositRefundDays });
  const featured = cars.find((c) => c.featured) ?? cars[0];

  return (
    <>
      {/* Intro beside a car parked under the garage lamp */}
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 pt-12 pb-16 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:pt-20">
        <div>
          <h1 className="text-4xl leading-tight font-black italic sm:text-5xl lg:text-6xl">{tPages("title")}</h1>
          <span className="slant mt-4 block h-1.5 w-20 bg-accent shadow-glow" aria-hidden="true" />
          <p className="mt-6 max-w-xl text-lg text-fg/85">{t("intro")}</p>
          <p className="mt-4 max-w-xl text-muted">{t("cities", { cities: cityList(locale) })}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <SlantLink href="/cars" variant="ghost">
              {tHero("browse")}
            </SlantLink>
            <SlantLink href="/book">{tNav("book")}</SlantLink>
          </div>
        </div>

        <div className="relative isolate aspect-16/10 overflow-hidden border border-line bg-night" aria-hidden="true">
          <StudioBackdrop horizon={72} />
          {/* Tyres on the 72% horizon (same placement as the catalogue cards) */}
          <div className="absolute inset-x-[8%] top-[26%]">
            <CarModel car={featured} sizes="(min-width: 1024px) 40vw, 90vw" />
          </div>
        </div>
      </div>

      {site.story && (
        <div className="mx-auto grid max-w-7xl gap-8 px-4 pb-16 sm:grid-cols-[auto_minmax(0,1fr)] sm:items-start sm:gap-12 lg:px-8">
          {/* Years in business, outlined like the grid-slot numbers on the home page */}
          <p className="flex items-end gap-3 sm:flex-col sm:items-start sm:gap-1">
            <span
              aria-hidden="true"
              className="font-heading text-8xl leading-none font-black text-transparent italic [-webkit-text-stroke:2px_var(--color-accent)] sm:text-9xl"
            >
              {site.yearsOnRoad}
            </span>
            <span className="pb-2 font-heading text-lg font-bold italic sm:pb-0">
              <span className="sr-only">{site.yearsOnRoad} </span>
              {t("yearsOnRoad", { count: site.yearsOnRoad })}
            </span>
          </p>
          <div>
            <h2 className="text-3xl font-black italic sm:text-4xl">{t("storyTitle")}</h2>
            <p className="mt-4 max-w-2xl whitespace-pre-line text-fg/85">{site.story[locale]}</p>
          </div>
        </div>
      )}

      <Section tone="surface" overlap={false} labelledBy="terms-title">
        <div id="terms" className="scroll-mt-24">
          <SectionHeading id="terms-title" title={t("terms.title")} intro={t("terms.intro")} />

          <dl className="mt-10 border-b border-line">
            <TermRow title={t("terms.deposit")}>
              <AskUs topic={t("terms.deposit")}>{tPrice("deposit", { refund })}</AskUs>
            </TermRow>

            <TermRow title={t("terms.insurance")}>
              <AskUs topic={t("terms.insurance")}>{t("terms.insuranceText")}</AskUs>
            </TermRow>

            <TermRow title={t("terms.requirements")}>
              <AskUs topic={t("terms.requirements")}>{tCar("requirementsText")}</AskUs>
            </TermRow>

            {site.rentalTerms.map((term) => (
              <TermRow key={term.id} title={term.title[locale]}>
                {!term.text ? (
                  <AskUs topic={term.title[locale]} />
                ) : term.ask ? (
                  <AskUs topic={term.title[locale]}>{term.text[locale]}</AskUs>
                ) : (
                  <p>{term.text[locale]}</p>
                )}
              </TermRow>
            ))}
          </dl>
        </div>
      </Section>

      <DeliveryCities tone="night" />
    </>
  );
}

// One rule: name on the left (stacked on phones), details on the right
function TermRow({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-2 border-t border-line py-6 sm:grid-cols-[minmax(0,14rem)_minmax(0,1fr)] sm:gap-10">
      <dt className="font-heading text-lg font-bold italic">{title}</dt>
      <dd className="text-fg/80">{children}</dd>
    </div>
  );
}

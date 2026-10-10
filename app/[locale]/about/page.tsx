import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ChevronRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { cars } from "@/data/cars";
import { site } from "@/data/site";
import { cityList } from "@/lib/siteText";
import StudioBackdrop from "@/components/garage/StudioBackdrop";
import CarModel from "@/components/garage/CarModel";
import SlantLink from "@/components/SlantLink";
import Price from "@/components/Price";
import AskUs from "@/components/AskUs";
import Section, { SectionHeading } from "@/components/home/Section";
import DeliveryCities from "@/components/home/DeliveryCities";

export async function generateMetadata({ params }: PageProps<"/[locale]/about">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pages.about" });
  const ta = await getTranslations({ locale, namespace: "about" });
  return { title: t("title"), description: ta("intro") };
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
        <div className="mx-auto max-w-7xl px-4 pb-16 lg:px-8">
          <h2 className="text-3xl font-black italic sm:text-4xl">{t("storyTitle")}</h2>
          <p className="mt-4 max-w-2xl whitespace-pre-line text-fg/85">{site.story[locale]}</p>
        </div>
      )}

      <Section tone="surface" overlap={false} labelledBy="terms-title">
        <div id="terms" className="scroll-mt-24">
          <SectionHeading id="terms-title" title={t("terms.title")} intro={t("terms.intro")} />

          <dl className="mt-10 border-b border-line">
            <TermRow title={t("terms.deposit")}>
              {t.rich("terms.depositText", {
                amount: () => <Price usd={site.deposit} className="text-fg" />,
                refund,
              })}
            </TermRow>

            <TermRow title={t("terms.insurance")}>{tCar("insurance")}</TermRow>

            <TermRow title={t("terms.requirements")}>
              <p>{t("terms.requirementsText")}</p>
              <div className="mt-4 max-w-xl overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="text-muted">
                    <tr className="border-b border-line">
                      <th scope="col" className="py-2 pr-4 font-normal">
                        {t("terms.car")}
                      </th>
                      <th scope="col" className="py-2 pr-4 font-normal">
                        {tCar("minAge")}
                      </th>
                      <th scope="col" className="py-2 font-normal">
                        {tCar("minExperience")}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {cars.map((car) => (
                      <tr key={car.slug} className="border-b border-line/60 last:border-0">
                        <th scope="row" className="py-2.5 pr-4 font-semibold">
                          <Link href={`/cars/${car.slug}`} className="text-fg transition-colors hover:text-accent">
                            {car.brand} {car.model}
                          </Link>
                        </th>
                        <td className="py-2.5 pr-4 whitespace-nowrap">{tCar("years", { count: car.minAge })}</td>
                        <td className="py-2.5 whitespace-nowrap">{tCar("years", { count: car.minExperience })}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Link
                href="/cars"
                className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-accent hover:underline"
              >
                {t("terms.allCars")}
                <ChevronRight size={16} aria-hidden="true" />
              </Link>
            </TermRow>

            {site.rentalTerms.map((term) => (
              <TermRow key={term.id} title={term.title[locale]}>
                {term.text ? <p>{term.text[locale]}</p> : <AskUs topic={term.title[locale]} />}
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

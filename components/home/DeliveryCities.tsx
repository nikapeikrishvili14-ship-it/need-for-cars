import { getLocale, getTranslations } from "next-intl/server";
import { MapPin } from "lucide-react";
import { site } from "@/data/site";
import type { Locale } from "@/i18n/routing";
import Price from "@/components/Price";
import AskUs from "@/components/AskUs";
import Section, { SectionHeading } from "./Section";

// Delivery places with their fees and free-delivery rules (data/site.ts → cities)
export default async function DeliveryCities({ tone = "surface" }: { tone?: "night" | "surface" }) {
  const t = await getTranslations("home.delivery");
  const td = await getTranslations("delivery");
  const locale = (await getLocale()) as Locale;

  return (
    <Section tone={tone} labelledBy="delivery-title">
      {/* Cool rim light low on the right, like a city glow on the horizon */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 -bottom-40 h-[480px] w-[720px] bg-[radial-gradient(closest-side,rgb(59_167_255/0.12),transparent)]"
      />

      <div className="relative">
        <SectionHeading id="delivery-title" title={t("title")} intro={t("intro")} />

        <ul className="mt-12 grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {site.cities.map((city) => (
            <li key={city.id} className={`flex flex-col gap-6 p-6 ${tone === "night" ? "bg-surface" : "bg-night"}`}>
              <MapPin size={20} className="text-accent" aria-hidden="true" />
              <div className="mt-auto">
                <p className="font-heading text-2xl font-bold italic">{city.name[locale]}</p>
                <p className="mt-1 text-sm text-muted">
                  {city.deliveryFee === 0 ? (
                    <span className="font-semibold text-accent capitalize">{td("free")}</span>
                  ) : (
                    t.rich("fee", { amount: () => <Price usd={city.deliveryFee} className="text-fg" /> })
                  )}
                </p>
                {city.deliveryFee > 0 && city.freeFromDays && (
                  <p className="slant mt-3 inline-block bg-accent/10 px-2.5 py-1 text-xs font-semibold text-accent">
                    <span className="unslant">{td("freeFromBadge", { days: city.freeFromDays })}</span>
                  </p>
                )}
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-6 text-sm">
          <AskUs topic={t("askTopic")}>
            <span className="text-muted">{t("other")}</span>
          </AskUs>
        </div>
      </div>
    </Section>
  );
}

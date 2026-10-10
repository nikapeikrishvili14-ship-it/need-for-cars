import { getLocale, getTranslations } from "next-intl/server";
import { Quote, Star } from "lucide-react";
import { site } from "@/data/site";
import type { Locale } from "@/i18n/routing";
import { whatsappUrl } from "@/lib/whatsapp";
import { slantButton } from "@/components/SlantLink";
import Section, { SectionHeading } from "./Section";

// Shows real reviews from data/site.ts. Until the owner adds some, an honest
// "coming soon" note with a way to leave one.
export default async function Reviews() {
  const t = await getTranslations("home.reviews");
  const locale = (await getLocale()) as Locale;
  const { reviews } = site;

  return (
    <Section labelledBy="reviews-title">
      <SectionHeading id="reviews-title" title={t("title")} />

      {reviews.length > 0 ? (
        <ul className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review) => (
            <li key={review.name} className="border-l-2 border-accent bg-surface p-6">
              <figure>
                <div className="flex gap-1 text-accent" aria-label={t("rating", { rating: review.rating })}>
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star key={i} size={16} fill={i < review.rating ? "currentColor" : "none"} aria-hidden="true" />
                  ))}
                </div>
                <blockquote className="mt-4 text-fg/90">{review.text[locale]}</blockquote>
                <figcaption className="mt-5 text-sm">
                  <span className="font-semibold">{review.name}</span>
                  <span className="text-muted">, {review.from[locale]}</span>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-10 flex flex-col items-start gap-6 border border-dashed border-line p-6 sm:flex-row sm:items-center sm:p-8">
          <Quote size={36} className="shrink-0 text-accent/70" aria-hidden="true" />
          <p className="max-w-xl flex-1 text-muted">{t("empty")}</p>
          <a href={whatsappUrl(t("shareMessage"))} target="_blank" rel="noopener noreferrer" className={slantButton("ghost")}>
            <span className="unslant">{t("share")}</span>
          </a>
        </div>
      )}
    </Section>
  );
}

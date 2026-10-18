import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ChevronDown } from "lucide-react";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { site } from "@/data/site";
import { deliveryRulesText, faqGroups, fillSiteTokens } from "@/lib/siteText";
import { whatsappUrl } from "@/lib/whatsapp";
import { staticPageMetadata } from "@/lib/seo";
import PageTitle from "@/components/PageTitle";
import AskUs from "@/components/AskUs";
import JsonLd from "@/components/JsonLd";
import WhatsAppIcon from "@/components/WhatsAppIcon";
import StudioBackdrop from "@/components/garage/StudioBackdrop";
import { slantButton } from "@/components/SlantLink";

export async function generateMetadata({ params }: PageProps<"/[locale]/faq">): Promise<Metadata> {
  const { locale } = await params;
  return staticPageMetadata(locale, "/faq");
}

export default async function FaqPage({ params }: PageProps<"/[locale]/faq">) {
  const { locale: param } = await params;
  setRequestLocale(param);
  const locale = param as Locale;
  const t = await getTranslations("pages.faq");
  const tf = await getTranslations("faq");
  const tPrice = await getTranslations("price");
  const tDelivery = await getTranslations("delivery");
  const tokens = {
    refundTime: tPrice("refundTime", { days: site.depositRefundDays }),
    deliveryRules: deliveryRulesText(locale, {
      free: tDelivery("free"),
      freeFrom: (days) => tDelivery("freeFrom", { days }),
    }),
  };

  const items = site.faq.map((item, i) => ({
    id: `q${i + 1}`,
    group: item.group,
    question: item.question[locale],
    answer: item.answer ? fillSiteTokens(item.answer[locale], locale, tokens) : undefined,
    ask: item.ask,
  }));
  const groups = faqGroups.filter((g) => items.some((item) => item.group === g));

  // Google FAQ rich results: only questions with a real answer on the page
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: locale,
    mainEntity: items
      .filter((item) => item.answer)
      .map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: { "@type": "Answer", text: item.answer },
      })),
  };

  return (
    <>
      <JsonLd data={jsonLd} />

      <PageTitle intro={tf("intro")}>{t("title")}</PageTitle>

      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <nav aria-label={tf("jump")} className="flex flex-wrap gap-2">
          {groups.map((group) => (
            <a
              key={group}
              href={`#${group}`}
              className="slant border border-line bg-night px-3 py-1.5 text-sm font-semibold text-muted transition-colors hover:border-accent/60 hover:text-fg"
            >
              <span className="unslant">{tf(`groups.${group}`)}</span>
            </a>
          ))}
        </nav>

        <div className="mt-10 grid gap-12 lg:mt-14 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-16">
          <div className="space-y-12">
            {groups.map((group) => (
              <section key={group} id={group} aria-labelledby={`${group}-title`} className="scroll-mt-24">
                <h2 id={`${group}-title`} className="text-2xl font-black italic sm:text-3xl">
                  {tf(`groups.${group}`)}
                </h2>
                <div className="mt-4 border-t border-line">
                  {items
                    .filter((item) => item.group === group)
                    .map((item) => (
                      // Native disclosure: works without JavaScript and keeps answers in the HTML for search engines
                      <details key={item.id} id={item.id} className="group border-b border-line">
                        <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 transition-colors hover:text-accent [&::-webkit-details-marker]:hidden">
                          <h3 className="text-base font-semibold sm:text-lg">{item.question}</h3>
                          <ChevronDown
                            size={20}
                            aria-hidden="true"
                            className="shrink-0 text-accent transition-transform duration-200 group-open:rotate-180"
                          />
                        </summary>
                        <div className="max-w-2xl pb-6 text-fg/80">
                          {!item.answer ? (
                            <AskUs topic={item.question} />
                          ) : item.ask ? (
                            <AskUs topic={item.question}>{item.answer}</AskUs>
                          ) : (
                            <p>{item.answer}</p>
                          )}
                        </div>
                      </details>
                    ))}
                </div>
              </section>
            ))}
          </div>

          {/* Still have a question? — a small garage bay with the ways to reach us */}
          <aside className="relative isolate self-start overflow-hidden border border-line bg-night p-6 lg:sticky lg:top-24">
            <StudioBackdrop horizon={100} />
            <div className="relative">
              <h2 className="text-2xl font-black italic">{tf("moreTitle")}</h2>
              <p className="mt-2 text-muted">{tf("moreText")}</p>
              <div className="mt-6 flex flex-col gap-3">
                <a
                  href={whatsappUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={slantButton("primary")}
                >
                  <span className="unslant inline-flex items-center gap-2">
                    <WhatsAppIcon size={18} />
                    {tf("whatsapp")}
                  </span>
                </a>
                <Link href="/contact" className={slantButton("ghost")}>
                  <span className="unslant">{tf("contact")}</span>
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}

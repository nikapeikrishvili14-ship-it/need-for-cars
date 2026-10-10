import { getTranslations } from "next-intl/server";
import { MessageCircle, ShieldCheck, Truck, Wallet } from "lucide-react";
import { site } from "@/data/site";
import Price from "@/components/Price";
import Section, { SectionHeading } from "./Section";

const items = [
  { key: "delivery", Icon: Truck },
  { key: "insured", Icon: ShieldCheck },
  { key: "deposit", Icon: Wallet },
  { key: "request", Icon: MessageCircle },
] as const;

export default async function WhyUs() {
  const t = await getTranslations("home.why");

  return (
    <Section labelledBy="why-title">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
        <SectionHeading id="why-title" title={t("title")} intro={t("intro")} />

        <ul>
          {items.map(({ key, Icon }) => (
            <li key={key} className="flex gap-5 border-t border-line py-6 last:border-b sm:gap-7">
              <span className="slant flex h-12 w-14 shrink-0 items-center justify-center border border-accent/40 text-accent">
                <Icon size={22} className="unslant" aria-hidden="true" />
              </span>
              <div>
                <h3 className="text-xl font-bold italic sm:text-2xl">{t(`${key}.title`)}</h3>
                <p className="mt-1.5 max-w-lg text-muted">
                  {key === "deposit"
                    ? t.rich("deposit.text", { amount: () => <Price usd={site.deposit} className="text-fg" /> })
                    : t(`${key}.text`)}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}

import { getTranslations } from "next-intl/server";
import Section, { SectionHeading } from "./Section";

const steps = ["choose", "request", "confirm", "drive"] as const;

export default async function HowItWorks() {
  const t = await getTranslations("home.steps");

  return (
    <Section labelledBy="steps-title">
      <SectionHeading id="steps-title" title={t("title")} intro={t("intro")} />

      <ol className="mt-12 grid gap-10 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4 lg:gap-8">
        {steps.map((step, i) => (
          <li key={step} className="relative">
            <div className="flex items-center gap-4">
              {/* Outlined numeral, like a grid-slot number */}
              <span
                aria-hidden="true"
                className="font-heading text-6xl leading-none font-black text-transparent italic [-webkit-text-stroke:1.5px_var(--color-accent)]"
              >
                {i + 1}
              </span>
              {i < steps.length - 1 && (
                <span aria-hidden="true" className="slant hidden h-px flex-1 bg-linear-to-r from-accent/60 to-transparent lg:block" />
              )}
            </div>
            <h3 className="mt-4 text-2xl font-bold italic">{t(`${step}.title`)}</h3>
            <p className="mt-2 max-w-xs text-muted">{t(`${step}.text`)}</p>
          </li>
        ))}
      </ol>
    </Section>
  );
}

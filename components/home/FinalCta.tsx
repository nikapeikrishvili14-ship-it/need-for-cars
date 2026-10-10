import { getTranslations } from "next-intl/server";
import SlantLink from "@/components/SlantLink";
import Section from "./Section";

export default async function FinalCta() {
  const t = await getTranslations("home.cta");
  const tNav = await getTranslations("nav");

  return (
    <Section labelledBy="cta-title" className="text-center">
      {/* A slanted streak of accent light behind the headline */}
      <div
        aria-hidden="true"
        className="slant pointer-events-none absolute top-1/2 left-1/2 h-40 w-[min(900px,90%)] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(closest-side,rgb(255_90_31/0.22),transparent)]"
      />
      <div className="relative">
        <h2 id="cta-title" className="mx-auto max-w-3xl text-4xl leading-none font-black italic sm:text-6xl">
          {t("title")}
        </h2>
        <p className="mx-auto mt-5 max-w-md text-fg/75">{t("text")}</p>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <SlantLink href="/book" size="lg">
            {tNav("book")}
          </SlantLink>
          <SlantLink href="/find-a-car" variant="ghost" size="lg">
            {t("find")}
          </SlantLink>
        </div>
      </div>
    </Section>
  );
}

type Props = {
  tone?: "night" | "surface";
  /** id of the section's heading, for aria-labelledby */
  labelledBy?: string;
  className?: string;
  children: React.ReactNode;
};

// Home page band with an angled top edge that tucks over the band above it,
// so neighbouring sections meet along one slanted line.
export default function Section({ tone = "night", labelledBy, className = "", children }: Props) {
  return (
    <section
      aria-labelledby={labelledBy}
      className={`edge-top relative -mt-(--edge) overflow-hidden pt-[calc(var(--edge)+3.5rem)] pb-20 lg:pt-[calc(var(--edge)+5rem)] lg:pb-28 ${
        tone === "surface" ? "bg-surface" : "bg-night"
      } ${className}`}
    >
      <div className="relative mx-auto max-w-7xl px-4 lg:px-8">{children}</div>
    </section>
  );
}

/** Section heading with the logo-slant accent bar, matching PageTitle. */
export function SectionHeading({ id, title, intro }: { id: string; title: string; intro?: React.ReactNode }) {
  return (
    <div>
      <h2 id={id} className="text-4xl leading-none font-black italic sm:text-5xl">
        {title}
      </h2>
      <span className="slant mt-4 block h-1.5 w-16 bg-accent shadow-glow" aria-hidden="true" />
      {intro && <p className="mt-5 max-w-md text-muted">{intro}</p>}
    </div>
  );
}

// Small slanted tag next to the power figure of a tuned car (car.specs.tuned)
export default function TunedBadge({ label, className = "" }: { label: string; className?: string }) {
  return (
    <span
      className={`slant inline-block border border-accent/60 px-1.5 py-px align-middle text-[0.65rem] leading-tight font-semibold tracking-wide text-accent uppercase not-italic ${className}`}
    >
      <span className="unslant inline-block">{label}</span>
    </span>
  );
}

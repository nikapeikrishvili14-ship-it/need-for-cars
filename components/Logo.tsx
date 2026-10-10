import { Link } from "@/i18n/navigation";

// public/brand/logo-wordmark.png is cut from public/brand/logo.png (2048×2048,
// white wordmark on black): cropped to the wordmark, black turned into
// transparency, scaled to 480 px wide — 21 KB instead of 600 KB.
// TODO(owner): when you have an official transparent logo, export it the same
// way (tight crop, ~480 px wide) and replace logo-wordmark.png.
export default function Logo({ className = "w-28", lazy = false }: { className?: string; lazy?: boolean }) {
  return (
    <Link href="/" className={`block shrink-0 ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/brand/logo-wordmark.png"
        alt="Need for Cars"
        width={480}
        height={177}
        loading={lazy ? "lazy" : undefined}
        className="h-auto w-full"
      />
    </Link>
  );
}

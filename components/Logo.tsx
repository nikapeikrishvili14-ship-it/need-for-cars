import { Link } from "@/i18n/navigation";

// public/brand/logo.png is a 2048×2048 square with the wordmark in the middle
// on solid black. We crop to the wordmark and use mix-blend-mode: screen so the
// black disappears into the dark header.
// Crop box (source px, measured): wordmark x 338–1701, y 804–1257, plus 40px
// padding → x 298–1741 (1443 wide), y 764–1297 (533 tall).
// TODO(owner): swap for a transparent, tightly-cropped logo when available.
export default function Logo({ className = "w-28" }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label="Need for Cars"
      className={`relative block aspect-[1443/533] shrink-0 overflow-hidden ${className}`}
    >
      {/* Same crop as a CSS mask (globals.css .logo-mark). mask-position % =
          offset / (box − mask): x = −20.65% / (1 − 1.4192) = 49.26%,
          y = −143.34% × (533/1443) / (533/1443 − 1.4192) = 50.43% */}
      <span aria-hidden="true" className="logo-mark absolute inset-0" />
      {/* Fallback for browsers without mask-mode. Screen blending can leave a
          faint box over a semi-transparent header, hence the mask above. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/brand/logo.png"
        alt="Need for Cars"
        width={2048}
        height={2048}
        className="logo-fallback absolute top-[-143.34%] left-[-20.65%] h-auto w-[141.92%] max-w-none mix-blend-screen"
      />
    </Link>
  );
}

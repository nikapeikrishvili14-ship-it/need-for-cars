import { Link } from "@/i18n/navigation";

// public/brand/logo.png is a 2048×2048 square with the wordmark in the middle
// on solid black. We crop to the wordmark and use mix-blend-mode: screen so the
// black disappears into the dark header.
// TODO(owner): swap for a transparent, tightly-cropped logo when available.
export default function Logo({ className = "w-28" }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label="Need for Cars"
      className={`relative block aspect-[1330/480] shrink-0 overflow-hidden ${className}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/brand/logo.png"
        alt="Need for Cars"
        width={2048}
        height={2048}
        className="absolute top-[-153%] left-[-22.6%] h-auto w-[150.4%] max-w-none mix-blend-screen"
      />
    </Link>
  );
}

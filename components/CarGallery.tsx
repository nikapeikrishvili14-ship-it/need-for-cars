"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";

type Props = {
  photos: string[];
  alt: string;
};

export default function CarGallery({ photos, alt }: Props) {
  const t = useTranslations("car");
  const [index, setIndex] = useState(0);
  const total = photos.length;
  const go = (delta: number) => setIndex((i) => (i + delta + total) % total);

  return (
    <div>
      <div className="edge-angled relative aspect-video overflow-hidden border border-line bg-surface">
        {photos.map((src, i) => (
          <Image
            key={src}
            src={src}
            alt={`${alt} — ${t("photo", { n: i + 1, total })}`}
            fill
            priority={i === 0}
            sizes="(min-width: 1024px) 60vw, 100vw"
            className={`object-cover transition-opacity duration-300 ${i === index ? "opacity-100" : "opacity-0"}`}
            aria-hidden={i !== index}
          />
        ))}

        {total > 1 && (
          <>
            <GalleryArrow label={t("prevPhoto")} onClick={() => go(-1)} side="left" />
            <GalleryArrow label={t("nextPhoto")} onClick={() => go(1)} side="right" />
            <p className="absolute right-4 bottom-6 bg-night/70 px-2 py-0.5 text-xs text-muted backdrop-blur" aria-live="polite">
              {index + 1} / {total}
            </p>
          </>
        )}
      </div>

      {total > 1 && (
        <ul className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-5">
          {photos.map((src, i) => (
            <li key={src}>
              <button
                type="button"
                onClick={() => setIndex(i)}
                aria-label={t("showPhoto", { n: i + 1 })}
                aria-current={i === index ? "true" : undefined}
                className={`relative block aspect-video w-full overflow-hidden border transition ${
                  i === index
                    ? "border-accent shadow-glow"
                    : "border-line opacity-60 hover:border-accent/60 hover:opacity-100"
                }`}
              >
                <Image src={src} alt="" fill sizes="20vw" className="object-cover" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function GalleryArrow({ label, onClick, side }: { label: string; onClick: () => void; side: "left" | "right" }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={`absolute top-1/2 -translate-y-1/2 ${side === "left" ? "left-3" : "right-3"} flex h-10 w-10 items-center justify-center bg-night/70 text-fg backdrop-blur transition hover:bg-accent hover:text-night hover:shadow-glow`}
    >
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <path
          d={side === "left" ? "M12.5 4.5 7 10l5.5 5.5" : "M7.5 4.5 13 10l-5.5 5.5"}
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}

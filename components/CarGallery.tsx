"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import { useTranslations } from "next-intl";
import { ChevronLeft, ChevronRight } from "lucide-react";
import StudioBackdrop from "./garage/StudioBackdrop";

type Props = {
  photos: string[];
  alt: string;
};

// Car page gallery: swipeable photos (embla) shown in a garage bay — lamp
// overhead, each photo mirrored on the glossy floor below it.
export default function CarGallery({ photos, alt }: Props) {
  const t = useTranslations("car");
  const total = photos.length;
  const [emblaRef, embla] = useEmblaCarousel({ loop: total > 1, duration: 24 });
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!embla) return;
    const onSelect = () => setIndex(embla.selectedScrollSnap());
    embla.on("select", onSelect);
    return () => {
      embla.off("select", onSelect);
    };
  }, [embla]);

  return (
    <div>
      <div
        role="region"
        aria-roledescription="carousel"
        aria-label={alt}
        className="relative isolate overflow-hidden border border-line bg-night px-3 pt-8 sm:px-8 sm:pt-12"
      >
        <StudioBackdrop horizon={80} />

        <div ref={emblaRef} className="relative overflow-hidden">
          <div className="flex touch-pan-y">
            {photos.map((src, i) => (
              <div
                key={src}
                role="group"
                aria-roledescription="slide"
                aria-label={t("photo", { n: i + 1, total })}
                className="min-w-0 flex-[0_0_100%]"
              >
                <div className="edge-angled relative aspect-video overflow-hidden">
                  <Image
                    src={src}
                    alt={`${alt} — ${t("photo", { n: i + 1, total })}`}
                    fill
                    preload={i === 0}
                    sizes="(min-width: 1024px) 60vw, 100vw"
                    draggable={false}
                    className="object-cover"
                  />
                </div>
                {/* Reflection on the floor */}
                <div aria-hidden="true" className="relative h-10 overflow-hidden sm:h-16">
                  <div className="car-reflection edge-angled absolute inset-x-0 top-0 aspect-video">
                    <Image src={src} alt="" fill sizes="(min-width: 1024px) 60vw, 100vw" className="object-cover" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {total > 1 && (
          <>
            <GalleryArrow label={t("prevPhoto")} onClick={() => embla?.scrollPrev()} side="left" />
            <GalleryArrow label={t("nextPhoto")} onClick={() => embla?.scrollNext()} side="right" />
            <p
              className="absolute right-4 bottom-3 text-xs text-muted sm:right-8"
              aria-live="polite"
            >
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
                onClick={() => embla?.scrollTo(i)}
                aria-label={t("showPhoto", { n: i + 1 })}
                aria-current={i === index ? "true" : undefined}
                className={`relative block aspect-video w-full overflow-hidden border transition-[border-color,box-shadow,opacity] duration-200 ${
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
  const Icon = side === "left" ? ChevronLeft : ChevronRight;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={`slant absolute top-[45%] -translate-y-1/2 ${
        side === "left" ? "left-4 sm:left-5" : "right-4 sm:right-5"
      } flex h-11 w-11 items-center justify-center border border-fg/15 bg-night/70 text-fg transition-[background-color,color,box-shadow] duration-200 hover:bg-accent hover:text-night hover:shadow-glow`}
    >
      <Icon size={22} className="unslant" aria-hidden="true" />
    </button>
  );
}

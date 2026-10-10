"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import { motion, useInView } from "motion/react";
import { useTranslations } from "next-intl";
import { ChevronLeft, ChevronRight, Volume2, VolumeX } from "lucide-react";
import { cars } from "@/data/cars";
import { playEngine } from "@/lib/engineSound";
import StudioBackdrop from "@/components/garage/StudioBackdrop";
import CarModel from "@/components/garage/CarModel";
import StatBars from "@/components/StatBars";
import Price from "@/components/Price";
import SlantLink from "@/components/SlantLink";

// The garage: one big car under the lamp, neighbours dimmed in the dark.
// Swipe (embla), arrows or the thumbnail strip switch cars; each switch
// replays the light sweep, the name slide-in and the stat bars.
export default function CarSelector() {
  const t = useTranslations("home.garage");
  const [emblaRef, embla] = useEmblaCarousel({ loop: cars.length > 2, align: "center", duration: 22 });
  const [index, setIndex] = useState(0);
  const [sound, setSound] = useState(false);
  const soundRef = useRef(false);
  const stageRef = useRef<HTMLDivElement>(null);
  // Don't spend the first light sweep before anyone can see it
  const seen = useInView(stageRef, { once: true, amount: 0.4 });

  useEffect(() => {
    if (!embla) return;
    const onSelect = () => {
      const i = embla.selectedScrollSnap();
      setIndex(i);
      if (soundRef.current) playEngine(cars[i].sound);
    };
    embla.on("select", onSelect);
    return () => {
      embla.off("select", onSelect);
    };
  }, [embla]);

  const toggleSound = useCallback(() => {
    const next = !soundRef.current;
    soundRef.current = next;
    setSound(next);
    if (next) playEngine(cars[embla?.selectedScrollSnap() ?? 0].sound);
  }, [embla]);

  const car = cars[index];
  const name = (c: (typeof cars)[number]) => `${c.brand} ${c.model}`;

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 id="garage-title" className="text-4xl leading-none font-black italic sm:text-5xl">
            {t("title")}
          </h2>
          <p className="mt-3 max-w-md text-muted">{t("intro")}</p>
        </div>
        <button
          type="button"
          onClick={toggleSound}
          aria-pressed={sound}
          aria-label={sound ? t("soundOff") : t("soundOn")}
          title={sound ? t("soundOff") : t("soundOn")}
          className={`slant flex h-10 w-12 items-center justify-center border transition-colors ${
            sound ? "border-accent text-accent" : "border-line text-muted hover:border-fg/30 hover:text-fg"
          }`}
        >
          <span className="unslant">{sound ? <Volume2 size={18} /> : <VolumeX size={18} />}</span>
        </button>
      </div>

      {/* Stage */}
      <div
        ref={stageRef}
        role="region"
        aria-roledescription="carousel"
        aria-labelledby="garage-title"
        className="relative mt-8 -mx-4 sm:mx-0"
      >
        <StudioBackdrop floor={false} className="top-[-6rem]" />
        <div aria-hidden="true" className="studio-floor absolute inset-x-[-50vw] top-[70.5%] bottom-[-4rem] mask-[linear-gradient(to_bottom,#000_45%,transparent)]" />

        <div ref={emblaRef} className="relative overflow-hidden">
          <div className="flex touch-pan-y">
            {cars.map((c, i) => {
              const active = i === index;
              return (
                <div
                  key={c.slug}
                  role="group"
                  aria-roledescription="slide"
                  aria-label={t("slide", { n: i + 1, total: cars.length })}
                  className="min-w-0 flex-[0_0_82%] px-2 sm:flex-[0_0_64%] lg:flex-[0_0_56%]"
                  onClick={() => !active && embla?.scrollTo(i)}
                >
                  {/* Bottom padding leaves room for the reflection inside the clipped viewport */}
                  <div className="pb-[13%]">
                    <div
                      className={`origin-bottom transition-[transform,opacity,filter] duration-500 ease-sweep ${
                        active ? "scale-100 opacity-100" : "scale-[0.7] cursor-pointer opacity-30 brightness-50"
                      }`}
                    >
                      <CarModel
                        car={c}
                        sizes="(min-width: 1024px) 56vw, (min-width: 640px) 64vw, 82vw"
                        sweepKey={active && seen ? c.slug : undefined}
                        sweepDelay={180}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <ArrowButton side="left" label={t("prev")} onClick={() => embla?.scrollPrev()} />
        <ArrowButton side="right" label={t("next")} onClick={() => embla?.scrollNext()} />
      </div>

      {/* Name, price and stats of the car under the lamp */}
      <div className="relative mt-4 grid gap-8 lg:grid-cols-2 lg:items-end lg:gap-16">
        <div aria-live="polite">
          <motion.div
            key={car.slug}
            initial={{ opacity: 0, x: 48, skewX: -10 }}
            animate={{ opacity: 1, x: 0, skewX: 0 }}
            transition={{ duration: 0.38, ease: [0.2, 0.7, 0.2, 1] }}
          >
            <p className="text-sm text-muted">{car.brand}</p>
            <h3 className="text-5xl leading-[0.95] font-black italic sm:text-6xl lg:text-7xl">{car.model}</h3>
            <Price usd={car.pricePerDay} per="day" className="mt-3 inline-block font-heading text-2xl font-bold" />
          </motion.div>
          <div className="mt-6 flex flex-wrap gap-3">
            <SlantLink href={`/cars/${car.slug}`} variant="ghost">
              {t("view")}
            </SlantLink>
            <SlantLink href={{ pathname: "/book", query: { car: car.slug } }}>{t("book")}</SlantLink>
          </div>
        </div>

        <StatBars key={car.slug} car={car} compact />
      </div>

      {/* Thumbnail strip */}
      <ul className="mt-10 -mx-4 flex snap-x gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0">
        {cars.map((c, i) => {
          const active = i === index;
          return (
            <li key={c.slug} className="w-40 shrink-0 snap-start sm:w-48">
              <button
                type="button"
                onClick={() => embla?.scrollTo(i)}
                aria-label={t("show", { car: name(c) })}
                aria-current={active ? "true" : undefined}
                className={`block w-full border px-3 pt-3 pb-2 text-left transition-[border-color,box-shadow,background-color] duration-200 ${
                  active ? "border-accent bg-night shadow-glow" : "border-line hover:border-fg/30"
                }`}
              >
                <span className="relative block aspect-20/7">
                  <Image
                    src={c.stage ?? c.photos[0]}
                    alt=""
                    fill
                    sizes="192px"
                    className={c.stage ? "object-contain" : "object-cover"}
                  />
                </span>
                <span className={`mt-2 block truncate text-sm font-semibold ${active ? "text-fg" : "text-muted"}`}>
                  {c.model}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function ArrowButton({ side, label, onClick }: { side: "left" | "right"; label: string; onClick: () => void }) {
  const Icon = side === "left" ? ChevronLeft : ChevronRight;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={`slant absolute top-[38%] z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center border border-fg/15 bg-night/70 text-fg transition-[background-color,color,box-shadow] duration-200 hover:bg-accent hover:text-night hover:shadow-glow sm:h-14 sm:w-14 ${
        side === "left" ? "left-2 sm:left-0" : "right-2 sm:right-0"
      }`}
    >
      <Icon size={24} className="unslant" />
    </button>
  );
}

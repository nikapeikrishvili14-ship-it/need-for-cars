"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import { motion, useInView } from "motion/react";
import { useTranslations } from "next-intl";
import { ChevronLeft, ChevronRight, Volume2, VolumeX } from "lucide-react";
import { cars } from "@/data/cars";
import { playEngine } from "@/lib/engineSound";
import { carouselKeyHandler } from "@/lib/carouselKeys";
import StudioBackdrop from "@/components/garage/StudioBackdrop";
import CarModel from "@/components/garage/CarModel";
import StatBars from "@/components/StatBars";
import Price from "@/components/Price";
import SlantLink from "@/components/SlantLink";

// Car width drives the whole layout (slides, floor line, arrows, overlap).
// Desktop: sized from the screen height so title, car, name, stats, price,
// buttons and thumbnails fit on one screen. 22rem ≈ everything except the car
// (measured at 1366×630); 0.39 × width = car height (0.35) + reflection room
// not covered by the info panel.
const carWidth =
  "[--car-w:calc(100vw-2.5rem)] sm:[--car-w:min(74vw,640px)] " +
  "lg:[--car-w:min(60vw,1100px,calc((100svh-4rem-22rem)/0.39))]";

// The garage: one big car under the lamp, neighbours dimmed in the dark.
// Swipe (embla), arrows or the thumbnail strip switch cars; each switch
// replays the light sweep, the name slide-in and the stat bars.
export default function CarSelector() {
  const t = useTranslations("home.garage");
  // containScroll off: when the cars are too narrow to loop, embla would
  // otherwise pin the first car to the left edge instead of under the lamp
  const [emblaRef, embla] = useEmblaCarousel({
    loop: cars.length > 2,
    align: "center",
    containScroll: false,
    duration: 22,
  });
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
    // ← → / Home / End switch cars while focus is anywhere in the garage
    <div className={carWidth} onKeyDown={carouselKeyHandler(embla)}>
      <div className="relative z-10 flex items-end justify-between gap-4">
        <div className="lg:flex lg:items-baseline lg:gap-5">
          <h2 id="garage-title" className="text-3xl leading-none font-black italic sm:text-4xl">
            {t("title")}
          </h2>
          <p id="garage-intro" className="mt-2 text-sm text-muted lg:mt-0">
            {t("intro")}
          </p>
        </div>
        <button
          type="button"
          onClick={toggleSound}
          aria-pressed={sound}
          aria-label={sound ? t("soundOff") : t("soundOn")}
          title={sound ? t("soundOff") : t("soundOn")}
          className={`slant flex h-10 w-12 shrink-0 items-center justify-center border transition-colors ${
            sound ? "border-accent text-accent" : "border-line text-muted hover:border-fg/30 hover:text-fg"
          }`}
        >
          <span className="unslant">{sound ? <Volume2 size={18} /> : <VolumeX size={18} />}</span>
        </button>
      </div>

      {/* Stage: lamp, floor, cars, and the info panel standing on the floor */}
      <div
        ref={stageRef}
        role="region"
        aria-roledescription="carousel"
        aria-labelledby="garage-title"
        aria-describedby="garage-intro"
        // Focusable so keyboard users can reach the arrow-key control
        tabIndex={0}
        // flow-root: keeps the car viewport's negative margin inside this box
        className="relative mx-[calc(50%-50vw)] mt-4 flow-root focus-visible:-outline-offset-4"
      >
        <StudioBackdrop floor={false} className="-top-20" />
        <div
          aria-hidden="true"
          className="studio-floor absolute inset-x-0 top-[calc(var(--car-w)*0.34)] bottom-0"
        />

        {/* Pulled up and padded back down by the same amount: room for SUV roofs,
            which rise above the car box (see CarModel), without moving the car */}
        <div ref={emblaRef} className="relative mt-[calc(-0.03*var(--car-w))] overflow-hidden">
          <div className="flex touch-pan-y">
            {cars.map((c, i) => {
              const active = i === index;
              return (
                <div
                  key={c.slug}
                  role="group"
                  aria-roledescription="slide"
                  aria-label={t("slide", { n: i + 1, total: cars.length })}
                  // Screen readers get the current car only (its name is announced below)
                  aria-hidden={!active}
                  className="min-w-0 flex-[0_0_var(--car-w)]"
                  onClick={() => !active && embla?.scrollTo(i)}
                >
                  {/* Bottom padding keeps the reflection inside the clipped viewport */}
                  <div className="pt-[calc(var(--car-w)*0.03)] pb-[calc(var(--car-w)*0.13)]">
                    <div
                      className={`origin-bottom transition-[transform,opacity,filter] duration-500 ease-sweep ${
                        active ? "scale-100 opacity-100" : "scale-[0.6] cursor-pointer opacity-30 brightness-50"
                      }`}
                    >
                      <CarModel
                        car={c}
                        sizes="(min-width: 1024px) 54vw, (min-width: 640px) 74vw, 100vw"
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

        {/* Desktop: in the gap between the main car and its dimmed neighbours.
            Phones: on the floor corners, below the car. */}
        <ArrowButton
          label={t("prev")}
          onClick={() => embla?.scrollPrev()}
          Icon={ChevronLeft}
          className="top-[calc(var(--car-w)*0.36)] left-3 lg:top-[calc(var(--car-w)*0.2)] lg:left-[calc(50%-var(--car-w)*0.6)] lg:-translate-x-1/2"
        />
        <ArrowButton
          label={t("next")}
          onClick={() => embla?.scrollNext()}
          Icon={ChevronRight}
          className="top-[calc(var(--car-w)*0.36)] right-3 lg:top-[calc(var(--car-w)*0.2)] lg:right-auto lg:left-[calc(50%+var(--car-w)*0.6)] lg:-translate-x-1/2"
        />

        {/* Info panel, pulled up onto the floor over the fading reflection */}
        <div className="relative z-10 mx-auto mt-6 grid max-w-7xl gap-6 px-4 lg:mt-[calc(-0.09*var(--car-w))] lg:px-8 lg:grid-cols-[minmax(0,30rem)_1fr] lg:items-end">
          <div aria-live="polite">
            <motion.div
              key={car.slug}
              initial={{ opacity: 0, x: 48, skewX: -10 }}
              animate={{ opacity: 1, x: 0, skewX: 0 }}
              transition={{ duration: 0.38, ease: [0.2, 0.7, 0.2, 1] }}
            >
              <p className="text-sm text-muted">{car.brand}</p>
              {/* Long model names ("X6 xDrive40i M Sport (G06)") step down a size */}
              <h3
                className={`leading-[0.95] font-black italic ${
                  car.model.length > 16
                    ? "text-4xl lg:text-[clamp(1.9rem,min(2.8vw,5.5svh),3.25rem)]"
                    : "text-5xl lg:text-[clamp(2.25rem,min(3.6vw,7svh),4rem)]"
                }`}
              >
                {car.model}
              </h3>
            </motion.div>
            <div className="mt-4">
              <StatBars key={car.slug} car={car} variant="inline" />
            </div>
          </div>

          <div className="flex flex-wrap items-end justify-between gap-4 lg:flex-col lg:items-end lg:justify-end">
            <Price usd={car.pricePerDay} per="day" className="font-heading text-3xl font-black italic" />
            <div className="flex gap-3">
              <SlantLink href={`/cars/${car.slug}`} variant="ghost">
                {t("view")}
              </SlantLink>
              <SlantLink href={{ pathname: "/book", query: { car: car.slug } }}>{t("book")}</SlantLink>
            </div>
          </div>
        </div>
      </div>

      {/* Thumbnail strip — compact rows (picture beside the name) to save height */}
      <ul className="mt-5 -mx-4 flex snap-x gap-2.5 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0">
        {cars.map((c, i) => {
          const active = i === index;
          return (
            <li key={c.slug} className="shrink-0 snap-start">
              <button
                type="button"
                onClick={() => embla?.scrollTo(i)}
                aria-label={t("show", { car: name(c) })}
                aria-current={active ? "true" : undefined}
                className={`flex items-center gap-2.5 border py-2 pr-4 pl-2.5 transition-[border-color,box-shadow,background-color] duration-200 ${
                  active ? "border-accent bg-surface shadow-glow" : "border-line hover:border-fg/30"
                }`}
              >
                <span className="relative block h-7 w-20 shrink-0">
                  <Image
                    src={c.stage ?? c.photos[0].src}
                    alt=""
                    fill
                    sizes="80px"
                    className={c.stage ? "object-contain object-bottom" : "object-cover"}
                  />
                </span>
                <span className={`text-sm font-semibold whitespace-nowrap ${active ? "text-fg" : "text-muted"}`}>
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

function ArrowButton({
  label,
  onClick,
  Icon,
  className,
}: {
  label: string;
  onClick: () => void;
  Icon: typeof ChevronLeft;
  className: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={`slant absolute z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center border border-fg/15 bg-night/70 text-fg transition-[background-color,color,box-shadow] duration-200 hover:bg-accent hover:text-night hover:shadow-glow lg:h-14 lg:w-14 ${className}`}
    >
      <Icon size={24} className="unslant" aria-hidden="true" />
    </button>
  );
}

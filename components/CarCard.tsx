"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { ChevronRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import type { Car } from "@/data/cars";
import Price from "./Price";
import TunedBadge from "./TunedBadge";

// Catalogue card: the first photo fills the 16:9 frame edge to edge. On hover
// the photo zooms in a little, the card lifts and picks up the accent glow.
export default function CarCard({ car }: { car: Car }) {
  const t = useTranslations("car");
  const sizes = "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw";

  return (
    <Link
      href={`/cars/${car.slug}`}
      className="group flex w-full flex-col border border-line bg-surface transition-[translate,border-color,box-shadow] duration-300 ease-sweep hover:-translate-y-1 hover:border-accent/60 hover:shadow-glow focus-visible:-translate-y-1 focus-visible:border-accent focus-visible:shadow-glow"
    >
      <div className="relative aspect-video overflow-hidden bg-night">
        <Image
          src={car.photos[0].src}
          alt={`${car.brand} ${car.model}`}
          fill
          sizes={sizes}
          className="object-cover transition-transform duration-500 ease-sweep group-hover:scale-[1.04]"
        />
        <span className="slant absolute top-3 left-4 bg-night/80 px-3 py-1 text-xs font-semibold text-accent">
          <span className="unslant">{t(`types.${car.type}`)}</span>
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-4 p-5 pt-3">
        <div>
          <p className="text-sm text-muted">{car.brand}</p>
          <h2 className="text-2xl leading-tight font-black italic">{car.model}</h2>
        </div>

        <ul className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted">
          <li>{t(`transmissions.${car.transmission}`)}</li>
          <li>{t("seats", { count: car.seats })}</li>
          <li>
            {t("units.hp", { value: car.specs.hp })}
            {car.specs.tuned && <TunedBadge label={t("tuned")} className="ml-2" />}
          </li>
        </ul>

        <div className="mt-auto flex items-end justify-between gap-3 border-t border-line pt-4">
          <Price usd={car.pricePerDay} per="day" className="font-heading text-2xl font-bold" />
          <span className="flex items-center gap-1 text-sm font-semibold text-accent">
            {t("details")}
            <ChevronRight
              size={16}
              aria-hidden="true"
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </span>
        </div>
      </div>
    </Link>
  );
}

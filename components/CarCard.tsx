"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { Car } from "@/data/cars";
import Price from "./Price";

export default function CarCard({ car }: { car: Car }) {
  const t = useTranslations("car");

  return (
    <Link
      href={`/cars/${car.slug}`}
      className="group flex w-full flex-col border border-line bg-surface transition duration-300 hover:border-accent/60 hover:shadow-glow focus-visible:border-accent focus-visible:shadow-glow"
    >
      <div className="edge-angled relative aspect-video overflow-hidden bg-night">
        <Image
          src={car.photos[0]}
          alt={`${car.brand} ${car.model}`}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
        <span className="slant absolute top-3 left-4 bg-night/80 px-3 py-1 text-xs font-semibold tracking-wide text-accent uppercase backdrop-blur">
          <span className="unslant">{t(`types.${car.type}`)}</span>
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-4 p-5 pt-3">
        <div>
          <p className="text-xs font-medium tracking-widest text-muted uppercase">{car.brand}</p>
          <h2 className="text-2xl leading-tight font-black italic">{car.model}</h2>
        </div>

        <ul className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted">
          <li>{t(`transmissions.${car.transmission}`)}</li>
          <li aria-hidden="true">·</li>
          <li>{t("seats", { count: car.seats })}</li>
          <li aria-hidden="true">·</li>
          <li>{t("units.hp", { value: car.specs.hp })}</li>
        </ul>

        <div className="mt-auto flex items-end justify-between gap-3 border-t border-line pt-4">
          <Price usd={car.pricePerDay} perDay className="font-heading text-2xl font-bold" />
          <span className="text-sm font-semibold text-accent transition-transform duration-300 group-hover:translate-x-1">
            {t("details")} →
          </span>
        </div>
      </div>
    </Link>
  );
}

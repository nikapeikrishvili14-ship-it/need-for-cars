"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { cars, type CarType, type Transmission } from "@/data/cars";
import { fleet } from "@/lib/fleet";
import CarCard from "./CarCard";
import Price from "./Price";

const PRICE_STEP = 10;
const priceFloor = Math.floor(fleet.minPrice / PRICE_STEP) * PRICE_STEP;
const priceCeil = Math.ceil(fleet.maxPrice / PRICE_STEP) * PRICE_STEP;

type Filters = {
  type: CarType | "all";
  transmission: Transmission | "all";
  minSeats: number;
  minPrice: number;
  maxPrice: number;
};

const initialFilters: Filters = {
  type: "all",
  transmission: "all",
  minSeats: 0,
  minPrice: priceFloor,
  maxPrice: priceCeil,
};

export default function CarCatalogue() {
  const t = useTranslations("catalogue");
  const tc = useTranslations("car");
  const [filters, setFilters] = useState<Filters>(initialFilters);
  const set = (patch: Partial<Filters>) => setFilters((f) => ({ ...f, ...patch }));

  const results = cars.filter(
    (car) =>
      (filters.type === "all" || car.type === filters.type) &&
      (filters.transmission === "all" || car.transmission === filters.transmission) &&
      car.seats >= filters.minSeats &&
      car.pricePerDay >= filters.minPrice &&
      car.pricePerDay <= filters.maxPrice,
  );

  const isFiltered = JSON.stringify(filters) !== JSON.stringify(initialFilters);

  return (
    <div className="mx-auto max-w-7xl px-4 lg:px-8">
      <section
        aria-label={t("filters")}
        className="grid gap-6 border border-line bg-surface p-4 sm:grid-cols-[repeat(auto-fit,minmax(14rem,1fr))] sm:p-6"
      >
        {/* A group only appears when it can actually narrow the list */}
        {fleet.types.length > 1 && (
          <FilterGroup label={t("type")}>
            <Chip active={filters.type === "all"} onClick={() => set({ type: "all" })}>
              {t("all")}
            </Chip>
            {fleet.types.map((type) => (
              <Chip key={type} active={filters.type === type} onClick={() => set({ type })}>
                {tc(`types.${type}`)}
              </Chip>
            ))}
          </FilterGroup>
        )}

        {fleet.transmissions.length > 1 && (
          <FilterGroup label={t("transmission")}>
            <Chip active={filters.transmission === "all"} onClick={() => set({ transmission: "all" })}>
              {t("all")}
            </Chip>
            {fleet.transmissions.map((transmission) => (
              <Chip
                key={transmission}
                active={filters.transmission === transmission}
                onClick={() => set({ transmission })}
              >
                {tc(`transmissions.${transmission}`)}
              </Chip>
            ))}
          </FilterGroup>
        )}

        {fleet.seatOptions.length > 0 && (
          <FilterGroup label={t("seats")}>
            <Chip active={filters.minSeats === 0} onClick={() => set({ minSeats: 0 })}>
              {t("all")}
            </Chip>
            {fleet.seatOptions.map((seats) => (
              <Chip key={seats} active={filters.minSeats === seats} onClick={() => set({ minSeats: seats })}>
                {t("seatsMin", { count: seats })}
              </Chip>
            ))}
          </FilterGroup>
        )}

        <fieldset className="min-w-0">
          <legend className="mb-3 text-xs font-semibold tracking-widest text-muted uppercase">{t("price")}</legend>
          <div className="space-y-3">
            <PriceSlider
              label={t("priceFrom")}
              value={filters.minPrice}
              onChange={(v) => set({ minPrice: v, maxPrice: Math.max(v, filters.maxPrice) })}
            />
            <PriceSlider
              label={t("priceTo")}
              value={filters.maxPrice}
              onChange={(v) => set({ maxPrice: v, minPrice: Math.min(v, filters.minPrice) })}
            />
          </div>
        </fieldset>
      </section>

      <div className="mt-6 mb-4 flex items-center justify-between gap-4">
        <p className="text-sm text-muted" aria-live="polite">
          {t("results", { count: results.length })}
        </p>
        {isFiltered && (
          <button
            type="button"
            onClick={() => setFilters(initialFilters)}
            className="text-sm font-semibold text-accent hover:underline"
          >
            {t("reset")}
          </button>
        )}
      </div>

      {results.length > 0 ? (
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((car) => (
            <li key={car.slug} className="flex">
              <CarCard car={car} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="border border-dashed border-line px-6 py-16 text-center">
          <p className="text-muted">{t("empty")}</p>
          <button
            type="button"
            onClick={() => setFilters(initialFilters)}
            className="slant mt-6 bg-accent px-6 py-2 font-semibold text-night transition-shadow hover:shadow-glow"
          >
            <span className="unslant">{t("reset")}</span>
          </button>
        </div>
      )}
    </div>
  );
}

function FilterGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <fieldset className="min-w-0">
      <legend className="mb-3 text-xs font-semibold tracking-widest text-muted uppercase">{label}</legend>
      <div className="flex flex-wrap gap-2">{children}</div>
    </fieldset>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`slant border px-3 py-1.5 text-sm font-semibold transition ${
        active
          ? "border-accent bg-accent text-night shadow-glow"
          : "border-line bg-night text-muted hover:border-accent/60 hover:text-fg"
      }`}
    >
      <span className="unslant">{children}</span>
    </button>
  );
}

function PriceSlider({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1 flex items-baseline justify-between text-sm">
        <span className="text-muted">{label}</span>
        <Price usd={value} className="font-semibold" />
      </span>
      <input
        type="range"
        min={priceFloor}
        max={priceCeil}
        step={PRICE_STEP}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full"
      />
    </label>
  );
}

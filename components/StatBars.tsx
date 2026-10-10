"use client";

import { useRef } from "react";
import { useInView } from "motion/react";
import { useLocale, useTranslations } from "next-intl";
import type { Car } from "@/data/cars";
import { fleet } from "@/lib/fleet";
import { formatDecimal } from "@/lib/money";

const SEGMENTS = 20;

type Props = {
  car: Car;
  /** "stacked": label and value above the bar. "inline": one row per stat (label · bar · value). */
  variant?: "stacked" | "inline";
};

// Segmented, slanted bars that fill one block at a time when they scroll into
// view. Each bar is scaled against the best car in the fleet (= full bar).
// For 0–100 km/h lower is better, so the quickest car gets the full bar.
// Remount with a new `key` to replay the fill (the home car selector does this).
export default function StatBars({ car, variant = "stacked" }: Props) {
  const t = useTranslations("car");
  const locale = useLocale();
  const ref = useRef<HTMLDListElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const { hp, acceleration, topSpeed } = car.specs;

  const stats = [
    { label: t("specs.power"), value: t("units.hp", { value: hp }), ratio: hp / fleet.maxHp },
    {
      label: t("specs.acceleration"),
      value: t("units.seconds", { value: formatDecimal(acceleration, locale) }),
      ratio: fleet.bestAcceleration / acceleration,
    },
    { label: t("specs.topSpeed"), value: t("units.kmh", { value: topSpeed }), ratio: topSpeed / fleet.maxTopSpeed },
  ];

  const bar = (ratio: number, row: number) => {
    const filled = Math.max(1, Math.round(ratio * SEGMENTS));
    return (
      <span className="flex gap-0.75" aria-hidden="true">
        {Array.from({ length: SEGMENTS }, (_, i) => {
          const on = inView && i < filled;
          return (
            <span
              key={i}
              className={`slant h-2.5 flex-1 transition-[background-color,box-shadow] duration-150 ${
                on ? (i === filled - 1 ? "bg-accent shadow-glow" : "bg-accent") : "bg-fg/[0.07]"
              }`}
              style={{ transitionDelay: on ? `${row * 140 + i * 28}ms` : "0ms" }}
            />
          );
        })}
      </span>
    );
  };

  if (variant === "inline") {
    return (
      <dl ref={ref} className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-x-4 gap-y-2">
        {stats.map((stat, row) => (
          // `contents` lets dt/dd sit directly in the parent grid's columns
          <div key={stat.label} className="contents">
            <dt className="text-sm text-muted">{stat.label}</dt>
            <dd className="contents">
              {bar(stat.ratio, row)}
              <span className="text-right font-heading font-bold italic">{stat.value}</span>
            </dd>
          </div>
        ))}
      </dl>
    );
  }

  return (
    <dl ref={ref} className="space-y-5">
      {stats.map((stat, row) => (
        <div key={stat.label}>
          <div className="mb-1.5 flex items-baseline justify-between gap-4">
            <dt className="text-sm text-muted">{stat.label}</dt>
            <dd className="font-heading text-lg font-bold italic">{stat.value}</dd>
          </div>
          {bar(stat.ratio, row)}
        </div>
      ))}
    </dl>
  );
}

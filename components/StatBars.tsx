"use client";

import { useRef } from "react";
import { useInView } from "motion/react";
import { useTranslations } from "next-intl";
import type { Car } from "@/data/cars";
import { fleet } from "@/lib/fleet";

const SEGMENTS = 20;

// Segmented, slanted bars that fill one block at a time when they scroll into
// view. Each bar is scaled against the best car in the fleet (= full bar).
// For 0–100 km/h lower is better, so the quickest car gets the full bar.
// Remount with a new `key` to replay the fill (the home car selector does this).
export default function StatBars({ car, compact = false }: { car: Car; compact?: boolean }) {
  const t = useTranslations("car");
  const ref = useRef<HTMLDListElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const { hp, acceleration, topSpeed } = car.specs;

  const stats = [
    { label: t("specs.power"), value: t("units.hp", { value: hp }), ratio: hp / fleet.maxHp },
    {
      label: t("specs.acceleration"),
      value: t("units.seconds", { value: acceleration }),
      ratio: fleet.bestAcceleration / acceleration,
    },
    { label: t("specs.topSpeed"), value: t("units.kmh", { value: topSpeed }), ratio: topSpeed / fleet.maxTopSpeed },
  ];

  return (
    <dl ref={ref} className={compact ? "space-y-3.5" : "space-y-5"}>
      {stats.map((stat, row) => {
        const filled = Math.max(1, Math.round(stat.ratio * SEGMENTS));
        return (
          <div key={stat.label}>
            <div className="mb-1.5 flex items-baseline justify-between gap-4">
              <dt className="text-sm text-muted">{stat.label}</dt>
              <dd className={`font-heading font-bold italic ${compact ? "text-base" : "text-lg"}`}>{stat.value}</dd>
            </div>
            <div className="flex gap-[3px]" aria-hidden="true">
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
            </div>
          </div>
        );
      })}
    </dl>
  );
}

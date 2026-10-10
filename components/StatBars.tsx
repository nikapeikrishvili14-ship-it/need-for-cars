import { getTranslations } from "next-intl/server";
import type { Car } from "@/data/cars";
import { fleet } from "@/lib/fleet";

// Each bar is scaled against the best car in the fleet (= 100%).
// For 0–100 km/h lower is better, so the quickest car gets the full bar.
export default async function StatBars({ car }: { car: Car }) {
  const t = await getTranslations("car");
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
    <dl className="space-y-5">
      {stats.map((stat, i) => (
        <div key={stat.label}>
          <div className="mb-2 flex items-baseline justify-between gap-4">
            <dt className="text-sm text-muted">{stat.label}</dt>
            <dd className="font-heading text-lg font-bold italic">{stat.value}</dd>
          </div>
          <div className="slant h-2.5 overflow-hidden bg-night" aria-hidden="true">
            <div
              className="animate-bar-fill h-full bg-accent shadow-glow"
              style={{ width: `${Math.round(stat.ratio * 100)}%`, animationDelay: `${i * 120}ms` }}
            />
          </div>
        </div>
      ))}
    </dl>
  );
}

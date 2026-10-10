import { cars } from "@/data/cars";

// Fleet-wide numbers used to scale stat bars and the price filter.
// Recomputed from data/cars.ts at build time, so adding a car updates them.
export const fleet = {
  maxHp: Math.max(...cars.map((c) => c.specs.hp)),
  maxTopSpeed: Math.max(...cars.map((c) => c.specs.topSpeed)),
  /** Quickest 0–100 time (lower is better) */
  bestAcceleration: Math.min(...cars.map((c) => c.specs.acceleration)),
  minPrice: Math.min(...cars.map((c) => c.pricePerDay)),
  maxPrice: Math.max(...cars.map((c) => c.pricePerDay)),
  /** Distinct seat counts, ascending — used for the "N+ seats" filter */
  seatOptions: [...new Set(cars.map((c) => c.seats))].sort((a, b) => a - b),
};

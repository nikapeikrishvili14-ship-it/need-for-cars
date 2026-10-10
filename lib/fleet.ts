import { cars, type CarType, type Transmission } from "@/data/cars";

const allTypes: CarType[] = ["sports", "suv"];
const allTransmissions: Transmission[] = ["automatic", "manual"];

// Fleet-wide numbers used to scale stat bars and build the catalogue filters.
// Recomputed from data/cars.ts at build time, so adding a car updates them.
export const fleet = {
  maxHp: Math.max(...cars.map((c) => c.specs.hp)),
  maxTopSpeed: Math.max(...cars.map((c) => c.specs.topSpeed)),
  /** Quickest 0–100 time (lower is better) */
  bestAcceleration: Math.min(...cars.map((c) => c.specs.acceleration)),
  minPrice: Math.min(...cars.map((c) => c.pricePerDay)),
  maxPrice: Math.max(...cars.map((c) => c.pricePerDay)),
  /** Only types/transmissions at least one car has, so no filter shows zero results */
  types: allTypes.filter((type) => cars.some((c) => c.type === type)),
  transmissions: allTransmissions.filter((tr) => cars.some((c) => c.transmission === tr)),
  /**
   * "N+ seats" choices, ascending. The smallest seat count is left out:
   * it matches every car, so it would do the same as "All".
   */
  seatOptions: [...new Set(cars.map((c) => c.seats))].sort((a, b) => a - b).slice(1),
};

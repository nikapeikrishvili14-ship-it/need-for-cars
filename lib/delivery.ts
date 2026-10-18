import { site, type City } from "@/data/site";

export function getCity(id: string): City | undefined {
  return site.cities.find((city) => city.id === id);
}

/** USD fee to deliver the car to this place for a rental of `days` days, with its free-delivery rule applied */
export function deliveryFee(city: City, days: number): number {
  return city.freeFromDays !== undefined && days >= city.freeFromDays ? 0 : city.deliveryFee;
}

import type { Localized } from "./types";

export type CarType = "sports" | "suv";
export type Transmission = "automatic" | "manual";

export type Car = {
  slug: string;
  brand: string;
  model: string;
  year: number;
  type: CarType;
  transmission: Transmission;
  seats: number;
  /** USD per day */
  pricePerDay: number;
  /** Minimum driver age, years */
  minAge: number;
  /** Minimum driving experience, years */
  minExperience: number;
  specs: {
    hp: number;
    /** 0–100 km/h, seconds */
    acceleration: number;
    /** km/h */
    topSpeed: number;
    engine: string;
    fuel: "petrol" | "diesel" | "hybrid" | "electric";
    drive: "RWD" | "AWD" | "FWD";
  };
  description: Localized;
  /** Paths under /public, first one is the cover */
  photos: string[];
  featured: boolean;
};

// TODO(owner): replace these 3 placeholder cars with the real fleet (7–8 cars):
// real specs, prices, requirements, and photos in public/cars/[slug]/1.webp, 2.webp ...
export const cars: Car[] = [
  {
    slug: "porsche-911-carrera",
    brand: "Porsche", // TODO(owner)
    model: "911 Carrera", // TODO(owner)
    year: 2022, // TODO(owner)
    type: "sports",
    transmission: "automatic", // TODO(owner)
    seats: 4, // TODO(owner)
    pricePerDay: 350, // TODO(owner)
    minAge: 25, // TODO(owner)
    minExperience: 5, // TODO(owner)
    specs: {
      hp: 385, // TODO(owner)
      acceleration: 4.2, // TODO(owner)
      topSpeed: 293, // TODO(owner)
      engine: "3.0 L twin-turbo flat-6", // TODO(owner)
      fuel: "petrol",
      drive: "RWD", // TODO(owner)
    },
    description: {
      // TODO(owner): real description
      en: "A pure sports car for mountain roads and night drives.",
      ka: "ნამდვილი სპორტული მანქანა მთის გზებისა და ღამის სეირნობისთვის.",
      ru: "Настоящий спорткар для горных дорог и ночных поездок.",
    },
    photos: ["/cars/porsche-911-carrera/1.svg", "/cars/porsche-911-carrera/2.svg"],
    featured: true,
  },
  {
    slug: "mercedes-amg-g63",
    brand: "Mercedes-AMG", // TODO(owner)
    model: "G 63", // TODO(owner)
    year: 2021, // TODO(owner)
    type: "suv",
    transmission: "automatic",
    seats: 5, // TODO(owner)
    pricePerDay: 450, // TODO(owner)
    minAge: 25, // TODO(owner)
    minExperience: 5, // TODO(owner)
    specs: {
      hp: 585, // TODO(owner)
      acceleration: 4.5, // TODO(owner)
      topSpeed: 220, // TODO(owner)
      engine: "4.0 L V8 biturbo", // TODO(owner)
      fuel: "petrol",
      drive: "AWD",
    },
    description: {
      // TODO(owner): real description
      en: "An icon that handles city streets and mountain passes with equal ease.",
      ka: "ლეგენდა, რომელიც თანაბრად კარგად გრძნობს თავს ქალაქშიც და მთაშიც.",
      ru: "Легенда, которой одинаково по силам городские улицы и горные перевалы.",
    },
    photos: ["/cars/mercedes-amg-g63/1.svg", "/cars/mercedes-amg-g63/2.svg"],
    featured: true,
  },
  {
    slug: "range-rover-sport",
    brand: "Land Rover", // TODO(owner)
    model: "Range Rover Sport", // TODO(owner)
    year: 2023, // TODO(owner)
    type: "suv",
    transmission: "automatic",
    seats: 5, // TODO(owner)
    pricePerDay: 300, // TODO(owner)
    minAge: 23, // TODO(owner)
    minExperience: 3, // TODO(owner)
    specs: {
      hp: 400, // TODO(owner)
      acceleration: 5.9, // TODO(owner)
      topSpeed: 242, // TODO(owner)
      engine: "3.0 L I6 mild hybrid", // TODO(owner)
      fuel: "hybrid", // TODO(owner)
      drive: "AWD",
    },
    description: {
      // TODO(owner): real description
      en: "A comfortable luxury SUV for long trips across Georgia.",
      ka: "კომფორტული ლუქს ჯიპი საქართველოში გრძელი მოგზაურობისთვის.",
      ru: "Комфортный люксовый внедорожник для дальних поездок по Грузии.",
    },
    photos: ["/cars/range-rover-sport/1.svg", "/cars/range-rover-sport/2.svg"],
    featured: true,
  },
];

export function getCar(slug: string): Car | undefined {
  return cars.find((car) => car.slug === slug);
}

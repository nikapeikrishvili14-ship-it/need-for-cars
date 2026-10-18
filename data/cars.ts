import type { Localized } from "./types";

export type CarType = "sports" | "gt" | "suv" | "sedan";
export type Transmission = "automatic" | "manual";
/** Names are translated in messages/*.json → car.colours */
export type CarColour = "blue" | "red" | "black" | "white" | "matteBlack";

export type Car = {
  slug: string;
  brand: string;
  model: string;
  /** Model year; leave out when unknown — the site then just doesn't show it */
  year?: number;
  type: CarType;
  colour: CarColour;
  transmission: Transmission;
  seats: number;
  /** USD per day */
  pricePerDay: number;
  specs: {
    hp: number;
    /**
     * The engine is tuned: `hp` is the tuned output and the car shows a
     * "Tuned" badge. Other figures stay factory figures.
     */
    tuned?: boolean;
    /** 0–100 km/h, seconds */
    acceleration: number;
    /** km/h */
    topSpeed: number;
    engine: string;
    fuel: "petrol" | "diesel" | "hybrid" | "electric";
    drive: "RWD" | "AWD" | "FWD";
  };
  /** Short tagline shown under the name */
  description: Localized;
  /** Paths under /public, first one is the cover */
  photos: string[];
  /**
   * Transparent cut-out of the car (side or 3/4 view, PNG/WebP/SVG) for the
   * garage scenes: home hero, car selector, catalogue cards. Without it the
   * first photo is shown instead.
   */
  stage?: string;
  /**
   * Short engine clip (1–2 s), played on switch when the visitor turns sound on.
   * Leave undefined until the file exists in public/ — a synthesized rev plays instead.
   */
  sound?: string;
  featured: boolean;
};

// Placeholder images until the real photos arrive.
// TODO(owner): real photos in public/cars/[slug]/1.webp, 2.webp ... and a
// transparent cut-out (stage.webp) for each car; then update the paths below.
const placeholder = (slug: string) => ({
  photos: [`/cars/${slug}/1.svg`, `/cars/${slug}/2.svg`],
  stage: `/cars/${slug}/stage.svg`,
});

// TODO(owner): engine clips, e.g. "/sounds/[slug].mp3" — the synth sound plays until `sound` is set

export const cars: Car[] = [
  {
    slug: "chevrolet-corvette-c8-stingray",
    brand: "Chevrolet",
    model: "Corvette C8 Stingray",
    year: 2025,
    type: "sports",
    colour: "blue",
    transmission: "automatic",
    seats: 2,
    pricePerDay: 500,
    specs: { hp: 490, acceleration: 3.0, topSpeed: 296, engine: "6.2L V8", fuel: "petrol", drive: "RWD" },
    description: {
      en: "Mid-engine American supercar. Low, loud and impossible to ignore.",
      ka: "ამერიკული სუპერქარი შუა ძრავით. დაბალი, ხმამაღალი და შეუმჩნეველი ვერასდროს დარჩება.",
      ru: "Американский суперкар со средним расположением двигателя. Низкий, громкий — его невозможно не заметить.",
    },
    ...placeholder("chevrolet-corvette-c8-stingray"),
    featured: false,
  },
  {
    slug: "toyota-gr-supra",
    brand: "Toyota",
    model: "GR Supra (MK5)",
    // TODO(owner): model year
    type: "sports",
    colour: "red",
    transmission: "automatic",
    seats: 2,
    pricePerDay: 350,
    specs: { hp: 600, tuned: true, acceleration: 4.1, topSpeed: 250, engine: "3.0L I6 turbo", fuel: "petrol", drive: "RWD" },
    description: {
      en: "Tuned to 600 hp. A legend with no limits.",
      ka: "ტიუნინგით 600 ც.ძ.-მდე. ლეგენდა, რომელსაც საზღვრები არ აქვს.",
      ru: "Тюнинг до 600 л.с. Легенда без ограничений.",
    },
    ...placeholder("toyota-gr-supra"),
    // The car in the home hero photo
    featured: true,
  },
  {
    slug: "bmw-x5-xdrive40i",
    brand: "BMW",
    model: "X5 xDrive40i (G05)",
    year: 2021,
    type: "suv",
    colour: "black",
    transmission: "automatic",
    seats: 5,
    pricePerDay: 250,
    specs: { hp: 340, acceleration: 5.5, topSpeed: 243, engine: "3.0L I6 turbo", fuel: "petrol", drive: "AWD" },
    description: {
      en: "Power, comfort and space. A luxury SUV for every road in Georgia.",
      ka: "სიმძლავრე, კომფორტი და სივრცე. ლუქს ჯიპი საქართველოს ყველა გზისთვის.",
      ru: "Мощность, комфорт и простор. Люксовый внедорожник для любых дорог Грузии.",
    },
    ...placeholder("bmw-x5-xdrive40i"),
    featured: false,
  },
  {
    slug: "bmw-m850i-gran-coupe",
    brand: "BMW",
    model: "M850i xDrive Gran Coupé",
    year: 2020,
    type: "gt",
    colour: "white",
    transmission: "automatic",
    seats: 5,
    pricePerDay: 300,
    specs: { hp: 530, acceleration: 3.9, topSpeed: 250, engine: "4.4L V8 twin-turbo", fuel: "petrol", drive: "AWD" },
    description: {
      en: "V8 grand tourer. 530 hp of pure elegance.",
      ka: "V8 გრან-ტურიზმო. 530 ც.ძ. სუფთა ელეგანტურობა.",
      ru: "Гран-туризмо с V8. 530 л.с. чистой элегантности.",
    },
    ...placeholder("bmw-m850i-gran-coupe"),
    featured: false,
  },
  {
    slug: "bmw-x6-xdrive40i-m-sport",
    brand: "BMW",
    model: "X6 xDrive40i M Sport (G06)",
    year: 2022,
    type: "suv",
    colour: "black",
    transmission: "automatic",
    seats: 5,
    pricePerDay: 250,
    specs: { hp: 340, acceleration: 5.5, topSpeed: 250, engine: "3.0L I6 turbo", fuel: "petrol", drive: "AWD" },
    description: {
      en: "Sporty coupé lines, SUV confidence. Aggressive M Sport look.",
      ka: "კუპეს სპორტული ხაზები და ჯიპის თავდაჯერებულობა. აგრესიული M Sport იერი.",
      ru: "Спортивный силуэт купе и уверенность внедорожника. Агрессивный облик M Sport.",
    },
    ...placeholder("bmw-x6-xdrive40i-m-sport"),
    featured: false,
  },
  {
    slug: "mercedes-amg-gle-63-s-coupe",
    brand: "Mercedes-AMG",
    model: "GLE 63 S Coupé",
    // TODO(owner): model year (C292 generation: 2016–2019)
    type: "suv",
    colour: "blue",
    transmission: "automatic",
    seats: 5,
    pricePerDay: 300,
    // Previous generation (C292, 2016–2019)
    specs: { hp: 585, acceleration: 4.2, topSpeed: 250, engine: "5.5L V8 biturbo", fuel: "petrol", drive: "AWD" },
    description: {
      en: "585 hp in an SUV. Family size, supercar speed.",
      ka: "585 ც.ძ. ჯიპში. ოჯახური ზომა, სუპერქარის სიჩქარე.",
      ru: "585 л.с. во внедорожнике. Семейный размер, скорость суперкара.",
    },
    ...placeholder("mercedes-amg-gle-63-s-coupe"),
    featured: false,
  },
  {
    slug: "chevrolet-corvette-c7-stingray",
    brand: "Chevrolet",
    model: "Corvette C7 Stingray",
    year: 2018,
    type: "sports",
    colour: "red",
    transmission: "automatic",
    seats: 2,
    pricePerDay: 350,
    specs: { hp: 455, acceleration: 4.0, topSpeed: 290, engine: "6.2L V8", fuel: "petrol", drive: "RWD" },
    description: {
      en: "Raw V8 sound, classic Corvette soul.",
      ka: "V8-ის ცოცხალი ხმა და კლასიკური Corvette-ის სული.",
      ru: "Необузданный звук V8 и классическая душа Corvette.",
    },
    ...placeholder("chevrolet-corvette-c7-stingray"),
    featured: false,
  },
  {
    slug: "mercedes-amg-gt-43-4-door-coupe",
    brand: "Mercedes-AMG",
    model: "GT 43 4-Door Coupé",
    year: 2023,
    type: "gt",
    colour: "matteBlack",
    transmission: "automatic",
    seats: 4,
    pricePerDay: 500,
    specs: { hp: 367, acceleration: 4.9, topSpeed: 270, engine: "3.0L I6 turbo + EQ Boost", fuel: "petrol", drive: "AWD" },
    description: {
      en: "Matte black, AMG power. Pure attitude.",
      ka: "მქრქალი შავი და AMG-ის ძალა. სუფთა ხასიათი.",
      ru: "Матовый чёрный и мощь AMG. Чистый характер.",
    },
    ...placeholder("mercedes-amg-gt-43-4-door-coupe"),
    featured: false,
  },
  {
    slug: "mercedes-benz-s-350-d",
    brand: "Mercedes-Benz",
    model: "S 350 d",
    year: 2017,
    type: "sedan",
    colour: "black",
    transmission: "automatic",
    seats: 5,
    pricePerDay: 200,
    specs: { hp: 258, acceleration: 6.8, topSpeed: 250, engine: "3.0L V6 diesel", fuel: "diesel", drive: "RWD" },
    description: {
      en: "Business-class luxury. Arrive like a VIP.",
      ka: "ბიზნეს-კლასის ფუფუნება. ჩადი ადგილზე, როგორც VIP.",
      ru: "Роскошь бизнес-класса. Приезжайте как VIP.",
    },
    ...placeholder("mercedes-benz-s-350-d"),
    featured: false,
  },
  {
    slug: "mercedes-benz-cls-450-4matic",
    brand: "Mercedes-Benz",
    model: "CLS 450 4MATIC",
    year: 2020,
    type: "gt",
    colour: "white",
    transmission: "automatic",
    seats: 5,
    pricePerDay: 200,
    specs: { hp: 367, acceleration: 4.8, topSpeed: 250, engine: "3.0L I6 turbo + EQ Boost", fuel: "petrol", drive: "AWD" },
    description: {
      en: "Coupé style, sedan comfort. Elegance with a sporty heart.",
      ka: "კუპეს სტილი, სედანის კომფორტი. ელეგანტურობა სპორტული გულით.",
      ru: "Стиль купе, комфорт седана. Элегантность со спортивным сердцем.",
    },
    ...placeholder("mercedes-benz-cls-450-4matic"),
    featured: false,
  },
];

export function getCar(slug: string): Car | undefined {
  return cars.find((car) => car.slug === slug);
}

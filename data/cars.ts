import type { Localized } from "./types";

export type CarType = "sports" | "gt" | "suv" | "sedan";
export type Transmission = "automatic" | "manual";
/** Names are translated in messages/*.json → car.colours */
export type CarColour = "blue" | "red" | "black" | "white" | "matteBlack";

/** Camera angle of a gallery photo, used for its alt text (messages → car.angles) */
export type PhotoAngle = "front34" | "side" | "rear34" | "front" | "rear" | "top34";

export type CarPhoto = {
  /** Path under /public */
  src: string;
  angle?: PhotoAngle;
};

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
  /** Gallery photos (16:9), first one is the cover */
  photos: CarPhoto[];
  /**
   * Transparent side-view cut-out of the car, facing right and tightly
   * cropped (tyres on the bottom edge), for the garage scenes: home hero, car
   * selector, catalogue cards. Without it the first photo is shown instead.
   */
  stage?: string;
  /**
   * Short engine clip (1–2 s), played on switch when the visitor turns sound on.
   * Leave undefined until the file exists in public/ — a synthesized rev plays instead.
   */
  sound?: string;
  featured: boolean;
};

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
    photos: [
      { src: "/cars/chevrolet-corvette-c8-stingray/1.webp", angle: "front34" },
      { src: "/cars/chevrolet-corvette-c8-stingray/2.webp", angle: "side" },
      { src: "/cars/chevrolet-corvette-c8-stingray/3.webp", angle: "rear34" },
      { src: "/cars/chevrolet-corvette-c8-stingray/4.webp", angle: "front" },
      { src: "/cars/chevrolet-corvette-c8-stingray/5.webp", angle: "rear" },
    ],
    stage: "/cars/chevrolet-corvette-c8-stingray/stage.webp",
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
    photos: [
      { src: "/cars/toyota-gr-supra/1.webp", angle: "front34" },
      { src: "/cars/toyota-gr-supra/2.webp", angle: "side" },
      { src: "/cars/toyota-gr-supra/3.webp", angle: "rear34" },
      { src: "/cars/toyota-gr-supra/4.webp", angle: "front" },
      { src: "/cars/toyota-gr-supra/5.webp", angle: "rear" },
      { src: "/cars/toyota-gr-supra/6.webp", angle: "top34" },
    ],
    stage: "/cars/toyota-gr-supra/stage.webp",
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
    photos: [
      { src: "/cars/bmw-x5-xdrive40i/1.webp", angle: "front34" },
      { src: "/cars/bmw-x5-xdrive40i/2.webp", angle: "side" },
      { src: "/cars/bmw-x5-xdrive40i/3.webp", angle: "rear34" },
      { src: "/cars/bmw-x5-xdrive40i/4.webp", angle: "front" },
      { src: "/cars/bmw-x5-xdrive40i/5.webp", angle: "rear" },
      { src: "/cars/bmw-x5-xdrive40i/6.webp", angle: "top34" },
    ],
    stage: "/cars/bmw-x5-xdrive40i/stage.webp",
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
    photos: [
      { src: "/cars/bmw-m850i-gran-coupe/1.webp", angle: "front34" },
      { src: "/cars/bmw-m850i-gran-coupe/2.webp", angle: "side" },
      { src: "/cars/bmw-m850i-gran-coupe/3.webp", angle: "rear34" },
      { src: "/cars/bmw-m850i-gran-coupe/4.webp", angle: "front" },
      { src: "/cars/bmw-m850i-gran-coupe/5.webp", angle: "rear" },
      { src: "/cars/bmw-m850i-gran-coupe/6.webp", angle: "top34" },
    ],
    stage: "/cars/bmw-m850i-gran-coupe/stage.webp",
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
    photos: [
      { src: "/cars/bmw-x6-xdrive40i-m-sport/1.webp", angle: "front34" },
      { src: "/cars/bmw-x6-xdrive40i-m-sport/2.webp", angle: "side" },
      { src: "/cars/bmw-x6-xdrive40i-m-sport/3.webp", angle: "rear34" },
      { src: "/cars/bmw-x6-xdrive40i-m-sport/4.webp", angle: "front" },
      { src: "/cars/bmw-x6-xdrive40i-m-sport/5.webp", angle: "rear" },
      { src: "/cars/bmw-x6-xdrive40i-m-sport/6.webp", angle: "top34" },
    ],
    stage: "/cars/bmw-x6-xdrive40i-m-sport/stage.webp",
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
    photos: [
      { src: "/cars/mercedes-amg-gle-63-s-coupe/1.webp", angle: "front34" },
      { src: "/cars/mercedes-amg-gle-63-s-coupe/2.webp", angle: "side" },
      { src: "/cars/mercedes-amg-gle-63-s-coupe/3.webp", angle: "rear34" },
      { src: "/cars/mercedes-amg-gle-63-s-coupe/4.webp", angle: "front" },
      { src: "/cars/mercedes-amg-gle-63-s-coupe/5.webp", angle: "rear" },
      { src: "/cars/mercedes-amg-gle-63-s-coupe/6.webp", angle: "top34" },
    ],
    stage: "/cars/mercedes-amg-gle-63-s-coupe/stage.webp",
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
    photos: [
      { src: "/cars/chevrolet-corvette-c7-stingray/1.webp", angle: "front34" },
      { src: "/cars/chevrolet-corvette-c7-stingray/2.webp", angle: "side" },
      { src: "/cars/chevrolet-corvette-c7-stingray/3.webp", angle: "rear34" },
      { src: "/cars/chevrolet-corvette-c7-stingray/4.webp", angle: "front" },
      { src: "/cars/chevrolet-corvette-c7-stingray/5.webp", angle: "rear" },
      { src: "/cars/chevrolet-corvette-c7-stingray/6.webp", angle: "top34" },
    ],
    stage: "/cars/chevrolet-corvette-c7-stingray/stage.webp",
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
    photos: [
      { src: "/cars/mercedes-amg-gt-43-4-door-coupe/1.webp", angle: "front34" },
      { src: "/cars/mercedes-amg-gt-43-4-door-coupe/2.webp", angle: "side" },
      { src: "/cars/mercedes-amg-gt-43-4-door-coupe/3.webp", angle: "rear34" },
      { src: "/cars/mercedes-amg-gt-43-4-door-coupe/4.webp", angle: "front" },
      { src: "/cars/mercedes-amg-gt-43-4-door-coupe/5.webp", angle: "rear" },
      { src: "/cars/mercedes-amg-gt-43-4-door-coupe/6.webp", angle: "top34" },
    ],
    stage: "/cars/mercedes-amg-gt-43-4-door-coupe/stage.webp",
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
    photos: [
      { src: "/cars/mercedes-benz-s-350-d/1.webp", angle: "front34" },
      { src: "/cars/mercedes-benz-s-350-d/2.webp", angle: "side" },
      { src: "/cars/mercedes-benz-s-350-d/3.webp", angle: "rear34" },
      { src: "/cars/mercedes-benz-s-350-d/4.webp", angle: "front" },
      { src: "/cars/mercedes-benz-s-350-d/5.webp", angle: "rear" },
      { src: "/cars/mercedes-benz-s-350-d/6.webp", angle: "top34" },
    ],
    stage: "/cars/mercedes-benz-s-350-d/stage.webp",
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
    photos: [
      { src: "/cars/mercedes-benz-cls-450-4matic/1.webp", angle: "front34" },
      { src: "/cars/mercedes-benz-cls-450-4matic/2.webp", angle: "side" },
      { src: "/cars/mercedes-benz-cls-450-4matic/3.webp", angle: "rear34" },
      { src: "/cars/mercedes-benz-cls-450-4matic/4.webp", angle: "front" },
      { src: "/cars/mercedes-benz-cls-450-4matic/5.webp", angle: "rear" },
      { src: "/cars/mercedes-benz-cls-450-4matic/6.webp", angle: "top34" },
    ],
    stage: "/cars/mercedes-benz-cls-450-4matic/stage.webp",
    featured: false,
  },
];

export function getCar(slug: string): Car | undefined {
  return cars.find((car) => car.slug === slug);
}

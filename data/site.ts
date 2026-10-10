import type { CurrencyCode, Localized } from "./types";

export type City = {
  id: string;
  name: Localized;
  /** One-way delivery fee in USD (0 = free) */
  deliveryFee: number;
};

export type Extra = {
  id: string;
  name: Localized;
  /** Price in USD */
  price: number;
  per: "day" | "rental";
};

export type FaqItem = {
  question: Localized;
  answer: Localized;
};

export type SiteConfig = {
  name: string;
  contacts: {
    /** Display format */
    phone: string;
    /** Digits only with country code, used for wa.me links */
    whatsapp: string;
    email: string;
    address: Localized;
    /** Google Maps embed URL (Share → Embed a map → src) */
    mapEmbedUrl: string;
    hours: Localized;
    instagram?: string;
    facebook?: string;
  };
  cities: City[];
  extras: Extra[];
  /** Custom drop-off at a different location, USD */
  customDropOffFee: number;
  /** Refundable deposit in USD — shown separately, never added to the total */
  deposit: number;
  baseCurrency: "USD";
  /** Fixed rates: 1 USD = X. Converted prices are shown as "approx." */
  currencyRates: Record<CurrencyCode, number>;
  terms: Localized[];
  faq: FaqItem[];
};

export const site: SiteConfig = {
  name: "Need for Cars",
  contacts: {
    phone: "+995 555 00 00 00", // TODO(owner): real phone number
    whatsapp: "995555000000", // TODO(owner): real WhatsApp number (digits only)
    email: "info@example.com", // TODO(owner): real email
    address: {
      // TODO(owner): real office / pickup address
      en: "Tbilisi, Georgia",
      ka: "თბილისი, საქართველო",
      ru: "Тбилиси, Грузия",
    },
    // TODO(owner): Google Maps embed link for the office
    mapEmbedUrl: "https://www.google.com/maps?q=Tbilisi&output=embed",
    hours: {
      // TODO(owner): real working hours
      en: "Every day, 09:00–21:00",
      ka: "ყოველდღე, 09:00–21:00",
      ru: "Ежедневно, 09:00–21:00",
    },
    instagram: undefined, // TODO(owner): Instagram URL
    facebook: undefined, // TODO(owner): Facebook URL
  },
  cities: [
    // TODO(owner): confirm delivery cities and fees
    { id: "tbilisi", name: { en: "Tbilisi", ka: "თბილისი", ru: "Тбилиси" }, deliveryFee: 0 },
    { id: "tbilisi-airport", name: { en: "Tbilisi Airport", ka: "თბილისის აეროპორტი", ru: "Аэропорт Тбилиси" }, deliveryFee: 0 },
    { id: "batumi", name: { en: "Batumi", ka: "ბათუმი", ru: "Батуми" }, deliveryFee: 0 },
    { id: "kutaisi", name: { en: "Kutaisi", ka: "ქუთაისი", ru: "Кутаиси" }, deliveryFee: 0 },
  ],
  extras: [
    // TODO(owner): confirm extras and prices
    { id: "child-seat", name: { en: "Child seat", ka: "ბავშვის სავარძელი", ru: "Детское кресло" }, price: 0, per: "day" },
    { id: "additional-driver", name: { en: "Additional driver", ka: "დამატებითი მძღოლი", ru: "Дополнительный водитель" }, price: 0, per: "rental" },
  ],
  customDropOffFee: 0, // TODO(owner): custom drop-off price
  deposit: 100,
  baseCurrency: "USD",
  currencyRates: {
    USD: 1,
    GEL: 2.7, // TODO(owner): confirm fixed GEL rate
    EUR: 0.92, // TODO(owner): confirm fixed EUR rate
  },
  terms: [
    // TODO(owner): full rental terms
    {
      en: "A refundable deposit of $100 is returned 1 working day after the car is returned.",
      ka: "$100-იანი დეპოზიტი ბრუნდება მანქანის დაბრუნებიდან 1 სამუშაო დღეში.",
      ru: "Депозит $100 возвращается через 1 рабочий день после возврата автомобиля.",
    },
    {
      en: "All cars are insured.",
      ka: "ყველა მანქანა დაზღვეულია.",
      ru: "Все автомобили застрахованы.",
    },
  ],
  faq: [
    // TODO(owner): real FAQ
    {
      question: { en: "Is there a deposit?", ka: "არის დეპოზიტი?", ru: "Нужен ли депозит?" },
      answer: {
        en: "Yes, $100. It is refunded 1 working day after you return the car.",
        ka: "დიახ, $100. ის ბრუნდება მანქანის დაბრუნებიდან 1 სამუშაო დღეში.",
        ru: "Да, $100. Он возвращается через 1 рабочий день после возврата автомобиля.",
      },
    },
  ],
};

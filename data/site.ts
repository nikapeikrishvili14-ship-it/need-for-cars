import type { CurrencyCode, Localized } from "./types";

export type City = {
  id: string;
  name: Localized;
  /** Fee in USD to deliver the car here or collect it from here (0 = free) */
  deliveryFee: number;
};

export type Extra = {
  id: string;
  name: Localized;
  /** Price in USD */
  price: number;
  per: "day" | "rental";
};

export type FaqGroup = "booking" | "payment" | "delivery" | "requirements";

/**
 * Answers may use these tokens, filled in from this file so values live in
 * one place: {deposit} (deposit amount), {refundTime} (e.g. "1 working day"),
 * {cities} (delivery cities), {customFee} (pickup/drop-off at a custom address).
 */
export type FaqItem = {
  group: FaqGroup;
  question: Localized;
  /** Leave undefined until the owner confirms it — the site then shows "Contact us for details" */
  answer?: Localized;
};

/** A rental rule shown on the About page (deposit, insurance and age rules are built from the data) */
export type RentalTerm = {
  id: string;
  title: Localized;
  /** Leave undefined until the owner confirms it — the site then shows "Contact us for details" */
  text?: Localized;
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
  /** Fee in USD for pickup or drop-off at a customer-chosen address */
  customAddressFee: number;
  /** Refundable deposit in USD — shown separately, never added to the total */
  deposit: number;
  /** Working days after the car is returned until the deposit is refunded. Used in every sentence that mentions it. */
  depositRefundDays: number;
  baseCurrency: "USD";
  /** Fixed rates: 1 USD = X. Converted prices are shown as "approx." */
  currencyRates: Record<CurrencyCode, number>;
  /** Company story for the About page; the section is hidden while empty */
  story?: Localized;
  rentalTerms: RentalTerm[];
  faq: FaqItem[];
  /**
   * Home hero background. Leave both empty to show the built-in garage scene
   * with the first featured car. A video wins over an image.
   */
  hero: {
    /** Short muted loop, e.g. /hero/garage.mp4 (keep it under ~4 MB) */
    video?: string;
    /** Still photo; also used as the video's poster frame */
    image?: string;
  };
  reviews: Review[];
};

export type Review = {
  name: string;
  /** Where the customer is from, e.g. "Germany" */
  from: Localized;
  text: Localized;
  /** 1–5 */
  rating: number;
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
    // TODO(owner): confirm delivery cities and fees (placeholder prices)
    { id: "tbilisi", name: { en: "Tbilisi", ka: "თბილისი", ru: "Тбилиси" }, deliveryFee: 0 },
    { id: "tbilisi-airport", name: { en: "Tbilisi Airport", ka: "თბილისის აეროპორტი", ru: "Аэропорт Тбилиси" }, deliveryFee: 20 },
    { id: "batumi", name: { en: "Batumi", ka: "ბათუმი", ru: "Батуми" }, deliveryFee: 150 },
    { id: "kutaisi", name: { en: "Kutaisi", ka: "ქუთაისი", ru: "Кутаиси" }, deliveryFee: 100 },
  ],
  extras: [
    // TODO(owner): confirm extras and prices (placeholder prices)
    { id: "child-seat", name: { en: "Child seat", ka: "ბავშვის სავარძელი", ru: "Детское кресло" }, price: 10, per: "day" },
    { id: "additional-driver", name: { en: "Additional driver", ka: "დამატებითი მძღოლი", ru: "Дополнительный водитель" }, price: 20, per: "rental" },
  ],
  customAddressFee: 30, // TODO(owner): price for delivery/collection at a custom address
  deposit: 100,
  depositRefundDays: 1,
  baseCurrency: "USD",
  currencyRates: {
    USD: 1,
    GEL: 2.7, // TODO(owner): confirm fixed GEL rate
    EUR: 0.92, // TODO(owner): confirm fixed EUR rate
  },
  story: undefined, // TODO(owner): a few sentences — when you started, why, what makes you different

  // Shown on the About page under the deposit, insurance and driver-requirement
  // rules (those come from `deposit` above and data/cars.ts).
  rentalTerms: [
    {
      id: "documents",
      title: { en: "Documents", ka: "საბუთები", ru: "Документы" },
      text: undefined, // TODO(owner): e.g. passport + driving licence (international licence needed?)
    },
    {
      id: "fuel",
      title: { en: "Fuel policy", ka: "საწვავი", ru: "Топливо" },
      text: undefined, // TODO(owner): e.g. full-to-full
    },
    {
      id: "mileage",
      title: { en: "Mileage limit", ka: "გარბენის ლიმიტი", ru: "Лимит пробега" },
      text: undefined, // TODO(owner): km per day, price per extra km
    },
    {
      id: "late-return",
      title: { en: "Late return", ka: "დაგვიანებით დაბრუნება", ru: "Поздний возврат" },
      text: undefined, // TODO(owner): grace period and fee
    },
    {
      id: "outside-georgia",
      title: {
        en: "Driving outside Georgia",
        ka: "საქართველოს ფარგლებს გარეთ მგზავრობა",
        ru: "Выезд за пределы Грузии",
      },
      text: undefined, // TODO(owner): allowed or not, which countries
    },
    {
      id: "smoking-pets",
      title: { en: "Smoking and pets", ka: "მოწევა და შინაური ცხოველები", ru: "Курение и животные" },
      text: undefined, // TODO(owner)
    },
    {
      id: "cancellation",
      title: { en: "Cancellation", ka: "ჯავშნის გაუქმება", ru: "Отмена бронирования" },
      text: undefined, // TODO(owner): free until when, fees after that
    },
  ],

  // Grouped on the FAQ page. Questions without an answer show
  // "Contact us for details" and are left out of Google's FAQ data.
  faq: [
    {
      group: "booking",
      question: { en: "How do I book a car?", ka: "როგორ დავჯავშნო მანქანა?", ru: "Как забронировать автомобиль?" },
      answer: {
        en: "Pick a car and fill in the booking form, or send us a message on WhatsApp. We check availability and confirm the final price with you. There's no online payment.",
        ka: "აირჩიე მანქანა და შეავსე ჯავშნის ფორმა, ან მოგვწერე WhatsApp-ზე. ჩვენ შევამოწმებთ ხელმისაწვდომობას და დაგიდასტურებთ საბოლოო ფასს. ონლაინ გადახდა საჭირო არ არის.",
        ru: "Выберите автомобиль и заполните форму бронирования или напишите нам в WhatsApp. Мы проверим наличие и подтвердим итоговую цену. Онлайн-оплата не нужна.",
      },
    },
    {
      group: "booking",
      question: {
        en: "How far in advance should I book?",
        ka: "რამდენი ხნით ადრე უნდა დავჯავშნო?",
        ru: "За сколько времени нужно бронировать?",
      },
      answer: undefined, // TODO(owner)
    },
    {
      group: "booking",
      question: {
        en: "Can I change or cancel my booking?",
        ka: "შემიძლია ჯავშნის შეცვლა ან გაუქმება?",
        ru: "Можно ли изменить или отменить бронирование?",
      },
      answer: undefined, // TODO(owner): match the cancellation term above
    },
    {
      group: "payment",
      question: { en: "Is there a deposit?", ka: "არის დეპოზიტი?", ru: "Нужен ли депозит?" },
      answer: {
        en: "Yes, a refundable deposit of {deposit}. You pay it when you get the car, and we return it {refundTime} after you bring the car back. It isn't part of the rental price.",
        ka: "დიახ, დასაბრუნებელი დეპოზიტი — {deposit}. მას იხდი მანქანის მიღებისას და გიბრუნდება მანქანის დაბრუნებიდან {refundTime}. ის ქირის ფასში არ შედის.",
        ru: "Да, возвратный депозит {deposit}. Он оплачивается при получении автомобиля и возвращается через {refundTime} после возврата машины. В стоимость аренды он не входит.",
      },
    },
    {
      group: "payment",
      question: { en: "How do I pay for the rental?", ka: "როგორ გადავიხადო ქირა?", ru: "Как оплатить аренду?" },
      answer: undefined, // TODO(owner): cash / card / transfer, and when (at pickup?)
    },
    {
      group: "payment",
      question: {
        en: "Are the prices on the site final?",
        ka: "საიტზე მითითებული ფასები საბოლოოა?",
        ru: "Цены на сайте окончательные?",
      },
      answer: {
        en: "Prices are per day in US dollars. Amounts in GEL and EUR are approximate, converted at a fixed rate. The booking form shows an estimate, and we confirm the final price before you book.",
        ka: "ფასები მითითებულია დღეში, აშშ დოლარში. ლარსა და ევროში თანხები მიახლოებითია, გადაყვანილი ფიქსირებული კურსით. ჯავშნის ფორმა გაჩვენებს სავარაუდო ფასს, საბოლოო ფასს კი ჯავშნამდე დაგიდასტურებთ.",
        ru: "Цены указаны за сутки в долларах США. Суммы в лари и евро приблизительные — они пересчитаны по фиксированному курсу. Форма бронирования показывает примерную стоимость, а итоговую цену мы подтвердим до бронирования.",
      },
    },
    {
      group: "delivery",
      question: {
        en: "Where can I pick up the car?",
        ka: "სად შემიძლია მანქანის აყვანა?",
        ru: "Где можно получить автомобиль?",
      },
      answer: {
        en: "We deliver to {cities}. We can also bring the car to another address, like your hotel, for {customFee}.",
        ka: "მანქანას მოგაწვდით აქ: {cities}. შეგვიძლია სხვა მისამართზეც მოგიყვანოთ, მაგალითად სასტუმროსთან — {customFee}.",
        ru: "Мы доставляем автомобиль сюда: {cities}. Можем подать машину и по другому адресу, например к вашему отелю, — за {customFee}.",
      },
    },
    {
      group: "delivery",
      question: {
        en: "Can you meet me at the airport?",
        ka: "დამხვდებით აეროპორტში?",
        ru: "Можете встретить меня в аэропорту?",
      },
      answer: {
        en: "Yes. Choose Tbilisi Airport as the pickup location and add your flight number to the booking form, so we can meet you on time.",
        ka: "დიახ. აყვანის ადგილად აირჩიე თბილისის აეროპორტი და ჯავშნის ფორმაში მიუთითე რეისის ნომერი, რომ დროულად დაგხვდეთ.",
        ru: "Да. Выберите Аэропорт Тбилиси местом получения и укажите номер рейса в форме бронирования — так мы встретим вас вовремя.",
      },
    },
    {
      group: "delivery",
      question: {
        en: "Can I return the car in another city?",
        ka: "შემიძლია მანქანა სხვა ქალაქში დავაბრუნო?",
        ru: "Можно ли вернуть автомобиль в другом городе?",
      },
      answer: {
        en: "Yes. Choose the drop-off location in the booking form. The fee depends on the city and is shown in the estimate.",
        ka: "დიახ. ჯავშნის ფორმაში აირჩიე დაბრუნების ადგილი. საფასური ქალაქზეა დამოკიდებული და სავარაუდო ფასში ჩანს.",
        ru: "Да. Выберите место возврата в форме бронирования. Стоимость зависит от города и видна в расчёте.",
      },
    },
    {
      group: "requirements",
      question: {
        en: "How old do I need to be?",
        ka: "რა ასაკიდან შემიძლია მანქანის ქირაობა?",
        ru: "С какого возраста можно арендовать автомобиль?",
      },
      answer: {
        en: "It depends on the car. Each car's page shows its minimum driver age and driving experience.",
        ka: "ეს მანქანაზეა დამოკიდებული. თითოეული მანქანის გვერდზე მითითებულია მძღოლის მინიმალური ასაკი და მართვის სტაჟი.",
        ru: "Это зависит от автомобиля. На странице каждой машины указаны минимальный возраст водителя и стаж вождения.",
      },
    },
    {
      group: "requirements",
      question: { en: "What documents do I need?", ka: "რა საბუთები მჭირდება?", ru: "Какие документы нужны?" },
      answer: undefined, // TODO(owner): match the documents term above
    },
    {
      group: "requirements",
      question: {
        en: "Can I drive the car outside Georgia?",
        ka: "შემიძლია მანქანით საქართველოს ფარგლებს გარეთ გასვლა?",
        ru: "Можно ли выезжать на автомобиле за пределы Грузии?",
      },
      answer: undefined, // TODO(owner): match the "driving outside Georgia" term above
    },
  ],
  hero: {
    video: undefined, // TODO(owner): e.g. "/hero/garage.mp4" — short muted loop
    image: undefined, // TODO(owner): e.g. "/hero/garage.webp" — dark, car lit from above
  },
  // TODO(owner): add real customer reviews. The home page shows a
  // "reviews coming soon" note while this list is empty. Example:
  // { name: "Anna", from: { en: "Germany", ka: "გერმანია", ru: "Германия" },
  //   text: { en: "...", ka: "...", ru: "..." }, rating: 5 },
  reviews: [],
};

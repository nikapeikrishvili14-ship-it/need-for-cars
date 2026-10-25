import type { CurrencyCode, Localized } from "./types";

export type City = {
  id: string;
  name: Localized;
  /**
   * Places in the same area share a region. Returning the car in another
   * region is possible, but its fee is "ask us" (not in the estimate).
   */
  region: string;
  /** Fee in USD to deliver the car here (0 = free). Also covers collecting it here at the end. */
  deliveryFee: number;
  /** Delivery here is free for rentals of at least this many days */
  freeFromDays?: number;
};

export type FaqGroup = "booking" | "payment" | "delivery" | "requirements";

/**
 * Answers may use these tokens, filled in from this file so values live in
 * one place: {refundTime} (e.g. "1 working day"), {cities} (delivery places),
 * {deliveryRules} (each place with its fee and free-delivery rule).
 */
export type FaqItem = {
  group: FaqGroup;
  question: Localized;
  /** Leave undefined until the owner confirms it — the site then shows "Contact us for details" */
  answer?: Localized;
  /** Add an "Ask on WhatsApp" link after the answer (for answers that say "ask us") */
  ask?: boolean;
};

/** A rental rule shown on the About page (deposit, insurance and driver rules come from messages/*.json) */
export type RentalTerm = {
  id: string;
  title: Localized;
  /** Leave undefined until the owner confirms it — the site then shows "Contact us for details" */
  text?: Localized;
  /** Add an "Ask on WhatsApp" link after the text */
  ask?: boolean;
};

export type SiteConfig = {
  name: string;
  contacts: {
    /** Display format */
    phone: string;
    /** Digits only with country code, used for wa.me links */
    whatsapp: string;
    email: string;
    /** Shown as the location (no street address) */
    address: Localized;
    /** City for Google (structured data) */
    city: Localized;
    /** Google Maps embed URL (Share → Embed a map → src) */
    mapEmbedUrl: string;
    hours: Localized;
    /** Same hours for Google (structured data): days Mo Tu We Th Fr Sa Su, 24-hour times */
    openingHours: { days: ("Mo" | "Tu" | "We" | "Th" | "Fr" | "Sa" | "Su")[]; opens: string; closes: string };
    instagram?: string;
    facebook?: string;
  };
  cities: City[];
  /** Working days after the car is returned until the deposit is refunded. Used in every sentence that mentions it. */
  depositRefundDays: number;
  /** Years in business, shown as a stat next to the story on the About page */
  yearsOnRoad: number;
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
    /**
     * Still photo (JPG), car in the middle; also used as the video's poster frame.
     * WebP copies next to it named <name>-1280.webp, <name>-1920.webp and
     * <name>-2750.webp are picked up automatically, so each screen gets the right size.
     */
    image?: string;
    /** The photo's size in px — its shape sets the hero's height on large screens */
    imageSize?: { width: number; height: number };
    /** Where the car begins, as a share of the photo's width from the left (0.31 = 31%). The text stays left of it. */
    carStart?: number;
    /**
     * The car's horizontal centre as a share of the photo's width (0.6 = 60%).
     * Phones and portrait tablets (text below the photo) shift the photo so the car is centred.
     */
    carCenter?: number;
    /** Slug of the fleet car in the photo (data/cars.ts), used for its description */
    car?: string;
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
  name: "Need For Cars",
  contacts: {
    phone: "+995 571 80 77 77",
    whatsapp: "995571807777",
    email: "mindiashvilishota6@gmail.com",
    address: { en: "Tbilisi, Georgia", ka: "თბილისი, საქართველო", ru: "Тбилиси, Грузия" },
    city: { en: "Tbilisi", ka: "თბილისი", ru: "Тбилиси" },
    mapEmbedUrl: "https://maps.google.com/maps?q=Tbilisi%2C%20Georgia&z=12&output=embed",
    hours: {
      en: "24/7 — we reply any time",
      ka: "24/7 — გიპასუხებთ ნებისმიერ დროს",
      ru: "24/7 — отвечаем в любое время",
    },
    // Keep in sync with `hours` above
    openingHours: { days: ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"], opens: "00:00", closes: "23:59" },
    instagram: undefined, // TODO(owner): Instagram URL
    facebook: undefined, // TODO(owner): Facebook URL
  },
  // Hotel or home address delivery and returns in another city: "ask us" (no fixed price)
  cities: [
    { id: "tbilisi", name: { en: "Tbilisi", ka: "თბილისი", ru: "Тбилиси" }, region: "tbilisi", deliveryFee: 0 },
    {
      id: "tbilisi-airport",
      name: { en: "Tbilisi Airport", ka: "თბილისის აეროპორტი", ru: "Аэропорт Тбилиси" },
      region: "tbilisi",
      deliveryFee: 50,
      freeFromDays: 3,
    },
    {
      id: "kutaisi-airport",
      name: { en: "Kutaisi Airport", ka: "ქუთაისის აეროპორტი", ru: "Аэропорт Кутаиси" },
      region: "kutaisi",
      deliveryFee: 150,
      freeFromDays: 7,
    },
    { id: "batumi", name: { en: "Batumi", ka: "ბათუმი", ru: "Батуми" }, region: "batumi", deliveryFee: 200 },
  ],
  depositRefundDays: 1,
  yearsOnRoad: 8,
  baseCurrency: "USD",
  currencyRates: {
    USD: 1,
    GEL: 2.6,
    EUR: 0.89,
  },
  // Keep the number of years in sync with `yearsOnRoad`
  story: {
    en: "For 8 years, Need For Cars has been putting drivers in Georgia behind the wheel of cars most people only see on posters. Corvettes, AMGs, M-cars — every one of them kept in top shape and ready to go. Message us any time, day or night: we answer, we deliver, you drive.",
    ka: "უკვე 8 წელია, Need For Cars საქართველოში მძღოლებს იმ მანქანების საჭესთან სვამს, რომლებსაც უმეტესობა მხოლოდ პოსტერებზე ხედავს. Corvette, AMG, BMW M — თითოეული იდეალურ მდგომარეობაშია და გზისთვის მზადაა. მოგვწერე ნებისმიერ დროს, დღე თუ ღამე: ჩვენ გიპასუხებთ, მანქანას მოგიყვანთ, შენ კი საჭესთან დაჯდები.",
    ru: "Уже 8 лет Need For Cars сажает водителей в Грузии за руль машин, которые большинство видит только на постерах. Corvette, AMG, BMW M — каждая в отличном состоянии и готова к дороге. Пишите нам в любое время, днём и ночью: мы отвечаем, привозим машину, а вы едете.",
  },

  // Shown on the About page under the deposit, insurance and driver-requirement
  // rules (those come from messages/*.json → about.terms).
  rentalTerms: [
    {
      id: "documents",
      title: { en: "Documents", ka: "საბუთები", ru: "Документы" },
      text: {
        en: "ID card and driving licence.",
        ka: "პირადობის მოწმობა და მართვის მოწმობა.",
        ru: "Удостоверение личности и водительские права.",
      },
    },
    {
      id: "minimum-rental",
      title: { en: "Minimum rental", ka: "მინიმალური ვადა", ru: "Минимальный срок" },
      text: { en: "1 day.", ka: "1 დღე.", ru: "1 сутки." },
    },
    {
      id: "long-rentals",
      title: { en: "Long rentals", ka: "ხანგრძლივი ქირაობა", ru: "Долгая аренда" },
      text: {
        en: "The longer you rent, the lower the daily price — discounts depend on the car. Ask us for your price.",
        ka: "რაც უფრო დიდხანს ქირაობ, მით უფრო დაბალია დღიური ფასი — ფასდაკლება მანქანაზეა დამოკიდებული. გვკითხე შენი ფასი.",
        ru: "Чем дольше аренда, тем ниже цена за сутки — скидка зависит от автомобиля. Спросите нас о вашей цене.",
      },
      ask: true,
    },
    {
      id: "mileage",
      title: { en: "Mileage", ka: "გარბენი", ru: "Пробег" },
      text: {
        en: "Mileage isn't unlimited. Planning long trips? Ask us — mileage depends on where you go.",
        ka: "გარბენი შეუზღუდავი არ არის. გეგმავ შორ მოგზაურობას? გვკითხე — გარბენი იმაზეა დამოკიდებული, სად მიდიხარ.",
        ru: "Пробег не безлимитный. Планируете дальние поездки? Спросите нас — пробег зависит от маршрута.",
      },
      ask: true,
    },
    {
      id: "outside-georgia",
      title: {
        en: "Driving outside Georgia",
        ka: "საქართველოს ფარგლებს გარეთ მგზავრობა",
        ru: "Выезд за пределы Грузии",
      },
      text: {
        en: "Not allowed.",
        ka: "დაშვებული არ არის.",
        ru: "Не разрешён.",
      },
    },
    {
      id: "traffic-fines",
      title: { en: "Traffic fines", ka: "საჯარიმო ქვითრები", ru: "Штрафы" },
      text: {
        en: "We pay fines first; you pay us back when you return the car.",
        ka: "ჯარიმას ჯერ ჩვენ ვიხდით, შენ კი თანხას მანქანის დაბრუნებისას გვიბრუნებ.",
        ru: "Сначала штраф оплачиваем мы, а вы возвращаете нам сумму при возврате автомобиля.",
      },
    },
    {
      id: "late-return",
      title: { en: "Late return", ka: "დაგვიანებით დაბრუნება", ru: "Поздний возврат" },
      text: undefined, // "Ask us" — the site shows "Contact us for details" + WhatsApp link
    },
    {
      id: "booking-payment",
      title: { en: "Booking payment", ka: "ჯავშნის საფასური", ru: "Оплата бронирования" },
      // TODO(owner): confirm wording — booking payment amount per car, non-refundable
      // on cancellation? Same as the deposit or extra? Until then: "Contact us for details".
      text: undefined,
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
      answer: {
        en: "Same-day booking is possible if the car is free. Still, the earlier you book, the better.",
        ka: "თუ მანქანა თავისუფალია, დაჯავშნა იმავე დღესაც შეიძლება. მაინც, რაც უფრო ადრე დაჯავშნი, მით უკეთესი.",
        ru: "Забронировать можно и в тот же день, если машина свободна. Но чем раньше, тем лучше.",
      },
    },
    {
      group: "booking",
      question: {
        en: "Can I change or cancel my booking?",
        ka: "შემიძლია ჯავშნის შეცვლა ან გაუქმება?",
        ru: "Можно ли изменить или отменить бронирование?",
      },
      // TODO(owner): confirm together with the booking payment term (refundable on cancellation?)
      answer: undefined,
    },
    {
      group: "payment",
      question: { en: "Is there a deposit?", ka: "არის დეპოზიტი?", ru: "Нужен ли депозит?" },
      answer: {
        en: "Yes. The deposit depends on the car — ask us. You pay it by card or cash, and we refund it {refundTime} after you return the car. It isn't part of the rental price.",
        ka: "დიახ. დეპოზიტი მანქანაზეა დამოკიდებული — გვკითხე. მას იხდი ბარათით ან ნაღდით და გიბრუნდება მანქანის დაბრუნებიდან {refundTime}. ის ქირის ფასში არ შედის.",
        ru: "Да. Размер депозита зависит от автомобиля — спросите нас. Он оплачивается картой или наличными и возвращается через {refundTime} после возврата машины. В стоимость аренды он не входит.",
      },
      ask: true,
    },
    {
      group: "payment",
      question: { en: "How do I pay for the rental?", ka: "როგორ გადავიხადო ქირა?", ru: "Как оплатить аренду?" },
      answer: {
        en: "The deposit is paid by card or cash. For rental payment details, ask us.",
        ka: "დეპოზიტი იხდება ბარათით ან ნაღდით. ქირის გადახდის დეტალებისთვის გვკითხე.",
        ru: "Депозит оплачивается картой или наличными. Детали оплаты аренды уточните у нас.",
      },
      ask: true,
    },
    {
      group: "payment",
      question: {
        en: "Is it cheaper to rent for longer?",
        ka: "უფრო დიდხანს ქირაობა უფრო იაფია?",
        ru: "Дешевле ли арендовать надолго?",
      },
      answer: {
        en: "Yes. The longer you rent, the lower the daily price — discounts depend on the car. Ask us for your price.",
        ka: "დიახ. რაც უფრო დიდხანს ქირაობ, მით უფრო დაბალია დღიური ფასი — ფასდაკლება მანქანაზეა დამოკიდებული. გვკითხე შენი ფასი.",
        ru: "Да. Чем дольше аренда, тем ниже цена за сутки — скидка зависит от автомобиля. Спросите нас о вашей цене.",
      },
      ask: true,
    },
    {
      group: "payment",
      question: {
        en: "Are the prices on the site final?",
        ka: "საიტზე მითითებული ფასები საბოლოოა?",
        ru: "Цены на сайте окончательные?",
      },
      answer: {
        en: "Prices are per day in US dollars. Amounts in GEL and EUR are approximate, converted at a fixed rate. The booking form shows an estimate at the normal daily price; longer rentals cost less per day, and we confirm the final price before you book.",
        ka: "ფასები მითითებულია დღეში, აშშ დოლარში. ლარსა და ევროში თანხები მიახლოებითია, გადაყვანილი ფიქსირებული კურსით. ჯავშნის ფორმა გაჩვენებს სავარაუდო ფასს ჩვეულებრივი დღიური ტარიფით; ხანგრძლივი ქირაობისას დღიური ფასი უფრო დაბალია, საბოლოო ფასს კი ჯავშნამდე დაგიდასტურებთ.",
        ru: "Цены указаны за сутки в долларах США. Суммы в лари и евро приблизительные — они пересчитаны по фиксированному курсу. Форма бронирования показывает примерную стоимость по обычному тарифу; при долгой аренде цена за сутки ниже, а итоговую цену мы подтвердим до бронирования.",
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
        en: "We deliver the car here: {deliveryRules}. Delivery to your hotel or home address is possible too — ask us.",
        ka: "მანქანას მოგაწვდით აქ: {deliveryRules}. შესაძლებელია სასტუმროსთან ან სახლთან მიყვანაც — გვკითხე.",
        ru: "Мы доставляем автомобиль сюда: {deliveryRules}. Можно и к вашему отелю или дому — спросите нас.",
      },
      ask: true,
    },
    {
      group: "delivery",
      question: {
        en: "Can you meet me at the airport?",
        ka: "დამხვდებით აეროპორტში?",
        ru: "Можете встретить меня в аэропорту?",
      },
      answer: {
        en: "Yes, at Tbilisi or Kutaisi Airport. Choose the airport as the pickup location and add your flight number to the booking form, so we can meet you on time.",
        ka: "დიახ, თბილისის ან ქუთაისის აეროპორტში. აყვანის ადგილად აირჩიე აეროპორტი და ჯავშნის ფორმაში მიუთითე რეისის ნომერი, რომ დროულად დაგხვდეთ.",
        ru: "Да, в аэропорту Тбилиси или Кутаиси. Выберите аэропорт местом получения и укажите номер рейса в форме бронирования — так мы встретим вас вовремя.",
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
        en: "Yes, it's possible. The fee depends on the location — ask us.",
        ka: "დიახ, შესაძლებელია. საფასური ადგილზეა დამოკიდებული — გვკითხე.",
        ru: "Да, это возможно. Стоимость зависит от места — спросите нас.",
      },
      ask: true,
    },
    {
      group: "requirements",
      question: {
        en: "How old do I need to be?",
        ka: "რა ასაკიდან შემიძლია მანქანის ქირაობა?",
        ru: "С какого возраста можно арендовать автомобиль?",
      },
      answer: {
        en: "Driver age and experience requirements depend on the car — ask us about the one you want.",
        ka: "მძღოლის ასაკისა და სტაჟის მოთხოვნები მანქანაზეა დამოკიდებული — გვკითხე იმ მანქანის შესახებ, რომელიც მოგწონს.",
        ru: "Требования к возрасту и стажу водителя зависят от автомобиля — спросите нас о машине, которая вам нравится.",
      },
      ask: true,
    },
    {
      group: "requirements",
      question: { en: "What documents do I need?", ka: "რა საბუთები მჭირდება?", ru: "Какие документы нужны?" },
      answer: {
        en: "An ID card and a driving licence.",
        ka: "პირადობის მოწმობა და მართვის მოწმობა.",
        ru: "Удостоверение личности и водительские права.",
      },
    },
    {
      group: "requirements",
      question: {
        en: "Can I drive the car outside Georgia?",
        ka: "შემიძლია მანქანით საქართველოს ფარგლებს გარეთ გასვლა?",
        ru: "Можно ли выезжать на автомобиле за пределы Грузии?",
      },
      answer: {
        en: "No, driving outside Georgia isn't allowed.",
        ka: "არა, საქართველოს ფარგლებს გარეთ გასვლა დაშვებული არ არის.",
        ru: "Нет, выезд за пределы Грузии не разрешён.",
      },
    },
    {
      group: "requirements",
      question: { en: "Is mileage unlimited?", ka: "გარბენი შეუზღუდავია?", ru: "Пробег безлимитный?" },
      answer: {
        en: "No. Planning long trips? Ask us — mileage depends on where you go.",
        ka: "არა. გეგმავ შორ მოგზაურობას? გვკითხე — გარბენი იმაზეა დამოკიდებული, სად მიდიხარ.",
        ru: "Нет. Планируете дальние поездки? Спросите нас — пробег зависит от маршрута.",
      },
      ask: true,
    },
    {
      group: "requirements",
      question: {
        en: "What if I get a traffic fine?",
        ka: "რა ხდება, თუ ჯარიმა დამეწერა?",
        ru: "Что, если я получу штраф?",
      },
      answer: {
        en: "We pay the fine first; you pay us back when you return the car.",
        ka: "ჯარიმას ჯერ ჩვენ ვიხდით, შენ კი თანხას მანქანის დაბრუნებისას გვიბრუნებ.",
        ru: "Сначала штраф оплачиваем мы, а вы возвращаете нам сумму при возврате автомобиля.",
      },
    },
  ],
  hero: {
    video: undefined, // TODO(owner): e.g. "/hero/garage.mp4" — short muted loop
    // Remove `image` to switch back to the built-in garage scene
    image: "/hero/hero-c8.jpg",
    imageSize: { width: 2750, height: 1536 },
    carStart: 0.44,
    carCenter: 0.6,
    car: "chevrolet-corvette-c8-stingray",
  },
  // TODO(owner): add real customer reviews. The home page shows a
  // "reviews coming soon" note while this list is empty. Example:
  // { name: "Anna", from: { en: "Germany", ka: "გერმანია", ru: "Германия" },
  //   text: { en: "...", ka: "...", ru: "..." }, rating: 5 },
  reviews: [],
};

import { cars, type Car } from "@/data/cars";
import { site } from "@/data/site";
import type { Locale } from "@/i18n/routing";
import { fleet } from "./fleet";
import { absoluteUrl, localePath } from "./seo";

const dayNames = { Mo: "Monday", Tu: "Tuesday", We: "Wednesday", Th: "Thursday", Fr: "Friday", Sa: "Saturday", Su: "Sunday" };

const driveConfig: Record<Car["specs"]["drive"], string> = {
  AWD: "https://schema.org/AllWheelDriveConfiguration",
  RWD: "https://schema.org/RearWheelDriveConfiguration",
  FWD: "https://schema.org/FrontWheelDriveConfiguration",
};

/** Translated car words for the page language (messages → car.*) */
export type CarLabels = {
  type: (car: Car) => string;
  colour: (car: Car) => string;
  fuel: (car: Car) => string;
  transmission: (car: Car) => string;
};

/**
 * schema.org AutoRental for the home page: the company, its contacts, hours,
 * delivery places and every car with its specs and daily price. Everything
 * comes from data/site.ts and data/cars.ts.
 */
export function autoRentalSchema(locale: Locale, description: string, labels: CarLabels) {
  const { contacts } = site;
  const home = absoluteUrl(localePath(locale, "/"));
  const sameAs = [contacts.instagram, contacts.facebook].filter(Boolean);

  return {
    "@context": "https://schema.org",
    "@type": "AutoRental",
    "@id": `${absoluteUrl("/")}#business`,
    name: site.name,
    url: home,
    description,
    logo: absoluteUrl("/icons/icon-512.png"),
    image: absoluteUrl(`/${locale}/og.png`),
    telephone: contacts.phone,
    email: contacts.email,
    address: {
      "@type": "PostalAddress",
      addressLocality: contacts.city[locale],
      addressCountry: "GE",
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: contacts.openingHours.days.map((d) => `https://schema.org/${dayNames[d]}`),
      opens: contacts.openingHours.opens,
      closes: contacts.openingHours.closes,
    },
    areaServed: site.cities.map((city) => ({ "@type": "Place", name: city.name[locale] })),
    priceRange: `$${fleet.minPrice}–$${fleet.maxPrice}`,
    contactPoint: {
      "@type": "ContactPoint",
      telephone: contacts.phone,
      email: contacts.email,
      contactType: "reservations",
      availableLanguage: ["English", "Georgian", "Russian"],
      hoursAvailable: {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: contacts.openingHours.days.map((d) => `https://schema.org/${dayNames[d]}`),
        opens: contacts.openingHours.opens,
        closes: contacts.openingHours.closes,
      },
    },
    makesOffer: cars.map((car) => ({
      "@type": "Offer",
      url: absoluteUrl(localePath(locale, `/cars/${car.slug}`)),
      itemOffered: {
        "@type": "Car",
        name: `${car.brand} ${car.model}`,
        description: car.description[locale],
        brand: { "@type": "Brand", name: car.brand },
        model: car.model,
        bodyType: labels.type(car),
        color: labels.colour(car),
        ...(car.year ? { vehicleModelDate: String(car.year) } : {}),
        vehicleTransmission: labels.transmission(car),
        fuelType: labels.fuel(car),
        driveWheelConfiguration: driveConfig[car.specs.drive],
        seatingCapacity: car.seats,
        vehicleEngine: {
          "@type": "EngineSpecification",
          name: car.specs.engine,
          enginePower: { "@type": "QuantitativeValue", value: car.specs.hp, unitCode: "BHP" },
        },
        accelerationTime: { "@type": "QuantitativeValue", value: car.specs.acceleration, unitCode: "SEC" },
        speed: { "@type": "QuantitativeValue", maxValue: car.specs.topSpeed, unitCode: "KMH" },
        image: absoluteUrl(car.photos[0]),
      },
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        price: car.pricePerDay,
        priceCurrency: site.baseCurrency,
        unitCode: "DAY",
      },
    })),
    ...(sameAs.length ? { sameAs } : {}),
  };
}

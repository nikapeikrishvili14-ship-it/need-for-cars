import { cars } from "@/data/cars";
import { site } from "@/data/site";
import type { Locale } from "@/i18n/routing";
import { fleet } from "./fleet";
import { absoluteUrl, localePath } from "./seo";

const dayNames = { Mo: "Monday", Tu: "Tuesday", We: "Wednesday", Th: "Thursday", Fr: "Friday", Sa: "Saturday", Su: "Sunday" };

/**
 * schema.org AutoRental for the home page: the company, its contacts, hours,
 * delivery cities and each car's daily price. Everything comes from
 * data/site.ts and data/cars.ts, so placeholder values there (TODO(owner))
 * show up here until the owner fills them in.
 */
export function autoRentalSchema(locale: Locale, description: string) {
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
      streetAddress: contacts.address[locale],
      addressCountry: "GE",
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: contacts.openingHours.days.map((d) => `https://schema.org/${dayNames[d]}`),
      opens: contacts.openingHours.opens,
      closes: contacts.openingHours.closes,
    },
    areaServed: site.cities.map((city) => ({ "@type": "City", name: city.name[locale] })),
    priceRange: `$${fleet.minPrice}–$${fleet.maxPrice}`,
    contactPoint: {
      "@type": "ContactPoint",
      telephone: contacts.phone,
      email: contacts.email,
      contactType: "reservations",
      availableLanguage: ["English", "Georgian", "Russian"],
    },
    makesOffer: cars.map((car) => ({
      "@type": "Offer",
      url: absoluteUrl(localePath(locale, `/cars/${car.slug}`)),
      itemOffered: {
        "@type": "Car",
        name: `${car.brand} ${car.model}`,
        brand: { "@type": "Brand", name: car.brand },
        model: car.model,
        vehicleModelDate: String(car.year),
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

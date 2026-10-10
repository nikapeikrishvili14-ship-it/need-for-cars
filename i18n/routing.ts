import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "ka", "ru"],
  defaultLocale: "en",
  // Every URL carries its locale (/en, /ka, /ru) — no middleware needed
  localePrefix: "always",
});

export type Locale = (typeof routing.locales)[number];

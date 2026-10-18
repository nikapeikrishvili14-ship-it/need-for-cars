@AGENTS.md

# Need for Cars — car rental website

## Business

Car rental company in Georgia (Tbilisi). Fleet: 10 cars — sports cars, grand tourers, luxury SUVs and a luxury sedan.
Customers: tourists and locals.

## Goal

Company info, car catalogue with photos and specs, strong visuals,
and forms that send inquiries to the owner. No online payment.

## Stack

- Next.js (App Router) + TypeScript + Tailwind
- Static export: output: 'export', images: { unoptimized: true }
- No backend, no database, no admin panel
- Forms via Web3Forms (key in .env.local as NEXT_PUBLIC_WEB3FORMS_KEY)
- Must build to /out and work on any static host (cPanel)

## Languages

- English (default), Georgian, Russian
- Routes: /en, /ka, /ru — root / redirects to /en
- No middleware (not supported in static export)
- All UI text in messages/en.json, ka.json, ru.json — never hardcode text in components
- Fonts must support Latin, Cyrillic AND Georgian

## Design direction

- Mood: night garage / street racing — premium, a little sporty, clean (not busy)
- Inspired by the feel of racing-game garages — do NOT copy any game's UI, logos, fonts or assets
- Colors: base #0B0B0D, surface #16161A, text #F5F5F5, muted #8A8A93, accent #FF5A1F
- Subtle glow on accent, motion used sparingly
- Fonts: headings Exo 2 Bold/Black Italic (Latin + Cyrillic) with Noto Sans Georgian Bold for Georgian;
  body Inter with Noto Sans Georgian for Georgian — load via next/font/google
- Logo: the site uses public/brand/logo-wordmark.png — white italic wordmark, transparent,
  cropped. It is cut from the original assets/brand/logo.png (2048×2048, black background,
  not deployed). Replace logo-wordmark.png when an official transparent logo is available
- Use the logo's forward slant as a design motif: slanted buttons, angled section edges
- Mobile-first, fast, readable

## Pages

- / — Home: hero, featured cars, why us, how renting works, delivery cities, reviews (placeholder), CTA
- /cars — Catalogue with filters (type, transmission, price, seats)
- /cars/[slug] — Gallery, specs, stat bars (HP, 0–100 km/h, top speed), price/day,
  age + experience requirements, "Book this car"
- /book — Booking form, car pre-filled, live price estimate
- /find-a-car — "Find me a car" request form
- /about — Company + rental terms
- /faq — FAQ
- /contact — Contact form, phone, WhatsApp, Google Maps, hours

## Pricing

- Base currency USD. Currency switch USD / GEL / EUR using FIXED rates in data/site.ts
  (converted prices marked "approx.")
- Estimate = days × price/day + delivery by place (free-delivery rules by rental length);
  hotel/home address and returns in another city are "ask us" (not in the total).
  Long-rental discounts depend on the car — shown as a note, estimate uses the normal price
- Deposit depends on the car ("ask us", no amounts), card or cash, refunded
  site.depositRefundDays after return — shown separately, not added to total
- All cars insured

## Forms

- Booking: name, phone/WhatsApp, email, car, pickup date, return date, pickup location,
  drop-off location, driver age, driving experience (years), flight number (optional), message
  (age/experience are info for the owner — requirements depend on the car, "ask us")
- Submit → email to owner via Web3Forms + "Send via WhatsApp" button
  (wa.me link with all details pre-typed)
- Spam protection: honeypot field
- No automatic reply to the customer

## Data

- data/cars.ts — all cars (EN/KA/RU text, specs, price, colour, optional year, photos)
- data/site.ts — contacts, delivery places + fees, currency rates, story, terms, FAQ
- Photos: public/cars/[slug]/1.webp, 2.webp ...
- Unknown info → placeholder marked with a comment: // TODO(owner): ...

## Rules

- Reusable components in components/
- No new libraries without asking me (exception: next-intl for translations)
- Work in small steps, explain what you changed
- Never put secrets in code — use .env.local
- Run npm run build before saying a step is done; fix all errors

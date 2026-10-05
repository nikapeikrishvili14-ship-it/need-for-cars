@AGENTS.md

# Need for Cars — car rental website

## Goal
Info about the company, car catalogue with photos, visuals,
and booking/inquiry forms that send to the owner.

## Stack
- Next.js (App Router) + TypeScript + Tailwind
- Static export (output: 'export') — will be hosted on cPanel
- Forms via Web3Forms (no backend)

## Pages
- / — Home
- /cars — Catalogue
- /cars/[slug] — Car page (gallery, specs, price, "Book this car")
- /book — Booking form (car pre-filled)
- /about — About + rental terms
- /contact — Phone, WhatsApp, map, hours

## Data
- All cars in data/cars.ts — car pages are generated from it
- Photos in public/cars/[slug]/ as .webp

## Rules
- Mobile-first
- Reusable components in components/
- No new libraries without asking me
- Make small changes and explain what you changed
- Never put API keys in code — use .env.local

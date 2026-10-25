import { existsSync } from "node:fs";
import { join } from "node:path";
import { preload } from "react-dom";
import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { cars, getCar } from "@/data/cars";
import { site } from "@/data/site";
import StudioBackdrop from "@/components/garage/StudioBackdrop";
import CarModel from "@/components/garage/CarModel";
import SlantLink from "@/components/SlantLink";
import Price from "@/components/Price";

// Three looks, chosen by site.hero in data/site.ts:
// - nothing set: the built-in "garage reveal" — the overhead lamp blinks on, the
//   featured car appears out of the dark and a light sweep crosses its body (CSS only)
// - image: the owner's photo with the car in the middle (PhotoHero)
// - video: a muted loop behind the text (HeroMedia)
//
// Garage scene, desktop: the hero fills the screen below the header. The car
// stands on the right with its tyres on the horizon (73% down); its width
// follows the screen height (--car-w) so the car and floor always fit on the
// first screen. --car-r lets it overhang the content column a little on very
// wide screens. Phones: text, then the car on its floor.
const desktopScene =
  "lg:h-[calc(100svh-4rem)] lg:min-h-[34rem] lg:max-h-[64rem] " +
  "lg:[--car-w:min(56vw,1000px,calc((100svh-4rem)*1.45))] " +
  "lg:[--car-r:max(2rem,calc((100vw-80rem)/2-8rem))]";

export default async function HomeHero() {
  const t = await getTranslations("home.hero");
  const tNav = await getTranslations("nav");
  const tPages = await getTranslations("pages.home");
  const car = cars.find((c) => c.featured) ?? cars[0];
  const { video, image } = site.hero;
  const hasMedia = Boolean(video || image);
  const georgian = (await getLocale()) === "ka";

  const subtitle = t("subtitle");
  const buttons = (
    <>
      <SlantLink href="/cars" variant="ghost" size="lg">
        {t("browse")}
      </SlantLink>
      <SlantLink href="/book" size="lg">
        {tNav("book")}
      </SlantLink>
    </>
  );

  if (image && !video) {
    const photoCar = site.hero.car ? getCar(site.hero.car) : undefined;
    const alt = photoCar ? `${photoCar.brand} ${photoCar.model}` : "";
    return (
      <PhotoHero src={image} alt={alt} title={tPages("title")} subtitle={subtitle} buttons={buttons} georgian={georgian} />
    );
  }

  // Georgian words run long — a smaller headline keeps it clear of the car
  const titleSize = georgian
    ? "text-[2.1rem] sm:text-5xl lg:text-[clamp(2.4rem,3.3vw,3.75rem)]"
    : "text-[2.75rem] sm:text-6xl lg:text-[clamp(3rem,4.2vw,4.75rem)]";

  return (
    <section className={`relative isolate overflow-hidden bg-night ${hasMedia ? "" : `pb-16 lg:pb-0 ${desktopScene}`}`}>
      {hasMedia ? (
        <HeroMedia video={video} image={image} />
      ) : (
        // Lamp centred over the car: on desktop that's right of centre
        <StudioBackdrop
          lampOn
          floor={false}
          className="lg:[--focus-x:calc(100%-var(--car-r)-var(--car-w)/2)]"
        />
      )}

      <div
        className={`relative mx-auto max-w-7xl px-4 pt-10 sm:pt-14 lg:px-8 lg:pt-[clamp(2rem,7svh,5rem)] ${
          hasMedia ? "flex min-h-[min(80svh,760px)] flex-col justify-center pb-16" : ""
        }`}
      >
        <div className="relative z-10 max-w-xl lg:max-w-136">
          <h1 className={`animate-rise leading-[0.95] font-black tracking-tight italic ${titleSize}`}>
            {tPages("title")}
          </h1>
          <p className="animate-rise mt-5 max-w-md text-base text-fg/75 sm:text-lg" style={{ animationDelay: "120ms" }}>
            {subtitle}
          </p>
          <div className="animate-rise mt-8 flex flex-wrap gap-3" style={{ animationDelay: "240ms" }}>
            {buttons}
          </div>
        </div>
      </div>

      {/* The featured car and its name + price label belong to the garage scene only */}
      {!hasMedia && (
        <div className="pointer-events-none relative mx-4 mt-10 sm:mx-auto sm:mt-6 sm:w-[86%] lg:absolute lg:right-(--car-r) lg:bottom-[27%] lg:mx-0 lg:mt-0 lg:w-(--car-w)">
          {/* The floor hangs off the car's own box (not this wrapper, which also
              holds the label on phones), so the horizon always meets the tyres */}
          <div className="relative">
            <div
              aria-hidden="true"
              className="studio-floor absolute top-[97%] right-[-100vw] left-[-100vw] h-[60vh] [--focus-x:50%]"
            />
            <CarModel
              car={car}
              sizes="(min-width: 1024px) 56vw, 100vw"
              preload
              sweepKey="hero"
              sweepDelay={1500}
              className="animate-car-reveal"
            />
          </div>
          <Link
            href={`/cars/${car.slug}`}
            className="animate-rise group pointer-events-auto relative z-10 mt-[6%] block w-fit lg:absolute lg:top-full lg:left-[6%] lg:mt-[5%]"
            style={{ animationDelay: "1.4s" }}
          >
            <span className="block text-xs text-muted">{car.brand}</span>
            <span className="block font-heading text-xl font-bold italic transition-colors group-hover:text-accent">
              {car.model}
            </span>
            <Price usd={car.pricePerDay} per="day" className="text-sm text-fg/80" />
          </Link>
        </div>
      )}

      {/* Fade the floor and reflection into the base tone, so the hero flows
          straight into the car selector with no visible seam */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-linear-to-t from-night to-transparent"
      />
    </section>
  );
}

/** WebP copies made for the hero photo: <name>-<width>.webp next to the original */
const WEBP_WIDTHS = [1280, 1920, 2750];

function webpSrcSet(src: string): string {
  const base = src.replace(/\.[a-z0-9]+$/i, "");
  return WEBP_WIDTHS.filter((w) => existsSync(join(process.cwd(), "public", `${base}-${w}.webp`)))
    .map((w) => `${base}-${w}.webp ${w}w`)
    .join(", ");
}

// How wide the photo is drawn, matching the layout below:
// phones crop the empty sides (5:4 box → photo ≈ 143% of the screen width),
// portrait tablets (4:3 box → ≈ 134%), small laptops a little (16:10 box → ≈ 112%),
// large screens show it whole.
const PHOTO_SIZES = "(min-width: 1280px) 100vw, (min-width: 1024px) 112vw, (min-width: 640px) 134vw, 143vw";

/**
 * object-position that puts the car (centre at `carCenter` of the photo's width)
 * in the middle of a box of shape `boxRatio`, as far as the cropped-off width allows.
 */
function focusOn(carCenter: number, photoRatio: number, boxRatio: number): string {
  const scale = photoRatio / boxRatio; // drawn photo width ÷ box width
  if (scale <= 1) return "50% 50%";
  const x = Math.min(1, Math.max(0, (carCenter * scale - 0.5) / (scale - 1)));
  return `${(x * 100).toFixed(1)}% 50%`;
}

/**
 * The owner's hero photo, car in the middle, lamp at the top.
 *
 * Large screens (xl): the hero takes the photo's own shape, up to one screen
 * tall, so the photo is never cropped: lamp and car always show. On very wide
 * screens it's centred and its dark edges melt into the base tone. The text
 * column ends where the car begins (site.hero.carStart), so it never covers it.
 *
 * Phones and tablets: the photo on top (only empty wall cropped from the
 * sides, the whole car visible), headline and buttons below it. Below lg the
 * photo shifts so the car (site.hero.carCenter) sits in the middle of the screen.
 */
function PhotoHero({
  src,
  alt,
  title,
  subtitle,
  buttons,
  georgian,
}: {
  src: string;
  /** Name of the fleet car in the photo (site.hero.car); empty = decorative */
  alt: string;
  title: string;
  subtitle: string;
  buttons: React.ReactNode;
  georgian: boolean;
}) {
  const { width, height } = site.hero.imageSize ?? { width: 16, height: 9 };
  const ratio = width / height;
  const carStart = site.hero.carStart ?? 0.3;
  const carCenter = site.hero.carCenter ?? 0.5;
  const srcSet = webpSrcSet(src);

  // First thing on screen: fetch it early, at high priority
  if (srcSet) {
    preload(`${src.replace(/\.[a-z0-9]+$/i, "")}-1920.webp`, {
      as: "image",
      type: "image/webp",
      imageSrcSet: srcSet,
      imageSizes: PHOTO_SIZES,
      fetchPriority: "high",
    });
  } else {
    preload(src, { as: "image", fetchPriority: "high" });
  }

  // Large-screen geometry: hero height, drawn photo width, where the car starts
  // on screen, and the text column that fits left of it
  const vars = {
    "--hero-h": `min(calc(100svh - 4rem), calc(100vw / ${ratio}))`,
    "--photo-w": `calc(var(--hero-h) * ${ratio})`,
    "--pad": "clamp(2rem, 4vw, 5rem)",
    "--car-x": `calc((100vw - var(--photo-w)) / 2 + var(--photo-w) * ${carStart})`,
    "--text-w": "calc(var(--car-x) - var(--pad) - 2.5rem)",
    // Phones (5:4 box) and portrait tablets (4:3 box): car centred
    "--pos-phone": focusOn(carCenter, ratio, 5 / 4),
    "--pos-tablet": focusOn(carCenter, ratio, 4 / 3),
  } as React.CSSProperties;

  const titleSize = georgian
    ? "text-[2rem] sm:text-[2.6rem] xl:text-[clamp(1.9rem,calc(var(--text-w)*0.1),3.4rem)]"
    : "text-[2.5rem] sm:text-5xl xl:text-[clamp(2.25rem,calc(var(--text-w)*0.14),4.5rem)]";

  return (
    <section style={vars} className="relative isolate overflow-hidden bg-night xl:h-(--hero-h)">
      {/* Tablets: at most 72svh tall (4:3 → 96svh wide, 16:10 → 115.2svh wide), so text still fits below.
          4:3 below lg leaves enough cropped width to centre a car that stands off-centre. */}
      <div className="relative mx-auto aspect-5/4 w-full sm:aspect-4/3 sm:max-w-[96svh] lg:aspect-16/10 lg:max-w-[115.2svh] xl:absolute xl:inset-y-0 xl:left-1/2 xl:aspect-auto xl:w-(--photo-w) xl:max-w-none xl:-translate-x-1/2">
        <picture>
          {srcSet && <source type="image/webp" srcSet={srcSet} sizes={PHOTO_SIZES} />}
          <img
            src={src}
            alt={alt}
            width={width}
            height={height}
            fetchPriority="high"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover object-(--pos-phone) sm:object-(--pos-tablet) lg:object-center"
          />
        </picture>
        {/* Edges melt into the base tone: floor at the bottom, walls at the sides */}
        <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-[14%] bg-linear-to-t from-night to-transparent" />
        <div aria-hidden="true" className="absolute inset-y-0 left-0 w-[5%] bg-linear-to-r from-night to-transparent" />
        <div aria-hidden="true" className="absolute inset-y-0 right-0 w-[5%] bg-linear-to-l from-night to-transparent" />
      </div>

      <div className="relative z-10 mx-auto -mt-4 max-w-2xl px-4 pb-14 sm:-mt-8 sm:px-8 xl:absolute xl:inset-y-0 xl:left-(--pad) xl:m-0 xl:flex xl:w-(--text-w) xl:max-w-none xl:flex-col xl:justify-center xl:p-0">
        <h1 className={`animate-rise leading-[0.98] font-black tracking-tight italic ${titleSize}`}>{title}</h1>
        <p className="animate-rise mt-5 max-w-md text-base text-fg/75 sm:text-lg xl:max-w-xl" style={{ animationDelay: "120ms" }}>
          {subtitle}
        </p>
        <div className="animate-rise mt-8 flex flex-wrap gap-3" style={{ animationDelay: "240ms" }}>
          {buttons}
        </div>
      </div>
    </section>
  );
}

/** Video background (site.hero.video); the image, if set, is its poster and reduced-motion fallback */
function HeroMedia({ video, image }: { video?: string; image?: string }) {
  return (
    <div aria-hidden="true" className="absolute inset-0 -z-10">
      {image && <Image src={image} alt="" fill preload sizes="100vw" className="object-cover" />}
      {video && (
        // Hidden for visitors who prefer reduced motion; the image shows instead
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={image}
          className="absolute inset-0 h-full w-full object-cover motion-reduce:hidden"
        >
          <source src={video} />
        </video>
      )}
      {/* Keep the headline readable over any video */}
      <div className="absolute inset-0 bg-linear-to-r from-night via-night/70 to-night/10" />
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-night to-transparent" />
    </div>
  );
}

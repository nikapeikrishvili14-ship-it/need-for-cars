import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { cars } from "@/data/cars";
import { site } from "@/data/site";
import StudioBackdrop from "@/components/garage/StudioBackdrop";
import CarModel from "@/components/garage/CarModel";
import SlantLink from "@/components/SlantLink";
import Price from "@/components/Price";

// "Garage reveal": the overhead lamp blinks on, the featured car appears out of
// the dark, and a light sweep crosses its body. All CSS, no JavaScript.
// When the owner sets site.hero.video or site.hero.image, that media replaces
// the built-in scene (see data/site.ts).
//
// Desktop: the hero fills the screen below the header. The car stands on the
// right with its tyres on the horizon (73% down); its width follows the screen
// height (--car-w) so the car and floor always fit on the first screen.
// --car-r lets it overhang the content column a little on very wide screens.
// Phones: text, then the car on its floor.
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
  // Georgian words run long — a smaller headline keeps it clear of the car
  const titleSize =
    (await getLocale()) === "ka"
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
            {t("subtitle")}
          </p>
          <div className="animate-rise mt-8 flex flex-wrap gap-3" style={{ animationDelay: "240ms" }}>
            <SlantLink href="/cars" variant="ghost" size="lg">
              {t("browse")}
            </SlantLink>
            <SlantLink href="/book" size="lg">
              {tNav("book")}
            </SlantLink>
          </div>
        </div>
      </div>

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
      {/* Keep the headline readable over any photo */}
      <div className="absolute inset-0 bg-linear-to-r from-night via-night/70 to-night/10" />
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-night to-transparent" />
    </div>
  );
}

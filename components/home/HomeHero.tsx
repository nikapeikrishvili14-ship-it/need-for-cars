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
export default async function HomeHero() {
  const t = await getTranslations("home.hero");
  const tNav = await getTranslations("nav");
  const tPages = await getTranslations("pages.home");
  const car = cars.find((c) => c.featured) ?? cars[0];
  // Georgian words run long — a smaller headline keeps the car in view on phones
  const titleSize =
    (await getLocale()) === "ka"
      ? "text-[2.1rem] sm:text-5xl lg:text-6xl xl:text-[4rem]"
      : "text-[2.75rem] sm:text-6xl lg:text-7xl xl:text-[5rem]";
  const { video, image } = site.hero;
  const hasMedia = Boolean(video || image);

  return (
    <section className="relative isolate overflow-hidden bg-night pb-[calc(var(--edge)+2rem)] lg:pb-[calc(var(--edge)+6.5rem)]">
      {hasMedia ? <HeroMedia video={video} image={image} /> : <StudioBackdrop lampOn floor={false} className="lg:[--focus-x:59%]" />}

      <div
        className={`relative mx-auto flex max-w-7xl flex-col px-4 pt-10 sm:pt-14 lg:px-8 lg:pt-16 ${
          hasMedia ? "min-h-[min(80svh,760px)] justify-center" : ""
        }`}
      >
        <div className="relative z-10 max-w-3xl lg:max-w-4xl">
          <h1 className={`animate-rise leading-[0.95] font-black tracking-tight italic ${titleSize}`}>
            {tPages("title")}
          </h1>
          <p className="animate-rise mt-5 max-w-xl text-base text-fg/75 sm:text-lg" style={{ animationDelay: "120ms" }}>
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

        {!hasMedia && (
          <div className="pointer-events-none relative mx-auto mt-10 w-full max-w-5xl sm:mt-6 lg:mr-0 lg:-mt-24 lg:w-[78%] lg:max-w-none">
            {/* Floor starts at the tyres, so it lines up whatever the screen size.
                On desktop the car sits right of centre, under the moved lamp. */}
            <div aria-hidden="true" className="studio-floor absolute top-[96%] right-[-50vw] left-[-50vw] h-[60vh] [--focus-x:50%]" />
            <CarModel
              car={car}
              sizes="(min-width: 1024px) 78vw, 100vw"
              preload
              sweepKey="hero"
              sweepDelay={1500}
              className="animate-car-reveal"
            />
            <Link
              href={`/cars/${car.slug}`}
              className="animate-rise group pointer-events-auto relative mt-[9%] ml-auto block w-fit text-right lg:absolute lg:top-full lg:right-0 lg:mt-3"
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
      </div>
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

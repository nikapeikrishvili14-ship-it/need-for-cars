import Image from "next/image";
import type { Car } from "@/data/cars";

type Props = {
  car: Car;
  sizes: string;
  /** Change this value to replay the light sweep; leave undefined for no sweep */
  sweepKey?: React.Key;
  sweepDelay?: number;
  preload?: boolean;
  reflection?: boolean;
  className?: string;
};

// A car standing on the studio floor with its mirror image below.
// Uses the transparent cut-out (car.stage) when there is one; otherwise falls
// back to the first photo, softly faded at the edges so it melts into the dark.
//
// Cut-outs are tightly cropped, so every car is drawn the full width of the
// 20:7 box with its tyres on the box bottom (the floor). Low cars end below
// the top of the box; taller ones (SUVs, up to ~8%) rise a little above it
// instead of being shrunk to fit, so all cars look the same length.
export default function CarModel({
  car,
  sizes,
  sweepKey,
  sweepDelay = 0,
  preload = false,
  reflection = true,
  className = "",
}: Props) {
  const cutout = car.stage;

  if (!cutout) {
    const src = car.photos[0].src;
    return (
      <div className={`relative aspect-video ${className}`}>
        <Image
          src={src}
          alt={`${car.brand} ${car.model}`}
          fill
          sizes={sizes}
          preload={preload}
          draggable={false}
          className="select-none object-cover photo-melt"
        />
        {reflection && (
          <div aria-hidden="true" className="car-reflection pointer-events-none absolute inset-x-0 top-full h-full">
            <Image src={src} alt="" fill sizes={sizes} draggable={false} className="object-cover photo-melt" />
          </div>
        )}
        {sweepKey !== undefined && <Sweep key={sweepKey} delay={sweepDelay} />}
      </div>
    );
  }

  // Nominal 20:7 size; the real proportions take over once the file loads
  const cutoutImage = (alt: string, extra?: Pick<Props, "preload">) => (
    <Image
      src={cutout}
      alt={alt}
      width={2000}
      height={700}
      sizes={sizes}
      draggable={false}
      className="block h-auto w-full select-none"
      {...extra}
    />
  );

  return (
    <div className={`relative aspect-20/7 ${className}`}>
      <span aria-hidden="true" className="contact-shadow absolute inset-x-[4%] bottom-[-2%] h-[9%]" />
      <div className="absolute inset-x-0 bottom-0">
        {cutoutImage(`${car.brand} ${car.model}`, { preload })}
        {/* Masking the sweep with the cut-out itself means only the car's body
            catches the light, not the empty space around it */}
        {sweepKey !== undefined && (
          <Sweep
            key={sweepKey}
            delay={sweepDelay}
            style={{
              maskImage: `url("${cutout}")`,
              maskSize: "100% 100%",
              maskRepeat: "no-repeat",
            }}
          />
        )}
      </div>

      {reflection && (
        <div aria-hidden="true" className="car-reflection pointer-events-none absolute inset-x-0 top-full h-full">
          <div className="absolute inset-x-0 bottom-0">{cutoutImage("")}</div>
        </div>
      )}
    </div>
  );
}

function Sweep({ delay, style }: { delay: number; style?: React.CSSProperties }) {
  return (
    <span
      aria-hidden="true"
      className="light-sweep absolute inset-0"
      style={{ animationDelay: `${delay}ms`, ...style }}
    />
  );
}

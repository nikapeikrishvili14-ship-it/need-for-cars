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
  const src = cutout ?? car.photos[0];
  const fit = cutout ? "object-contain object-bottom" : "object-cover photo-melt";

  // Masking the sweep with the cut-out itself means only the car's body
  // catches the light, not the empty space around it.
  const sweepMask: React.CSSProperties = cutout
    ? {
        maskImage: `url("${src}")`,
        maskSize: "contain",
        maskPosition: "center bottom",
        maskRepeat: "no-repeat",
      }
    : {};

  return (
    <div className={`relative ${cutout ? "aspect-20/7" : "aspect-video"} ${className}`}>
      {cutout && (
        <span aria-hidden="true" className="contact-shadow absolute inset-x-[4%] bottom-[-2%] h-[9%]" />
      )}
      <Image
        src={src}
        alt={`${car.brand} ${car.model}`}
        fill
        sizes={sizes}
        preload={preload}
        draggable={false}
        className={`select-none ${fit}`}
      />

      {reflection && (
        <div aria-hidden="true" className="car-reflection pointer-events-none absolute inset-x-0 top-full h-full">
          <Image src={src} alt="" fill sizes={sizes} draggable={false} className={fit} />
        </div>
      )}

      {sweepKey !== undefined && (
        <span
          key={sweepKey}
          aria-hidden="true"
          className="light-sweep absolute inset-0"
          style={{ animationDelay: `${sweepDelay}ms`, ...sweepMask }}
        />
      )}
    </div>
  );
}

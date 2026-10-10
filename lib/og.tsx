import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { getTranslations } from "next-intl/server";
import { cars, type Car } from "@/data/cars";
import type { Locale } from "@/i18n/routing";
import { formatDecimal, formatMoney } from "./money";
import { canDraw } from "./seo";

// Sharing previews (Open Graph / Twitter), drawn at build time into
// /[locale]/og.png and /[locale]/cars/[slug]/og.png. Same garage mood as the
// site: overhead lamp, glossy floor, the car under the light.
// Fonts are TTF copies in assets/og/ (the renderer can't read woff2). They are
// only used at build time and never sent to visitors.

export const ogSize = { width: 1200, height: 630 };

const c = {
  night: "#0B0B0D",
  surface: "#16161A",
  fg: "#F5F5F5",
  muted: "#8A8A93",
  accent: "#FF5A1F",
  line: "#26262C",
};

/** Floor line, px from the top */
const HORIZON = 468;
/** Car / lamp centre, px from the left */
const STAGE_X = 850;

const mime: Record<string, string> = { png: "image/png", jpg: "image/jpeg", jpeg: "image/jpeg", svg: "image/svg+xml" };

async function dataUri(publicPath: string): Promise<string> {
  const ext = publicPath.split(".").pop()!.toLowerCase();
  const file = await readFile(join(process.cwd(), "public", publicPath));
  return `data:${mime[ext]};base64,${file.toString("base64")}`;
}

type Font = { name: string; data: Buffer; weight: 600 | 900; style: "normal" | "italic" };
let fonts: Promise<Font[]> | undefined;

// Latin + Cyrillic from Exo 2; Georgian glyphs fall back to Noto Sans Georgian
// (registered under the same weights; it stays upright, as on the site).
function loadFonts() {
  const font = (file: string, name: string, weight: Font["weight"], style: Font["style"]) =>
    readFile(join(process.cwd(), "assets/og", file)).then((data): Font => ({ name, data, weight, style }));
  fonts ??= Promise.all([
    font("Exo2-BlackItalic.ttf", "Exo 2", 900, "italic"),
    font("Exo2-SemiBold.ttf", "Exo 2", 600, "normal"),
    font("NotoSansGeorgian-Bold.ttf", "Noto Sans Georgian", 900, "italic"),
    font("NotoSansGeorgian-Medium.ttf", "Noto Sans Georgian", 600, "normal"),
  ]);
  return fonts;
}

const fontFamily = '"Exo 2", "Noto Sans Georgian"';

async function render(node: React.ReactElement) {
  return new ImageResponse(node, { ...ogSize, fonts: await loadFonts() });
}

/** Garage backdrop + logo; children fill the left column */
function Garage({ logo, children, car }: { logo: string; children: React.ReactNode; car?: React.ReactNode }) {
  return (
    <div style={{ display: "flex", width: "100%", height: "100%", position: "relative", background: c.night, fontFamily, color: c.fg }}>
      {/* Lamp light from above the car */}
      <div
        style={{
          position: "absolute",
          top: -40,
          left: STAGE_X - 460,
          width: 920,
          height: 620,
          backgroundImage: "radial-gradient(ellipse at 50% 0%, rgba(255,255,255,0.17), rgba(255,255,255,0.05) 45%, rgba(255,255,255,0) 70%)",
        }}
      />
      {/* Lamp strip */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: STAGE_X - 110,
          width: 220,
          height: 6,
          background: "rgba(255,255,255,0.85)",
          boxShadow: "0 0 40px 10px rgba(255,255,255,0.25)",
        }}
      />
      {/* Cool rim light on the horizon */}
      <div
        style={{
          position: "absolute",
          top: HORIZON - 190,
          left: STAGE_X - 420,
          width: 840,
          height: 300,
          backgroundImage: "radial-gradient(ellipse at 50% 60%, rgba(59,167,255,0.2), rgba(59,167,255,0) 70%)",
        }}
      />
      {/* Glossy floor */}
      <div
        style={{
          position: "absolute",
          top: HORIZON,
          left: 0,
          width: 1200,
          height: 630 - HORIZON,
          backgroundImage: `linear-gradient(to bottom, #131317, ${c.night})`,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: HORIZON,
          left: 0,
          width: 1200,
          height: 2,
          backgroundImage: "linear-gradient(to right, rgba(255,255,255,0) 48%, rgba(255,255,255,0.22) 71%, rgba(255,255,255,0) 100%)",
        }}
      />

      {car}

      {/* Accent stripe on the left edge, slanted like the logo */}
      <div style={{ position: "absolute", top: 0, left: -24, width: 40, height: 630, background: c.accent, transform: "skewX(-12deg)" }} />

      <div style={{ position: "absolute", top: 56, left: 76, bottom: 56, width: 560, display: "flex", flexDirection: "column" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logo} width={230} height={85} alt="" />
        {children}
      </div>
    </div>
  );
}

/** The car's cut-out standing on the floor, with a faded reflection */
function StagedCar({ src }: { src: string }) {
  const w = 660;
  const h = (w * 7) / 20; // stage images are 20:7 (components/garage/CarModel.tsx)
  const top = HORIZON - h + 10;
  const left = STAGE_X - w / 2;
  return (
    <>
      <div
        style={{
          position: "absolute",
          top: HORIZON - 6,
          left: left + 30,
          width: w - 60,
          height: 26,
          backgroundImage: "radial-gradient(closest-side, rgba(0,0,0,0.85), rgba(0,0,0,0))",
        }}
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} width={w} height={h} alt="" style={{ position: "absolute", top, left, objectFit: "contain", objectPosition: "bottom" }} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        width={w}
        height={h}
        alt=""
        style={{ position: "absolute", top: HORIZON + 10, left, objectFit: "contain", objectPosition: "bottom", transform: "scaleY(-1)", opacity: 0.16 }}
      />
      <div
        style={{
          position: "absolute",
          top: HORIZON + 2,
          left: 0,
          width: 1200,
          height: 630 - HORIZON,
          backgroundImage: `linear-gradient(to bottom, rgba(11,11,13,0.2), ${c.night} 75%)`,
        }}
      />
    </>
  );
}

/** A regular photo (no cut-out) on the right, melting into the dark */
function PhotoPanel({ src }: { src: string }) {
  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} width={700} height={630} alt="" style={{ position: "absolute", top: 0, right: 0, objectFit: "cover" }} />
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: 700,
          height: 630,
          backgroundImage: `linear-gradient(to right, ${c.night}, rgba(11,11,13,0.35) 45%, rgba(11,11,13,0) 100%)`,
        }}
      />
    </>
  );
}

function AccentBar() {
  return (
    <div
      style={{
        width: 96,
        height: 8,
        marginTop: 26,
        background: c.accent,
        transform: "skewX(-12deg)",
      }}
    />
  );
}

/** Car image for the card: the cut-out if it can be drawn, else the cover photo */
async function carVisual(car: Car | undefined) {
  if (!car) return undefined;
  if (canDraw(car.stage)) return <StagedCar src={await dataUri(car.stage)} />;
  if (canDraw(car.photos[0])) return <PhotoPanel src={await dataUri(car.photos[0])} />;
  return undefined;
}

/** Site-wide preview for one language: logo, headline, tagline, featured car */
export async function siteCard(locale: Locale) {
  const t = await getTranslations({ locale, namespace: "meta" });
  const featured = cars.find((car) => car.featured) ?? cars[0];
  const georgian = locale === "ka";

  return render(
    <Garage logo={await dataUri("/brand/logo-wordmark.png")} car={await carVisual(featured)}>
      <div style={{ display: "flex", flexDirection: "column", marginTop: "auto", marginBottom: 40 }}>
        <div
          style={{
            fontSize: georgian ? 46 : 64,
            lineHeight: georgian ? 1.25 : 1.02,
            fontWeight: 900,
            fontStyle: "italic",
            letterSpacing: georgian ? 0 : -1,
          }}
        >
          {t("ogHeadline")}
        </div>
        <AccentBar />
        <div style={{ marginTop: 26, fontSize: georgian ? 24 : 28, fontWeight: 600, color: c.muted }}>{t("ogTagline")}</div>
      </div>
    </Garage>,
  );
}

/** Car page preview: the car under the lamp, name, price per day and key numbers */
export async function carCard(locale: Locale, car: Car) {
  const t = await getTranslations({ locale, namespace: "car" });
  const tPrice = await getTranslations({ locale, namespace: "price" });
  const georgian = locale === "ka";
  const stats = [
    t("units.hp", { value: car.specs.hp }),
    `0–100 ${t("units.seconds", { value: formatDecimal(car.specs.acceleration, locale) })}`,
    t("units.kmh", { value: car.specs.topSpeed }),
  ];

  return render(
    <Garage logo={await dataUri("/brand/logo-wordmark.png")} car={await carVisual(car)}>
      <div style={{ display: "flex", flexDirection: "column", marginTop: "auto", marginBottom: 24 }}>
        <div style={{ display: "flex" }}>
          <div
            style={{
              display: "flex",
              padding: "6px 16px",
              background: "rgba(255,90,31,0.14)",
              color: c.accent,
              fontSize: georgian ? 18 : 20,
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: 1,
              transform: "skewX(-12deg)",
            }}
          >
            {t(`types.${car.type}`)}
          </div>
        </div>
        <div style={{ marginTop: 22, fontSize: 26, fontWeight: 600, color: c.muted, textTransform: "uppercase", letterSpacing: 4 }}>
          {car.brand}
        </div>
        <div style={{ fontSize: 76, lineHeight: 1, fontWeight: 900, fontStyle: "italic", letterSpacing: -1 }}>{car.model}</div>
        <AccentBar />
        <div style={{ display: "flex", alignItems: "baseline", marginTop: 24 }}>
          <span style={{ fontSize: 46, fontWeight: 900, fontStyle: "italic", color: c.fg }}>
            {formatMoney(car.pricePerDay, "USD", locale)}
          </span>
          <span style={{ marginLeft: 10, fontSize: 24, fontWeight: 600, color: c.muted }}>{tPrice("perDay")}</span>
        </div>
        <div style={{ display: "flex", marginTop: 22 }}>
          {stats.map((stat) => (
            <div
              key={stat}
              style={{
                display: "flex",
                marginRight: 12,
                padding: "8px 14px",
                border: `1px solid ${c.line}`,
                background: "rgba(22,22,26,0.85)",
                fontSize: 20,
                fontWeight: 600,
                color: c.fg,
              }}
            >
              {stat}
            </div>
          ))}
        </div>
      </div>
    </Garage>,
  );
}

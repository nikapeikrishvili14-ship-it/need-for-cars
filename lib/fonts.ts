import { Exo_2, Inter, Noto_Sans_Georgian } from "next/font/google";

// Headings — Latin + Cyrillic. Variable font covers Bold (700) and Black (900).
export const exo2 = Exo_2({
  subsets: ["latin", "cyrillic"],
  style: ["normal", "italic"],
  variable: "--font-exo2",
  display: "swap",
});

// Body — Latin + Cyrillic
export const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
  display: "swap",
});

// Georgian for both headings and body. It sits after Exo 2 / Inter in the
// font stacks, so the browser uses it only for Georgian glyphs.
// Its unicode-range means EN/RU visitors never download it, so no preload.
export const notoGeorgian = Noto_Sans_Georgian({
  subsets: ["georgian"],
  variable: "--font-georgian",
  display: "swap",
  preload: false,
});

export const fontVariables = `${exo2.variable} ${inter.variable} ${notoGeorgian.variable}`;

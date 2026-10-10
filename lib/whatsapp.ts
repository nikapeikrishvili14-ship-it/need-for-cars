import { site } from "@/data/site";

/** wa.me link to the owner's WhatsApp, optionally with a pre-typed message */
export function whatsappUrl(text?: string): string {
  const base = `https://wa.me/${site.contacts.whatsapp}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}

/** "Label: value" lines, skipping empty values */
export function toLines(rows: [label: string, value: string | number | undefined][]): string {
  return rows
    .filter(([, value]) => value !== undefined && String(value).trim() !== "")
    .map(([label, value]) => `${label}: ${value}`)
    .join("\n");
}

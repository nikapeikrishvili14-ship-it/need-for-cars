import { getTranslations } from "next-intl/server";
import { whatsappUrl } from "@/lib/whatsapp";
import WhatsAppIcon from "./WhatsAppIcon";

// Stand-in for an answer or rule the owner hasn't confirmed yet:
// "Contact us for details" + a WhatsApp link with the question pre-typed.
export default async function AskUs({ topic }: { topic: string }) {
  const t = await getTranslations("askUs");

  return (
    <p className="flex flex-wrap items-center gap-x-4 gap-y-1">
      <span className="text-muted">{t("text")}</span>
      <a
        href={whatsappUrl(t("message", { topic }))}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 font-semibold text-accent hover:underline"
      >
        <WhatsAppIcon size={16} />
        {t("link")}
      </a>
    </p>
  );
}

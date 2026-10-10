import { getTranslations } from "next-intl/server";
import { whatsappUrl } from "@/lib/whatsapp";
import WhatsAppIcon from "./WhatsAppIcon";

export default async function WhatsAppButton() {
  const t = await getTranslations("whatsapp");

  return (
    <a
      href={whatsappUrl()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t("label")}
      title={t("label")}
      className="fixed right-4 bottom-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-black/40 transition-transform hover:scale-105 sm:right-6 sm:bottom-6"
    >
      <WhatsAppIcon size={30} />
    </a>
  );
}

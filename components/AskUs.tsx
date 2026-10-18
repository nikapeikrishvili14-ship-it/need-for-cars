import { useTranslations } from "next-intl";
import { whatsappUrl } from "@/lib/whatsapp";
import WhatsAppIcon from "./WhatsAppIcon";

/** "Ask on WhatsApp" link with the question about `topic` pre-typed */
export function AskLink({ topic, className = "" }: { topic: string; className?: string }) {
  const t = useTranslations("askUs");

  return (
    <a
      href={whatsappUrl(t("message", { topic }))}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-1.5 font-semibold text-accent hover:underline ${className}`}
    >
      <WhatsAppIcon size={16} />
      {t("link")}
    </a>
  );
}

// Stand-in for an answer or rule the owner hasn't confirmed yet, or one whose
// answer is "ask us": a short line (default "Contact us for details") + a
// WhatsApp link with the question pre-typed. Works in server and client components.
export default function AskUs({ topic, children }: { topic: string; children?: React.ReactNode }) {
  const t = useTranslations("askUs");

  return (
    <p className="flex flex-wrap items-center gap-x-4 gap-y-1">
      <span className={children ? "" : "text-muted"}>{children ?? t("text")}</span>
      <AskLink topic={topic} />
    </p>
  );
}

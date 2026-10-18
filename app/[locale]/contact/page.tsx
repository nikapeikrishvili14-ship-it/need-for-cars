import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { site } from "@/data/site";
import { whatsappUrl } from "@/lib/whatsapp";
import { staticPageMetadata } from "@/lib/seo";
import PageTitle from "@/components/PageTitle";
import ContactForm from "@/components/ContactForm";
import WhatsAppIcon from "@/components/WhatsAppIcon";

export async function generateMetadata({ params }: PageProps<"/[locale]/contact">): Promise<Metadata> {
  const { locale } = await params;
  return staticPageMetadata(locale, "/contact");
}

export default async function ContactPage({ params }: PageProps<"/[locale]/contact">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();
  const { contacts } = site;
  const lang = locale as Locale;

  const items = [
    {
      label: t("contact.phone"),
      value: contacts.phone,
      href: `tel:${contacts.phone.replace(/\s/g, "")}`,
    },
    { label: t("contact.email"), value: contacts.email, href: `mailto:${contacts.email}` },
    { label: t("contact.hours"), value: contacts.hours[lang] },
    { label: t("contact.address"), value: contacts.address[lang] },
  ];

  return (
    <>
      <PageTitle intro={t("contact.intro")}>{t("pages.contact.title")}</PageTitle>

      <div className="mx-auto grid max-w-7xl gap-8 px-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] lg:gap-12 lg:px-8">
        <div className="space-y-6">
          <a
            href={whatsappUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="slant flex items-center justify-center bg-[#25D366] py-3.5 font-semibold text-night transition-shadow hover:shadow-[0_0_24px_-4px_rgb(37_211_102/0.6)]"
          >
            <span className="unslant flex items-center gap-2">
              <WhatsAppIcon size={22} />
              {t("contact.whatsappAction")}
            </span>
          </a>

          <dl className="divide-y divide-line border border-line bg-surface">
            {items.map((item) => (
              <div key={item.label} className="px-5 py-4">
                <dt className="text-xs font-semibold tracking-widest text-muted uppercase">{item.label}</dt>
                <dd className="mt-1 text-lg">
                  {item.href ? (
                    <a href={item.href} className="transition-colors hover:text-accent">
                      {item.value}
                    </a>
                  ) : (
                    item.value
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <section aria-labelledby="contact-form-title" className="border border-line bg-surface p-5 sm:p-8">
          <h2 id="contact-form-title" className="mb-6 text-2xl font-black italic">
            {t("contact.formTitle")}
          </h2>
          <ContactForm />
        </section>
      </div>

      <div className="mx-auto mt-12 max-w-7xl px-4 lg:px-8">
        {/* Tbilisi city map (no exact address) — data/site.ts → contacts.mapEmbedUrl */}
        <iframe
          src={contacts.mapEmbedUrl}
          title={t("contact.mapTitle")}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="edge-angled h-80 w-full border border-line grayscale-[0.6] invert-[0.9] hue-rotate-180 sm:h-96"
        />
      </div>
    </>
  );
}

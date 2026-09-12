"use client";

import { MarketingShell, PageHero } from "@/components/marketing-shell";
import { ContactLeadForm } from "@/components/contact-lead-form";
import { useLocale } from "@/lib/locale";
import { t } from "@/lib/i18n";
import { whatsappHref } from "@/lib/contact";
import { useHome } from "@/lib/use-site";

export default function ContactView() {
  const { locale } = useLocale();
  const home = useHome();
  const email = home?.email ?? "info@ranzglobal.com";
  const city = home ? t(locale, home.cityTr, home.cityEn) : t(locale, "İstanbul, Türkiye", "Istanbul, Turkey");
  return (
    <MarketingShell>
      <PageHero
        eyebrow={t(locale, "İletişim", "Contact")}
        title={t(locale, "Danışmanınızla konuşun", "Talk to an advisor")}
        lead={t(locale, "Adınızı, telefonunuzu ve mesajınızı bırakın.", "Leave your name, phone and message.")}
      />
      <section className="mx-auto grid max-w-6xl gap-10 px-5 py-14 md:grid-cols-[1fr_0.9fr]">
        <div className="rounded-2xl border border-line bg-paper p-8">
          <h2 className="font-serif text-2xl">{t(locale, "İletişim formu", "Contact form")}</h2>
          <div className="mt-6">
            <ContactLeadForm source="/iletisim" />
          </div>
        </div>
        <div className="space-y-4">
          <article className="rounded-2xl border border-line bg-paper p-6">
            <h2 className="font-serif text-2xl">E-posta</h2>
            <a href={`mailto:${email}`} className="mt-3 block text-sm text-gold-deep">
              {email}
            </a>
          </article>
          {home?.phone && (
            <article className="rounded-2xl border border-line bg-paper p-6">
              <h2 className="font-serif text-2xl">{t(locale, "Telefon", "Phone")}</h2>
              <p className="mt-3 text-sm text-ink-soft">{home.phone}</p>
            </article>
          )}
          <article className="rounded-2xl border border-line bg-paper p-6">
            <h2 className="font-serif text-2xl">WhatsApp</h2>
            <a href={whatsappHref(locale)} target="_blank" rel="noopener noreferrer" className="mt-3 block text-sm text-gold-deep">
              {t(locale, "Sohbeti aç", "Open chat")}
            </a>
          </article>
          <article className="rounded-2xl border border-line bg-paper p-6">
            <h2 className="font-serif text-2xl">{t(locale, "Ofis", "Office")}</h2>
            <p className="mt-3 text-sm text-ink-soft">{city}</p>
          </article>
        </div>
      </section>
    </MarketingShell>
  );
}

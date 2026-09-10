"use client";

import Link from "next/link";
import { MarketingShell, PageHero } from "@/components/marketing-shell";
import { useLocale } from "@/lib/locale";
import { t } from "@/lib/i18n";
import { SITE } from "@/lib/cms";
import { whatsappHref } from "@/lib/contact";

export default function ContactView() {
  const { locale } = useLocale();
  return (
    <MarketingShell>
      <PageHero
        eyebrow={t(locale, "İletişim", "Contact")}
        title={t(locale, "Danışmanınızla konuşun", "Talk to an advisor")}
        lead={t(locale, "Görüşme talebi bırakın veya WhatsApp’tan yazın.", "Leave a meeting request or write on WhatsApp.")}
      />
      <section className="mx-auto grid max-w-6xl gap-6 px-5 py-14 md:grid-cols-3">
        <article className="rounded-2xl border border-line bg-paper p-6">
          <h2 className="font-serif text-2xl">E-posta</h2>
          <a href={`mailto:${SITE.email}`} className="mt-3 block text-sm text-gold-deep">
            {SITE.email}
          </a>
        </article>
        <article className="rounded-2xl border border-line bg-paper p-6">
          <h2 className="font-serif text-2xl">WhatsApp</h2>
          <a href={whatsappHref(locale)} target="_blank" rel="noopener noreferrer" className="mt-3 block text-sm text-gold-deep">
            {t(locale, "Sohbeti aç", "Open chat")}
          </a>
        </article>
        <article className="rounded-2xl border border-line bg-paper p-6">
          <h2 className="font-serif text-2xl">{t(locale, "Ofis", "Office")}</h2>
          <p className="mt-3 text-sm text-ink-soft">{t(locale, SITE.cityTr, SITE.cityEn)}</p>
        </article>
      </section>
      <section className="mx-auto max-w-6xl px-5 pb-16">
        <Link href="/randevu" className="inline-flex rounded-full bg-ink px-6 py-3 text-sm text-cream">
          {t(locale, "Görüşme talebi", "Request a meeting")}
        </Link>
      </section>
    </MarketingShell>
  );
}

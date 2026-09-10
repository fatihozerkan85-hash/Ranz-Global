"use client";

import Link from "next/link";
import { MarketingShell, PageHero } from "@/components/marketing-shell";
import { useLocale } from "@/lib/locale";
import { t } from "@/lib/i18n";
import { VISA_TYPES } from "@/lib/visa-catalog";

export default function ServicesView() {
  const { locale } = useLocale();
  return (
    <MarketingShell>
      <PageHero
        eyebrow={t(locale, "Travel & Visa", "Travel & Visa")}
        title={t(locale, "Vize danışmanlığı hizmetleri", "Visa consultancy services")}
        lead={t(
          locale,
          "Önce yön, sonra evrak listesi. Konsolosluk formu burada yok; dosyanız panelde ilerler.",
          "Destination first, then a document list. No consular form dump; your file moves in the portal.",
        )}
      />
      <section className="mx-auto grid max-w-6xl gap-4 px-5 py-14 md:grid-cols-2">
        {VISA_TYPES.map((type) => (
          <article key={type.id} className="rounded-2xl border border-line bg-paper p-7">
            <p className="text-xs uppercase tracking-[0.22em] text-gold-deep">
              {type.family === "europe" ? t(locale, "Avrupa", "Europe") : t(locale, "Amerika", "United States")}
            </p>
            <h2 className="mt-3 font-serif text-2xl">{locale === "en" ? type.titleEn : type.titleTr}</h2>
            <p className="mt-2 text-sm text-ink-soft">{locale === "en" ? type.titleHintEn : type.hintTr}</p>
            <p className="mt-4 text-sm text-muted">
              {t(locale, "Danışmanlık bedeli", "Service fee")} · {type.feeTry.toLocaleString("tr-TR")} TL
            </p>
          </article>
        ))}
      </section>
      <section className="mx-auto max-w-6xl px-5 pb-16">
        <Link href="/kayit" className="inline-flex rounded-full bg-ink px-6 py-3 text-sm text-cream">
          {t(locale, "Dosya açın", "Open a file")}
        </Link>
      </section>
    </MarketingShell>
  );
}

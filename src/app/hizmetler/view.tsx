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
          "Ülkeyi seçin, o ülkeye özel evrak listesi panelde açılsın.",
          "Choose a country and its document list opens in the portal.",
        )}
      />
      <section className="mx-auto grid max-w-6xl gap-4 px-5 py-14 md:grid-cols-2">
        {VISA_TYPES.map((type) => (
          <article key={type.id} className="rounded-2xl border border-line bg-paper p-7">
            <h2 className="font-serif text-2xl">{locale === "en" ? type.titleEn : type.titleTr}</h2>
            <p className="mt-2 text-sm text-ink-soft">{locale === "en" ? type.titleHintEn : type.hintTr}</p>
            <p className="mt-3 text-xs text-muted">
              {type.documents.filter((d) => d.required).length} {t(locale, "zorunlu evrak", "required documents")}
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

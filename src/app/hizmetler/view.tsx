"use client";

import Link from "next/link";
import { MarketingShell, PageHero } from "@/components/marketing-shell";
import { useLocale } from "@/lib/locale";
import { t } from "@/lib/i18n";
import { usePages } from "@/lib/use-site";
import { VISA_TYPES } from "@/lib/visa-catalog";

export default function ServicesView() {
  const { locale } = useLocale();
  const page = usePages().find((p) => p.slug === "hizmetler" && p.status === "published");
  return (
    <MarketingShell>
      <PageHero
        eyebrow={t(locale, "Travel & Visa", "Travel & Visa")}
        title={page ? t(locale, page.titleTr, page.titleEn) : t(locale, "Vize danışmanlığı hizmetleri", "Visa consultancy services")}
        lead={
          page
            ? t(locale, page.descriptionTr, page.descriptionEn)
            : t(locale, "Ülkeyi seçin, o ülkeye özel evrak listesi panelde açılsın.", "Choose a country and its document list opens in the portal.")
        }
      />
      {page?.bodyTr && (
        <section className="mx-auto max-w-6xl px-5 pt-10 text-sm leading-7 text-ink-soft whitespace-pre-line">
          {t(locale, page.bodyTr, page.bodyEn)}
        </section>
      )}
      <section className="mx-auto grid max-w-6xl gap-4 px-5 py-14 md:grid-cols-2">
        {VISA_TYPES.map((type) => (
          <article key={type.id} className="rounded-2xl border border-line bg-paper p-7">
            <h2 className="font-serif text-2xl">{t(locale, type.titleTr, type.titleEn)}</h2>
            <p className="mt-2 text-sm text-ink-soft">{t(locale, type.hintTr, type.titleHintEn)}</p>
            <p className="mt-3 text-xs text-muted">
              {type.documents.filter((d) => d.required).length} {t(locale, "zorunlu evrak", "required documents")}
            </p>
          </article>
        ))}
      </section>
      <section className="mx-auto max-w-6xl px-5 pb-16">
        <Link href="/kayit" className="btn">
          {t(locale, "Dosya açın", "Open a file")}
        </Link>
      </section>
    </MarketingShell>
  );
}

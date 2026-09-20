"use client";

import Link from "next/link";
import { MarketingShell, PageHero } from "@/components/marketing-shell";
import { useLocale } from "@/lib/locale";
import { t } from "@/lib/i18n";
import { usePages } from "@/lib/use-site";
import { VISA_TYPES } from "@/lib/visa-catalog";
import { RegionCountryScroller } from "@/components/region-country-scroller";
import { StartApplicationLink } from "@/components/start-application-link";
import { visaIdToRegion, isRegionVisaId } from "@/lib/region-countries";

function slugForVisa(id: string) {
  if (id === "usa") return "abd";
  if (id === "uk") return "ingiltere";
  if (id === "canada") return "kanada";
  if (id === "uae") return "dubai";
  if (id === "china") return "cin";
  if (id === "russia") return "rusya";
  if (id === "asia") return "asya";
  if (id === "africa") return "afrika";
  return "schengen";
}

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
          <Link key={type.id} href={`/hizmet/${slugForVisa(type.id)}`} className="rounded-2xl border border-line bg-paper p-7 hover:border-gold">
            <h2 className="font-serif text-2xl">{t(locale, type.titleTr, type.titleEn)}</h2>
            <p className="mt-2 text-sm text-ink-soft">{t(locale, type.hintTr, type.titleHintEn)}</p>
          </Link>
        ))}
      </section>
      <section className="mx-auto max-w-6xl space-y-4 px-5 pb-8">
        {(["schengen", "asia", "africa"] as const).map((id) => (
          <div key={id} className="rounded-2xl border border-line bg-paper p-5">
            <RegionCountryScroller region={isRegionVisaId(id) ? visaIdToRegion(id) : "schengen"} mode="links" />
          </div>
        ))}
      </section>
      <section className="mx-auto max-w-6xl px-5 pb-16">
        <StartApplicationLink className="btn">
          {t(locale, "Dosya açın", "Open a file")}
        </StartApplicationLink>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <Link href="/blog/vize-danismanligi" className="rounded-2xl border border-line bg-paper p-6 hover:border-gold">
            <h2 className="font-serif text-2xl">{t(locale, "Vize danışmanlığı", "Visa consultancy")}</h2>
            <p className="mt-2 text-sm text-ink-soft">
              {t(locale, "Ne yaptığımız, ne yapmadığımız ve dosyanın nasıl yürüdüğü.", "What we do, what we do not do, and how the file runs.")}
            </p>
          </Link>
          <Link href="/blog/kuzey-kibris-schengen-vize-danismanligi" className="rounded-2xl border border-line bg-paper p-6 hover:border-gold">
            <h2 className="font-serif text-2xl">{t(locale, "Kuzey Kıbrıs Schengen vize danışmanlığı", "Northern Cyprus Schengen visa consultancy")}</h2>
            <p className="mt-2 text-sm text-ink-soft">
              {t(locale, "KKTC’den Schengen kısa konaklama dosyası.", "Schengen short-stay files from the TRNC.")}
            </p>
          </Link>
        </div>
      </section>
    </MarketingShell>
  );
}

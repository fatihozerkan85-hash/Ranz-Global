"use client";

import { MarketingShell, PageHero } from "@/components/marketing-shell";
import { useLocale } from "@/lib/locale";
import { t } from "@/lib/i18n";
import { StartApplicationLink } from "@/components/start-application-link";
import { RefusalReviewForm } from "@/components/refusal-review-form";

const POINTS = [
  { tr: "Ret gerekçesinin incelenmesi", en: "Reading the refusal grounds" },
  { tr: "Önceki dosyanın değerlendirilmesi", en: "Review of the previous file" },
  { tr: "Eksik ve zayıf noktaların belirlenmesi", en: "Finding gaps and weak points" },
  { tr: "Yeniden başvuru için dosya hazırlığı", en: "Preparing a new application file" },
];

export default function RefusalView() {
  const { locale } = useLocale();
  return (
    <MarketingShell>
      <PageHero
        eyebrow={t(locale, "Yeniden Başvuru", "Apply Again")}
        title={t(locale, "Vize Reddi Mi Aldınız?", "Was Your Visa Refused?")}
        lead={t(locale, "Ret kararınızı uzmanımız değerlendirsin.", "Have an advisor review the refusal.")}
      />
      <section className="mx-auto max-w-6xl px-5 py-14">
        <p className="max-w-2xl text-sm leading-7 text-ink-soft">
          {t(
            locale,
            "Yeniden başvuru çoğu ülkede mümkündür. Önceki ret gerekçeleri yeni dosyada durur. Onay yine resmi makama aittir; Ranz Global garanti vermez.",
            "A new application is possible in most countries. Previous refusal grounds remain on the file. Approval still belongs to the authority; Ranz Global does not guarantee a visa.",
          )}
        </p>
        <ul className="mt-10 space-y-3">
          {POINTS.map((p) => (
            <li key={p.tr} className="border-b border-line pb-3 text-sm text-ink-soft">
              {t(locale, p.tr, p.en)}
            </li>
          ))}
        </ul>
        <div className="mt-10">
          <RefusalReviewForm source="/vize-reddi" />
          <div className="mt-3">
            <StartApplicationLink className="btn btn-lg btn-line">
              {t(locale, "Vize Başvurumu Başlat", "Start My Visa Application")}
            </StartApplicationLink>
          </div>
        </div>
      </section>
    </MarketingShell>
  );
}

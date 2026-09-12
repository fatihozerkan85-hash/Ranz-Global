"use client";

import Link from "next/link";
import { MarketingShell } from "@/components/marketing-shell";
import { useLocale } from "@/lib/locale";
import { t } from "@/lib/i18n";
import { CountryFlag } from "@/components/country-flag";
import { FEE_DISCLAIMER_EN, FEE_DISCLAIMER_TR, SCOPE_EN, SCOPE_TR, serviceBySlug } from "@/lib/services";

export function ServiceView({ slug }: { slug: string }) {
  const { locale } = useLocale();
  const service = serviceBySlug(slug);
  if (!service) return null;
  const scope = locale === "en" ? SCOPE_EN : SCOPE_TR;

  return (
    <MarketingShell>
      <section className="border-b border-gold/30 bg-paper">
        <div className="mx-auto max-w-6xl px-5 py-14 md:py-20">
          <CountryFlag code={service.flag} title={t(locale, service.titleTr, service.titleEn)} size="lg" />
          <h1 className="mt-4 font-serif text-4xl leading-tight md:text-6xl">{t(locale, service.titleTr, service.titleEn)}</h1>
          <h2 className="mt-4 font-serif text-2xl text-ink-soft">{t(locale, service.visaTr, service.visaEn)}</h2>
          <p className="mt-6 text-lg">
            {t(locale, "Ranz Global danışmanlık ücreti", "Ranz Global consultancy fee")}:{" "}
            <strong>{service.fee || t(locale, "Fiyat al", "Request a fee")}</strong>
          </p>
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-5 py-14">
        <h2 className="font-serif text-3xl">{t(locale, "Hizmet kapsamında", "What is included")}</h2>
        <ul className="mt-8 space-y-3">
          {scope.map((item) => (
            <li key={item} className="border-b border-line pb-3 text-sm leading-6 text-ink-soft">
              {item}
            </li>
          ))}
        </ul>
        <p className="mt-8 max-w-2xl text-xs leading-5 text-muted">{t(locale, FEE_DISCLAIMER_TR, FEE_DISCLAIMER_EN)}</p>
        <div className="mt-10 flex flex-wrap gap-3">
          <Link href={`/kayit?hizmet=${service.slug}`} className="btn btn-lg">
            {t(locale, `${service.titleTr.replace(/Vizesi$/, "Vizesine")} başla`, `Start ${service.titleEn}`)}
          </Link>
          <Link href="/giris" className="btn btn-lg btn-line">
            {t(locale, "Mevcut müşteriyim — dosyama gir", "I’m a client — open my file")}
          </Link>
        </div>
      </section>
    </MarketingShell>
  );
}

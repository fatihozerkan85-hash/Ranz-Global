"use client";

import Link from "next/link";
import { MarketingShell } from "@/components/marketing-shell";
import { useLocale } from "@/lib/locale";
import { t } from "@/lib/i18n";
import { CountryFlag } from "@/components/country-flag";
import { RegionCountryScroller } from "@/components/region-country-scroller";
import { StartApplicationLink } from "@/components/start-application-link";
import { FEE_DISCLAIMER_EN, FEE_DISCLAIMER_TR, SCOPE_EN, SCOPE_TR, serviceBySlug } from "@/lib/services";
import { REGION_META, isRegionServiceSlug, regionMemberFromService } from "@/lib/region-countries";

function ServiceBody({ slug, ulke }: { slug: string; ulke?: string }) {
  const { locale } = useLocale();
  const service = serviceBySlug(slug);
  if (!service) return null;
  const scope = locale === "en" ? SCOPE_EN : SCOPE_TR;
  const picked = regionMemberFromService(slug, ulke ?? null);
  const member = picked?.country;
  const region = picked?.region;
  const meta = region ? REGION_META[region] : undefined;
  const regional = isRegionServiceSlug(slug);

  return (
    <MarketingShell>
      <section className="border-b border-gold/30 bg-paper">
        <div className="mx-auto max-w-6xl px-5 py-14 md:py-20">
          <CountryFlag
            code={member?.code ?? service.flag}
            title={member ? t(locale, member.tr, member.en) : t(locale, service.titleTr, service.titleEn)}
            size="lg"
          />
          <h1 className="mt-4 font-serif text-[1.85rem] leading-tight sm:text-4xl md:text-6xl">
            {member && meta
              ? t(locale, `${member.tr} ${meta.labelTr} Vizesi`, `${member.en} ${meta.labelEn} Visa`)
              : t(locale, service.titleTr, service.titleEn)}
          </h1>
          <h2 className="mt-4 font-serif text-2xl text-ink-soft">{t(locale, service.visaTr, service.visaEn)}</h2>
          <p className="mt-6 text-lg">
            {t(locale, "Ranz Global danışmanlık ücreti", "Ranz Global consultancy fee")}:{" "}
            <strong>{service.fee || t(locale, "Lütfen fiyat alınız", "Please request a quote")}</strong>
          </p>
          {regional && region && (
            <div className="mt-8">
              <RegionCountryScroller region={region} mode="links" value={member?.code} />
            </div>
          )}
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
          <StartApplicationLink
            className="btn btn-lg"
            region={region ?? service.slug}
            ulke={member?.code}
          >
            {t(locale, `${service.titleTr.replace(/Vizesi$/, "Vizesine")} başla`, `Start ${service.titleEn}`)}
          </StartApplicationLink>
          <Link href="/giris" className="btn btn-lg btn-line">
            {t(locale, "Mevcut müşteriyim — dosyama gir", "I’m a client — open my file")}
          </Link>
        </div>
        <p className="mt-8 max-w-2xl text-sm leading-7">
          <Link href="/blog/vize-danismanligi" className="text-gold-deep">
            {t(locale, "Vize danışmanlığı", "Visa consultancy")}
          </Link>
          {slug === "schengen" ? (
            <>
              {" · "}
              <Link href="/blog/kuzey-kibris-schengen-vize-danismanligi" className="text-gold-deep">
                {t(locale, "Kuzey Kıbrıs Schengen vize danışmanlığı", "Northern Cyprus Schengen visa consultancy")}
              </Link>
            </>
          ) : null}
        </p>
      </section>
    </MarketingShell>
  );
}

export function ServiceView({ slug, ulke }: { slug: string; ulke?: string }) {
  return <ServiceBody slug={slug} ulke={ulke} />;
}

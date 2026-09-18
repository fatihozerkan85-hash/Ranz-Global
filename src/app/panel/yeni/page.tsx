"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { useLocale } from "@/lib/locale";
import { t } from "@/lib/i18n";
import { VISA_TYPES } from "@/lib/visa-catalog";
import { createApplication } from "@/lib/store";
import type { VisaCountry } from "@/lib/types";
import { RegionCountryScroller } from "@/components/region-country-scroller";
import {
  REGION_META,
  findRegionCountry,
  isRegionVisaId,
  regionByCode,
  slugToRegion,
  visaIdToRegion,
} from "@/lib/region-countries";

function NewFileForm() {
  const { locale } = useLocale();
  const { user } = useAuth();
  const router = useRouter();
  const params = useSearchParams();
  const [country, setCountry] = useState<VisaCountry | null>(null);
  const [memberCode, setMemberCode] = useState("");
  const [scrollTo, setScrollTo] = useState<"country" | "docs" | null>(null);
  const countryPickRef = useRef<HTMLDivElement>(null);
  const docsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ulke = params.get("ulke");
    const region = slugToRegion(params.get("hizmet")) ?? findRegionCountry(ulke)?.region;
    const matched = region && ulke ? regionByCode(region, ulke) : undefined;
    if (region && matched) {
      setCountry(REGION_META[region].visaId);
      setMemberCode(matched.code);
    }
  }, [params]);

  useEffect(() => {
    if (!scrollTo) return;
    let cancelled = false;
    let tries = 0;
    const timers: number[] = [];
    const move = () => {
      if (cancelled) return;
      const target = scrollTo === "country" ? countryPickRef.current : docsRef.current;
      if (!target) return false;
      const top = target.getBoundingClientRect().top + window.scrollY - 16;
      window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
      return true;
    };
    const run = () => {
      if (cancelled) return;
      if (!move() && tries < 20) {
        tries += 1;
        timers.push(window.setTimeout(run, 32));
        return;
      }
      timers.push(window.setTimeout(() => move(), 180));
    };
    timers.push(window.setTimeout(run, 40));
    return () => {
      cancelled = true;
      timers.forEach((id) => window.clearTimeout(id));
    };
  }, [scrollTo, country, memberCode]);

  const selected = VISA_TYPES.find((v) => v.id === country);
  const region = country && isRegionVisaId(country) ? visaIdToRegion(country) : undefined;
  const member = region ? regionByCode(region, memberCode) : undefined;

  return (
    <div>
      <h1 className="font-serif text-4xl">{t(locale, "Yeni dosya", "New file")}</h1>
      <p className="mt-2 text-sm text-ink-soft">
        {t(
          locale,
          "Başvuracağınız ülkeyi seçin. Evrak listesi o ülkeye göre açılır.",
          "Choose the country you will apply for. The document list follows that country.",
        )}
      </p>

      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        {VISA_TYPES.map((type) => (
          <button
            key={type.id}
            type="button"
            onClick={() => {
              setCountry(type.id);
              setMemberCode("");
              setScrollTo(isRegionVisaId(type.id) ? "country" : "docs");
            }}
            className={`rounded-2xl border p-5 text-left ${
              country === type.id ? "border-gold bg-paper" : "border-line bg-paper"
            }`}
          >
            <p className="font-serif text-2xl">{t(locale, type.titleTr, type.titleEn)}</p>
            <p className="mt-1 text-sm text-muted">{t(locale, type.hintTr, type.titleHintEn)}</p>
          </button>
        ))}
      </div>

      {region && (
        <div ref={countryPickRef} className="mt-6 scroll-mt-6 scroll-mb-24 rounded-2xl border border-line bg-paper p-5">
          <RegionCountryScroller
            region={region}
            value={memberCode}
            onChange={(code) => {
              setMemberCode(code);
              setScrollTo("docs");
            }}
          />
        </div>
      )}

      {selected && (!region || member) && (
        <div ref={docsRef} className="mt-8 scroll-mt-6 scroll-mb-24 rounded-2xl border border-line bg-paper p-6">
          <h2 className="font-serif text-2xl">{t(locale, "Yüklenecek evraklar", "Documents to upload")}</h2>
          <p className="mt-1 text-sm text-muted">
            {member && region
              ? t(locale, `${member.tr} (${REGION_META[region].labelTr})`, `${member.en} (${REGION_META[region].labelEn})`)
              : t(locale, selected.titleTr, selected.titleEn)}
          </p>
          <ul className="mt-4 space-y-2 text-sm">
            {selected.documents.map((doc) => (
              <li key={doc.key} className="flex items-start justify-between gap-3 border-b border-line py-2 last:border-0">
                <span>{t(locale, doc.labelTr, doc.labelEn)}</span>
                <span className="shrink-0 text-xs uppercase tracking-wider text-gold-deep">
                  {doc.required ? t(locale, "Zorunlu", "Required") : t(locale, "İsteğe bağlı", "Optional")}
                </span>
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={() => {
              if (!user) return;
              const app = createApplication(user.id, selected.id, memberCode || undefined);
              if (app) router.push(`/panel/basvuru/${app.id}`);
            }}
            className="mt-6 btn"
            disabled={Boolean(region) && !memberCode}
          >
            {t(locale, "Bu ülkeyle dosya aç", "Open file for this country")}
          </button>
        </div>
      )}
    </div>
  );
}

export default function NewFilePage() {
  return (
    <Suspense>
      <NewFileForm />
    </Suspense>
  );
}

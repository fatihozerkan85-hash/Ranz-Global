"use client";

import { useState } from "react";
import Link from "next/link";
import { useLocale } from "@/lib/locale";
import { t } from "@/lib/i18n";
import { CountryFlag } from "@/components/country-flag";
import {
  docsFor,
  HOME_DEST_SLUGS,
  PROFILES,
  SERVICES,
  type ProfileId,
  type ServiceSlug,
} from "@/lib/services";

export function DocsFinder() {
  const { locale } = useLocale();
  const list = SERVICES.filter((s) => HOME_DEST_SLUGS.includes(s.slug));
  const [slug, setSlug] = useState<ServiceSlug>("ingiltere");
  const [profile, setProfile] = useState<ProfileId>("employee");
  const service = list.find((s) => s.slug === slug) ?? list[0];
  const docs = docsFor(service.quizKey, profile, locale);

  return (
    <section id="evraklar" className="mx-auto max-w-6xl px-5 py-16">
      <h2 className="font-serif text-3xl md:text-4xl">
        {t(locale, "Vizeniz için gerekli evrakları öğrenin", "See the documents your visa needs")}
      </h2>
      <p className="mt-3 max-w-2xl text-sm leading-7 text-ink-soft">
        {t(
          locale,
          "Standart listeden önce durumunuza göre bakın: çalışan, şirket sahibi, emekli, öğrenci veya sponsorlu başvuru.",
          "Look at your situation first — employed, business owner, retired, student or sponsored — not only a generic list.",
        )}
      </p>
      <div className="mt-8 flex flex-wrap gap-2">
        {list.map((s) => (
          <button
            key={s.slug}
            type="button"
            onClick={() => setSlug(s.slug)}
            className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm ${slug === s.slug ? "border-navy bg-navy text-cream" : "border-line bg-paper"}`}
          >
            <CountryFlag code={s.flag} title={t(locale, s.titleTr, s.titleEn)} />
            {t(locale, s.titleTr.replace(" Vizesi", " Evrak Listesi"), `${s.titleEn} List`)}
          </button>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {PROFILES.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => setProfile(p.id)}
            className={`rounded-full border px-4 py-2 text-sm ${profile === p.id ? "border-gold bg-paper" : "border-line bg-cream"}`}
          >
            {t(locale, p.tr, p.en)}
          </button>
        ))}
      </div>
      <ul className="mt-8 space-y-2 rounded-2xl border border-line bg-paper p-6">
        {docs.map((item) => (
          <li key={item} className="text-sm leading-6 text-ink-soft">
            {item}
          </li>
        ))}
      </ul>
      <p className="mt-4 text-xs leading-5 text-muted">
        {t(
          locale,
          "Bu liste ön bilgidir. Danışman, profile göre madde ekler veya çıkarır.",
          "This list is a starting point. An advisor will add or remove items for your profile.",
        )}
      </p>
      <Link href={`/hizmet/${service.slug}`} className="btn mt-6">
        {t(locale, `${service.titleTr} sayfası`, `${service.titleEn} page`)}
      </Link>
    </section>
  );
}

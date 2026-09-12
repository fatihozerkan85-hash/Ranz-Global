"use client";

import { FormEvent, useEffect, useState } from "react";
import { SeoNav } from "@/components/seo-nav";
import { useLocale } from "@/lib/locale";
import { t } from "@/lib/i18n";
import { addBacklink, getSeo, setBacklinkLive, subscribeSeo } from "@/lib/seo-store";
import type { SeoStore } from "@/lib/seo-store";

export default function BacklinkPage() {
  const { locale } = useLocale();
  const [seo, setSeo] = useState<SeoStore | null>(null);
  useEffect(() => {
    const load = () => setSeo(getSeo());
    load();
    return subscribeSeo(load);
  }, []);
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const url = String(new FormData(e.currentTarget).get("url") || "");
    if (url) addBacklink(url);
    e.currentTarget.reset();
  };
  const check = async (url: string) => {
    try {
      await fetch(url, { mode: "no-cors" });
      setBacklinkLive(url, true);
    } catch {
      setBacklinkLive(url, false);
    }
  };
  return (
    <div>
      <SeoNav />
      <h1 className="font-serif text-4xl">Backlink</h1>
      <p className="mt-2 text-sm text-ink-soft">
        {t(locale, "Aday URL canlılık kontrolü. Link satın alma yok. AI outreach taslağı üretilir, gönderilmez.", "Liveness check for candidate URLs. No link buying. AI outreach drafts are generated, not sent.")}
      </p>
      <form onSubmit={onSubmit} className="mt-6 flex gap-2">
        <input name="url" placeholder="https://" className="flex-1 rounded-full border border-line bg-paper px-4 py-2 text-sm" />
        <button className="rounded-full bg-navy px-4 py-2 text-sm text-cream">{t(locale, "Ekle", "Add")}</button>
      </form>
      <div className="mt-8 space-y-3">
        {seo?.backlinks.map((b) => (
          <article key={b.url} className="rounded-xl border border-line bg-paper p-5">
            <p className="break-all text-sm">{b.url}</p>
            <p className="mt-1 text-xs text-muted">{b.live === null ? t(locale, "Kontrol edilmedi", "Not checked") : b.live ? t(locale, "Canlı", "Live") : t(locale, "Kırık", "Broken")}</p>
            <button type="button" className="mt-3 btn btn-sm" onClick={() => check(b.url)}>
              {t(locale, "Canlılık", "Check")}
            </button>
            <pre className="mt-3 whitespace-pre-wrap text-xs text-ink-soft">
              {t(
                locale,
                `Merhaba,\nRanz Global Travel & Visa olarak Schengen / ABD vize danışmanlığı içeriğinizi faydalı bulduk. Karşılıklı kaynak belirtmek isteriz.`,
                `Hello,\nWe found your visa content useful. Ranz Global Travel & Visa would like to mention a reciprocal resource.`,
              )}
            </pre>
          </article>
        ))}
      </div>
    </div>
  );
}

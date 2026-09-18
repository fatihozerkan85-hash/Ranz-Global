"use client";

import { FormEvent, useEffect, useState } from "react";
import { SeoNav } from "@/components/seo-nav";
import { useLocale } from "@/lib/locale";
import { t } from "@/lib/i18n";
import {
  addBacklink,
  getSeo,
  removeBacklink,
  setBacklinkLive,
  subscribeSeo,
} from "@/lib/seo-store";
import type { SeoStore } from "@/lib/seo-store";

export default function BacklinkPage() {
  const { locale } = useLocale();
  const [seo, setSeo] = useState<SeoStore | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
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
    setBusy(url);
    try {
      const res = await fetch("/api/seo/tools", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "backlink", url }),
      });
      const json = (await res.json()) as { live?: boolean; mentions?: boolean };
      setBacklinkLive(url, Boolean(json.live));
    } finally {
      setBusy(null);
    }
  };
  return (
    <div>
      <SeoNav />
      <h1 className="font-serif text-4xl">Backlink</h1>
      <p className="mt-2 text-sm text-ink-soft">
        {t(
          locale,
          "Aday URL’nin açılıp açılmadığını sunucudan kontrol eder. Link satın alma yok. Outreach metni kopyalanır, gönderilmez.",
          "Checks whether a candidate URL is reachable from the server. No link buying. Outreach text is copied, not sent.",
        )}
      </p>
      <form onSubmit={onSubmit} className="mt-6 flex gap-2">
        <input name="url" placeholder="https://" className="flex-1 rounded-full border border-line bg-paper px-4 py-2 text-sm" />
        <button className="rounded-full bg-navy px-4 py-2 text-sm text-cream">{t(locale, "Ekle", "Add")}</button>
      </form>
      <div className="mt-8 space-y-3">
        {seo?.backlinks.map((b) => (
          <article key={b.url} className="rounded-xl border border-line bg-paper p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <p className="break-all text-sm">{b.url}</p>
              <button type="button" className="text-xs text-[#8a3b24]" onClick={() => removeBacklink(b.url)}>
                {t(locale, "Sil", "Delete")}
              </button>
            </div>
            <p className="mt-1 text-xs text-muted">
              {b.live === null
                ? t(locale, "Kontrol edilmedi", "Not checked")
                : b.live
                  ? t(locale, "Sayfa açılıyor", "Page reachable")
                  : t(locale, "Açılamadı", "Unreachable")}
            </p>
            <button type="button" className="mt-3 btn btn-sm" disabled={busy === b.url} onClick={() => void check(b.url)}>
              {busy === b.url ? "…" : t(locale, "Canlılık", "Check")}
            </button>
            <pre className="mt-3 whitespace-pre-wrap text-xs text-ink-soft">
              {t(
                locale,
                `Merhaba,\nRanz Global Travel & Visa olarak Schengen / ABD vize danışmanlığı içeriğinizi faydalı bulduk. Kaynak olarak www.ranzglobal.com belirtmek isteriz.`,
                `Hello,\nWe found your visa content useful. Ranz Global Travel & Visa would like to cite www.ranzglobal.com as a resource.`,
              )}
            </pre>
          </article>
        ))}
        {seo && seo.backlinks.length === 0 && (
          <p className="text-sm text-muted">{t(locale, "Aday backlink yok.", "No backlink candidates.")}</p>
        )}
      </div>
    </div>
  );
}

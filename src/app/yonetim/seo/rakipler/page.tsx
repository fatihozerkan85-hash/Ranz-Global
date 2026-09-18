"use client";

import { FormEvent, useEffect, useState } from "react";
import { SeoNav } from "@/components/seo-nav";
import { useLocale } from "@/lib/locale";
import { t } from "@/lib/i18n";
import {
  addCompetitor,
  addContentJob,
  getSeo,
  removeCompetitor,
  setCompetitorTopics,
  subscribeSeo,
} from "@/lib/seo-store";
import type { SeoStore } from "@/lib/seo-store";

export default function CompetitorsPage() {
  const { locale } = useLocale();
  const [seo, setSeo] = useState<SeoStore | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const load = () => setSeo(getSeo());
    load();
    return subscribeSeo(load);
  }, []);
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const d = String(new FormData(e.currentTarget).get("d") || "");
    if (d) addCompetitor(d);
    e.currentTarget.reset();
  };
  const scan = async (domain: string) => {
    setBusy(domain);
    setError(null);
    try {
      const res = await fetch("/api/seo/tools", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "competitor", domain }),
      });
      const json = (await res.json()) as { topics?: string[]; error?: string };
      if (!res.ok) throw new Error(json.error || "Tarama başarısız.");
      setCompetitorTopics(domain, json.topics ?? []);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(null);
    }
  };
  return (
    <div>
      <SeoNav />
      <h1 className="font-serif text-4xl">{t(locale, "Rakip analizi", "Competitor analysis")}</h1>
      <p className="mt-2 text-sm text-ink-soft">
        {t(locale, "Rakip anasayfadan başlık ve vize konuları çekilir. Konuyu içerik kuyruğuna atabilirsiniz.", "Pull titles and visa topics from a competitor homepage. Send a topic to the content queue.")}
      </p>
      <form onSubmit={onSubmit} className="mt-6 flex gap-2">
        <input name="d" placeholder="ornek.com" className="flex-1 rounded-full border border-line bg-paper px-4 py-2 text-sm" />
        <button className="rounded-full bg-navy px-4 py-2 text-sm text-cream">{t(locale, "Ekle", "Add")}</button>
      </form>
      {error && <p className="mt-3 text-sm text-[#8a3b24]">{error}</p>}
      <div className="mt-8 space-y-3">
        {seo?.competitors.map((c) => (
          <article key={c.domain} className="rounded-xl border border-line bg-paper p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="font-medium">{c.domain}</p>
              <div className="flex gap-2">
                <button type="button" className="btn btn-sm" disabled={busy === c.domain} onClick={() => void scan(c.domain)}>
                  {busy === c.domain ? t(locale, "Taranıyor…", "Scanning…") : t(locale, "Siteyi tara", "Scan site")}
                </button>
                <button type="button" className="text-xs text-[#8a3b24]" onClick={() => removeCompetitor(c.domain)}>
                  {t(locale, "Sil", "Delete")}
                </button>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {(c.topics.length ? c.topics : [t(locale, "Önce siteyi tarayın", "Scan the site first")]).map((topic) => (
                <button
                  key={topic}
                  type="button"
                  className="btn btn-sm"
                  disabled={!c.topics.length}
                  onClick={() => addContentJob(topic, locale)}
                >
                  {topic}
                  {c.topics.length ? ` → ${t(locale, "kuyruk", "queue")}` : ""}
                </button>
              ))}
            </div>
          </article>
        ))}
        {seo && seo.competitors.length === 0 && (
          <p className="text-sm text-muted">{t(locale, "Henüz rakip yok.", "No competitors yet.")}</p>
        )}
      </div>
    </div>
  );
}

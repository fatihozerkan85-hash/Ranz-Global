"use client";

import { FormEvent, useEffect, useState } from "react";
import { SeoNav } from "@/components/seo-nav";
import { useLocale } from "@/lib/locale";
import { t } from "@/lib/i18n";
import { addCompetitor, addContentJob, getSeo, subscribeSeo } from "@/lib/seo-store";
import type { SeoStore } from "@/lib/seo-store";

export default function CompetitorsPage() {
  const { locale } = useLocale();
  const [seo, setSeo] = useState<SeoStore | null>(null);
  useEffect(() => {
    const load = () => setSeo(getSeo());
    load();
    return subscribeSeo(load);
  }, []);
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const d = String(new FormData(e.currentTarget).get("d") || "");
    if (d) addCompetitor(d.replace(/^https?:\/\//, ""));
    e.currentTarget.reset();
  };
  return (
    <div>
      <SeoNav />
      <h1 className="font-serif text-4xl">{t(locale, "Rakip analizi", "Competitor analysis")}</h1>
      <p className="mt-2 text-sm text-ink-soft">{t(locale, "En fazla 10 rakip domain. Konu boşluğunu kuyruğa gönderin.", "Up to 10 competitor domains. Send topic gaps to the queue.")}</p>
      <form onSubmit={onSubmit} className="mt-6 flex gap-2">
        <input name="d" placeholder="ornek.com" className="flex-1 rounded-full border border-line bg-paper px-4 py-2 text-sm" />
        <button className="rounded-full bg-ink px-4 py-2 text-sm text-cream">{t(locale, "Ekle", "Add")}</button>
      </form>
      <div className="mt-8 space-y-3">
        {seo?.competitors.map((c) => (
          <article key={c.domain} className="rounded-xl border border-line bg-paper p-5">
            <p className="font-medium">{c.domain}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {(c.topics.length ? c.topics : ["Visa checklist", "Document portal"]).map((topic) => (
                <button
                  key={topic}
                  type="button"
                  className="rounded-full border border-line px-3 py-1 text-xs"
                  onClick={() => addContentJob(topic, locale)}
                >
                  {topic} → {t(locale, "kuyruk", "queue")}
                </button>
              ))}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

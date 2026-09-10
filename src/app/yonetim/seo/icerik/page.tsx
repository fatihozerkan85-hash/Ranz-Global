"use client";

import { FormEvent, useEffect, useState } from "react";
import { SeoNav } from "@/components/seo-nav";
import { useLocale } from "@/lib/locale";
import { t } from "@/lib/i18n";
import { addContentJob, draftContent, getSeo, publishContent, subscribeSeo } from "@/lib/seo-store";
import type { SeoStore } from "@/lib/seo-store";

export default function ContentQueue() {
  const { locale } = useLocale();
  const [seo, setSeo] = useState<SeoStore | null>(null);
  useEffect(() => {
    const load = () => setSeo(getSeo());
    load();
    return subscribeSeo(load);
  }, []);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const topic = String(new FormData(e.currentTarget).get("topic") || "");
    if (topic) addContentJob(topic, locale);
    e.currentTarget.reset();
  };

  return (
    <div>
      <SeoNav />
      <h1 className="font-serif text-4xl">{t(locale, "İçerik kuyruğu", "Content queue")}</h1>
      <p className="mt-2 text-sm text-ink-soft">
        {t(locale, "AI taslak 800–1.800 kelime hedefi. Yayın insan onayı ile. Stok görsel API sonraki bağlanır.", "AI draft targets 800–1,800 words. Human approval before publish. Stock image APIs connect later.")}
      </p>
      <form onSubmit={onSubmit} className="mt-6 flex gap-2">
        <input name="topic" placeholder={t(locale, "Konu veya kelime", "Topic or keyword")} className="flex-1 rounded-full border border-line bg-paper px-4 py-2 text-sm" />
        <button className="rounded-full bg-ink px-4 py-2 text-sm text-cream">{t(locale, "Kuyruğa al", "Queue")}</button>
      </form>
      <div className="mt-8 space-y-3">
        {seo?.queue.map((job) => (
          <article key={job.id} className="rounded-xl border border-line bg-paper p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-medium">{job.topic}</p>
                <p className="text-xs text-muted">{job.locale.toUpperCase()} · {job.status} · {job.words} {t(locale, "kelime", "words")}</p>
              </div>
              <div className="flex gap-2">
                <button type="button" className="rounded-full border border-line px-3 py-1.5 text-xs" onClick={() => draftContent(job.id)}>
                  {t(locale, "AI yazsın", "AI draft")}
                </button>
                <button type="button" className="rounded-full bg-ink px-3 py-1.5 text-xs text-cream" onClick={() => publishContent(job.id)}>
                  {t(locale, "Yayınla", "Publish")}
                </button>
              </div>
            </div>
            {job.body && <pre className="mt-4 whitespace-pre-wrap text-xs text-ink-soft">{job.body}</pre>}
          </article>
        ))}
      </div>
    </div>
  );
}

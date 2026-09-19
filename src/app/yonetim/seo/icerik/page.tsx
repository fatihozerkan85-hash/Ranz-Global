"use client";

import { FormEvent, useEffect, useState } from "react";
import { SeoNav } from "@/components/seo-nav";
import { useLocale } from "@/lib/locale";
import { t } from "@/lib/i18n";
import {
  addContentJob,
  demoteMissingLivePosts,
  getSeo,
  jobSlug,
  publishContent,
  removeContentJob,
  setContentDraft,
  subscribeSeo,
  unpublishContent,
} from "@/lib/seo-store";
import type { BlogArticle } from "@/lib/blog-article";
import type { SeoStore } from "@/lib/seo-store";
import { ArticleBody } from "@/components/article-body";

export default function ContentQueue() {
  const { locale } = useLocale();
  const [seo, setSeo] = useState<SeoStore | null>(null);
  const [published, setPublished] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const load = () => setSeo(getSeo());
    load();
    return subscribeSeo(load);
  }, []);

  useEffect(() => {
    void fetch("/api/seo/content", { cache: "no-store" })
      .then((res) => res.json())
      .then((json: { posts?: { slug: string }[] }) => {
        demoteMissingLivePosts((json.posts ?? []).map((p) => p.slug));
      })
      .catch(() => undefined);
  }, []);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const topic = String(new FormData(e.currentTarget).get("topic") || "");
    if (topic) addContentJob(topic, locale);
    e.currentTarget.reset();
  };

  const draft = async (id: string, topic: string) => {
    setBusyId(id);
    setError(null);
    try {
      const res = await fetch("/api/seo/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "draft", topic, locale }),
      });
      const json = (await res.json()) as {
        article?: BlogArticle;
        source?: "gemini" | "ai" | "fallback";
        warning?: string;
        error?: string;
      };
      if (!res.ok || !json.article) throw new Error(json.error || "Yazı üretilemedi.");
      setContentDraft(id, json.article, json.source || "fallback");
      if (json.warning) setError(json.warning);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusyId(null);
    }
  };

  const publish = async (id: string, topic: string, article?: BlogArticle) => {
    if (!article) {
      setError(t(locale, "Önce AI yazsın.", "Generate the article first."));
      return;
    }
    setBusyId(id);
    setError(null);
    try {
      const res = await fetch("/api/seo/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "publish", topic, article }),
      });
      const json = (await res.json()) as { href?: string; error?: string };
      if (!res.ok || !json.href) throw new Error(json.error || "Yayın başarısız.");
      const href = publishContent(id, json.href);
      if (href && href.startsWith("/")) setPublished(href);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusyId(null);
    }
  };

  const unpublish = async (id: string, slug: string) => {
    setBusyId(id);
    setError(null);
    try {
      const res = await fetch("/api/seo/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "unpublish", slug }),
      });
      const json = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(json.error || "Yayından alınamadı.");
      unpublishContent(id);
      setPublished(null);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusyId(null);
    }
  };

  const remove = async (id: string, slug: string) => {
    if (!confirm(t(locale, "Bu yazı silinsin mi?", "Delete this article?"))) return;
    setBusyId(id);
    setError(null);
    try {
      if (slug) {
        const res = await fetch("/api/seo/content", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "delete", slug }),
        });
        const json = (await res.json()) as { error?: string };
        if (!res.ok) throw new Error(json.error || "Silinemedi.");
      }
      removeContentJob(id);
      setPublished(null);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div>
      <SeoNav />
      <h1 className="font-serif text-4xl">{t(locale, "İçerik kuyruğu", "Content queue")}</h1>
      <p className="mt-2 text-sm text-ink-soft">
        {t(
          locale,
          "Konuyu yazın, Gemini gerçek bir blog yazısı üretsin. Onaylayınca /blog altında herkese açılır. Yayındaki yazıya yeniden Gemini yazılmaz.",
          "Enter a topic; Gemini writes a real article. After you approve it, it goes live under /blog. Published items cannot be rewritten by Gemini.",
        )}
      </p>
      {published && (
        <p className="mt-3 text-sm text-gold-deep">
          {t(locale, "Yayınlandı", "Published")}:{" "}
          <a href={published} className="underline">
            {published}
          </a>
        </p>
      )}
      {error && <p className="mt-3 text-sm text-[#8a3b24]">{error}</p>}
      <form onSubmit={onSubmit} className="mt-6 flex gap-2">
        <input
          name="topic"
          placeholder={t(locale, "Örn. sonbaharda gezilmesi gereken Avrupa rotası", "e.g. autumn Europe itinerary")}
          className="flex-1 rounded-full border border-line bg-paper px-4 py-2 text-sm"
        />
        <button className="rounded-full bg-navy px-4 py-2 text-sm text-cream">{t(locale, "Kuyruğa al", "Queue")}</button>
      </form>
      <div className="mt-8 space-y-3">
        {seo?.queue.map((job) => {
          const live = job.status === "published";
          const slug = jobSlug(job);
          return (
            <article key={job.id} className="rounded-xl border border-line bg-paper p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-medium">{job.article?.titleTr || job.topic}</p>
                  <p className="text-xs text-muted">
                    {job.locale.toUpperCase()} · {job.words} {t(locale, "kelime", "words")}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {live ? (
                    <span className="rounded-full bg-navy px-3 py-1.5 text-[10px] font-medium uppercase tracking-wider text-cream">
                      {t(locale, "Yayında", "Live")}
                    </span>
                  ) : (
                    <>
                      <button type="button" className="btn btn-sm" disabled={busyId === job.id} onClick={() => void draft(job.id, job.topic)}>
                        {busyId === job.id ? t(locale, "AI yazıyor…", "AI is writing…") : t(locale, "AI yazsın", "AI draft")}
                      </button>
                      <button
                        type="button"
                        className="rounded-full bg-navy px-3 py-1.5 text-xs text-cream disabled:opacity-50"
                        disabled={busyId === job.id}
                        onClick={() => void publish(job.id, job.topic, job.article)}
                      >
                        {t(locale, "Yayınla", "Publish")}
                      </button>
                    </>
                  )}
                  {live ? (
                    <button
                      type="button"
                      className="btn btn-sm"
                      disabled={busyId === job.id}
                      onClick={() => void unpublish(job.id, slug)}
                    >
                      {t(locale, "Yayından al", "Unpublish")}
                    </button>
                  ) : null}
                  <button
                    type="button"
                    className="text-xs text-[#8a3b24]"
                    disabled={busyId === job.id}
                    onClick={() => void remove(job.id, slug)}
                  >
                    {t(locale, "Sil", "Delete")}
                  </button>
                </div>
              </div>
              {job.body ? (
                <div className="mt-4 border-t border-line pt-4">
                  <ArticleBody text={job.body} />
                </div>
              ) : null}
            </article>
          );
        })}
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useLocale } from "@/lib/locale";
import { t } from "@/lib/i18n";
import { getAllPosts, getPages, savePage, savePost, subscribeStore } from "@/lib/store";
import type { BlogPost, CmsPage } from "@/lib/types";

export default function CmsPage() {
  const { locale } = useLocale();
  const [pages, setPages] = useState<CmsPage[]>([]);
  const [posts, setPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    const load = () => {
      setPages(getPages());
      setPosts(getAllPosts());
    };
    load();
    return subscribeStore(load);
  }, []);

  return (
    <div>
      <h1 className="font-serif text-4xl">{t(locale, "İçerik yönetimi", "Content management")}</h1>
      <p className="mt-2 text-sm text-ink-soft">
        {t(locale, "Yayın / taslak. Open Graph alanları CMS kaydından dolar.", "Publish / draft. Open Graph fields come from CMS records.")}
      </p>
      <h2 className="mt-8 font-serif text-2xl">{t(locale, "Sayfalar", "Pages")}</h2>
      <div className="mt-4 space-y-3">
        {pages.map((p) => (
          <article key={p.slug} className="rounded-xl border border-line bg-paper p-5">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">{p.titleTr}</h3>
              <button
                type="button"
                className="text-xs text-gold-deep"
                onClick={() => savePage({ ...p, status: p.status === "published" ? "draft" : "published" })}
              >
                {p.status}
              </button>
            </div>
            <textarea
              className="mt-3 w-full rounded-lg border border-line bg-cream p-3 text-sm"
              rows={3}
              value={p.descriptionTr}
              onChange={(e) => savePage({ ...p, descriptionTr: e.target.value, ogDescription: e.target.value })}
            />
          </article>
        ))}
      </div>
      <h2 className="mt-10 font-serif text-2xl">{t(locale, "Blog", "Blog")}</h2>
      <div className="mt-4 space-y-3">
        {posts.map((p) => (
          <article key={p.slug} className="rounded-xl border border-line bg-paper p-5">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">{p.titleTr}</h3>
              <button
                type="button"
                className="text-xs text-gold-deep"
                onClick={() => savePost({ ...p, status: p.status === "published" ? "draft" : "published" })}
              >
                {p.status}
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

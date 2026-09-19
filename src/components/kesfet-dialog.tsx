"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import { useLocale } from "@/lib/locale";
import { t } from "@/lib/i18n";
import { usePosts } from "@/lib/use-site";
import { trackBlogListView, trackBlogOpen } from "@/components/google-pageview";

export function openKesfet() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event("ranz-kesfet"));
}

export function KesfetDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { locale } = useLocale();
  const posts = usePosts().filter((p) => p.status === "published").slice(0, 12);

  useEffect(() => {
    if (!open) return;
    if (posts.length) trackBlogListView(posts.length);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose, posts.length]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center p-4 sm:items-center">
      <button type="button" className="absolute inset-0 bg-navy/55" aria-label={t(locale, "Kapat", "Close")} onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="kesfet-title"
        className="relative z-[61] max-h-[min(88vh,40rem)] w-full max-w-2xl overflow-y-auto rounded-2xl border border-line bg-paper p-6 shadow-xl sm:p-8"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-gold-deep">{t(locale, "Blog", "Blog")}</p>
            <h2 id="kesfet-title" className="mt-2 font-serif text-3xl text-ink">
              {t(locale, "Keşfet", "Explore")}
            </h2>
            <p className="mt-2 text-sm text-ink-soft">
              {t(locale, "Yayınlanan yazılar. Vize onayı sözü yoktur.", "Published articles. Not a visa-approval promise.")}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-ink hover:bg-cream"
            aria-label={t(locale, "Kapat", "Close")}
          >
            <X size={18} />
          </button>
        </div>
        <div className="mt-6 space-y-3">
          {posts.map((p) => (
            <Link
              key={p.slug}
              href={`/blog/${p.slug}`}
              onClick={() => {
                trackBlogOpen(p.slug, t(locale, p.titleTr, p.titleEn));
                onClose();
              }}
              className="block rounded-xl border border-line bg-cream px-4 py-4 hover:border-gold"
            >
              <p className="text-xs text-muted">{p.publishedAt}</p>
              <h3 className="mt-1 font-serif text-xl text-ink">{t(locale, p.titleTr, p.titleEn)}</h3>
              <p className="mt-1 text-sm text-ink-soft">{t(locale, p.excerptTr, p.excerptEn)}</p>
            </Link>
          ))}
          {posts.length === 0 ? (
            <p className="text-sm text-muted">{t(locale, "Henüz yayınlanan yazı yok.", "No published articles yet.")}</p>
          ) : null}
        </div>
        <Link href="/blog" onClick={onClose} className="mt-6 inline-block text-sm text-gold-deep">
          {t(locale, "Tüm yazıları aç", "Open all articles")}
        </Link>
      </div>
    </div>
  );
}

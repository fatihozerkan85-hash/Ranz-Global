"use client";

import { useEffect, useState } from "react";
import { SeoNav } from "@/components/seo-nav";
import { useLocale } from "@/lib/locale";
import { t } from "@/lib/i18n";
import { getSeo, setBots, subscribeSeo } from "@/lib/seo-store";
import type { SeoStore } from "@/lib/seo-store";

export default function BotsPage() {
  const { locale } = useLocale();
  const [seo, setSeo] = useState<SeoStore | null>(null);
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    const load = () => setSeo(getSeo());
    load();
    return subscribeSeo(load);
  }, []);
  const refresh = async () => {
    setBusy(true);
    try {
      const res = await fetch("/api/seo/tools?action=bots", { cache: "no-store" });
      const json = (await res.json()) as { bots?: SeoStore["bots"] };
      if (json.bots) setBots(json.bots);
    } finally {
      setBusy(false);
    }
  };
  useEffect(() => {
    void refresh();
  }, []);
  return (
    <div>
      <SeoNav />
      <h1 className="font-serif text-4xl">{t(locale, "Yapay zeka bot kaydı", "AI bot log")}</h1>
      <p className="mt-2 text-sm text-ink-soft">
        {t(
          locale,
          "GPTBot, ClaudeBot, Google AI (Notebook, Deep Research, Vertex), Perplexity ve benzeri tarayıcılar canlı sitede loglanır. Google Arama botu burada görünmez.",
          "GPTBot, ClaudeBot, Google AI (Notebook, Deep Research, Vertex), Perplexity and similar crawlers are logged on the live site. Google Search crawlers are not listed here.",
        )}
      </p>
      <button type="button" className="mt-6 btn" disabled={busy} onClick={() => void refresh()}>
        {t(locale, "Yenile", "Refresh")}
      </button>
      <div className="mt-8 space-y-2">
        {seo?.bots.map((b, i) => (
          <div key={`${b.at}-${i}`} className="flex items-center justify-between rounded-xl border border-line bg-paper px-4 py-3 text-sm">
            <div>
              <p className="break-all">{b.ua}</p>
              <p className="text-xs text-muted">
                {b.path} · {b.at.replace("T", " ").slice(0, 19)}
              </p>
            </div>
            <span className={`rounded-full px-2 py-0.5 text-[10px] uppercase ${b.tag === "ai" ? "bg-navy text-cream" : "bg-[#f6e4dc] text-[#8a3b24]"}`}>
              {b.tag}
            </span>
          </div>
        ))}
        {seo && seo.bots.length === 0 && (
          <p className="text-sm text-muted">{t(locale, "Henüz AI bot isteği yok.", "No AI bot hits yet.")}</p>
        )}
      </div>
    </div>
  );
}

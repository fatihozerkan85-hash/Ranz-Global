"use client";

import { useEffect, useState } from "react";
import { SeoNav } from "@/components/seo-nav";
import { useLocale } from "@/lib/locale";
import { t } from "@/lib/i18n";
import { getSeo, subscribeSeo } from "@/lib/seo-store";
import type { SeoStore } from "@/lib/seo-store";

export default function BotsPage() {
  const { locale } = useLocale();
  const [seo, setSeo] = useState<SeoStore | null>(null);
  useEffect(() => {
    const load = () => setSeo(getSeo());
    load();
    return subscribeSeo(load);
  }, []);
  return (
    <div>
      <SeoNav />
      <h1 className="font-serif text-4xl">{t(locale, "Yapay zeka bot kaydı", "AI bot log")}</h1>
      <p className="mt-2 text-sm text-ink-soft">
        {t(locale, "GPTBot, ClaudeBot vb. user-agent işaretlenir. Cevap kutusunda marka ölçümü yapılmaz.", "GPTBot, ClaudeBot and similar user-agents are tagged. Brand presence in AI answers is not measured.")}
      </p>
      <div className="mt-8 space-y-2">
        {seo?.bots.map((b, i) => (
          <div key={`${b.at}-${i}`} className="flex items-center justify-between rounded-xl border border-line bg-paper px-4 py-3 text-sm">
            <div>
              <p>{b.ua}</p>
              <p className="text-xs text-muted">{b.path} · {b.at}</p>
            </div>
            <span className={`rounded-full px-2 py-0.5 text-[10px] uppercase ${b.tag === "ai" ? "bg-ink text-cream" : "bg-[#f6e4dc] text-[#8a3b24]"}`}>
              {b.tag}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

"use client";

import { FormEvent, useEffect, useState } from "react";
import { SeoNav } from "@/components/seo-nav";
import { useLocale } from "@/lib/locale";
import { t } from "@/lib/i18n";
import { addUptimeTarget, getSeo, pushUptime, removeUptimeTarget, subscribeSeo } from "@/lib/seo-store";
import type { SeoStore } from "@/lib/seo-store";

export default function UptimePage() {
  const { locale } = useLocale();
  const [seo, setSeo] = useState<SeoStore | null>(null);
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    const load = () => setSeo(getSeo());
    load();
    return subscribeSeo(load);
  }, []);
  useEffect(() => {
    void fetch("/api/seo/tools?action=uptime", { cache: "no-store" })
      .then((res) => res.json())
      .then((json: { checks?: SeoStore["uptime"] }) => {
        if (json.checks?.length) pushUptime(json.checks);
      })
      .catch(() => undefined);
  }, []);
  const ping = async () => {
    if (!seo) return;
    setBusy(true);
    try {
      const res = await fetch("/api/seo/tools", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "uptime", paths: seo.uptimeTargets }),
      });
      const json = (await res.json()) as { checks?: SeoStore["uptime"] };
      if (json.checks) pushUptime(json.checks);
    } finally {
      setBusy(false);
    }
  };
  const onAdd = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const path = String(new FormData(e.currentTarget).get("path") || "");
    if (path) addUptimeTarget(path);
    e.currentTarget.reset();
  };
  return (
    <div>
      <SeoNav />
      <h1 className="font-serif text-4xl">Uptime</h1>
      <p className="mt-2 text-sm text-ink-soft">
        {t(
          locale,
          "Canlı sitedeki yollar sunucudan HTTP ile ölçülür. Vercel cron her 6 saatte bir de kontrol eder.",
          "Live-site paths are measured with HTTP from the server. Vercel cron also checks every 6 hours.",
        )}
      </p>
      <form onSubmit={onAdd} className="mt-6 flex gap-2">
        <input name="path" placeholder="/iletisim" className="flex-1 rounded-full border border-line bg-paper px-4 py-2 text-sm" />
        <button className="rounded-full bg-navy px-4 py-2 text-sm text-cream">{t(locale, "Yol ekle", "Add path")}</button>
      </form>
      <div className="mt-4 flex flex-wrap gap-2">
        {seo?.uptimeTargets.map((path) => (
          <button key={path} type="button" className="rounded-full border border-line px-3 py-1 text-xs" onClick={() => removeUptimeTarget(path)}>
            {path} ×
          </button>
        ))}
      </div>
      <button type="button" disabled={busy} onClick={() => void ping()} className="mt-6 rounded-full bg-navy px-5 py-2.5 text-sm text-cream">
        {busy ? t(locale, "Kontrol ediliyor…", "Checking…") : t(locale, "Şimdi kontrol et", "Check now")}
      </button>
      <div className="mt-8 space-y-2">
        {seo?.uptime.slice(0, 24).map((u, i) => (
          <div key={`${u.at}-${i}`} className="flex items-center justify-between rounded-xl border border-line bg-paper px-4 py-3 text-sm">
            <span>
              {u.url}
              <span className="ml-2 text-xs text-muted">{u.at.replace("T", " ").slice(0, 19)}</span>
            </span>
            <span className={u.ok ? "text-[#215c38]" : "text-[#8a3b24]"}>{u.ok ? `${u.ms} ms` : "down"}</span>
          </div>
        ))}
        {seo && seo.uptime.length === 0 && <p className="text-sm text-muted">{t(locale, "Henüz ölçüm yok.", "No checks yet.")}</p>}
      </div>
    </div>
  );
}

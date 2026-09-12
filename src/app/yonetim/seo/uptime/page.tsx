"use client";

import { useEffect, useState } from "react";
import { SeoNav } from "@/components/seo-nav";
import { useLocale } from "@/lib/locale";
import { t } from "@/lib/i18n";
import { getSeo, pushUptime, subscribeSeo } from "@/lib/seo-store";
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
  const ping = async () => {
    if (!seo) return;
    setBusy(true);
    const checks = [];
    for (const path of seo.uptimeTargets) {
      const t0 = performance.now();
      try {
        const res = await fetch(path, { cache: "no-store" });
        checks.push({ url: path, ok: res.ok, ms: Math.round(performance.now() - t0), at: new Date().toISOString() });
      } catch {
        checks.push({ url: path, ok: false, ms: 0, at: new Date().toISOString() });
      }
    }
    pushUptime(checks);
    setBusy(false);
  };
  return (
    <div>
      <SeoNav />
      <h1 className="font-serif text-4xl">Uptime</h1>
      <p className="mt-2 text-sm text-ink-soft">
        {t(locale, "Seçilen URL’ler hafif HTTP kontrolü. Üretimde 5 dakikada bir; kesintide e-posta.", "Light HTTP checks on selected URLs. In production every 5 minutes; email on outage.")}
      </p>
      <button type="button" disabled={busy} onClick={ping} className="mt-6 rounded-full bg-navy px-5 py-2.5 text-sm text-cream">
        {t(locale, "Şimdi kontrol et", "Check now")}
      </button>
      <div className="mt-8 space-y-2">
        {seo?.uptime.slice(0, 24).map((u, i) => (
          <div key={`${u.at}-${i}`} className="flex items-center justify-between rounded-xl border border-line bg-paper px-4 py-3 text-sm">
            <span>{u.url}</span>
            <span className={u.ok ? "text-[#215c38]" : "text-[#8a3b24]"}>
              {u.ok ? `${u.ms} ms` : "down"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

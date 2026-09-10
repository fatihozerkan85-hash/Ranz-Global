"use client";

import { useEffect, useMemo, useState } from "react";
import { SeoNav } from "@/components/seo-nav";
import { useLocale } from "@/lib/locale";
import { t } from "@/lib/i18n";
import { getSeo, subscribeSeo } from "@/lib/seo-store";
import type { SeoStore } from "@/lib/seo-store";

export default function EngagementPage() {
  const { locale } = useLocale();
  const [seo, setSeo] = useState<SeoStore | null>(null);
  useEffect(() => {
    const load = () => setSeo(getSeo());
    load();
    return subscribeSeo(load);
  }, []);
  const counts = useMemo(() => {
    const map: Record<string, number> = {};
    for (const e of seo?.engagement ?? []) map[e.type] = (map[e.type] || 0) + 1;
    return map;
  }, [seo]);
  return (
    <div>
      <SeoNav />
      <h1 className="font-serif text-4xl">{t(locale, "Etkileşim", "Engagement")}</h1>
      <p className="mt-2 text-sm text-ink-soft">
        {t(locale, "WhatsApp, tel, e-posta tıklaması ve form gönderimi. Kişisel kimlik tutulmaz.", "WhatsApp, phone, email clicks and form submits. No personal identity stored.")}
      </p>
      <div className="mt-8 grid gap-4 md:grid-cols-4">
        {["whatsapp", "phone", "email", "form"].map((k) => (
          <div key={k} className="rounded-2xl border border-line bg-paper p-5">
            <p className="text-xs uppercase tracking-wider text-muted">{k}</p>
            <p className="mt-3 font-serif text-3xl">{counts[k] || 0}</p>
          </div>
        ))}
      </div>
      <div className="mt-8 space-y-2">
        {seo?.engagement.slice(0, 20).map((e, i) => (
          <div key={`${e.at}-${i}`} className="flex justify-between rounded-xl border border-line bg-paper px-4 py-3 text-sm">
            <span>{e.type} · {e.page}</span>
            <span className="text-xs text-muted">{e.at.slice(11, 19)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

"use client";

import { useEffect, useMemo, useState } from "react";
import { useLocale } from "@/lib/locale";
import { t } from "@/lib/i18n";
import { getAppointments, getApplications, subscribeStore } from "@/lib/store";
import type { Application, AppointmentRequest } from "@/lib/types";

export default function AdminHome() {
  const { locale } = useLocale();
  const [apps, setApps] = useState<Application[]>([]);
  const [appts, setAppts] = useState<AppointmentRequest[]>([]);

  useEffect(() => {
    const load = () => {
      setApps(getApplications());
      setAppts(getAppointments());
    };
    load();
    return subscribeStore(load);
  }, []);

  const stats = useMemo(() => {
    const open = apps.filter((a) => a.status !== "complete");
    const done = apps.filter((a) => a.status === "complete");
    const billed = apps.reduce((s, a) => s + (a.feeTry || 0), 0);
    const paid = apps.reduce((s, a) => s + (a.paidTry || 0), 0);
    const byType = apps.reduce<Record<string, number>>((acc, a) => {
      acc[a.visaTypeId] = (acc[a.visaTypeId] || 0) + 1;
      return acc;
    }, {});
    return { open: open.length, done: done.length, billed, paid, pending: billed - paid, byType };
  }, [apps]);

  return (
    <div>
      <p className="text-xs uppercase tracking-[0.28em] text-gold-deep">{t(locale, "Yönetici", "Admin")}</p>
      <h1 className="mt-2 font-serif text-4xl">{t(locale, "İstatistik ve gelir", "Statistics and revenue")}</h1>
      <div className="mt-8 grid gap-4 md:grid-cols-4">
        {[
          [t(locale, "Açık dosya", "Open files"), stats.open],
          [t(locale, "Tamamlanan", "Completed"), stats.done],
          [t(locale, "Tahsil", "Collected"), `${stats.paid.toLocaleString("tr-TR")} TL`],
          [t(locale, "Bekleyen bakiye", "Outstanding"), `${stats.pending.toLocaleString("tr-TR")} TL`],
        ].map(([label, value]) => (
          <div key={String(label)} className="rounded-2xl border border-line bg-paper p-5">
            <p className="text-xs uppercase tracking-[0.18em] text-muted">{label}</p>
            <p className="mt-3 font-serif text-3xl">{value}</p>
          </div>
        ))}
      </div>
      <h2 className="mt-10 font-serif text-2xl">{t(locale, "Vize türü kırılımı", "By visa type")}</h2>
      <div className="mt-4 space-y-2">
        {Object.entries(stats.byType).map(([k, v]) => (
          <div key={k} className="flex items-center justify-between rounded-xl border border-line bg-paper px-4 py-3 text-sm">
            <span>{k}</span>
            <span>{v}</span>
          </div>
        ))}
      </div>
      <h2 className="mt-10 font-serif text-2xl">{t(locale, "İletişim formları", "Contact forms")}</h2>
      <div className="mt-4 space-y-2">
        {appts.map((a) => (
          <div key={a.id} className="rounded-xl border border-line bg-paper px-4 py-3 text-sm">
            <p className="font-medium">{a.name}</p>
            <p className="text-xs text-muted">{a.phone}</p>
            {a.message && <p className="mt-2 text-sm text-ink-soft">{a.message}</p>}
          </div>
        ))}
        {appts.length === 0 && <p className="text-sm text-muted">{t(locale, "Henüz talep yok.", "No requests yet.")}</p>}
      </div>
    </div>
  );
}

"use client";

import { useEffect, useMemo, useState } from "react";
import { useLocale } from "@/lib/locale";
import { t } from "@/lib/i18n";
import { getApplications, getAppointments, getUsers, subscribeStore } from "@/lib/store";
import type { Application, AppointmentRequest, User } from "@/lib/types";
import { GroupedBars, HBars } from "@/components/erp-charts";

const MONTHS_TR = ["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara"];
const MONTHS_EN = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function lastMonths(count: number) {
  const now = new Date();
  const keys: string[] = [];
  for (let i = count - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    keys.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`);
  }
  return keys;
}

function monthKey(iso: string) {
  return iso.slice(0, 7);
}

export default function MiniErpPage() {
  const { locale } = useLocale();
  const [apps, setApps] = useState<Application[]>([]);
  const [appts, setAppts] = useState<AppointmentRequest[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const load = () => {
      setApps(getApplications());
      setAppts(getAppointments());
      setUsers(getUsers());
    };
    load();
    return subscribeStore(load);
  }, []);
  const monthNames = locale === "tr" ? MONTHS_TR : MONTHS_EN;

  const stats = useMemo(() => {
    const open = apps.filter((a) => a.status !== "complete");
    const done = apps.filter((a) => a.status === "complete");
    const billed = apps.reduce((s, a) => s + (a.feeTry || 0), 0);
    const paid = apps.reduce((s, a) => s + (a.paidTry || 0), 0);
    return { total: apps.length, open: open.length, done: done.length, billed, paid, pending: billed - paid };
  }, [apps]);

  const months = lastMonths(6);
  const revenueRows = months.map((key) => {
    const monthApps = apps.filter((a) => monthKey(a.createdAt) === key);
    const [, m] = key.split("-");
    return {
      label: monthNames[Number(m) - 1],
      a: monthApps.reduce((s, a) => s + (a.feeTry || 0), 0),
      b: monthApps.reduce((s, a) => s + (a.paidTry || 0), 0),
    };
  });

  const fileRows = months.map((key) => {
    const monthApps = apps.filter((a) => monthKey(a.createdAt) === key);
    const [, m] = key.split("-");
    return {
      label: monthNames[Number(m) - 1],
      a: monthApps.length,
      b: monthApps.filter((a) => a.status === "complete").length,
    };
  });

  const byType = apps.reduce<Record<string, number>>((acc, a) => {
    acc[a.visaTypeId] = (acc[a.visaTypeId] || 0) + 1;
    return acc;
  }, {});

  const byAdvisor = apps.reduce<Record<string, { billed: number; paid: number }>>((acc, a) => {
    const id = a.assignedTo || "—";
    if (!acc[id]) acc[id] = { billed: 0, paid: 0 };
    acc[id].billed += a.feeTry || 0;
    acc[id].paid += a.paidTry || 0;
    return acc;
  }, {});

  const csv = () => {
    const header = ["id", "createdAt", "visa", "status", "feeTry", "paidTry", "advisor"];
    const lines = [
      header.join(","),
      ...apps.map((a) =>
        [a.id, a.createdAt, a.visaTypeId, a.status, a.feeTry, a.paidTry, a.advisorName].join(","),
      ),
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "ranz-mini-erp.csv";
    link.click();
  };

  const money = (n: number) => `${n.toLocaleString("tr-TR")} TL`;

  return (
    <div>
      <p className="text-xs uppercase tracking-[0.28em] text-gold-deep">Mini ERP</p>
      <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
        <h1 className="font-serif text-4xl">{t(locale, "İstatistik ve gelir", "Statistics and revenue")}</h1>
        <button type="button" className="btn btn-sm" onClick={csv}>
          CSV
        </button>
      </div>
      <p className="mt-2 max-w-xl text-sm text-ink-soft">
        {t(
          locale,
          "Dosya, tahsilat ve bekleyen bakiye. Ödeme entegrasyonu bağlanınca tahsilat otomatikleşir.",
          "Files, collections and outstanding balance. Collection becomes automatic after payment is connected.",
        )}
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {[
          [t(locale, "Toplam dosya", "Total files"), stats.total],
          [t(locale, "Açık", "Open"), stats.open],
          [t(locale, "Tamamlanan", "Completed"), stats.done],
          [t(locale, "Tahsil", "Collected"), money(stats.paid)],
          [t(locale, "Bekleyen", "Outstanding"), money(stats.pending)],
        ].map(([label, value]) => (
          <div key={String(label)} className="rounded-2xl border border-line bg-paper p-5">
            <p className="text-[11px] uppercase tracking-[0.16em] text-muted">{label}</p>
            <p className="mt-3 font-serif text-2xl text-navy">{value}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-line bg-paper p-6">
          <h2 className="font-serif text-2xl">{t(locale, "Gelir (6 ay)", "Revenue (6 months)")}</h2>
          <p className="mt-1 text-xs text-muted">
            {t(locale, "Faturalanan hizmet bedeli ve tahsil edilen tutar.", "Billed fees and collected amount.")}
          </p>
          <div className="mt-6">
            <GroupedBars
              rows={revenueRows}
              aLabel={t(locale, "Faturalanan", "Billed")}
              bLabel={t(locale, "Tahsil", "Collected")}
            />
          </div>
        </section>
        <section className="rounded-2xl border border-line bg-paper p-6">
          <h2 className="font-serif text-2xl">{t(locale, "Dosya adedi", "File volume")}</h2>
          <p className="mt-1 text-xs text-muted">
            {t(locale, "Açılan dosya ve tamamlanan dosya.", "Opened files and completed files.")}
          </p>
          <div className="mt-6">
            <GroupedBars
              rows={fileRows}
              aLabel={t(locale, "Açılan", "Opened")}
              bLabel={t(locale, "Tamamlanan", "Completed")}
            />
          </div>
        </section>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-line bg-paper p-6">
          <h2 className="font-serif text-2xl">{t(locale, "Vize türü", "By visa type")}</h2>
          <div className="mt-6">
            <HBars rows={Object.entries(byType).map(([label, value]) => ({ label, value }))} />
            {Object.keys(byType).length === 0 && (
              <p className="text-sm text-muted">{t(locale, "Henüz dosya yok.", "No files yet.")}</p>
            )}
          </div>
        </section>
        <section className="rounded-2xl border border-line bg-paper p-6">
          <h2 className="font-serif text-2xl">{t(locale, "Danışman ciro", "Advisor revenue")}</h2>
          <div className="mt-6">
            <HBars
              rows={Object.entries(byAdvisor).map(([id, v]) => ({
                label: users.find((u) => u.id === id)?.name || id,
                value: v.paid,
                color: "var(--color-gold)",
              }))}
            />
          </div>
        </section>
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

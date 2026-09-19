"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { QUEUE_CARD_TONE, StatusBadge } from "@/components/badges";
import { useAuth } from "@/lib/auth";
import { useLocale } from "@/lib/locale";
import { t } from "@/lib/i18n";
import { AdminFeeField } from "@/components/admin-fee-field";
import { appointmentSoon, crmStatusOf, visaBucket } from "@/lib/file-hub";
import { assignApplication, deleteApplication, getApplications, getStaffUsers, getUsers, progressOf, subscribeStore } from "@/lib/store";
import type { Application, User } from "@/lib/types";

const FAMILY_FILTERS = [
  { id: "all", tr: "Tümü", en: "All" },
  { id: "uk", tr: "İngiltere", en: "UK" },
  { id: "usa", tr: "ABD", en: "USA" },
  { id: "canada", tr: "Kanada", en: "Canada" },
  { id: "schengen", tr: "Schengen", en: "Schengen" },
] as const;

const STATUS_FILTERS = [
  { id: "all", tr: "Tümü", en: "All" },
  { id: "draft", tr: "Yeni", en: "New" },
  { id: "missing", tr: "Evrak bekleniyor", en: "Docs pending" },
  { id: "review", tr: "Kontrolde", en: "In review" },
  { id: "revision", tr: "Revizyonda", en: "Revision" },
  { id: "ready", tr: "Hazır", en: "Ready" },
  { id: "appointment", tr: "Randevu", en: "Appointment" },
  { id: "complete", tr: "Sonuçlandı", en: "Closed" },
] as const;

export function ReviewQueue({ basePath }: { basePath: "/danisman" | "/yonetim" }) {
  const { locale } = useLocale();
  const { user } = useAuth();
  const [apps, setApps] = useState<Application[]>([]);
  const [staff, setStaff] = useState<User[]>([]);
  const [people, setPeople] = useState<User[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [family, setFamily] = useState<(typeof FAMILY_FILTERS)[number]["id"]>("all");
  const [status, setStatus] = useState<(typeof STATUS_FILTERS)[number]["id"]>("all");

  useEffect(() => {
    let alive = true;
    const refresh = () => {
      setApps(getApplications());
      setStaff(getStaffUsers());
      setPeople(getUsers());
    };
    const load = async () => {
      refresh();
      const { pullOps } = await import("@/lib/ops-client");
      await pullOps();
      if (!alive) return;
      refresh();
    };
    void load();
    const tick = window.setInterval(() => void load(), 5000);
    const unsub = subscribeStore(refresh);
    return () => {
      alive = false;
      window.clearInterval(tick);
      unsub();
    };
  }, []);

  const scoped =
    user?.role === "staff" ? apps.filter((a) => a.assignedTo === user.id) : apps;
  const open = scoped.filter((a) => a.status !== "complete");
  const admin = user?.role === "admin";

  const stats = useMemo(() => {
    const uploadedWaiting = scoped.reduce(
      (n, app) => n + app.documents.filter((d) => d.status === "uploaded").length,
      0,
    );
    return {
      newClients: scoped.filter((a) => a.status === "draft").length,
      docChecks: uploadedWaiting,
      revisions: scoped.filter((a) => a.status === "revision").length,
      appointments: scoped.filter((a) => appointmentSoon(a.appointment)).length,
      followups: scoped.filter((a) => a.status === "revision" || a.status === "missing").length,
    };
  }, [scoped]);

  const list = scoped.filter((app) => {
    if (family !== "all" && visaBucket(app.visaFamily) !== family) return false;
    if (status !== "all" && crmStatusOf(app) !== status) return false;
    return true;
  });

  return (
    <div>
      <h1 className="font-serif text-4xl">{t(locale, "Bugün yapılacaklar", "Today’s desk")}</h1>
      <p className="mt-2 text-sm text-ink-soft">
        {admin
          ? t(locale, "Kuyruk, ülke ve duruma göre. Dosyayı atayın veya evrakları inceleyin.", "Queue by country and status. Assign a file or review documents.")
          : t(locale, "Size atanan dosyalar. Evrakları onaylayın veya revizyon isteyin.", "Files assigned to you. Approve documents or request revision.")}
      </p>
      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {[
          [stats.newClients, t(locale, "yeni müşteri", "new clients")],
          [stats.docChecks, t(locale, "evrak kontrolü", "document checks")],
          [stats.revisions, t(locale, "müşteri revizyon bekliyor", "clients awaiting revision")],
          [stats.appointments, t(locale, "randevu yaklaşmış", "upcoming appointments")],
          [stats.followups, t(locale, "müşteriye dönüş", "client follow-ups")],
        ].map(([n, label]) => (
          <div key={String(label)} className="rounded-2xl border border-line bg-paper p-4">
            <p className="font-serif text-3xl">{n}</p>
            <p className="mt-1 text-xs text-muted">{label}</p>
          </div>
        ))}
      </div>
      <div className="mt-6 flex flex-wrap gap-2">
        {FAMILY_FILTERS.map((row) => (
          <button
            key={row.id}
            type="button"
            onClick={() => setFamily(row.id)}
            className={`rounded-full px-3 py-1.5 text-xs ${family === row.id ? "bg-navy text-cream" : "border border-line"}`}
          >
            {t(locale, row.tr, row.en)}
          </button>
        ))}
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {STATUS_FILTERS.map((row) => (
          <button
            key={row.id}
            type="button"
            onClick={() => setStatus(row.id)}
            className={`rounded-full px-3 py-1.5 text-xs ${status === row.id ? "bg-navy text-cream" : "border border-line"}`}
          >
            {t(locale, row.tr, row.en)}
          </button>
        ))}
      </div>
      <div className="mt-8 space-y-3">
        {list.map((app) => {
          const p = progressOf(app);
          const waiting = app.documents.filter((d) => d.status === "uploaded").length;
          const assigned = Boolean(app.assignedTo);
          const canEdit = admin && (!assigned || editingId === app.id);
          const cardClass = assigned ? QUEUE_CARD_TONE[app.status] : "border-line bg-paper";
          return (
            <div key={app.id} className={`rounded-xl border px-5 py-4 ${cardClass}`}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <Link href={`${basePath}/basvuru/${app.id}`} className="min-w-0 hover:text-gold-deep">
                  <p className="font-medium">{t(locale, app.destinationTr, app.destinationEn)}</p>
                  <p className="mt-1 text-xs text-muted">
                    {app.id} · {people.find((person) => person.id === app.userId)?.name || app.userId} · {app.advisorName} · {waiting}{" "}
                    {t(locale, "kontrol bekliyor", "awaiting review")} · {p.done}/{p.total}
                  </p>
                </Link>
                <div className="flex shrink-0 flex-col items-end gap-1">
                  <StatusBadge status={app.status} locale={locale} />
                  {admin && assigned && (
                    <button
                      type="button"
                      className="text-xs font-medium text-gold-deep hover:underline"
                      onClick={() => setEditingId((id) => (id === app.id ? null : app.id))}
                    >
                      {editingId === app.id ? t(locale, "Kapat", "Done") : t(locale, "Danışman değiştir", "Change advisor")}
                    </button>
                  )}
                  {admin && (
                    <button
                      type="button"
                      className="text-xs text-[#8a3b24]"
                      onClick={() => {
                        if (window.confirm(t(locale, "Bu dosyayı silmek istiyor musunuz?", "Delete this file?"))) {
                          deleteApplication(app.id);
                        }
                      }}
                    >
                      {t(locale, "Sil", "Delete")}
                    </button>
                  )}
                </div>
              </div>
              {admin && (
                <div className="mt-3 grid gap-3 sm:grid-cols-2 md:max-w-xl">
                  <AdminFeeField appId={app.id} feeTry={app.feeTry} locale={locale} disabled={!canEdit} />
                  <label className="block text-xs text-muted">
                    {t(locale, "Danışman", "Advisor")}
                    {staff.length === 0 ? (
                      <p className="mt-1 text-sm text-ink-soft">
                        {t(locale, "Önce Danışmanlar’dan hesap açın.", "Create an advisor account first.")}{" "}
                        <Link href="/yonetim/danismanlar" className="text-gold-deep">
                          {t(locale, "Danışmanlar", "Advisors")}
                        </Link>
                      </p>
                    ) : (
                      <select
                        className="mt-1 w-full rounded-lg border border-line bg-cream px-3 py-2 text-sm text-ink disabled:cursor-not-allowed disabled:opacity-60"
                        value={app.assignedTo}
                        disabled={!canEdit}
                        onChange={(e) => {
                          if (e.target.value) assignApplication(app.id, e.target.value);
                          setEditingId(null);
                        }}
                      >
                        <option value="">{t(locale, "Atanmadı", "Unassigned")}</option>
                        {staff.map((person) => (
                          <option key={person.id} value={person.id}>
                            {person.name}
                          </option>
                        ))}
                      </select>
                    )}
                  </label>
                </div>
              )}
            </div>
          );
        })}
        {list.length === 0 && <p className="text-sm text-muted">{t(locale, "Bu filtrede dosya yok.", "No files in this filter.")}</p>}
        {open.length === 0 && status === "all" && family === "all" && (
          <p className="text-sm text-muted">{t(locale, "Açık dosya yok.", "No open files.")}</p>
        )}
      </div>
    </div>
  );
}

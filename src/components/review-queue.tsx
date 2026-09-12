"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { StatusBadge } from "@/components/badges";
import { useAuth } from "@/lib/auth";
import { useLocale } from "@/lib/locale";
import { t } from "@/lib/i18n";
import { AdminFeeField } from "@/components/admin-fee-field";
import { assignApplication, getApplications, getStaffUsers, progressOf, subscribeStore } from "@/lib/store";
import type { Application, User } from "@/lib/types";

export function ReviewQueue({ basePath }: { basePath: "/danisman" | "/yonetim" }) {
  const { locale } = useLocale();
  const { user } = useAuth();
  const [apps, setApps] = useState<Application[]>([]);
  const [staff, setStaff] = useState<User[]>([]);

  useEffect(() => {
    const load = () => {
      setApps(getApplications());
      setStaff(getStaffUsers());
    };
    load();
    return subscribeStore(load);
  }, []);

  const open = apps.filter((a) => a.status !== "complete");
  const list =
    user?.role === "staff" ? open.filter((a) => a.assignedTo === user.id) : open;
  const admin = user?.role === "admin";

  return (
    <div>
      <h1 className="font-serif text-4xl">{t(locale, "İnceleme kuyruğu", "Review queue")}</h1>
      <p className="mt-2 text-sm text-ink-soft">
        {admin
          ? t(locale, "Dosyayı bir danışmana atayın veya evrakları inceleyin.", "Assign a file to an advisor or review documents.")
          : t(locale, "Size atanan dosyalardaki evrakları onaylayın veya eksik bildirin.", "Approve or flag documents on files assigned to you.")}
      </p>
      <div className="mt-8 space-y-3">
        {list.map((app) => {
          const p = progressOf(app);
          const waiting = app.documents.filter((d) => d.status === "uploaded").length;
          return (
            <div key={app.id} className="rounded-xl border border-line bg-paper px-5 py-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <Link href={`${basePath}/basvuru/${app.id}`} className="min-w-0 hover:text-gold-deep">
                  <p className="font-medium">{t(locale, app.destinationTr, app.destinationEn)}</p>
                  <p className="mt-1 text-xs text-muted">
                    {app.id} · {app.advisorName} · {app.feeTry.toLocaleString("tr-TR")} TL · {waiting}{" "}
                    {t(locale, "kontrol bekliyor", "awaiting review")} · {p.done}/{p.total}
                  </p>
                </Link>
                <StatusBadge status={app.status} locale={locale} />
              </div>
              {admin && (
                <div className="mt-3 grid gap-3 sm:grid-cols-2 md:max-w-xl">
                  <AdminFeeField appId={app.id} feeTry={app.feeTry} locale={locale} />
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
                        className="mt-1 w-full rounded-lg border border-line bg-cream px-3 py-2 text-sm text-ink"
                        value={app.assignedTo}
                        onChange={(e) => {
                          if (e.target.value) assignApplication(app.id, e.target.value);
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
        {list.length === 0 && (
          <p className="text-sm text-muted">{t(locale, "Açık dosya yok.", "No open files.")}</p>
        )}
      </div>
    </div>
  );
}

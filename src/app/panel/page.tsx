"use client";

import { useEffect, useState } from "react";
import { ClientHub } from "@/components/client-hub";
import { AppLink } from "@/components/panel-shell";
import { StatusBadge } from "@/components/badges";
import { useAuth } from "@/lib/auth";
import { useLocale } from "@/lib/locale";
import { t } from "@/lib/i18n";
import { getApplications, getUserById, progressOf, subscribeStore } from "@/lib/store";
import type { Application } from "@/lib/types";

export default function PanelHome() {
  const { user } = useAuth();
  const { locale } = useLocale();
  const [apps, setApps] = useState<Application[]>([]);

  useEffect(() => {
    if (!user) return;
    const load = () => setApps(getApplications(user.id));
    load();
    return subscribeStore(load);
  }, [user]);

  const active = apps.find((a) => a.status !== "complete") ?? apps[0];
  const advisor = active ? getUserById(active.assignedTo) : undefined;

  return (
    <div>
      {active && user ? (
        <ClientHub userName={user.name} app={active} advisor={advisor} locale={locale} />
      ) : (
        <>
          <p className="text-xs uppercase tracking-[0.28em] text-gold-deep">
            {t(locale, "Ranz Global müşteri paneli", "Ranz Global client portal")}
          </p>
          <h1 className="mt-2 font-serif text-4xl">{t(locale, `Merhaba ${user?.name || ""}`, `Hello ${user?.name || ""}`)}</h1>
          <p className="mt-2 max-w-xl text-sm text-ink-soft">
            {t(locale, "Başvurunuzu yönetin ve sürecinizi takip edin.", "Manage your application and follow the process.")}
          </p>
        </>
      )}

      <div className="mt-12 flex items-end justify-between">
        <h3 className="font-serif text-2xl">{t(locale, "Dosyalarım", "My files")}</h3>
        <AppLink href="/panel/yeni" className="text-sm text-gold-deep">
          {t(locale, "Yeni dosya", "New file")}
        </AppLink>
      </div>
      <div className="mt-4 space-y-3">
        {apps.map((app) => {
          const p = progressOf(app);
          return (
            <AppLink
              key={app.id}
              href={`/panel/basvuru/${app.id}`}
              className="flex items-center justify-between rounded-xl border border-line bg-paper px-5 py-4 hover:border-gold"
            >
              <div>
                <p className="font-medium">{t(locale, app.destinationTr, app.destinationEn)}</p>
                <p className="mt-1 text-xs text-muted">
                  {app.id} · {p.done}/{p.total} {t(locale, "zorunlu evrak", "required documents")}
                </p>
              </div>
              <StatusBadge status={app.status} locale={locale} />
            </AppLink>
          );
        })}
        {apps.length === 0 && (
          <p className="text-sm text-muted">{t(locale, "Henüz dosya yok. Yeni dosya açarak başlayın.", "No files yet. Start by opening a new file.")}</p>
        )}
      </div>
    </div>
  );
}

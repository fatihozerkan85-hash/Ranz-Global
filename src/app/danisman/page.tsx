"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { StatusBadge } from "@/components/badges";
import { useLocale } from "@/lib/locale";
import { t } from "@/lib/i18n";
import { getApplications, progressOf, subscribeStore } from "@/lib/store";
import type { Application } from "@/lib/types";

export default function StaffQueuePage() {
  const { locale } = useLocale();
  const [apps, setApps] = useState<Application[]>([]);

  useEffect(() => {
    const load = () => setApps(getApplications());
    load();
    return subscribeStore(load);
  }, []);

  const open = apps.filter((a) => a.status !== "complete");

  return (
    <div>
      <h1 className="font-serif text-4xl">{t(locale, "İnceleme kuyruğu", "Review queue")}</h1>
      <p className="mt-2 text-sm text-ink-soft">
        {t(locale, "Yüklenen evrakları onaylayın veya eksik bildirin.", "Approve uploads or flag missing items.")}
      </p>
      <div className="mt-8 space-y-3">
        {open.map((app) => {
          const p = progressOf(app);
          const waiting = app.documents.filter((d) => d.status === "uploaded").length;
          return (
            <Link
              key={app.id}
              href={`/danisman/basvuru/${app.id}`}
              className="flex items-center justify-between rounded-xl border border-line bg-paper px-5 py-4 hover:border-gold"
            >
              <div>
                <p className="font-medium">
                  {locale === "en" ? app.destinationEn : app.destinationTr}
                </p>
                <p className="mt-1 text-xs text-muted">
                  {app.id} · {waiting} {t(locale, "kontrol bekliyor", "awaiting review")} · {p.done}/
                  {p.total}
                </p>
              </div>
              <StatusBadge status={app.status} locale={locale} />
            </Link>
          );
        })}
        {open.length === 0 && (
          <p className="text-sm text-muted">{t(locale, "Açık dosya yok.", "No open files.")}</p>
        )}
      </div>
    </div>
  );
}

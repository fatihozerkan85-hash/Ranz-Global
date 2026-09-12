"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { FilePipeline } from "@/components/file-pipeline";
import { StatusBadge } from "@/components/badges";
import { useAuth } from "@/lib/auth";
import { useLocale } from "@/lib/locale";
import { t } from "@/lib/i18n";
import { getApplications, nextAction, progressOf, subscribeStore } from "@/lib/store";
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

  return (
    <div>
      <p className="text-xs uppercase tracking-[0.28em] text-gold-deep">
        {t(locale, "Hoş geldiniz", "Welcome")}
      </p>
      <h1 className="mt-2 font-serif text-4xl">{user?.name}</h1>
      <p className="mt-2 max-w-xl text-sm text-ink-soft">
        {t(
          locale,
          "Atlys ve iVisa’daki gibi: bugün ne yapmanız gerektiği tek kartta.",
          "Like Atlys and iVisa: today’s only task sits on one card.",
        )}
      </p>

      {active && (
        <div className="mt-8 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <Link
            href={`/panel/basvuru/${active.id}`}
            className="block rounded-2xl bg-navy p-6 text-cream transition hover:opacity-95 md:p-8"
          >
            <p className="text-xs uppercase tracking-[0.22em] text-gold">
              {t(locale, "Sıradaki adım", "Next step")}
            </p>
            <h2 className="mt-3 font-serif text-3xl">
              {t(locale, active.destinationTr, active.destinationEn)}
            </h2>
            <p className="mt-3 text-sm text-cream/75">{nextAction(active, locale)}</p>
            <p className="mt-6 inline-flex items-center gap-2 text-sm">
              {t(locale, "Dosyayı aç", "Open file")}
              <ArrowRight size={16} />
            </p>
          </Link>
          <FilePipeline app={active} locale={locale} />
        </div>
      )}

      <div className="mt-10 flex items-end justify-between">
        <h3 className="font-serif text-2xl">{t(locale, "Dosyalarım", "My files")}</h3>
        <Link href="/panel/yeni" className="text-sm text-gold-deep">
          {t(locale, "Yeni dosya", "New file")}
        </Link>
      </div>
      <div className="mt-4 space-y-3">
        {apps.map((app) => {
          const p = progressOf(app);
          return (
            <Link
              key={app.id}
              href={`/panel/basvuru/${app.id}`}
              className="flex items-center justify-between rounded-xl border border-line bg-paper px-5 py-4 hover:border-gold"
            >
              <div>
                <p className="font-medium">
                  {t(locale, app.destinationTr, app.destinationEn)}
                </p>
                <p className="mt-1 text-xs text-muted">
                  {app.id} · {p.done}/{p.total} {t(locale, "zorunlu evrak", "required documents")}
                </p>
              </div>
              <StatusBadge status={app.status} locale={locale} />
            </Link>
          );
        })}
        {apps.length === 0 && (
          <p className="text-sm text-muted">{t(locale, "Henüz dosya yok.", "No files yet.")}</p>
        )}
      </div>
    </div>
  );
}

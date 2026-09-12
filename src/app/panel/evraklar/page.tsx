"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { DocBadge } from "@/components/badges";
import { useAuth } from "@/lib/auth";
import { useLocale } from "@/lib/locale";
import { t } from "@/lib/i18n";
import { documentOpenHref } from "@/lib/blob-evrak";
import { getApplications, subscribeStore } from "@/lib/store";
import type { Application } from "@/lib/types";

export default function VaultPage() {
  const { user } = useAuth();
  const { locale } = useLocale();
  const [apps, setApps] = useState<Application[]>([]);

  useEffect(() => {
    if (!user) return;
    const load = () => setApps(getApplications(user.id));
    load();
    return subscribeStore(load);
  }, [user]);

  const docs = apps.flatMap((app) =>
    app.documents
      .filter((d) => d.status !== "empty")
      .map((d) => ({ app, d })),
  );

  return (
    <div>
      <h1 className="font-serif text-4xl">{t(locale, "Evrak kasası", "Document vault")}</h1>
      <p className="mt-2 text-sm text-ink-soft">
        {t(
          locale,
          "Bir kez yüklenen belgeler burada durur. Sonraki dosyada yeniden kullanabilirsiniz.",
          "Documents you uploaded once stay here. Reuse them on the next file.",
        )}
      </p>
      <div className="mt-8 divide-y divide-line rounded-2xl border border-line bg-paper px-5">
        {docs.map(({ app, d }) => {
          const openHref = documentOpenHref(d.filePathname);
          return (
            <div key={`${app.id}-${d.key}`} className="flex items-center justify-between gap-3 py-4">
              <Link href={`/panel/basvuru/${app.id}`} className="min-w-0">
                <p className="font-medium">{t(locale, d.labelTr, d.labelEn)}</p>
                <p className="mt-1 truncate text-xs text-muted">
                  {app.id} · {d.fileName}
                </p>
              </Link>
              <div className="flex shrink-0 items-center gap-2">
                {openHref && (
                  <a href={openHref} target="_blank" rel="noreferrer" className="text-xs text-gold-deep">
                    {t(locale, "Aç", "Open")}
                  </a>
                )}
                <DocBadge status={d.status} locale={locale} />
              </div>
            </div>
          );
        })}
        {docs.length === 0 && (
          <p className="py-8 text-sm text-muted">{t(locale, "Henüz yüklenmiş evrak yok.", "No documents yet.")}</p>
        )}
      </div>
    </div>
  );
}

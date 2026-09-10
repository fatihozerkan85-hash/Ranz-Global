"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { DocBadge } from "@/components/badges";
import { useAuth } from "@/lib/auth";
import { useLocale } from "@/lib/locale";
import { t } from "@/lib/i18n";
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
        {docs.map(({ app, d }) => (
          <Link
            key={`${app.id}-${d.key}`}
            href={`/panel/basvuru/${app.id}`}
            className="flex items-center justify-between py-4"
          >
            <div>
              <p className="font-medium">{t(locale, d.labelTr, d.labelEn)}</p>
              <p className="mt-1 text-xs text-muted">
                {app.id} · {d.fileName}
              </p>
            </div>
            <DocBadge status={d.status} locale={locale} />
          </Link>
        ))}
        {docs.length === 0 && (
          <p className="py-8 text-sm text-muted">{t(locale, "Henüz yüklenmiş evrak yok.", "No documents yet.")}</p>
        )}
      </div>
    </div>
  );
}

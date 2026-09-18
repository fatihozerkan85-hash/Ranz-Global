"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { DocumentStatusCard } from "@/components/document-status-card";
import { useAuth } from "@/lib/auth";
import { useLocale } from "@/lib/locale";
import { t } from "@/lib/i18n";
import { isFormDoc } from "@/lib/file-hub";
import { getApplications, subscribeStore, uploadDocument } from "@/lib/store";
import { uploadEvrakFile } from "@/lib/upload-evrak";
import type { Application } from "@/lib/types";

export default function FormsHub() {
  const { user } = useAuth();
  const { locale } = useLocale();
  const [apps, setApps] = useState<Application[]>([]);

  useEffect(() => {
    if (!user) return;
    const load = () => setApps(getApplications(user.id));
    load();
    return subscribeStore(load);
  }, [user]);

  return (
    <div>
      <p className="text-xs uppercase tracking-[0.28em] text-gold-deep">{t(locale, "Formlarım", "My forms")}</p>
      <h1 className="mt-2 font-serif text-4xl">{t(locale, "Başvuru formları", "Application forms")}</h1>
      <p className="mt-2 max-w-xl text-sm text-ink-soft">
        {t(
          locale,
          "DS-160, UKVI ve benzeri form kayıtları dosyanızdaki madde olarak durur. Danışmanınız doldurmanız gerekenleri işaretler.",
          "DS-160, UKVI and similar forms sit as items on your file. Your advisor marks what you need to complete.",
        )}
      </p>
      <div className="mt-8 space-y-8">
        {apps.map((app) => {
          const forms = app.documents.filter((d) => isFormDoc(d.labelTr, d.labelEn, d.key));
          return (
            <section key={app.id}>
              <div className="mb-3 flex items-center justify-between">
                <h2 className="font-serif text-2xl">{t(locale, app.destinationTr, app.destinationEn)}</h2>
                <Link href={`/panel/basvuru/${app.id}`} className="text-sm text-gold-deep">
                  {t(locale, "Tüm evraklar", "All documents")}
                </Link>
              </div>
              {forms.length === 0 ? (
                <p className="text-sm text-muted">
                  {t(locale, "Bu dosyada ayrı bir form maddesi yok. Evrak listenizden devam edin.", "This file has no separate form item. Continue from your document list.")}
                </p>
              ) : (
                <div className="space-y-3">
                  {forms.map((doc) => (
                    <DocumentStatusCard
                      key={doc.key}
                      doc={doc}
                      locale={locale}
                      onUpload={async (file) => {
                        const blob = await uploadEvrakFile(app.id, doc.key, file);
                        uploadDocument(app.id, doc.key, file.name, { pathname: blob.pathname, url: blob.url });
                      }}
                    />
                  ))}
                </div>
              )}
            </section>
          );
        })}
        {apps.length === 0 && <p className="text-sm text-muted">{t(locale, "Henüz dosya yok.", "No files yet.")}</p>}
      </div>
    </div>
  );
}

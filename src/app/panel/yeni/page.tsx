"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { useLocale } from "@/lib/locale";
import { t } from "@/lib/i18n";
import { VISA_TYPES } from "@/lib/visa-catalog";
import { createApplication } from "@/lib/store";
import type { VisaCountry } from "@/lib/types";

export default function NewFilePage() {
  const { locale } = useLocale();
  const { user } = useAuth();
  const router = useRouter();
  const [country, setCountry] = useState<VisaCountry | null>(null);

  const selected = VISA_TYPES.find((v) => v.id === country);

  return (
    <div>
      <h1 className="font-serif text-4xl">{t(locale, "Yeni dosya", "New file")}</h1>
      <p className="mt-2 text-sm text-ink-soft">
        {t(
          locale,
          "Başvuracağınız ülkeyi seçin. Evrak listesi o ülkeye göre açılır.",
          "Choose the country you will apply for. The document list follows that country.",
        )}
      </p>

      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        {VISA_TYPES.map((type) => (
          <button
            key={type.id}
            type="button"
            onClick={() => setCountry(type.id)}
            className={`rounded-2xl border p-5 text-left ${
              country === type.id ? "border-gold bg-paper" : "border-line bg-paper"
            }`}
          >
            <p className="font-serif text-2xl">{locale === "en" ? type.titleEn : type.titleTr}</p>
            <p className="mt-1 text-sm text-muted">{locale === "en" ? type.titleHintEn : type.hintTr}</p>
          </button>
        ))}
      </div>

      {selected && (
        <div className="mt-8 rounded-2xl border border-line bg-paper p-6">
          <h2 className="font-serif text-2xl">
            {t(locale, "Yüklenecek evraklar", "Documents to upload")}
          </h2>
          <p className="mt-1 text-sm text-muted">
            {locale === "en" ? selected.titleEn : selected.titleTr}
          </p>
          <ul className="mt-4 space-y-2 text-sm">
            {selected.documents.map((doc) => (
              <li key={doc.key} className="flex items-start justify-between gap-3 border-b border-line py-2 last:border-0">
                <span>{locale === "en" ? doc.labelEn : doc.labelTr}</span>
                <span className="shrink-0 text-xs uppercase tracking-wider text-gold-deep">
                  {doc.required ? t(locale, "Zorunlu", "Required") : t(locale, "İsteğe bağlı", "Optional")}
                </span>
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={() => {
              if (!user) return;
              const app = createApplication(user.id, selected.id);
              if (app) router.push(`/panel/basvuru/${app.id}`);
            }}
            className="mt-6 rounded-full bg-ink px-6 py-3 text-sm text-cream"
          >
            {t(locale, "Bu ülkeyle dosya aç", "Open file for this country")}
          </button>
        </div>
      )}
    </div>
  );
}

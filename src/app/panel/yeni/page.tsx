"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { useLocale } from "@/lib/locale";
import { t } from "@/lib/i18n";
import { VISA_TYPES } from "@/lib/visa-catalog";
import { createApplication } from "@/lib/store";
import type { VisaFamily } from "@/lib/types";

export default function NewFilePage() {
  const { locale } = useLocale();
  const { user } = useAuth();
  const router = useRouter();
  const [family, setFamily] = useState<VisaFamily | null>(null);

  const types = VISA_TYPES.filter((v) => v.family === family);

  return (
    <div>
      <h1 className="font-serif text-4xl">{t(locale, "Yeni dosya", "New file")}</h1>
      <p className="mt-2 text-sm text-ink-soft">
        {t(locale, "Önce yön, sonra vize türü. Form yağmuru yok.", "Destination first, then visa type. No form dump.")}
      </p>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <button
          type="button"
          onClick={() => setFamily("europe")}
          className={`rounded-2xl border p-6 text-left ${family === "europe" ? "border-gold bg-paper" : "border-line bg-paper"}`}
        >
          <p className="font-serif text-2xl">{t(locale, "Avrupa", "Europe")}</p>
          <p className="mt-1 text-sm text-muted">{t(locale, "Schengen ve ilgili vizeler", "Schengen and related visas")}</p>
        </button>
        <button
          type="button"
          onClick={() => setFamily("america")}
          className={`rounded-2xl border p-6 text-left ${family === "america" ? "border-gold bg-paper" : "border-line bg-paper"}`}
        >
          <p className="font-serif text-2xl">{t(locale, "Amerika", "United States")}</p>
          <p className="mt-1 text-sm text-muted">{t(locale, "B1/B2 ve öğrenci", "B1/B2 and student")}</p>
        </button>
      </div>

      {family && (
        <div className="mt-8 space-y-3">
          {types.map((type) => (
            <button
              key={type.id}
              type="button"
              onClick={() => {
                if (!user) return;
                const app = createApplication(user.id, type.id);
                if (app) router.push(`/panel/basvuru/${app.id}`);
              }}
              className="flex w-full items-center justify-between rounded-xl border border-line bg-paper px-5 py-4 text-left hover:border-gold"
            >
              <div>
                <p className="font-medium">{locale === "en" ? type.titleEn : type.titleTr}</p>
                <p className="mt-1 text-xs text-muted">
                  {locale === "en" ? type.titleHintEn : type.hintTr}
                </p>
              </div>
              <span className="text-xs text-gold-deep">{t(locale, "Aç", "Open")}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

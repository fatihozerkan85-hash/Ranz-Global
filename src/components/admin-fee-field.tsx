"use client";

import { useEffect, useState } from "react";
import type { Locale } from "@/lib/types";
import { t } from "@/lib/i18n";
import { setApplicationFee } from "@/lib/store";

function parseTry(raw: string) {
  const n = Number(raw.replace(/\s/g, "").replace(/\./g, "").replace(",", "."));
  if (!Number.isFinite(n) || n < 0) return null;
  return Math.round(n);
}

export function AdminFeeField({
  appId,
  feeTry,
  locale,
}: {
  appId: string;
  feeTry: number;
  locale: Locale;
}) {
  const [value, setValue] = useState(String(feeTry));

  useEffect(() => {
    setValue(String(feeTry));
  }, [feeTry]);

  const save = () => {
    const next = parseTry(value);
    if (next === null) {
      setValue(String(feeTry));
      return;
    }
    setApplicationFee(appId, next);
    setValue(String(next));
  };

  return (
    <div>
      <label htmlFor={`fee-${appId}`} className="block text-xs text-muted">
        {t(locale, "Hizmet bedeli (TL)", "Service fee (TRY)")}
      </label>
      <span className="mt-1 flex gap-2 md:max-w-xs">
        <input
          id={`fee-${appId}`}
          type="text"
          inputMode="numeric"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={save}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              save();
            }
          }}
          className="w-full rounded-lg border border-line bg-cream px-3 py-2 text-sm text-ink"
        />
        <button type="button" className="btn btn-sm shrink-0" onClick={save}>
          {t(locale, "Kaydet", "Save")}
        </button>
      </span>
    </div>
  );
}

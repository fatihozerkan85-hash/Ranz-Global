"use client";

import { LOCALES, LOCALE_META } from "@/lib/i18n";
import { useLocale } from "@/lib/locale";

export function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
  const { locale, setLocale } = useLocale();
  return (
    <label className="inline-flex items-center gap-1">
      <span className="sr-only">{LOCALE_META[locale].native}</span>
      <select
        value={locale}
        onChange={(e) => setLocale(e.target.value as typeof locale)}
        aria-label="Language"
        className={`rounded-full border border-line bg-paper px-2 py-1 text-[11px] font-medium uppercase tracking-wider text-muted ${
          compact ? "max-w-[4.5rem]" : "max-w-[7.5rem]"
        }`}
      >
        {LOCALES.map((code) => (
          <option key={code} value={code}>
            {compact ? LOCALE_META[code].short : LOCALE_META[code].native}
          </option>
        ))}
      </select>
    </label>
  );
}

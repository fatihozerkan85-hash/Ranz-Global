"use client";

import { LOCALES, LOCALE_META } from "@/lib/i18n";
import { useLocale } from "@/lib/locale";

export function LanguageSwitcher({
  compact = false,
  tone = "navy",
}: {
  compact?: boolean;
  tone?: "navy" | "gold";
}) {
  const { locale, setLocale } = useLocale();
  const gold = tone === "gold";
  return (
    <label className="inline-flex items-center gap-1">
      <span className="sr-only">{LOCALE_META[locale].native}</span>
      <select
        value={locale}
        onChange={(e) => setLocale(e.target.value as typeof locale)}
        aria-label="Language"
        className={`header-chip border ${
          gold ? "header-chip-gold border-gold text-ink" : "header-chip-navy border-navy text-cream"
        }`}
      >
        {LOCALES.map((code) => (
          <option key={code} value={code} className="bg-paper text-ink">
            {compact ? LOCALE_META[code].short : LOCALE_META[code].native}
          </option>
        ))}
      </select>
    </label>
  );
}

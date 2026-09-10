"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { Locale } from "./types";
import { isLocale, LOCALE_META } from "./i18n";

const KEY = "ranz-locale";

type Ctx = {
  locale: Locale;
  setLocale: (l: Locale) => void;
};

const LocaleContext = createContext<Ctx>({ locale: "tr", setLocale: () => {} });

function applyDocumentLocale(locale: Locale) {
  document.documentElement.lang = locale;
  document.documentElement.dir = LOCALE_META[locale].dir;
}

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("tr");

  useEffect(() => {
    const saved = localStorage.getItem(KEY);
    if (isLocale(saved)) {
      setLocaleState(saved);
      applyDocumentLocale(saved);
    }
  }, []);

  const setLocale = (l: Locale) => {
    setLocaleState(l);
    localStorage.setItem(KEY, l);
    applyDocumentLocale(l);
  };

  const value = useMemo(() => ({ locale, setLocale }), [locale]);
  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  return useContext(LocaleContext);
}

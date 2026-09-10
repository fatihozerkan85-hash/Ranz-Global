"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { Locale } from "./types";

const KEY = "ranz-locale";

type Ctx = {
  locale: Locale;
  setLocale: (l: Locale) => void;
};

const LocaleContext = createContext<Ctx>({ locale: "tr", setLocale: () => {} });

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("tr");

  useEffect(() => {
    const saved = localStorage.getItem(KEY) as Locale | null;
    if (saved === "en" || saved === "tr") setLocaleState(saved);
  }, []);

  const setLocale = (l: Locale) => {
    setLocaleState(l);
    localStorage.setItem(KEY, l);
    document.documentElement.lang = l;
  };

  const value = useMemo(() => ({ locale, setLocale }), [locale]);
  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  return useContext(LocaleContext);
}

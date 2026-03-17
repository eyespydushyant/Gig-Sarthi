"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { DEFAULT_LOCALE } from "./languages";

// Import all translation files
import en from "./translations/en.json";
import hi from "./translations/hi.json";
import bn from "./translations/bn.json";
import ta from "./translations/ta.json";
import te from "./translations/te.json";
import mr from "./translations/mr.json";
import gu from "./translations/gu.json";
import kn from "./translations/kn.json";
import ml from "./translations/ml.json";
import pa from "./translations/pa.json";

const translations: Record<string, Record<string, Record<string, string>>> = {
  en, hi, bn, ta, te, mr, gu, kn, ml, pa,
};

interface LanguageContextType {
  locale: string;
  setLocale: (code: string) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  locale: DEFAULT_LOCALE,
  setLocale: () => {},
  t: (key: string) => key,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState(DEFAULT_LOCALE);

  useEffect(() => {
    const saved = localStorage.getItem("gigsarthi_lang");
    if (saved && translations[saved]) {
      setLocaleState(saved);
    }
  }, []);

  const setLocale = useCallback((code: string) => {
    setLocaleState(code);
    localStorage.setItem("gigsarthi_lang", code);
    localStorage.setItem("gigsarthi_lang_chosen", "true");
  }, []);

  const t = useCallback(
    (key: string): string => {
      // key format: "section.key" e.g. "home.title"
      const [section, ...rest] = key.split(".");
      const k = rest.join(".");
      const dict = translations[locale] || translations[DEFAULT_LOCALE];
      const fallback = translations[DEFAULT_LOCALE];
      return dict?.[section]?.[k] || fallback?.[section]?.[k] || key;
    },
    [locale]
  );

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}

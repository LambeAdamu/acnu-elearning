"use client";
import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { dictionary, Locale, Dictionary } from "./dictionary";

interface LanguageContextValue {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: Dictionary;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

const COOKIE_NAME = "acnu_locale";

function lireLocaleInitiale(): Locale {
  if (typeof document === "undefined") return "fr";
  const cookieMatch = document.cookie.match(new RegExp(`${COOKIE_NAME}=(fr|en)`));
  if (cookieMatch) return cookieMatch[1] as Locale;
  const stored = window.localStorage.getItem(COOKIE_NAME);
  if (stored === "fr" || stored === "en") return stored;
  // Détection basique de la langue du navigateur, avec repli sur le français
  return navigator.language?.toLowerCase().startsWith("en") ? "en" : "fr";
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("fr");

  useEffect(() => {
    setLocaleState(lireLocaleInitiale());
  }, []);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    window.localStorage.setItem(COOKIE_NAME, l);
    document.cookie = `${COOKIE_NAME}=${l}; path=/; max-age=31536000`;
  }, []);

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t: dictionary[locale] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage doit être utilisé à l'intérieur de <LanguageProvider>");
  return ctx;
}

"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { type Dictionary, type Language, dictionaries } from "./dictionaries";

const STORAGE_KEY = "language";

type LanguageContextValue = {
  language: Language;
  setLanguage: (lang: Language) => void;
  dict: Dictionary;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("es");

  useEffect(() => {
    // Read after mount — localStorage isn't available during SSR, and this
    // keeps the server-rendered "es" default consistent with first paint.
    const stored = window.localStorage.getItem(STORAGE_KEY);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (stored === "es" || stored === "en") setLanguageState(stored);
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  function setLanguage(lang: Language) {
    setLanguageState(lang);
    window.localStorage.setItem(STORAGE_KEY, lang);
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, dict: dictionaries[language] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within a LanguageProvider");
  return ctx;
}

export function useDictionary() {
  return useLanguage().dict;
}

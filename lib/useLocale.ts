"use client";

import { useState, useEffect } from "react";
import { LOCALES, type Locale, TEXTS } from "@/data/i18n";

const STORAGE_KEY = "sj-alliance-locale";

export function useLocale() {
  const [locale, setLocaleState] = useState<Locale>("ko");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as Locale | null;
    if (saved && LOCALES.find((l) => l.code === saved)) {
      setLocaleState(saved);
    }
    setMounted(true);
  }, []);

  function setLocale(code: Locale) {
    setLocaleState(code);
    localStorage.setItem(STORAGE_KEY, code);
  }

  function t(key: keyof typeof TEXTS): string {
    return TEXTS[key]?.[locale] ?? TEXTS[key]?.ko ?? "";
  }

  return { locale, setLocale, t, mounted };
}

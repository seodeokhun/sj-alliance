"use client";

import { useState } from "react";
import { LOCALES, type Locale } from "@/data/i18n";

type Props = {
  locale: Locale;
  onChange: (locale: Locale) => void;
  compact?: boolean;
};

export default function LangSwitcher({ locale, onChange, compact = false }: Props) {
  const [open, setOpen] = useState(false);
  const current = LOCALES.find((l) => l.code === locale);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2"
        style={{ backgroundColor: "#213A8F", color: "white" }}
      >
        <span>🌐</span>
        {!compact && <span className="hidden sm:inline">{current?.label}</span>}
        <span className="text-xs">▼</span>
      </button>
      {open && (
        <>
          <div onClick={() => setOpen(false)} className="fixed inset-0 z-40" />
          <div className="absolute right-0 mt-2 bg-white rounded-lg shadow-lg overflow-hidden min-w-[160px] z-50">
            {LOCALES.map((l) => (
              <button
                key={l.code}
                onClick={() => { onChange(l.code); setOpen(false); }}
                className={`w-full px-4 py-2.5 text-left text-sm flex items-center gap-2 hover:bg-gray-100 ${l.code === locale ? "bg-blue-50 font-medium" : ""}`}
                style={l.code === locale ? { color: "#11306E" } : {}}
              >
                <span>{l.flag}</span>
                <span>{l.label}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

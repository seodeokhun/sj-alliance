"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { LOCALES, type Locale } from "@/data/i18n";

export default function Home() {
  const [locale, setLocale] = useState<Locale>("ko");
  const [showLangMenu, setShowLangMenu] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("sj-alliance-locale") as Locale | null;
    if (saved && LOCALES.find((l) => l.code === saved)) setLocale(saved);
  }, []);

  function changeLocale(code: Locale) {
    setLocale(code);
    setShowLangMenu(false);
    localStorage.setItem("sj-alliance-locale", code);
  }

  const categories = [
    {
      href: "/alliance",
      icon: "🍽",
      titleKo: "SJ Alliance",
      titleEn: "SJ Alliance",
      descKo: "협약 업체 할인·지도·신청",
      descEn: "Partnered stores · Map · Apply",
      bg: "#11306E",
      accent: "#FFD500",
    },
    {
      href: "/lost",
      icon: "📦",
      titleKo: "분실물",
      titleEn: "Lost & Found",
      descKo: "분실물 보관·찾기·신청",
      descEn: "Search · Register lost items",
      bg: "#213A8F",
      accent: "#FFD500",
      ready: false,
    },
    {
      href: "/volunteer",
      icon: "🤝",
      titleKo: "서포터즈·봉사단",
      titleEn: "Supporters & Volunteers",
      descKo: "지원자 모집·신청서",
      descEn: "Apply for programs",
      bg: "#E6007E",
      accent: "#FFD500",
      ready: false,
    },
  ];

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="px-5 py-4 flex items-center justify-between" style={{ backgroundColor: "#11306E" }}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center font-bold text-sm" style={{ backgroundColor: "#FFD500", color: "#11306E" }}>SJ</div>
          <div>
            <h1 className="text-white font-semibold text-base leading-tight">서정대학교</h1>
            <p className="text-xs leading-tight" style={{ color: "#FFD500" }}>학생 종합 정보</p>
          </div>
        </div>
        <div className="relative">
          <button onClick={() => setShowLangMenu(!showLangMenu)} className="px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2" style={{ backgroundColor: "#213A8F", color: "white" }}>
            <span>🌐</span>
            <span className="hidden sm:inline">{LOCALES.find((l) => l.code === locale)?.label}</span>
            <span className="text-xs">▼</span>
          </button>
          {showLangMenu && (
            <div className="absolute right-0 mt-2 bg-white rounded-lg shadow-lg overflow-hidden min-w-[160px] z-50">
              {LOCALES.map((l) => (
                <button key={l.code} onClick={() => changeLocale(l.code)} className={`w-full px-4 py-2.5 text-left text-sm flex items-center gap-2 hover:bg-gray-100 ${l.code === locale ? "bg-blue-50 font-medium" : ""}`} style={l.code === locale ? { color: "#11306E" } : {}}>
                  <span>{l.flag}</span>
                  <span>{l.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </header>

      <section className="px-5 py-10 text-white text-center" style={{ backgroundColor: "#213A8F" }}>
        <h2 className="text-2xl font-bold mb-2">
          {locale === "ko" ? "어떤 정보가 필요하세요?" : "What are you looking for?"}
        </h2>
        <p className="text-sm" style={{ color: "#B5D4F4" }}>
          {locale === "ko" ? "원하는 카테고리를 선택해주세요" : "Choose a category"}
        </p>
      </section>

      <section className="px-5 py-8 max-w-3xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {categories.map((c) => {
            const title = locale === "ko" ? c.titleKo : c.titleEn;
            const desc = locale === "ko" ? c.descKo : c.descEn;
            const Card = (
              <div className="relative bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg hover:border-gray-300 transition h-full">
                <div className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl mb-4" style={{ backgroundColor: c.bg }}>
                  {c.icon}
                </div>
                <h3 className="text-lg font-bold mb-1" style={{ color: "#11306E" }}>{title}</h3>
                <p className="text-sm text-gray-500 mb-3">{desc}</p>
                <span className="text-sm font-medium" style={{ color: c.bg }}>
                  {c.ready === false
                    ? (locale === "ko" ? "🚧 준비중" : "🚧 Coming soon")
                    : (locale === "ko" ? "바로가기 →" : "Open →")}
                </span>
              </div>
            );
            return c.ready === false ? (
              <div key={c.href} className="opacity-60 cursor-not-allowed">{Card}</div>
            ) : (
              <Link key={c.href} href={c.href}>{Card}</Link>
            );
          })}
        </div>
      </section>

      <footer className="mt-8 py-4 px-5 text-center text-xs text-white" style={{ backgroundColor: "#11306E" }}>
        © 2025 서정대학교 · 학생 종합 정보 사이트
      </footer>
    </main>
  );
}

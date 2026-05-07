"use client";

import { useState, useMemo, useEffect } from "react";
import { STORES, CATEGORY_INFO, type StoreCategory } from "@/data/stores";
import { LOCALES, TEXTS, type Locale, t } from "@/data/i18n";

export default function Home() {
  const [locale, setLocale] = useState<Locale>("ko");
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<StoreCategory | "all">("all");
  const [showLangMenu, setShowLangMenu] = useState(false);

  // 저장된 언어 설정 복원
  useEffect(() => {
    const saved = localStorage.getItem("sj-alliance-locale") as Locale | null;
    if (saved && LOCALES.find((l) => l.code === saved)) {
      setLocale(saved);
    }
  }, []);

  function changeLocale(code: Locale) {
    setLocale(code);
    setShowLangMenu(false);
    localStorage.setItem("sj-alliance-locale", code);
  }

  // 카테고리 카운트
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: STORES.length };
    for (const s of STORES) {
      counts[s.category] = (counts[s.category] || 0) + 1;
    }
    return counts;
  }, []);

  // 사용 중인 카테고리만 필터
  const usedCategories = useMemo(() => {
    return Object.keys(CATEGORY_INFO).filter(
      (c) => categoryCounts[c] && categoryCounts[c] > 0
    ) as StoreCategory[];
  }, [categoryCounts]);

  // 필터링된 업체 목록
  const filteredStores = useMemo(() => {
    return STORES.filter((s) => {
      if (activeCategory !== "all" && s.category !== activeCategory) return false;
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      const name = (s.name[locale] || s.name.ko).toLowerCase();
      const benefit = (s.benefit[locale] || s.benefit.ko).toLowerCase();
      const industry = s.industry.toLowerCase();
      return (
        name.includes(q) ||
        s.name.ko.toLowerCase().includes(q) ||
        benefit.includes(q) ||
        industry.includes(q)
      );
    });
  }, [search, activeCategory, locale]);

  return (
    <main className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header
        className="px-5 py-4 flex items-center justify-between sticky top-0 z-40"
        style={{ backgroundColor: "#11306E" }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center font-bold text-sm"
            style={{ backgroundColor: "#FFD500", color: "#11306E" }}
          >
            SJ
          </div>
          <div>
            <h1 className="text-white font-semibold text-base leading-tight">
              {t("siteName", locale)}
            </h1>
            <p className="text-xs leading-tight" style={{ color: "#FFD500" }}>
              {t("siteDesc", locale)}
            </p>
          </div>
        </div>

        {/* 언어 토글 */}
        <div className="relative">
          <button
            onClick={() => setShowLangMenu(!showLangMenu)}
            className="px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:opacity-80 transition"
            style={{ backgroundColor: "#213A8F", color: "white" }}
          >
            <span>🌐</span>
            <span>{LOCALES.find((l) => l.code === locale)?.label}</span>
            <span className="text-xs">▼</span>
          </button>
          {showLangMenu && (
            <div className="absolute right-0 mt-2 bg-white rounded-lg shadow-lg overflow-hidden min-w-[160px] z-50">
              {LOCALES.map((l) => (
                <button
                  key={l.code}
                  onClick={() => changeLocale(l.code)}
                  className={`w-full px-4 py-2.5 text-left text-sm flex items-center gap-2 hover:bg-gray-100 transition ${
                    l.code === locale ? "bg-blue-50 font-medium" : ""
                  }`}
                  style={l.code === locale ? { color: "#11306E" } : {}}
                >
                  <span>{l.flag}</span>
                  <span>{l.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </header>

      {/* 히어로 + 검색 */}
      <section className="px-5 py-6 text-white" style={{ backgroundColor: "#213A8F" }}>
        <h2 className="text-xl font-semibold mb-1">{t("heroTitle", locale)}</h2>
        <p className="text-sm mb-4" style={{ color: "#B5D4F4" }}>
          {STORES.length} {t("storeCount", locale)} · {t("heroDesc", locale)}
        </p>
        <div className="bg-white rounded-lg flex items-center gap-2 px-4 py-3">
          <span className="text-gray-400">🔍</span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("searchPlaceholder", locale)}
            className="flex-1 outline-none text-sm text-gray-700"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          )}
        </div>
      </section>

      {/* 카테고리 필터 */}
      <div className="px-5 py-3 bg-white border-b border-gray-200 overflow-x-auto">
        <div className="flex gap-2 min-w-max">
          <button
            onClick={() => setActiveCategory("all")}
            className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition ${
              activeCategory === "all"
                ? "text-white"
                : "bg-white text-gray-700 border border-gray-300"
            }`}
            style={
              activeCategory === "all" ? { backgroundColor: "#11306E" } : {}
            }
          >
            {t("all", locale)} {STORES.length}
          </button>
          {usedCategories.map((c) => {
            const info = CATEGORY_INFO[c];
            const active = activeCategory === c;
            return (
              <button
                key={c}
                onClick={() => setActiveCategory(c)}
                className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition flex items-center gap-1.5 ${
                  active
                    ? "text-white"
                    : "bg-white text-gray-700 border border-gray-300"
                }`}
                style={active ? { backgroundColor: "#11306E" } : {}}
              >
                <span>{info.emoji}</span>
                <span>{info[locale]}</span>
                <span className="opacity-70">{categoryCounts[c]}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 업체 카드 리스트 */}
      <section className="px-5 py-4">
        {filteredStores.length === 0 ? (
          <div className="py-12 text-center text-gray-500 text-sm">
            {t("noResults", locale)}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredStores.map((s) => {
              const info = CATEGORY_INFO[s.category];
              return (
                <div
                  key={s.id}
                  className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition cursor-pointer"
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex-1 min-w-0">
                      <h3
                        className="text-base font-semibold leading-tight mb-1"
                        style={{ color: "#11306E" }}
                      >
                        {s.name[locale] || s.name.ko}
                      </h3>
                      <p className="text-xs text-gray-500">
                        {info.emoji} {info[locale]} · {s.industry}
                      </p>
                    </div>
                    <span
                      className="px-3 py-1 rounded-full text-[11px] font-semibold text-white whitespace-nowrap"
                      style={{ backgroundColor: "#E6007E" }}
                    >
                      Discount
                    </span>
                  </div>

                  <p className="text-sm text-gray-700 mb-3 leading-relaxed">
                    {s.benefit[locale] || s.benefit.ko}
                  </p>

                  <div className="flex items-center justify-between gap-2 text-xs">
                    <span className="text-gray-500 flex items-center gap-1">
                      📍 {s.address.ko}
                    </span>
                    <a
                      href={`https://map.kakao.com/link/search/${encodeURIComponent(
                        s.address.ko
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium hover:underline whitespace-nowrap"
                      style={{ color: "#11306E" }}
                    >
                      {t("navigate", locale)} →
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 푸터 */}
      <footer
        className="mt-auto py-4 px-5 text-center text-xs text-white"
        style={{ backgroundColor: "#11306E" }}
      >
        {t("footer", locale)}
      </footer>
    </main>
  );
}

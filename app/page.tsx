"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { STORES, CATEGORY_INFO, type StoreCategory } from "@/data/stores";
import { LOCALES, type Locale, t } from "@/data/i18n";
import KakaoMap from "@/components/KakaoMap";

export default function Home() {
  const [locale, setLocale] = useState<Locale>("ko");
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<StoreCategory | "all">("all");
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [selectedStoreId, setSelectedStoreId] = useState<number | null>(null);
  const [showMapMobile, setShowMapMobile] = useState(false);
  const cardRefs = useRef<Record<number, HTMLDivElement | null>>({});

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

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: STORES.length };
    for (const s of STORES) counts[s.category] = (counts[s.category] || 0) + 1;
    return counts;
  }, []);

  const usedCategories = useMemo(
    () =>
      (Object.keys(CATEGORY_INFO) as StoreCategory[]).filter(
        (c) => categoryCounts[c] && categoryCounts[c] > 0
      ),
    [categoryCounts]
  );

  const filteredStores = useMemo(() => {
    return STORES.filter((s) => {
      if (activeCategory !== "all" && s.category !== activeCategory) return false;
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      const name = (s.name[locale] || s.name.ko).toLowerCase();
      const benefit = (s.benefit[locale] || s.benefit.ko).toLowerCase();
      return (
        name.includes(q) ||
        s.name.ko.toLowerCase().includes(q) ||
        benefit.includes(q) ||
        s.industry.toLowerCase().includes(q)
      );
    });
  }, [search, activeCategory, locale]);

  function handleCardClick(id: number) {
    setSelectedStoreId(id);
  }

  function handleMarkerClick(id: number) {
    setSelectedStoreId(id);
    cardRefs.current[id]?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

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

        <div className="relative">
          <button
            onClick={() => setShowLangMenu(!showLangMenu)}
            className="px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:opacity-80 transition"
            style={{ backgroundColor: "#213A8F", color: "white" }}
          >
            <span>🌐</span>
            <span className="hidden sm:inline">
              {LOCALES.find((l) => l.code === locale)?.label}
            </span>
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
            <button onClick={() => setSearch("")} className="text-gray-400 hover:text-gray-600">
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
            style={activeCategory === "all" ? { backgroundColor: "#11306E" } : {}}
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
                  active ? "text-white" : "bg-white text-gray-700 border border-gray-300"
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

      {/* 모바일: 지도/리스트 토글 */}
      <div className="lg:hidden px-5 py-3 bg-white border-b border-gray-200">
        <div className="flex gap-2">
          <button
            onClick={() => setShowMapMobile(false)}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${
              !showMapMobile ? "text-white" : "bg-gray-100 text-gray-700"
            }`}
            style={!showMapMobile ? { backgroundColor: "#11306E" } : {}}
          >
            📋 리스트 ({filteredStores.length})
          </button>
          <button
            onClick={() => setShowMapMobile(true)}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${
              showMapMobile ? "text-white" : "bg-gray-100 text-gray-700"
            }`}
            style={showMapMobile ? { backgroundColor: "#11306E" } : {}}
          >
            🗺 {t("viewMap", locale)}
          </button>
        </div>
      </div>

      {/* 메인 영역 — PC: 좌측 리스트 + 우측 지도, 모바일: 토글 */}
      <div className="lg:flex lg:gap-4 lg:px-5 lg:py-4">
        {/* 카드 리스트 */}
        <section
          className={`px-5 py-4 lg:px-0 lg:py-0 lg:flex-1 lg:max-w-[55%] ${
            showMapMobile ? "hidden lg:block" : ""
          }`}
        >
          {filteredStores.length === 0 ? (
            <div className="py-12 text-center text-gray-500 text-sm">
              {t("noResults", locale)}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredStores.map((s) => {
                const info = CATEGORY_INFO[s.category];
                const isSelected = selectedStoreId === s.id;
                return (
                  <div
                    key={s.id}
                    ref={(el) => { cardRefs.current[s.id] = el; }}
                    onClick={() => handleCardClick(s.id)}
                    className={`bg-white border rounded-xl p-4 hover:shadow-md transition cursor-pointer ${
                      isSelected ? "ring-2 shadow-md" : "border-gray-200"
                    }`}
                    style={
                      isSelected
                        ? ({ borderColor: "#11306E", "--tw-ring-color": "#11306E" } as React.CSSProperties)
                        : {}
                    }
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
                      <span className="text-gray-500 flex items-center gap-1 min-w-0 truncate">
                        📍 {s.address.ko}
                      </span>
                      <a
                        href={`https://map.kakao.com/link/to/${encodeURIComponent(s.name.ko)},${encodeURIComponent(s.address.ko)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
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

        {/* 지도 */}
        <aside
          className={`px-5 lg:px-0 lg:flex-1 lg:sticky lg:top-4 lg:self-start ${
            !showMapMobile ? "hidden lg:block" : ""
          }`}
          style={{ height: "calc(100vh - 220px)", minHeight: "400px" }}
        >
          <KakaoMap
            stores={filteredStores}
            selectedStoreId={selectedStoreId}
            onMarkerClick={handleMarkerClick}
            className="w-full h-full"
          />
        </aside>
      </div>

      {/* 푸터 */}
      <footer
        className="mt-8 py-4 px-5 text-center text-xs text-white"
        style={{ backgroundColor: "#11306E" }}
      >
        {t("footer", locale)}
      </footer>
    </main>
  );
}

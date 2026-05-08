"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { STORES, CATEGORY_INFO, type StoreCategory } from "@/data/stores";
import { LOCALES, type Locale, t } from "@/data/i18n";
import KakaoMap from "@/components/KakaoMap";

export default function MapPage() {
  const [locale, setLocale] = useState<Locale>("ko");
  const [search, setSearch] = useState("");
  const [activeCategories, setActiveCategories] = useState<Set<StoreCategory>>(
    new Set(Object.keys(CATEGORY_INFO) as StoreCategory[])
  );

  useEffect(() => {
    const saved = localStorage.getItem("sj-alliance-locale") as Locale | null;
    if (saved && LOCALES.find((l) => l.code === saved)) setLocale(saved);
  }, []);

  const usedCategories = useMemo(() => {
    const set = new Set<StoreCategory>();
    STORES.forEach((s) => set.add(s.category));
    return Array.from(set);
  }, []);

  const filteredStores = useMemo(() => {
    return STORES.filter((s) => {
      if (!activeCategories.has(s.category)) return false;
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      const name = (s.name[locale] || s.name.ko).toLowerCase();
      const benefit = (s.benefit[locale] || s.benefit.ko).toLowerCase();
      return (
        name.includes(q) ||
        s.name.ko.toLowerCase().includes(q) ||
        benefit.includes(q) ||
        s.industry.toLowerCase().includes(q) ||
        s.address.ko.toLowerCase().includes(q)
      );
    });
  }, [activeCategories, search, locale]);

  function toggleCategory(c: StoreCategory) {
    setActiveCategories((prev) => {
      const next = new Set(prev);
      if (next.has(c)) next.delete(c);
      else next.add(c);
      return next;
    });
  }

  function selectAll() {
    setActiveCategories(new Set(usedCategories));
  }

  function clearAll() {
    setActiveCategories(new Set());
  }

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col">
      <header className="px-5 py-4 sticky top-0 z-40 flex items-center gap-3" style={{ backgroundColor: "#11306E" }}>
        <Link href="/" className="text-white text-xl">←</Link>
        <h1 className="text-white font-semibold text-base flex-1">🗺 전체 지도</h1>
      </header>

      {/* 검색창 */}
      <div className="bg-white border-b border-gray-200 px-4 pt-4">
        <div className="bg-gray-100 rounded-lg flex items-center gap-2 px-4 py-2.5">
          <span className="text-gray-400">🔍</span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("searchPlaceholder", locale)}
            className="flex-1 outline-none text-sm text-gray-700 bg-transparent"
          />
          {search && (
            <button onClick={() => setSearch("")} className="text-gray-400 hover:text-gray-600">✕</button>
          )}
        </div>
      </div>

      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-medium" style={{ color: "#11306E" }}>
            카테고리 필터 ({filteredStores.length}/{STORES.length})
          </p>
          <div className="flex gap-2 text-xs">
            <button onClick={selectAll} className="px-2 py-1 rounded border border-gray-300 hover:bg-gray-100">전체선택</button>
            <button onClick={clearAll} className="px-2 py-1 rounded border border-gray-300 hover:bg-gray-100">전체해제</button>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {usedCategories.map((c) => {
            const info = CATEGORY_INFO[c];
            const active = activeCategories.has(c);
            const count = STORES.filter((s) => s.category === c).length;
            return (
              <label
                key={c}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs cursor-pointer transition ${
                  active ? "text-white" : "bg-white text-gray-700 border border-gray-300"
                }`}
                style={active ? { backgroundColor: "#11306E" } : {}}
              >
                <input
                  type="checkbox"
                  checked={active}
                  onChange={() => toggleCategory(c)}
                  className="cursor-pointer"
                />
                <span>{info.emoji}</span>
                <span>{info[locale]}</span>
                <span className="opacity-70">{count}</span>
              </label>
            );
          })}
        </div>
      </div>

      <div className="flex-1 p-4">
        <div className="rounded-lg overflow-hidden" style={{ height: "calc(100vh - 220px)", minHeight: "400px" }}>
          {filteredStores.length > 0 ? (
            <KakaoMap stores={filteredStores} className="w-full h-full" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-white rounded-lg">
              <p className="text-gray-500 text-sm">카테고리를 하나 이상 선택해주세요</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

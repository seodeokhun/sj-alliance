"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import { STORES, CATEGORY_INFO } from "@/data/stores";
import { LOCALES, type Locale, t } from "@/data/i18n";
import KakaoMap from "@/components/KakaoMap";

export default function StoreDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const store = STORES.find((s) => s.id === parseInt(id));
  const [locale, setLocale] = useState<Locale>("ko");

  useEffect(() => {
    const saved = localStorage.getItem("sj-alliance-locale") as Locale | null;
    if (saved && LOCALES.find((l) => l.code === saved)) setLocale(saved);
  }, []);

  if (!store) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">업체를 찾을 수 없습니다</p>
          <Link href="/" className="text-blue-600 hover:underline">← 목록으로</Link>
        </div>
      </main>
    );
  }

  const info = CATEGORY_INFO[store.category];

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="px-5 py-4 sticky top-0 z-40 flex items-center gap-3" style={{ backgroundColor: "#11306E" }}>
        <Link href="/" className="text-white text-xl">←</Link>
        <h1 className="text-white font-semibold text-base flex-1 truncate">{store.name[locale] || store.name.ko}</h1>
      </header>

      <div className="px-5 py-5 bg-white border-b border-gray-200">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-1" style={{ color: "#11306E" }}>{store.name[locale] || store.name.ko}</h2>
            <p className="text-sm text-gray-500">{info.emoji} {info[locale]} · {store.industry}</p>
          </div>
          <span className="px-3 py-1.5 rounded-full text-xs font-semibold text-white whitespace-nowrap" style={{ backgroundColor: "#E6007E" }}>Discount</span>
        </div>
        <div className="bg-pink-50 border-l-4 p-4 rounded mb-4" style={{ borderColor: "#E6007E" }}>
          <p className="text-sm text-gray-800 leading-relaxed">{store.benefit[locale] || store.benefit.ko}</p>
        </div>
        <div className="text-sm text-gray-600 mb-4">📍 {store.address.ko}</div>
        <a
          href={`https://map.kakao.com/link/to/${encodeURIComponent(store.name.ko)},${encodeURIComponent(store.address.ko)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full py-3 text-center text-white font-semibold rounded-lg"
          style={{ backgroundColor: "#FFD500", color: "#11306E" }}
        >
          🗺 카카오맵에서 길찾기
        </a>
      </div>

      <div className="px-5 py-4">
        <h3 className="text-base font-semibold mb-3" style={{ color: "#11306E" }}>📍 위치</h3>
        <div className="rounded-lg overflow-hidden" style={{ height: "400px" }}>
          <KakaoMap stores={[store]} className="w-full h-full" />
        </div>
      </div>
    </main>
  );
}

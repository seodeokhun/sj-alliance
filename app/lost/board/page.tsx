"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type LostItem = {
  id: string;
  type: "lost" | "found";
  title: string;
  category: string | null;
  location: string | null;
  lost_at: string | null;
  images: string[];
  nickname: string;
  created_at: string;
};

const CATEGORIES = [
  { key: "all", label: "전체" },
  { key: "wallet", label: "지갑·카드" },
  { key: "phone", label: "휴대폰·전자기기" },
  { key: "bag", label: "가방·옷" },
  { key: "umbrella", label: "우산" },
  { key: "key", label: "키·열쇠" },
  { key: "book", label: "도서·서류" },
  { key: "etc", label: "기타" },
];

export default function LostBoard() {
  const [items, setItems] = useState<LostItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState<"all" | "lost" | "found">("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("lost_items")
        .select("*")
        .order("created_at", { ascending: false });
      setItems(data || []);
      setLoading(false);
    })();
  }, []);

  const filtered = items.filter((i) => {
    if (typeFilter !== "all" && i.type !== typeFilter) return false;
    if (categoryFilter !== "all" && i.category !== categoryFilter) return false;
    if (search && !i.title.toLowerCase().includes(search.toLowerCase()) &&
        !(i.location || "").toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const counts = {
    all: items.length,
    lost: items.filter((i) => i.type === "lost").length,
    found: items.filter((i) => i.type === "found").length,
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="px-5 py-4 sticky top-0 z-40 flex items-center justify-between gap-3" style={{ backgroundColor: "#11306E" }}>
        <div className="flex items-center gap-3">
          <Link href="/" className="text-white text-xl">←</Link>
          <h1 className="text-white font-semibold">📦 분실물 게시판</h1>
        </div>
        <Link href="/lost/register" className="px-3 py-1.5 rounded-lg text-xs font-bold" style={{ backgroundColor: "#FFD500", color: "#11306E" }}>
          + 글쓰기
        </Link>
      </header>

      {/* 타입 탭 */}
      <div className="px-5 py-3 bg-white border-b border-gray-200 sticky top-[60px] z-30">
        <div className="max-w-3xl mx-auto flex gap-2 mb-2">
          {[
            { key: "all", label: "전체", count: counts.all, color: "#11306E" },
            { key: "lost", label: "🔍 잃어버렸어요", count: counts.lost, color: "#991B1B" },
            { key: "found", label: "✋ 주웠어요", count: counts.found, color: "#065F46" },
          ].map((t) => {
            const active = typeFilter === t.key;
            return (
              <button
                key={t.key}
                onClick={() => setTypeFilter(t.key as any)}
                className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition ${active ? "text-white" : "bg-white text-gray-700 border border-gray-300"}`}
                style={active ? { backgroundColor: t.color } : {}}
              >
                {t.label} <span className="opacity-70">{t.count}</span>
              </button>
            );
          })}
        </div>

        {/* 검색 */}
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="제목·위치 검색"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-blue-500 text-sm mb-2"
        />

        {/* 카테고리 필터 */}
        <div className="flex gap-1.5 overflow-x-auto pb-1">
          {CATEGORIES.map((c) => {
            const active = categoryFilter === c.key;
            return (
              <button
                key={c.key}
                onClick={() => setCategoryFilter(c.key)}
                className={`px-3 py-1 rounded-full text-[11px] font-medium whitespace-nowrap transition ${active ? "text-white" : "bg-gray-100 text-gray-600"}`}
                style={active ? { backgroundColor: "#11306E" } : {}}
              >
                {c.label}
              </button>
            );
          })}
        </div>
      </div>

      <section className="px-5 py-5 max-w-3xl mx-auto">
        {loading ? (
          <p className="text-center text-gray-500 py-12">불러오는 중...</p>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 mb-4">아직 게시글이 없습니다</p>
            <Link href="/lost/register" className="inline-block px-5 py-2.5 rounded-lg text-sm font-bold text-white" style={{ backgroundColor: "#11306E" }}>
              첫 글 작성하기
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((item) => {
              const thumb = item.images && item.images.length > 0 ? item.images[0] : null;
              const typeBadge = item.type === "lost"
                ? { label: "잃어버렸어요", color: "#991B1B", bg: "#FEE2E2" }
                : { label: "주웠어요",     color: "#065F46", bg: "#D1FAE5" };
              const categoryLabel = CATEGORIES.find((c) => c.key === item.category)?.label || "기타";

              return (
                <Link
                  key={item.id}
                  href={`/lost/${item.id}`}
                  className="block bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md hover:border-gray-300 transition"
                >
                  <div className="flex items-start gap-3">
                    {thumb ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={thumb} alt="" className="w-20 h-20 rounded-lg object-cover flex-shrink-0 bg-gray-100" />
                    ) : (
                      <div className="w-20 h-20 rounded-lg flex items-center justify-center text-3xl flex-shrink-0 bg-gray-100">📦</div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold" style={{ color: typeBadge.color, backgroundColor: typeBadge.bg }}>
                          {typeBadge.label}
                        </span>
                        <span className="text-[10px] text-gray-500">{categoryLabel}</span>
                      </div>
                      <h3 className="text-sm font-bold leading-tight mb-1 line-clamp-2" style={{ color: "#11306E" }}>
                        {item.title}
                      </h3>
                      {item.location && (
                        <p className="text-xs text-gray-500 truncate">📍 {item.location}</p>
                      )}
                      <p className="text-[11px] text-gray-400 mt-1">
                        {item.nickname} · {new Date(item.created_at).toLocaleDateString("ko-KR")}
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type ShareItem = {
  id: string;
  title: string;
  category: string | null;
  location: string | null;
  condition: string | null;
  images: string[];
  status: "open" | "reserved" | "done";
  nickname: string;
  created_at: string;
};

const CATEGORIES = [
  { key: "all", label: "전체" },
  { key: "book", label: "교재·전공책" },
  { key: "furniture", label: "가구·생활용품" },
  { key: "electronics", label: "전자기기" },
  { key: "clothes", label: "의류" },
  { key: "kitchen", label: "식료품·키친" },
  { key: "etc", label: "기타" },
];

const STATUS_LABEL: Record<string, { label: string; color: string; bg: string }> = {
  open:     { label: "나눔중",   color: "#065F46", bg: "#D1FAE5" },
  reserved: { label: "예약중",   color: "#92400E", bg: "#FEF3C7" },
  done:     { label: "나눔완료", color: "#6B7280", bg: "#F3F4F6" },
};

export default function ShareBoard() {
  const [items, setItems] = useState<ShareItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("share_items")
        .select("*")
        .order("created_at", { ascending: false });
      setItems(data || []);
      setLoading(false);
    })();
  }, []);

  const filtered = items.filter((i) => {
    if (statusFilter !== "all" && i.status !== statusFilter) return false;
    if (categoryFilter !== "all" && i.category !== categoryFilter) return false;
    if (search && !i.title.toLowerCase().includes(search.toLowerCase()) &&
        !(i.location || "").toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const counts = {
    all: items.length,
    open: items.filter((i) => i.status === "open").length,
    reserved: items.filter((i) => i.status === "reserved").length,
    done: items.filter((i) => i.status === "done").length,
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="px-5 py-4 sticky top-0 z-40 flex items-center justify-between gap-3" style={{ backgroundColor: "#10B981" }}>
        <div className="flex items-center gap-3">
          <Link href="/" className="text-white text-xl">←</Link>
          <h1 className="text-white font-semibold">🎁 나눔 게시판</h1>
        </div>
        <Link href="/share/register" className="px-3 py-1.5 rounded-lg text-xs font-bold" style={{ backgroundColor: "#FFD500", color: "#11306E" }}>
          + 나눔 등록
        </Link>
      </header>

      <div className="bg-emerald-50 border-b border-emerald-100 px-5 py-3">
        <p className="text-xs text-emerald-800 max-w-3xl mx-auto">
          🌱 본 게시판은 <strong>무료 나눔 전용</strong>입니다. 금전 거래는 금지되며, 발견 시 게시물이 삭제될 수 있습니다.
        </p>
      </div>

      <div className="px-5 py-3 bg-white border-b border-gray-200 sticky top-[60px] z-30">
        <div className="max-w-3xl mx-auto flex gap-2 mb-2 overflow-x-auto">
          {[
            { key: "all", label: "전체", count: counts.all, color: "#11306E" },
            { key: "open", label: "🟢 나눔중", count: counts.open, color: "#065F46" },
            { key: "reserved", label: "🟡 예약중", count: counts.reserved, color: "#92400E" },
            { key: "done", label: "⚪ 완료", count: counts.done, color: "#6B7280" },
          ].map((s) => {
            const active = statusFilter === s.key;
            return (
              <button
                key={s.key}
                onClick={() => setStatusFilter(s.key)}
                className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition ${active ? "text-white" : "bg-white text-gray-700 border border-gray-300"}`}
                style={active ? { backgroundColor: s.color } : {}}
              >
                {s.label} <span className="opacity-70">{s.count}</span>
              </button>
            );
          })}
        </div>

        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="제목·위치 검색"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-emerald-500 text-sm mb-2"
        />

        <div className="flex gap-1.5 overflow-x-auto pb-1">
          {CATEGORIES.map((c) => {
            const active = categoryFilter === c.key;
            return (
              <button
                key={c.key}
                onClick={() => setCategoryFilter(c.key)}
                className={`px-3 py-1 rounded-full text-[11px] font-medium whitespace-nowrap transition ${active ? "text-white" : "bg-gray-100 text-gray-600"}`}
                style={active ? { backgroundColor: "#10B981" } : {}}
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
            <p className="text-gray-500 mb-4">아직 나눔 글이 없습니다</p>
            <Link href="/share/register" className="inline-block px-5 py-2.5 rounded-lg text-sm font-bold text-white" style={{ backgroundColor: "#10B981" }}>
              첫 나눔 등록하기
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((item) => {
              const thumb = item.images && item.images.length > 0 ? item.images[0] : null;
              const status = STATUS_LABEL[item.status] || STATUS_LABEL.open;
              const categoryLabel = CATEGORIES.find((c) => c.key === item.category)?.label || "기타";
              const isDone = item.status === "done";

              return (
                <Link
                  key={item.id}
                  href={`/share/${item.id}`}
                  className={`block bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md hover:border-gray-300 transition ${isDone ? "opacity-60" : ""}`}
                >
                  <div className="flex items-start gap-3">
                    {thumb ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={thumb} alt="" className="w-20 h-20 rounded-lg object-cover flex-shrink-0 bg-gray-100" />
                    ) : (
                      <div className="w-20 h-20 rounded-lg flex items-center justify-center text-3xl flex-shrink-0 bg-gray-100">🎁</div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold" style={{ color: status.color, backgroundColor: status.bg }}>
                          {status.label}
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

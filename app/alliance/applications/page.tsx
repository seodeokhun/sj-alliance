"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type ListItem = {
  id: string;
  store_name: string;
  industry: string | null;
  status: string;
  created_at: string;
};

const STATUS_LABEL: Record<string, { label: string; color: string; bg: string }> = {
  pending:  { label: "신청대기",  color: "#92400E", bg: "#FEF3C7" },
  approved: { label: "신청완료",  color: "#065F46", bg: "#D1FAE5" },
  rejected: { label: "신청불가",  color: "#991B1B", bg: "#FEE2E2" },
};

export default function ApplicationsList() {
  const [items, setItems] = useState<ListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("alliance_applications")
        .select("id, store_name, industry, status, created_at")
        .order("created_at", { ascending: false });
      setItems(data || []);
      setLoading(false);
    })();
  }, []);

  const filtered = filter === "all" ? items : items.filter((i) => i.status === filter);
  const counts = {
    all: items.length,
    pending: items.filter((i) => i.status === "pending").length,
    approved: items.filter((i) => i.status === "approved").length,
    rejected: items.filter((i) => i.status === "rejected").length,
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="px-5 py-4 sticky top-0 z-40 flex items-center gap-3" style={{ backgroundColor: "#11306E" }}>
        <Link href="/partner" className="text-white text-xl">←</Link>
        <h1 className="text-white font-semibold">📄 신청 내역</h1>
      </header>

      <div className="px-5 py-3 bg-white border-b border-gray-200">
        <div className="max-w-3xl mx-auto flex gap-2 overflow-x-auto">
          {[
            { key: "all", label: "전체", color: "#11306E", count: counts.all },
            { key: "pending", label: "🟡 대기", color: "#92400E", count: counts.pending },
            { key: "approved", label: "🟢 완료", color: "#065F46", count: counts.approved },
            { key: "rejected", label: "🔴 불가", color: "#991B1B", count: counts.rejected },
          ].map((f) => {
            const active = filter === f.key;
            return (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition ${active ? "text-white" : "bg-white text-gray-700 border border-gray-300"}`}
                style={active ? { backgroundColor: f.color } : {}}
              >
                {f.label} <span className="opacity-70">{f.count}</span>
              </button>
            );
          })}
        </div>
      </div>

      <section className="px-5 py-6 max-w-3xl mx-auto">
        <p className="text-xs text-gray-500 mb-4">
          ℹ️ 업체명만 표시됩니다. 본인 신청 상세 정보는 클릭 후 비밀번호를 입력하세요.
        </p>

        {loading ? (
          <p className="text-center text-gray-500 py-12">불러오는 중...</p>
        ) : filtered.length === 0 ? (
          <p className="text-center text-gray-500 py-12">신청 내역이 없습니다</p>
        ) : (
          <div className="space-y-2">
            {filtered.map((item) => {
              const s = STATUS_LABEL[item.status] || STATUS_LABEL.pending;
              return (
                <Link
                  key={item.id}
                  href={`/alliance/applications/${item.id}`}
                  className="block bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md hover:border-gray-300 transition"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-semibold leading-tight" style={{ color: "#11306E" }}>
                        {item.store_name}
                      </h3>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {item.industry || "업종 미입력"} · {new Date(item.created_at).toLocaleDateString("ko-KR")}
                      </p>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap" style={{ color: s.color, backgroundColor: s.bg }}>
                      {s.label}
                    </span>
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

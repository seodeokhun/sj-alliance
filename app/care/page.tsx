"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useLocale } from "@/lib/useLocale";
import LangSwitcher from "@/components/LangSwitcher";
import {
  CARE_CENTERS,
  BRANCH_META,
  RECOMMENDED_BRANCHES,
  type CareCenter,
  type CareCenterBranch,
} from "@/data/care-centers";

type FilterKey = "all" | "recommended" | CareCenterBranch;

export default function CarePage() {
  const { locale, setLocale, t, mounted } = useLocale();
  const [filter, setFilter] = useState<FilterKey>("all");
  const [searchQ, setSearchQ] = useState("");

  // 지부별 개수
  const branchCounts = useMemo(() => {
    const map = new Map<string, number>();
    for (const c of CARE_CENTERS) {
      map.set(c.branch, (map.get(c.branch) || 0) + 1);
    }
    return map;
  }, []);

  // 필터링된 센터
  const filtered = useMemo(() => {
    let list = CARE_CENTERS;
    if (filter === "recommended") {
      list = list.filter((c) => RECOMMENDED_BRANCHES.includes(c.branch));
    } else if (filter !== "all") {
      list = list.filter((c) => c.branch === filter);
    }
    if (searchQ.trim()) {
      const q = searchQ.toLowerCase();
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.address.toLowerCase().includes(q)
      );
    }
    return list;
  }, [filter, searchQ]);

  const branchOrder: CareCenterBranch[] = [
    "경기", "서울", "인천",
    "강원", "광주전남", "대전충청",
    "부산제주", "경남", "전북",
    "대구경북", "울산경주", "기타",
  ];

  if (!mounted) return null;

  return (
    <main className="min-h-screen bg-gray-50 pb-24">
      {/* 헤더 */}
      <header
        className="px-5 py-4 sticky top-0 z-40 flex items-center gap-3"
        style={{ backgroundColor: "#11306E" }}
      >
        <Link href="/" className="text-white text-xl leading-none hover:opacity-80 transition" aria-label="홈으로">
          ←
        </Link>
        <h1 className="text-white font-semibold text-base flex items-center gap-2 flex-1">
          🏥 {t("careTitle")}
        </h1>
        <LangSwitcher locale={locale} onChange={setLocale} compact />
      </header>

      {/* 히어로 */}
      <section className="px-5 py-6 text-white" style={{ backgroundColor: "#0E7490" }}>
        <div className="max-w-3xl mx-auto">
          <h2 className="text-xl font-bold mb-1">🏥 {t("careTitle")}</h2>
          <p className="text-xs" style={{ color: "#A5F3FC" }}>
            {t("careSubtitle")}
          </p>
          <div className="mt-3 text-2xl font-extrabold">
            {CARE_CENTERS.length}
            <span className="text-xs font-normal opacity-80 ml-1">
              {t("careCenterCount")}
            </span>
          </div>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-5 pt-4">
        {/* 검색창 */}
        <div className="relative mb-3">
          <input
            type="search"
            placeholder={t("careSearchPlaceholder")}
            value={searchQ}
            onChange={(e) => setSearchQ(e.target.value)}
            className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-cyan-700"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
            🔍
          </span>
        </div>

        {/* 추천 카드 */}
        <button
          onClick={() => setFilter(filter === "recommended" ? "all" : "recommended")}
          className={`w-full mb-3 px-4 py-3 rounded-xl border-2 transition text-left flex items-center justify-between ${
            filter === "recommended" ? "" : "bg-white"
          }`}
          style={{
            borderColor: filter === "recommended" ? "#0E7490" : "#E5E7EB",
            backgroundColor: filter === "recommended" ? "#ECFEFF" : "white",
          }}
        >
          <div>
            <div className="text-sm font-bold" style={{ color: "#0E7490" }}>
              {t("careRecommended")}
            </div>
            <div className="text-[11px] text-gray-500 mt-0.5">
              {t("careRecommendedDesc")}
            </div>
          </div>
          <div className="text-base font-bold" style={{ color: "#0E7490" }}>
            {CARE_CENTERS.filter((c) => RECOMMENDED_BRANCHES.includes(c.branch)).length}
          </div>
        </button>

        {/* 지부 필터 칩 */}
        <div className="flex flex-wrap gap-2 mb-4">
          <FilterChip
            label={t("careAllBranches")}
            count={CARE_CENTERS.length}
            active={filter === "all"}
            onClick={() => setFilter("all")}
            color="#11306E"
          />
          {branchOrder.map((b) => {
            const cnt = branchCounts.get(b) || 0;
            if (cnt === 0) return null;
            const meta = BRANCH_META[b];
            return (
              <FilterChip
                key={b}
                label={meta.label}
                count={cnt}
                active={filter === b}
                onClick={() => setFilter(b)}
                color={meta.color}
              />
            );
          })}
        </div>

        {/* 결과 개수 */}
        <div className="text-xs text-gray-500 mb-3 px-1">
          {filtered.length}{t("careCenterCount")}
        </div>

        {/* 센터 카드 리스트 */}
        <section className="space-y-3">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-gray-400 text-sm">
              {t("noResults")}
            </div>
          ) : (
            filtered.map((c) => <CenterCard key={c.id} center={c} t={t} />)
          )}
        </section>

        {/* 안내 */}
        <div
          className="mt-6 px-4 py-3 rounded-lg text-[11px]"
          style={{ backgroundColor: "#F9FAFB", color: "#6B7280", border: "1px solid #E5E7EB" }}
        >
          💡 {t("careNotice")}
        </div>
      </div>
    </main>
  );
}

/* ==================== 보조 컴포넌트 ==================== */

function FilterChip({
  label,
  count,
  active,
  onClick,
  color,
}: {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
  color: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-xs font-medium transition border ${
        active ? "text-white" : "bg-white"
      }`}
      style={{
        backgroundColor: active ? color : "white",
        borderColor: active ? color : "#D1D5DB",
        color: active ? "white" : "#4B5563",
      }}
    >
      {label} <span className="opacity-70 ml-0.5">{count}</span>
    </button>
  );
}

function CenterCard({ center, t }: { center: CareCenter; t: (key: any) => string }) {
  const meta = BRANCH_META[center.branch];
  return (
    <Link
      href={`/care/${center.id}`}
      className="block bg-white border border-gray-200 rounded-2xl p-4 hover:border-cyan-700 hover:shadow-sm transition"
    >
      <div className="flex items-start gap-2 mb-2">
        <span
          className="text-[10px] px-2 py-0.5 rounded font-semibold flex-shrink-0"
          style={{ color: meta.color, backgroundColor: meta.bg }}
        >
          {meta.label}
        </span>
        <h3 className="text-sm font-bold flex-1" style={{ color: "#11306E" }}>
          {center.name}
        </h3>
      </div>
      <div className="text-[11px] text-gray-600 space-y-0.5">
        {center.address && (
          <div className="flex items-start gap-1">
            <span className="flex-shrink-0">📍</span>
            <span className="leading-relaxed">{center.address}</span>
          </div>
        )}
        {center.officePhone && (
          <div className="flex items-center gap-1">
            <span>☎</span>
            <span>{center.officePhone}</span>
          </div>
        )}
      </div>
      <div className="mt-2 text-right">
        <span className="text-[11px] font-medium" style={{ color: "#0E7490" }}>
          {t("details")} →
        </span>
      </div>
    </Link>
  );
}

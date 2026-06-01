"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useLocale } from "@/lib/useLocale";
import LangSwitcher from "@/components/LangSwitcher";
import CareKakaoMap from "@/components/CareKakaoMap";
import {
  CARE_CENTERS,
  BRANCH_META,
  RECOMMENDED_BRANCHES,
  type CareCenterBranch,
} from "@/data/care-centers";

type FilterKey = "all" | "recommended" | CareCenterBranch;

export default function CareMapPage() {
  const { locale, setLocale, t, mounted } = useLocale();
  const [filter, setFilter] = useState<FilterKey>("recommended"); // 기본 추천 (캠퍼스 근처)
  const [searchQ, setSearchQ] = useState("");

  const branchCounts = useMemo(() => {
    const map = new Map<string, number>();
    for (const c of CARE_CENTERS) {
      map.set(c.branch, (map.get(c.branch) || 0) + 1);
    }
    return map;
  }, []);

  const filtered = useMemo(() => {
    let list = CARE_CENTERS.filter((c) => c.address); // 주소 있는 것만
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
    <main className="min-h-screen bg-gray-50 flex flex-col">
      {/* 헤더 */}
      <header
        className="px-5 py-4 sticky top-0 z-40 flex items-center gap-3"
        style={{ backgroundColor: "#11306E" }}
      >
        <Link href="/care" className="text-white text-xl leading-none hover:opacity-80 transition" aria-label="목록으로">
          ←
        </Link>
        <h1 className="text-white font-semibold text-base flex items-center gap-2 flex-1">
          🗺 {t("careTitle")} · {t("careViewMap")}
        </h1>
        <LangSwitcher locale={locale} onChange={setLocale} compact />
      </header>

      {/* 검색 + 필터 */}
      <div className="bg-white border-b border-gray-200 px-5 py-3 space-y-2">
        <div className="relative">
          <input
            type="search"
            placeholder={t("careSearchPlaceholder")}
            value={searchQ}
            onChange={(e) => setSearchQ(e.target.value)}
            className="w-full px-4 py-2.5 pr-10 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-cyan-700"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
            🔍
          </span>
        </div>

        <div className="flex flex-wrap gap-1.5">
          <FilterChip
            label={`🎯 ${t("careRecommended").replace("🎯 ", "")}`}
            count={CARE_CENTERS.filter((c) => RECOMMENDED_BRANCHES.includes(c.branch)).length}
            active={filter === "recommended"}
            onClick={() => setFilter("recommended")}
            color="#0E7490"
          />
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

        <div className="text-[11px] text-gray-500">
          📍 {filtered.length}{t("careCenterCount")} · 핀을 누르면 정보가 나옵니다
        </div>
      </div>

      {/* 지도 */}
      <div className="flex-1 px-3 py-3">
        <CareKakaoMap centers={filtered} className="w-full h-full" />
      </div>
    </main>
  );
}

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
      className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition border whitespace-nowrap ${
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

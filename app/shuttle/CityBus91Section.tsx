"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  BUS91_INFO,
  BUS91_STOPS,
  BUS91_SCHEDULE,
  getStopArrivalsToSchool,
  getStopArrivalsFromSchool,
  type StopArrival,
} from "@/data/city-bus-91";

type Direction = "to-school" | "from-school";

type ArrivalData = {
  remainingSec: number | null;
  locationNo: string | null;
  seats: number | null;
  plateNo: string | null;
};

type ApiResponse =
  | {
      ok: true;
      updatedAt: string;
      direction: "school" | "deokjeong";
      next: ArrivalData | null;
      second: ArrivalData | null;
    }
  | {
      ok: false;
      error: "API_KEY_MISSING" | "CONFIG_MISSING" | "FETCH_ERROR" | "PARSE_ERROR";
      message: string;
      updatedAt: string;
    };

const AUTO_REFRESH_MS = 60_000;
const FAVORITE_KEY = "sj-bus91-favorite-stops";

export default function CityBus91Section({ t }: { t: (key: any) => string }) {
  const [direction, setDirection] = useState<Direction>("to-school");
  const [openStopIndex, setOpenStopIndex] = useState<number | null>(BUS91_STOPS.length - 1); // 기본 펼침 = 종점(학교)
  const [now, setNow] = useState(new Date());
  const [showAllSchedule, setShowAllSchedule] = useState(false);
  const [favoriteStops, setFavoriteStops] = useState<number[]>([]);

  // 실시간 도착 정보 (현재 학교 정류장만)
  const [liveData, setLiveData] = useState<ApiResponse | null>(null);
  const [liveLoading, setLiveLoading] = useState(false);
  const [refreshDisabled, setRefreshDisabled] = useState(false);
  const lastFetchRef = useRef<number>(0);

  /* ---------- 즐겨찾기 정류장 로드 ---------- */
  useEffect(() => {
    try {
      const raw = localStorage.getItem(FAVORITE_KEY);
      if (raw) setFavoriteStops(JSON.parse(raw));
    } catch {}
  }, []);

  function toggleFavorite(stopIdx: number) {
    setFavoriteStops((prev) => {
      const next = prev.includes(stopIdx) ? prev.filter((i) => i !== stopIdx) : [...prev, stopIdx];
      try {
        localStorage.setItem(FAVORITE_KEY, JSON.stringify(next));
      } catch {}
      return next;
    });
  }

  /* ---------- 현재 시각 1분마다 갱신 ---------- */
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(id);
  }, []);

  /* ---------- 실시간 도착 (학교 방향에서 학교 정류장 열렸을 때만) ---------- */
  const shouldFetchLive =
    openStopIndex === BUS91_STOPS.length - 1 && direction === "to-school";

  const fetchLive = useCallback(async () => {
    setLiveLoading(true);
    try {
      const res = await fetch("/api/bus-arrival?direction=school", { cache: "no-store" });
      const json = (await res.json()) as ApiResponse;
      setLiveData(json);
      lastFetchRef.current = Date.now();
    } catch {
      setLiveData({
        ok: false,
        error: "FETCH_ERROR",
        message: "network",
        updatedAt: new Date().toISOString(),
      });
    } finally {
      setLiveLoading(false);
    }
  }, []);

  useEffect(() => {
    if (shouldFetchLive) fetchLive();
  }, [shouldFetchLive, fetchLive]);

  useEffect(() => {
    if (!shouldFetchLive) return;
    const id = setInterval(() => {
      if (document.visibilityState === "visible") fetchLive();
    }, AUTO_REFRESH_MS);
    return () => clearInterval(id);
  }, [shouldFetchLive, fetchLive]);

  function handleRefresh() {
    if (refreshDisabled || liveLoading) return;
    setRefreshDisabled(true);
    fetchLive();
    setTimeout(() => setRefreshDisabled(false), 3000);
  }

  /* ---------- 정류장 순서 (방향에 따라 역순) ---------- */
  const stops = useMemo(
    () => (direction === "to-school" ? BUS91_STOPS : [...BUS91_STOPS].reverse()),
    [direction]
  );

  /* ---------- 헤더의 "기준 시각" ---------- */
  const refTimeStr = now.toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" });

  return (
    <>
      {/* 노선 정보 헤더 (네이버 스타일) */}
      <section
        className="px-5 py-5 text-white relative"
        style={{ backgroundColor: "#3D9651" /* 양주 시내버스 녹색 */ }}
      >
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          <div
            className="w-14 h-14 rounded-xl flex items-center justify-center font-extrabold text-xl flex-shrink-0"
            style={{ backgroundColor: "white", color: "#3D9651" }}
          >
            91
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-bold leading-tight">{BUS91_INFO.routeName}</h2>
            <p className="text-xs opacity-90 leading-tight">
              {BUS91_INFO.operator} · {BUS91_INFO.dailyTrips}회/일
            </p>
            <p className="text-[11px] opacity-80 mt-1">
              평일 {BUS91_INFO.weekdayHours} · 배차 {BUS91_INFO.weekdayInterval}
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-5 pt-4">
        {/* 방향 토글 */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-white rounded-xl border border-gray-200 mb-3">
          <button
            onClick={() => setDirection("to-school")}
            className={`py-2.5 rounded-lg text-xs font-semibold transition ${
              direction === "to-school" ? "text-white" : "text-gray-600"
            }`}
            style={{ backgroundColor: direction === "to-school" ? "#3D9651" : "transparent" }}
          >
            ➡️ {t("cityBusToSchool")}
          </button>
          <button
            onClick={() => setDirection("from-school")}
            className={`py-2.5 rounded-lg text-xs font-semibold transition ${
              direction === "from-school" ? "text-white" : "text-gray-600"
            }`}
            style={{ backgroundColor: direction === "from-school" ? "#3D9651" : "transparent" }}
          >
            ⬅️ {t("cityBusToOrigin")}
          </button>
        </div>

        {/* 기준 시각 + 새로고침 */}
        <div className="flex items-center justify-between text-[11px] text-gray-500 mb-2 px-1">
          <span>
            ⏱ {t("cityBusReferenceTime")} {refTimeStr}
          </span>
          <span>{t("cityBusTapToView")}</span>
        </div>

        {/* 정류장 타임라인 */}
        <section className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
          {stops.map((stop, displayIdx) => {
            // 원본 인덱스 (BUS91_STOPS 기준)
            const stopIdx = direction === "to-school"
              ? displayIdx
              : BUS91_STOPS.length - 1 - displayIdx;

            const isOpen = openStopIndex === stopIdx;
            const isFav = favoriteStops.includes(stopIdx);
            const isFirst = displayIdx === 0;
            const isLast = displayIdx === stops.length - 1;
            const isMajor = stop.major;

            return (
              <StopRow
                key={stopIdx}
                stop={stop}
                stopIdx={stopIdx}
                isOpen={isOpen}
                isFav={isFav}
                isFirst={isFirst}
                isLast={isLast}
                isMajor={!!isMajor}
                direction={direction}
                now={now}
                onClick={() => setOpenStopIndex(isOpen ? null : stopIdx)}
                onToggleFav={() => toggleFavorite(stopIdx)}
                liveData={shouldFetchLive && stopIdx === BUS91_STOPS.length - 1 ? liveData : null}
                liveLoading={liveLoading}
                refreshDisabled={refreshDisabled}
                onRefresh={handleRefresh}
                t={t}
              />
            );
          })}
        </section>

        {/* 전체 시간표 (펼치기) */}
        <section className="mt-5 bg-white border border-gray-200 rounded-2xl overflow-hidden">
          <button
            onClick={() => setShowAllSchedule((v) => !v)}
            className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition"
          >
            <span className="text-sm font-semibold" style={{ color: "#11306E" }}>
              ⏱ {t("busScheduleTitle")} ({BUS91_INFO.dailyTrips}{t("cityBusTrips")})
            </span>
            <span className="text-gray-400 text-xs">
              {showAllSchedule ? "▲" : "▼"}
            </span>
          </button>

          {showAllSchedule && (
            <div className="border-t border-gray-100">
              <div className="grid grid-cols-[40px_1fr_1fr_1fr] text-[10px] font-semibold text-gray-500 px-3 py-2 sticky top-0 bg-gray-50 border-b border-gray-100">
                <span>회차</span>
                <span className="text-center">덕정역 출발</span>
                <span className="text-center" style={{ color: "#3D9651" }}>🏫 학교 도착</span>
                <span className="text-center">덕정역 회차</span>
              </div>
              <div className="max-h-96 overflow-y-auto divide-y divide-gray-100">
                {BUS91_SCHEDULE.map((trip) => (
                  <div
                    key={trip.trip}
                    className="grid grid-cols-[40px_1fr_1fr_1fr] text-xs items-center px-3 py-2"
                  >
                    <span className="text-gray-400 text-[10px] font-mono">{trip.trip}</span>
                    <span className="text-center font-mono text-gray-700">{trip.deokjeong}</span>
                    <span className="text-center font-mono font-bold" style={{ color: "#3D9651" }}>
                      {trip.school}
                    </span>
                    <span className="text-center font-mono text-gray-500">{trip.deokjeongReturn}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* 학교 공식 페이지 링크 */}
        <div className="mt-6 mb-2 text-center">
          <a
            href="https://seojeong.ac.kr/main/campus-life/city-bus.do"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs underline"
            style={{ color: "#11306E" }}
          >
            🔗 {t("shuttleSourceLink")}
          </a>
        </div>
      </div>
    </>
  );
}

/* ==================== 정류장 행 (타임라인) ==================== */
function StopRow({
  stop,
  stopIdx,
  isOpen,
  isFav,
  isFirst,
  isLast,
  isMajor,
  direction,
  now,
  onClick,
  onToggleFav,
  liveData,
  liveLoading,
  refreshDisabled,
  onRefresh,
  t,
}: {
  stop: { name: string; major?: boolean; minFromOrigin: number };
  stopIdx: number;
  isOpen: boolean;
  isFav: boolean;
  isFirst: boolean;
  isLast: boolean;
  isMajor: boolean;
  direction: Direction;
  now: Date;
  onClick: () => void;
  onToggleFav: () => void;
  liveData: ApiResponse | null;
  liveLoading: boolean;
  refreshDisabled: boolean;
  onRefresh: () => void;
  t: (key: any) => string;
}) {
  // 정류장 도착 정보 계산 (시간표 기반)
  const arrivals = useMemo(
    () =>
      direction === "to-school"
        ? getStopArrivalsToSchool(stopIdx, 3, now)
        : getStopArrivalsFromSchool(stopIdx, 3, now),
    [direction, stopIdx, now]
  );

  const nextArrival = arrivals[0];
  const isOriginStop = direction === "to-school" ? isFirst : isLast;
  const isDestStop = direction === "to-school" ? isLast : isFirst;

  return (
    <div className={`relative ${isLast ? "" : "border-b border-gray-100"}`}>
      {/* 클릭 가능한 행 */}
      <button
        onClick={onClick}
        className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition text-left"
      >
        {/* 좌측 타임라인 (동그라미 + 세로선) */}
        <div className="relative flex flex-col items-center w-6 flex-shrink-0">
          {/* 위쪽 세로선 */}
          {!isFirst && (
            <div
              className="absolute top-0 w-0.5 h-1/2"
              style={{ backgroundColor: "#3D9651", opacity: 0.4 }}
            />
          )}
          {/* 아래쪽 세로선 */}
          {!isLast && (
            <div
              className="absolute bottom-0 w-0.5 h-1/2"
              style={{ backgroundColor: "#3D9651", opacity: 0.4 }}
            />
          )}
          {/* 동그라미 */}
          <div
            className="relative z-10 rounded-full border-2"
            style={{
              width: isMajor ? "14px" : "10px",
              height: isMajor ? "14px" : "10px",
              backgroundColor: isMajor ? "#3D9651" : "white",
              borderColor: "#3D9651",
            }}
          />
        </div>

        {/* 정류장 이름 + 라벨 */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span
              className={`text-sm ${isMajor ? "font-bold" : "font-medium"}`}
              style={{ color: isMajor ? "#11306E" : "#374151" }}
            >
              {isDestStop ? "🏫 " : ""}{stop.name}
            </span>
            {isOriginStop && (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-600">
                {t("cityBusOriginLabel")}
              </span>
            )}
            {isDestStop && (
              <span
                className="text-[10px] px-1.5 py-0.5 rounded font-semibold"
                style={{ backgroundColor: "#3D9651", color: "white" }}
              >
                {t("cityBusDestLabel")}
              </span>
            )}
          </div>
          {/* 다음 도착 요약 (접힌 상태) */}
          {!isOpen && nextArrival && (
            <div className="text-[11px] text-gray-500 mt-0.5">
              {nextArrival.minutesLeft <= 60 ? (
                <span>
                  <b style={{ color: "#E6007E" }}>{nextArrival.minutesLeft}{t("cityBusMinutesShort")}</b> 후 · {nextArrival.arrivalTime}
                  {nextArrival.isEstimated && <span className="ml-1 text-gray-400">({t("cityBusEstimated")})</span>}
                </span>
              ) : (
                <span>다음 {nextArrival.arrivalTime}</span>
              )}
            </div>
          )}
          {!isOpen && !nextArrival && (
            <div className="text-[11px] text-gray-400 mt-0.5">{t("cityBusEnd")}</div>
          )}
        </div>

        {/* 우측 즐겨찾기 별 */}
        <span
          role="button"
          tabIndex={0}
          onClick={(e) => {
            e.stopPropagation();
            onToggleFav();
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.stopPropagation();
              onToggleFav();
            }
          }}
          className="text-base px-2 cursor-pointer"
          style={{ color: isFav ? "#E6007E" : "#9CA3AF" }}
        >
          {isFav ? "★" : "☆"}
        </span>

        <span className="text-gray-300 text-xs">{isOpen ? "▲" : "▼"}</span>
      </button>

      {/* 펼친 도착 정보 */}
      {isOpen && (
        <div className="px-4 pb-3 pl-12 bg-gray-50 border-t border-gray-100">
          {/* 실시간 카드 (학교 종점 + to-school만) */}
          {liveData && liveData.ok && liveData.next && (
            <div
              className="mt-3 p-3 rounded-lg flex items-center justify-between"
              style={{ backgroundColor: "#E8F5EE", border: "1px solid #3D9651" }}
            >
              <div>
                <div className="text-[11px] font-semibold" style={{ color: "#3D9651" }}>
                  🛰️ 실시간
                </div>
                <div className="text-[11px] text-gray-600 mt-0.5">
                  {liveData.next.locationNo && `${liveData.next.locationNo}${t("cityBusStopNumber")} 전`}
                  {liveData.next.seats !== null && liveData.next.seats >= 0 && ` · 좌석 ${liveData.next.seats}`}
                </div>
              </div>
              <div className="text-2xl font-bold" style={{ color: "#E6007E" }}>
                {liveData.next.remainingSec !== null ? Math.round(liveData.next.remainingSec / 60) : "—"}
                <span className="text-[11px] text-gray-500 font-normal ml-1">{t("cityBusMinutesShort")}</span>
              </div>
            </div>
          )}
          {liveData && !liveData.ok && (
            <div
              className="mt-3 px-3 py-2 rounded text-[11px]"
              style={{ backgroundColor: "#FFF8DD", color: "#7A5C00", border: "1px solid #FFE680" }}
            >
              {t("busArrivalApiKeyMissing")}
            </div>
          )}

          {/* 시간표 기반 다음 N개 */}
          <div className="mt-3 space-y-1.5">
            {arrivals.length === 0 ? (
              <div className="text-xs text-gray-500 py-2">⏰ {t("cityBusEnd")}</div>
            ) : (
              arrivals.map((a, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between py-1.5 px-2 rounded"
                  style={i === 0 ? { backgroundColor: "white", border: "1px solid #D1D5DB" } : {}}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-gray-400 font-mono">#{a.trip}</span>
                    <span className="text-xs font-mono font-semibold" style={{ color: "#11306E" }}>
                      {a.arrivalTime}
                    </span>
                    {a.isEstimated && (
                      <span
                        className="text-[10px] px-1 py-0.5 rounded"
                        style={{ backgroundColor: "#FFF8DD", color: "#7A5C00" }}
                      >
                        {t("cityBusEstimated")}
                      </span>
                    )}
                  </div>
                  <div className="text-xs">
                    <b style={{ color: i === 0 ? "#E6007E" : "#6B7280" }}>{a.minutesLeft}</b>
                    <span className="text-gray-500 ml-0.5">{t("cityBusMinutesShort")}</span>
                  </div>
                </div>
              ))
            )}
          </div>

          {arrivals.some((a) => a.isEstimated) && (
            <p className="text-[10px] text-gray-500 mt-2">
              💡 {t("cityBusEstimatedNote")}
            </p>
          )}
          {isDestStop && direction === "to-school" && (
            <div className="mt-2 flex justify-end">
              <button
                onClick={onRefresh}
                disabled={refreshDisabled || liveLoading}
                className="text-[11px] px-3 py-1 rounded border border-gray-200 hover:bg-white transition disabled:opacity-50 flex items-center gap-1"
                style={{ color: "#3D9651" }}
              >
                <span className={liveLoading ? "inline-block animate-spin" : ""}>🔄</span>
                {t("busArrivalRefresh")}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

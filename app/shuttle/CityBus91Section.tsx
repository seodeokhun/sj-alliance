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
  remainingStops: number | null;
  seats: number | null;
  plateNo: string | null;
  flag: string | null;
};

type ApiResponse =
  | {
      ok: true;
      updatedAt: string;
      stationId: string;
      routeId: string;
      next: ArrivalData | null;
      second: ArrivalData | null;
    }
  | {
      ok: false;
      error: "API_KEY_MISSING" | "CONFIG_MISSING" | "FETCH_ERROR" | "PARSE_ERROR" | "API_ERROR";
      message: string;
      updatedAt: string;
    };

const AUTO_REFRESH_MS = 60_000;
const BUS_LOCATIONS_REFRESH_MS = 30_000; // 버스 위치는 30초마다 (더 자주)
const FAVORITE_KEY = "sj-bus91-favorite-stops";

type BusLocation = {
  plateNo: string | null;
  stationSeq: number | null;
  stationId: number | null;
  endBus: string | null;
  lowPlate: string | null;
  remainSeatCnt: number | null;
};

type LocationsResponse =
  | { ok: true; updatedAt: string; routeId: string; buses: BusLocation[] }
  | { ok: false; error: string; message: string; updatedAt: string };

export default function CityBus91Section({ t }: { t: (key: any) => string }) {
  const [direction, setDirection] = useState<Direction>("to-school");
  const [openStopIndex, setOpenStopIndex] = useState<number | null>(BUS91_STOPS.length - 1); // 종점(학교) 기본 펼침
  const [now, setNow] = useState(new Date());
  const [showAllSchedule, setShowAllSchedule] = useState(false);
  const [favoriteStops, setFavoriteStops] = useState<number[]>([]);

  // 실시간 도착 정보 (현재 펼친 정류장)
  const [liveData, setLiveData] = useState<ApiResponse | null>(null);
  const [liveLoading, setLiveLoading] = useState(false);
  const [refreshDisabled, setRefreshDisabled] = useState(false);
  const lastFetchRef = useRef<number>(0);

  // 운행 중인 모든 91번 버스 위치
  const [busLocations, setBusLocations] = useState<BusLocation[]>([]);
  const [locationsLoaded, setLocationsLoaded] = useState(false);

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

  /* ---------- 현재 펼친 정류장의 stationId (방향별) ---------- */
  const openStationId = useMemo(() => {
    if (openStopIndex === null) return null;
    const stop = BUS91_STOPS[openStopIndex];
    if (!stop) return null;
    if (direction === "to-school") return stop.stationIdToSchool ?? null;
    return stop.stationIdFromSchool ?? null;
  }, [openStopIndex, direction]);

  /* ---------- 실시간 도착정보 fetch ---------- */
  const fetchLive = useCallback(async (stationId: number) => {
    setLiveLoading(true);
    try {
      const res = await fetch(
        `/api/bus-arrival?stationId=${stationId}&routeId=${BUS91_INFO.routeId}`,
        { cache: "no-store" }
      );
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

  /* ---------- 펼친 정류장 바뀔 때마다 실시간 호출 ---------- */
  useEffect(() => {
    if (openStationId !== null) {
      setLiveData(null);
      fetchLive(openStationId);
    } else {
      setLiveData(null);
    }
  }, [openStationId, fetchLive]);

  /* ---------- 1분마다 자동 갱신 (탭 보일 때만) ---------- */
  useEffect(() => {
    if (openStationId === null) return;
    const id = setInterval(() => {
      if (document.visibilityState === "visible") fetchLive(openStationId);
    }, AUTO_REFRESH_MS);
    return () => clearInterval(id);
  }, [openStationId, fetchLive]);

  /* ---------- 운행 중 버스 위치 fetch (30초마다) ---------- */
  const fetchBusLocations = useCallback(async () => {
    try {
      const res = await fetch(
        `/api/bus-locations?routeId=${BUS91_INFO.routeId}`,
        { cache: "no-store" }
      );
      const json = (await res.json()) as LocationsResponse;
      if (json.ok) {
        setBusLocations(json.buses);
      } else {
        setBusLocations([]);
      }
    } catch {
      setBusLocations([]);
    } finally {
      setLocationsLoaded(true);
    }
  }, []);

  useEffect(() => {
    fetchBusLocations();
    const id = setInterval(() => {
      if (document.visibilityState === "visible") fetchBusLocations();
    }, BUS_LOCATIONS_REFRESH_MS);
    return () => clearInterval(id);
  }, [fetchBusLocations]);

  /* ---------- 수동 새로고침 (3초 디바운스) ---------- */
  function handleRefresh() {
    if (refreshDisabled || liveLoading || openStationId === null) return;
    setRefreshDisabled(true);
    fetchLive(openStationId);
    setTimeout(() => setRefreshDisabled(false), 3000);
  }

  /* ---------- 전체 새로고침 (열린 정류장 도착 + 모든 버스 위치) ---------- */
  function handleRefreshAll() {
    if (refreshDisabled) return;
    setRefreshDisabled(true);
    if (openStationId !== null) fetchLive(openStationId);
    fetchBusLocations();
    setTimeout(() => setRefreshDisabled(false), 3000);
  }

  /* ---------- 정류장 순서 (방향에 따라 역순) ---------- */
  const stops = useMemo(
    () => (direction === "to-school" ? BUS91_STOPS : [...BUS91_STOPS].reverse()),
    [direction]
  );

  const refTimeStr = now.toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" });

  return (
    <>
      {/* 노선 정보 헤더 */}
      <section
        className="px-5 py-5 text-white relative"
        style={{ backgroundColor: "#3D9651" }}
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
          {/* 운행 중 버스 수 */}
          {locationsLoaded && (
            <div className="text-right flex-shrink-0">
              <div className="text-xs opacity-80">🚌 운행 중</div>
              <div className="text-2xl font-extrabold leading-tight">
                {busLocations.length}
                <span className="text-xs opacity-80 font-normal ml-0.5">대</span>
              </div>
            </div>
          )}
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

        {/* 기준 시각 + 전체 새로고침 */}
        <div className="flex items-center justify-between mb-2 px-1">
          <span className="text-[11px] text-gray-500">⏱ {t("cityBusReferenceTime")} {refTimeStr}</span>
          <button
            onClick={handleRefreshAll}
            disabled={refreshDisabled}
            className="text-[11px] px-3 py-1 rounded-md text-white transition disabled:opacity-50 flex items-center gap-1 font-semibold"
            style={{ backgroundColor: "#3D9651" }}
            aria-label="전체 새로고침"
          >
            <span className={refreshDisabled ? "inline-block animate-spin" : ""}>🔄</span>
            전체 새로고침
          </button>
        </div>
        <div className="text-[11px] text-gray-500 mb-2 px-1">
          {t("cityBusTapToView")}
        </div>

        {/* 정류장 타임라인 */}
        <section className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
          {stops.map((stop, displayIdx) => {
            const stopIdx = direction === "to-school"
              ? displayIdx
              : BUS91_STOPS.length - 1 - displayIdx;
            const isOpen = openStopIndex === stopIdx;
            const isFav = favoriteStops.includes(stopIdx);
            const isFirst = displayIdx === 0;
            const isLast = displayIdx === stops.length - 1;
            const isMajor = stop.major;

            // 이 정류장에 운행 중인 버스가 있는지 (stationSeq 기준)
            // 학교 방면: stationSeq = stopIdx + 1 (1-based)
            // 학교 출발: stationSeq = (총 65개) - stopIdx  로 계산
            // BUS91_STOPS는 학교 방면 순서 (33개). 학교방면일 때 stationSeq = stopIdx+1
            // 학교 출발 방면일 때는 stationSeq = 65 - stopIdx 정도 (역방향)
            const expectedSeq = direction === "to-school"
              ? stopIdx + 1
              : 65 - stopIdx; // 대략적 매핑 (정확한 매핑은 stationId로)
            const busesHere = busLocations.filter((b) => {
              if (b.stationSeq === null) return false;
              // stationId로 정확히 매칭
              const expectedId = direction === "to-school"
                ? stop.stationIdToSchool
                : stop.stationIdFromSchool;
              return expectedId && b.stationId === expectedId;
            });

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
                liveData={isOpen ? liveData : null}
                liveLoading={isOpen ? liveLoading : false}
                refreshDisabled={refreshDisabled}
                onRefresh={handleRefresh}
                busesHere={busesHere}
                t={t}
              />
            );
          })}
        </section>

        {/* 전체 시간표 */}
        <section className="mt-5 bg-white border border-gray-200 rounded-2xl overflow-hidden">
          <button
            onClick={() => setShowAllSchedule((v) => !v)}
            className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition"
          >
            <span className="text-sm font-semibold" style={{ color: "#11306E" }}>
              ⏱ {t("busScheduleTitle")} ({BUS91_INFO.dailyTrips}{t("cityBusTrips")})
            </span>
            <span className="text-gray-400 text-xs">{showAllSchedule ? "▲" : "▼"}</span>
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
  busesHere,
  t,
}: {
  stop: { name: string; major?: boolean; minFromOrigin: number; stationIdToSchool: number; stationIdFromSchool?: number };
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
  busesHere: BusLocation[];
  t: (key: any) => string;
}) {
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

  // 역방향 정류장 ID 없으면 안내
  const noStationForDirection = direction === "from-school" && !stop.stationIdFromSchool;

  // 실시간 도착 정보가 의미 있는지 (다음 버스 분 단위 데이터 있음)
  const hasLiveArrival = !!(
    liveData &&
    liveData.ok &&
    liveData.next &&
    liveData.next.remainingSec !== null &&
    liveData.next.remainingSec !== undefined
  );

  return (
    <div className={`relative ${isLast ? "" : "border-b border-gray-100"}`}>
      <button
        onClick={onClick}
        className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition text-left"
      >
        {/* 좌측 타임라인 (굵은 연결선 + 화살표) */}
        <div className="relative flex flex-col items-center w-7 flex-shrink-0 self-stretch">
          {/* 위쪽 세로선 */}
          {!isFirst && (
            <div
              className="absolute top-0 w-[3px] left-1/2 -translate-x-1/2"
              style={{ backgroundColor: "#3D9651", height: "50%" }}
            />
          )}
          {/* 아래쪽 세로선 */}
          {!isLast && (
            <div
              className="absolute bottom-0 w-[3px] left-1/2 -translate-x-1/2"
              style={{ backgroundColor: "#3D9651", height: "50%" }}
            />
          )}
          {/* 방향 화살표 (위에서 아래로 진행 표시, 정류장 동그라미 위쪽) */}
          {!isFirst && (
            <div
              className="absolute text-[10px] leading-none"
              style={{ top: "12%", color: "#3D9651" }}
            >
              ▼
            </div>
          )}
          {/* 정류장 동그라미 */}
          <div className="relative z-10 my-auto">
            <div
              className="rounded-full border-2"
              style={{
                width: isMajor ? "16px" : "12px",
                height: isMajor ? "16px" : "12px",
                backgroundColor: isMajor ? "#3D9651" : "white",
                borderColor: "#3D9651",
              }}
            />
          </div>
        </div>

        {/* 운행 중인 버스 표시 (이 정류장에 있을 때) */}
        {busesHere.length > 0 && (
          <div
            className="flex flex-col items-center gap-0.5 flex-shrink-0 px-1 py-1 rounded-md"
            style={{ backgroundColor: "#FEF3C7", border: "1px solid #FBBF24" }}
            title={`이 정류장 ${busesHere.length}대`}
          >
            <span className="text-base leading-none">🚌</span>
            {busesHere.length > 1 && (
              <span className="text-[9px] font-bold leading-none" style={{ color: "#B45309" }}>
                ×{busesHere.length}
              </span>
            )}
          </div>
        )}

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

      {isOpen && (
        <div className="px-4 pb-3 pl-12 bg-gray-50 border-t border-gray-100">
          {/* 실시간 카드 */}
          <LiveCard
            liveData={liveData}
            liveLoading={liveLoading}
            noStationForDirection={noStationForDirection}
            onRefresh={onRefresh}
            refreshDisabled={refreshDisabled}
            t={t}
          />

          {/*
            시간표 기반 다음 N개 (추정)
            실시간 도착 정보가 있을 때는 중복이라 숨김.
            실시간이 없을 때 (시점·종점 PASS, 운행 종료, API 에러)에만 폴백으로 표시.
          */}
          {!hasLiveArrival && (
            <div className="mt-3">
              <div className="text-[11px] font-semibold text-gray-500 mb-1.5 px-1">
                📋 {t("busScheduleUpcoming")} ({t("cityBusEstimated")})
              </div>
              <div className="space-y-1.5">
                {arrivals.length === 0 ? (
                  <div className="text-xs text-gray-500 py-2 px-1">⏰ {t("cityBusEnd")}</div>
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
                      </div>
                      <div className="text-xs">
                        <b style={{ color: i === 0 ? "#E6007E" : "#6B7280" }}>{a.minutesLeft}</b>
                        <span className="text-gray-500 ml-0.5">{t("cityBusMinutesShort")}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ==================== 실시간 도착 카드 ==================== */
function LiveCard({
  liveData,
  liveLoading,
  noStationForDirection,
  onRefresh,
  refreshDisabled,
  t,
}: {
  liveData: ApiResponse | null;
  liveLoading: boolean;
  noStationForDirection: boolean;
  onRefresh: () => void;
  refreshDisabled: boolean;
  t: (key: any) => string;
}) {
  if (noStationForDirection) {
    return (
      <div
        className="mt-3 px-3 py-2 rounded text-[11px]"
        style={{ backgroundColor: "#F3F4F6", color: "#6B7280", border: "1px solid #E5E7EB" }}
      >
        이 정류장은 반대 방향에서만 정차합니다.
      </div>
    );
  }

  if (liveLoading && !liveData) {
    return (
      <div className="mt-3 px-3 py-3 text-xs text-gray-500 text-center">
        🛰️ 실시간 정보 불러오는 중...
      </div>
    );
  }

  if (!liveData) return null;

  if (!liveData.ok) {
    if (liveData.error === "API_KEY_MISSING") {
      return (
        <div
          className="mt-3 px-3 py-2 rounded text-[11px]"
          style={{ backgroundColor: "#FFF8DD", color: "#7A5C00", border: "1px solid #FFE680" }}
        >
          ⚠️ {t("busArrivalApiKeyMissing")}
        </div>
      );
    }
    return (
      <div className="mt-3 px-3 py-2 rounded text-[11px] bg-red-50 text-red-700 border border-red-200">
        ⚠️ 실시간 정보 없음 ({liveData.message})
      </div>
    );
  }

  const minutes1 = liveData.next?.remainingSec !== null && liveData.next?.remainingSec !== undefined
    ? Math.round(liveData.next.remainingSec / 60)
    : null;
  const minutes2 = liveData.second?.remainingSec !== null && liveData.second?.remainingSec !== undefined
    ? Math.round(liveData.second.remainingSec / 60)
    : null;

  // 의미 있는 데이터 확인 (시점·종점은 PASS만 나올 수 있음)
  const hasValidNext = minutes1 !== null;
  const hasValidSecond = minutes2 !== null;
  const flag1 = liveData.next?.flag;
  const isPassOrNoBus = !hasValidNext && (flag1 === "PASS" || liveData.next === null);

  return (
    <div className="mt-3 space-y-2">
      {/* 헤더 */}
      <div className="flex items-center justify-between px-1">
        <span className="text-[11px] font-semibold" style={{ color: "#3D9651" }}>
          🛰️ 실시간 도착 정보
        </span>
        <button
          onClick={onRefresh}
          disabled={refreshDisabled || liveLoading}
          className="text-[11px] px-2 py-0.5 rounded border border-gray-200 hover:bg-white transition disabled:opacity-50 flex items-center gap-1"
          style={{ color: "#3D9651" }}
        >
          <span className={liveLoading ? "inline-block animate-spin" : ""}>🔄</span>
          새로고침
        </button>
      </div>

      {/* 다음 버스 */}
      {hasValidNext && liveData.next ? (
        <div
          className="p-3 rounded-lg"
          style={{ backgroundColor: "#E8F5EE", border: "1px solid #3D9651" }}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-semibold" style={{ color: "#11306E" }}>
              다음 버스
            </span>
            <span className="text-2xl font-bold" style={{ color: "#E6007E" }}>
              {minutes1}
              <span className="text-[11px] text-gray-500 font-normal ml-1">분 후</span>
            </span>
          </div>
          <div className="text-[11px] text-gray-600 flex flex-wrap gap-x-3 gap-y-0.5">
            {liveData.next.remainingStops !== null && (
              <span>📍 {liveData.next.remainingStops}정거장 전</span>
            )}
            {liveData.next.seats !== null && liveData.next.seats >= 0 && (
              <span>🪑 잔여 {liveData.next.seats}석</span>
            )}
            {liveData.next.plateNo && (
              <span className="text-gray-400">🚌 {liveData.next.plateNo}</span>
            )}
          </div>
        </div>
      ) : isPassOrNoBus ? (
        <div
          className="px-3 py-2.5 rounded text-[11px]"
          style={{ backgroundColor: "#F3F4F6", color: "#6B7280", border: "1px solid #E5E7EB" }}
        >
          🚌 현재 이 정류장에 도착 예정인 버스가 없습니다
          <div className="text-[10px] text-gray-400 mt-1">
            시점·종점 정류장은 도착 정보 없이 출발 정보만 제공됩니다. 아래 시간표를 참고해 주세요.
          </div>
        </div>
      ) : (
        <div className="px-3 py-2 rounded text-[11px] text-gray-500 bg-white border border-gray-200">
          실시간 정보를 가져오는 중...
        </div>
      )}

      {/* 다다음 버스 */}
      {hasValidSecond && liveData.second && (
        <div
          className="p-2.5 rounded-lg"
          style={{ backgroundColor: "#F9FAFB", border: "1px solid #E5E7EB" }}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-gray-600">다다음 버스</span>
            <span className="text-base font-bold text-gray-600">
              {minutes2}
              <span className="text-[10px] text-gray-500 font-normal ml-1">분 후</span>
            </span>
          </div>
          <div className="text-[10px] text-gray-500 mt-0.5 flex flex-wrap gap-x-3">
            {liveData.second.remainingStops !== null && (
              <span>{liveData.second.remainingStops}정거장 전</span>
            )}
            {liveData.second.seats !== null && liveData.second.seats >= 0 && (
              <span>좌석 {liveData.second.seats}</span>
            )}
          </div>
        </div>
      )}

      <div className="text-[10px] text-gray-400 text-right px-1">
        갱신: {new Date(liveData.updatedAt).toLocaleTimeString("ko-KR")} · 1분 자동
      </div>
    </div>
  );
}

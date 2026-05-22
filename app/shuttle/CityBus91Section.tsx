"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  BUS91_INFO,
  BUS91_STOPS,
  BUS91_SCHEDULE,
  getUpcomingTrips,
} from "@/data/city-bus-91";

type Direction = "school" | "deokjeong";

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
      direction: Direction;
      next: ArrivalData | null;
      second: ArrivalData | null;
    }
  | {
      ok: false;
      error: "API_KEY_MISSING" | "CONFIG_MISSING" | "FETCH_ERROR" | "PARSE_ERROR";
      message: string;
      updatedAt: string;
    };

const AUTO_REFRESH_MS = 60_000; // 1분

export default function CityBus91Section({ t }: { t: (key: any) => string }) {
  const [direction, setDirection] = useState<Direction>("school");
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [refreshDisabled, setRefreshDisabled] = useState(false);
  const [now, setNow] = useState(new Date());
  const [showAllSchedule, setShowAllSchedule] = useState(false);
  const lastFetchRef = useRef<number>(0);

  /* ---------- 실시간 도착정보 fetch ---------- */
  const fetchArrival = useCallback(
    async (dir: Direction) => {
      setLoading(true);
      try {
        const res = await fetch(`/api/bus-arrival?direction=${dir}`, {
          cache: "no-store",
        });
        const json = (await res.json()) as ApiResponse;
        setData(json);
        lastFetchRef.current = Date.now();
      } catch {
        setData({
          ok: false,
          error: "FETCH_ERROR",
          message: "network error",
          updatedAt: new Date().toISOString(),
        });
      } finally {
        setLoading(false);
      }
    },
    []
  );

  /* ---------- 초기 + 방향 변경 시 fetch ---------- */
  useEffect(() => {
    fetchArrival(direction);
  }, [direction, fetchArrival]);

  /* ---------- 1분마다 자동 갱신 (탭 활성 상태일 때만) ---------- */
  useEffect(() => {
    const id = setInterval(() => {
      if (document.visibilityState === "visible") {
        fetchArrival(direction);
      }
    }, AUTO_REFRESH_MS);
    return () => clearInterval(id);
  }, [direction, fetchArrival]);

  /* ---------- 현재 시각 갱신 (시간표 계산용) ---------- */
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(id);
  }, []);

  /* ---------- 수동 새로고침 (3초 디바운스) ---------- */
  function handleRefresh() {
    if (refreshDisabled || loading) return;
    setRefreshDisabled(true);
    fetchArrival(direction);
    setTimeout(() => setRefreshDisabled(false), 3000);
  }

  /* ---------- 다가오는 운행 (시간표 기준) ---------- */
  const upcoming = useMemo(
    () => getUpcomingTrips(direction === "school" ? "school" : "deokjeong", 3, now),
    [direction, now]
  );

  return (
    <>
      {/* 히어로 */}
      <section className="px-5 py-6 text-white" style={{ backgroundColor: "#213A8F" }}>
        <div className="max-w-3xl mx-auto">
          <h2 className="text-xl font-bold mb-1">🚌 {t("cityBus91Title")}</h2>
          <p className="text-xs" style={{ color: "#B5D4F4" }}>
            {t("cityBus91Subtitle")}
          </p>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-5">
        {/* 노선 기본 정보 */}
        <section className="mt-5 bg-white border border-gray-200 rounded-2xl p-4">
          <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-xs">
            <InfoRow label={t("cityBusOperator")} value={BUS91_INFO.operator} />
            <InfoRow
              label={t("cityBusDailyTrips")}
              value={`${BUS91_INFO.dailyTrips}${t("cityBusTrips")}`}
            />
            <InfoRow label={t("shuttleWeekday")} value={BUS91_INFO.weekdayHours} />
            <InfoRow label={t("shuttleWeekend")} value={BUS91_INFO.weekendHours} />
            <InfoRow
              label={`${t("cityBusInterval")} (${t("shuttleWeekday")})`}
              value={BUS91_INFO.weekdayInterval}
            />
            <InfoRow
              label={`${t("cityBusInterval")} (${t("shuttleWeekend")})`}
              value={BUS91_INFO.weekendInterval}
            />
          </div>
        </section>

        {/* 실시간 도착정보 */}
        <section className="mt-5 bg-white border border-gray-200 rounded-2xl overflow-hidden">
          <header
            className="px-4 py-3 flex items-center justify-between"
            style={{ backgroundColor: "#11306E", color: "white" }}
          >
            <h3 className="text-sm font-bold">{t("busArrivalLiveTitle")}</h3>
            <button
              onClick={handleRefresh}
              disabled={refreshDisabled || loading}
              className="text-xs px-3 py-1.5 rounded-md transition disabled:opacity-50 flex items-center gap-1"
              style={{ backgroundColor: "#213A8F" }}
              title={t("busArrivalRefresh")}
            >
              <span className={loading ? "inline-block animate-spin" : ""}>🔄</span>
              {t("busArrivalRefresh")}
            </button>
          </header>

          {/* 방향 토글 */}
          <div className="grid grid-cols-2 gap-2 p-3 border-b border-gray-100">
            <button
              onClick={() => setDirection("school")}
              className={`py-2 rounded-lg text-xs font-semibold transition ${
                direction === "school" ? "text-white" : "text-gray-600 bg-gray-100"
              }`}
              style={{ backgroundColor: direction === "school" ? "#11306E" : undefined }}
            >
              ➡️ {t("busArrivalToSchool")}
            </button>
            <button
              onClick={() => setDirection("deokjeong")}
              className={`py-2 rounded-lg text-xs font-semibold transition ${
                direction === "deokjeong" ? "text-white" : "text-gray-600 bg-gray-100"
              }`}
              style={{ backgroundColor: direction === "deokjeong" ? "#11306E" : undefined }}
            >
              ⬅️ {t("busArrivalFromSchool")}
            </button>
          </div>

          {/* 도착 정보 본문 */}
          <div className="p-4">
            <ArrivalBody data={data} loading={loading} t={t} />
          </div>

          {/* 푸터: 마지막 갱신 */}
          <footer className="px-4 py-2.5 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
            <span>
              {t("busArrivalLastUpdate")}:{" "}
              {data?.updatedAt
                ? new Date(data.updatedAt).toLocaleTimeString("ko-KR")
                : "—"}
            </span>
            <span>{t("busArrivalAutoRefresh")}</span>
          </footer>
        </section>

        {/* 정류장 목록 */}
        <section className="mt-5 bg-white border border-gray-200 rounded-2xl p-4">
          <h3 className="text-sm font-bold mb-3" style={{ color: "#11306E" }}>
            📍 {t("cityBusRouteStops")}
          </h3>
          <ol className="space-y-2">
            {BUS91_STOPS.map((stop, idx) => (
              <li key={idx} className="flex items-center gap-3">
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0"
                  style={{
                    backgroundColor: stop.major ? "#11306E" : "#E5E7EB",
                    color: stop.major ? "white" : "#6B7280",
                  }}
                >
                  {idx + 1}
                </div>
                <span
                  className={`text-xs ${stop.major ? "font-semibold" : ""}`}
                  style={stop.major ? { color: "#11306E" } : { color: "#4B5563" }}
                >
                  {stop.name}
                </span>
              </li>
            ))}
          </ol>
        </section>

        {/* 시간표 */}
        <section className="mt-5 bg-white border border-gray-200 rounded-2xl overflow-hidden">
          <header className="px-4 py-3 border-b border-gray-100">
            <h3 className="text-sm font-bold" style={{ color: "#11306E" }}>
              ⏱️ {t("busScheduleTitle")} ({BUS91_INFO.dailyTrips}{t("cityBusTrips")})
            </h3>
          </header>

          {/* 다가오는 운행 */}
          <div className="px-4 py-3 border-b border-gray-100 bg-amber-50">
            <div className="text-[11px] font-semibold mb-2 text-amber-900">
              🔥 {t("busScheduleUpcoming")}
            </div>
            {upcoming.length > 0 ? (
              <div className="space-y-1.5">
                {upcoming.map((trip) => (
                  <ScheduleRow
                    key={trip.trip}
                    trip={trip.trip}
                    deokjeong={trip.deokjeong}
                    school={trip.school}
                    deokjeongReturn={trip.deokjeongReturn}
                    highlight
                    direction={direction}
                  />
                ))}
              </div>
            ) : (
              <div className="text-xs text-gray-500">
                {t("shuttleNoMoreToday")}
              </div>
            )}
          </div>

          {/* 전체 / 접기 */}
          <div className="px-4 py-3">
            <button
              onClick={() => setShowAllSchedule((v) => !v)}
              className="w-full text-center text-xs py-2 rounded-md hover:bg-gray-50 transition"
              style={{ color: "#11306E", border: "1px solid #E5E7EB" }}
            >
              {showAllSchedule
                ? t("busScheduleShowLess")
                : t("busScheduleShowAll")}
            </button>

            {showAllSchedule && (
              <div className="mt-3 max-h-96 overflow-y-auto border border-gray-100 rounded-md">
                <div className="grid grid-cols-[40px_1fr_1fr_1fr] text-[10px] font-semibold text-gray-500 px-2 py-2 sticky top-0 bg-gray-50">
                  <span>{t("busScheduleTrip")}</span>
                  <span className="text-center">덕정역</span>
                  <span className="text-center">학교</span>
                  <span className="text-center">덕정역(회차)</span>
                </div>
                <div className="divide-y divide-gray-100">
                  {BUS91_SCHEDULE.map((trip) => (
                    <ScheduleRow
                      key={trip.trip}
                      trip={trip.trip}
                      deokjeong={trip.deokjeong}
                      school={trip.school}
                      deokjeongReturn={trip.deokjeongReturn}
                      direction={direction}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* 학교 공식 페이지 링크 */}
        <div className="mt-6 text-center pb-2">
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

/* ==================== 보조 컴포넌트 ==================== */

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10px] text-gray-500 mb-0.5">{label}</div>
      <div className="text-xs font-semibold text-gray-800">{value}</div>
    </div>
  );
}

function ArrivalBody({
  data,
  loading,
  t,
}: {
  data: ApiResponse | null;
  loading: boolean;
  t: (key: any) => string;
}) {
  if (!data) {
    return (
      <div className="py-6 text-center text-xs text-gray-500">
        {t("loading")}
      </div>
    );
  }

  if (!data.ok) {
    if (data.error === "API_KEY_MISSING" || data.error === "CONFIG_MISSING") {
      return (
        <div
          className="px-3 py-3 rounded-lg text-xs"
          style={{
            backgroundColor: "#FFF8DD",
            color: "#7A5C00",
            border: "1px solid #FFE680",
          }}
        >
          {t("busArrivalApiKeyMissing")}
        </div>
      );
    }
    return (
      <div className="px-3 py-3 rounded-lg text-xs bg-red-50 text-red-700 border border-red-200">
        ⚠️ {t("busArrivalError")}
      </div>
    );
  }

  if (!data.next && !data.second) {
    return (
      <div className="py-6 text-center text-xs text-gray-500">
        {t("busArrivalNoData")}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {data.next && (
        <ArrivalCard
          label={t("busArrivalNextBus")}
          arrival={data.next}
          highlight
          t={t}
        />
      )}
      {data.second && (
        <ArrivalCard
          label={t("busArrivalSecondBus")}
          arrival={data.second}
          highlight={false}
          t={t}
        />
      )}
    </div>
  );
}

function ArrivalCard({
  label,
  arrival,
  highlight,
  t,
}: {
  label: string;
  arrival: ArrivalData;
  highlight: boolean;
  t: (key: any) => string;
}) {
  const minutes = arrival.remainingSec !== null
    ? Math.round(arrival.remainingSec / 60)
    : null;

  return (
    <div
      className="p-3 rounded-lg"
      style={{
        backgroundColor: highlight ? "#F0F4FA" : "#F9FAFB",
        border: highlight ? "1px solid #11306E" : "1px solid #E5E7EB",
      }}
    >
      <div className="flex items-center justify-between mb-1">
        <span className="text-[11px] font-semibold" style={{ color: "#11306E" }}>
          {label}
        </span>
        {minutes !== null && (
          <span className="text-2xl font-bold" style={{ color: "#E6007E" }}>
            {minutes}
            <span className="text-[11px] text-gray-500 font-normal ml-1">
              {t("busArrivalMinutesAway")}
            </span>
          </span>
        )}
      </div>
      <div className="text-[11px] text-gray-600 flex flex-wrap gap-x-3 gap-y-1">
        {arrival.locationNo && (
          <span>
            📍 {t("busArrivalCurrentLocation")}: {arrival.locationNo}
          </span>
        )}
        {arrival.seats !== null && arrival.seats >= 0 && (
          <span>🪑 {t("busArrivalSeats")}: {arrival.seats}</span>
        )}
        {arrival.plateNo && (
          <span className="text-gray-400">🚌 {arrival.plateNo}</span>
        )}
      </div>
    </div>
  );
}

function ScheduleRow({
  trip,
  deokjeong,
  school,
  deokjeongReturn,
  highlight = false,
  direction,
}: {
  trip: number;
  deokjeong: string;
  school: string;
  deokjeongReturn: string;
  highlight?: boolean;
  direction: Direction;
}) {
  return (
    <div
      className={`grid grid-cols-[40px_1fr_1fr_1fr] text-xs items-center px-2 py-2 ${
        highlight ? "rounded-md" : ""
      }`}
      style={highlight ? { backgroundColor: "white", border: "1px solid #FED7AA" } : {}}
    >
      <span className="text-gray-400 text-[10px] font-mono">{trip}</span>
      <span
        className={`text-center font-mono ${
          direction === "deokjeong" ? "font-bold" : "text-gray-700"
        }`}
        style={direction === "deokjeong" ? { color: "#11306E" } : {}}
      >
        {deokjeong}
      </span>
      <span
        className={`text-center font-mono ${
          direction === "school" ? "font-bold" : "text-gray-700"
        }`}
        style={direction === "school" ? { color: "#11306E" } : {}}
      >
        {school}
      </span>
      <span className="text-center font-mono text-gray-500">{deokjeongReturn}</span>
    </div>
  );
}

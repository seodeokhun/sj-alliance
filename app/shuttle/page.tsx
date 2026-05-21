"use client";

import { useEffect, useMemo, useState } from "react";
import { useLocale } from "@/lib/useLocale";
import LangSwitcher from "@/components/LangSwitcher";
import {
  SHUTTLE_ROUTES,
  SHUTTLE_TERM,
  SHUTTLE_GENERAL_NOTICES,
  getNextDeparture,
  type ShuttleRoute,
} from "@/data/shuttle";

const FAVORITE_KEY = "sj-shuttle-favorites";

export default function ShuttlePage() {
  const { locale, setLocale, t, mounted } = useLocale();
  const [now, setNow] = useState(new Date());
  const [favorites, setFavorites] = useState<string[]>([]);
  const [dayType, setDayType] = useState<"weekday" | "weekend">("weekday");
  const [showNotices, setShowNotices] = useState(false);

  // 현재 시각 1분마다 갱신 (다음 버스 카운트다운용)
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(id);
  }, []);

  // 첫 진입 시 현재 요일에 맞춰 평일/주말 자동 선택
  useEffect(() => {
    const day = new Date().getDay(); // 0=일, 6=토
    if (day === 6) setDayType("weekend");
    else if (day === 0) setDayType("weekday"); // 일요일은 운행 없음 → 평일 기본
    else setDayType("weekday");
  }, []);

  // 즐겨찾기 로드
  useEffect(() => {
    try {
      const raw = localStorage.getItem(FAVORITE_KEY);
      if (raw) setFavorites(JSON.parse(raw));
    } catch {}
  }, []);

  function toggleFavorite(id: string) {
    setFavorites((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      try {
        localStorage.setItem(FAVORITE_KEY, JSON.stringify(next));
      } catch {}
      return next;
    });
  }

  const routesForDay = useMemo(
    () => SHUTTLE_ROUTES.filter((r) => r.type === dayType),
    [dayType]
  );

  const favRoutes = useMemo(
    () => routesForDay.filter((r) => favorites.includes(r.id)),
    [routesForDay, favorites]
  );
  const otherRoutes = useMemo(
    () => routesForDay.filter((r) => !favorites.includes(r.id)),
    [routesForDay, favorites]
  );

  // 일요일은 운행 없음
  const isSunday = new Date().getDay() === 0;
  const todayMatchesType =
    (dayType === "weekday" && [1, 2, 3, 4, 5].includes(new Date().getDay())) ||
    (dayType === "weekend" && new Date().getDay() === 6);

  if (!mounted) return null;

  return (
    <main className="min-h-screen bg-gray-50 pb-24">
      {/* 헤더 */}
      <header
        className="px-5 py-4 sticky top-0 z-40 flex items-center justify-between"
        style={{ backgroundColor: "#11306E" }}
      >
        <h1 className="text-white font-semibold text-base flex items-center gap-2">
          🚌 {t("shuttleTitle")}
        </h1>
        <LangSwitcher locale={locale} onChange={setLocale} compact />
      </header>

      {/* 히어로 */}
      <section className="px-5 py-6 text-white" style={{ backgroundColor: "#213A8F" }}>
        <div className="max-w-3xl mx-auto">
          <h2 className="text-xl font-bold mb-1">{t("shuttleTitle")}</h2>
          <p className="text-xs mb-3" style={{ color: "#B5D4F4" }}>
            {t("shuttleSubtitle")}
          </p>
          <div
            className="inline-block px-3 py-1.5 rounded-md text-xs font-medium"
            style={{ backgroundColor: "#FFD500", color: "#11306E" }}
          >
            {t("shuttleTermLabel")}: {SHUTTLE_TERM.semester} · {SHUTTLE_TERM.startDate} ~ {SHUTTLE_TERM.endDate}
          </div>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-5">
        {/* GPS 안내 배너 */}
        <div
          className="mt-5 px-4 py-3 rounded-lg text-xs"
          style={{ backgroundColor: "#FFF8DD", color: "#7A5C00", border: "1px solid #FFE680" }}
        >
          {t("shuttleGpsComing")}
        </div>

        {/* 평일/주말 토글 */}
        <div className="mt-5 grid grid-cols-2 gap-2 p-1 bg-white rounded-xl border border-gray-200">
          <button
            onClick={() => setDayType("weekday")}
            className={`py-3 rounded-lg text-sm font-semibold transition ${
              dayType === "weekday" ? "text-white" : "text-gray-600"
            }`}
            style={{
              backgroundColor: dayType === "weekday" ? "#11306E" : "transparent",
            }}
          >
            {t("shuttleWeekday")}
          </button>
          <button
            onClick={() => setDayType("weekend")}
            className={`py-3 rounded-lg text-sm font-semibold transition ${
              dayType === "weekend" ? "text-white" : "text-gray-600"
            }`}
            style={{
              backgroundColor: dayType === "weekend" ? "#11306E" : "transparent",
            }}
          >
            {t("shuttleWeekend")}
          </button>
        </div>

        {/* 일요일 안내 */}
        {isSunday && (
          <div className="mt-3 px-4 py-3 rounded-lg text-xs text-center bg-gray-100 text-gray-600">
            ⚠️ {t("shuttleNoneToday")}
          </div>
        )}

        {/* 즐겨찾기 섹션 */}
        {favRoutes.length > 0 && (
          <section className="mt-6">
            <h3 className="text-sm font-bold mb-2 flex items-center gap-1" style={{ color: "#11306E" }}>
              ⭐ {t("shuttleMyFavorites")}
            </h3>
            <div className="space-y-3">
              {favRoutes.map((r) => (
                <RouteCard
                  key={r.id}
                  route={r}
                  favorite
                  onToggleFavorite={toggleFavorite}
                  now={now}
                  showCountdown={todayMatchesType}
                  t={t}
                />
              ))}
            </div>
          </section>
        )}

        {/* 전체 노선 */}
        <section className="mt-6">
          <h3 className="text-sm font-bold mb-2" style={{ color: "#11306E" }}>
            {t("shuttleAllRoutes")} ({otherRoutes.length})
          </h3>
          <div className="space-y-3">
            {otherRoutes.map((r) => (
              <RouteCard
                key={r.id}
                route={r}
                favorite={false}
                onToggleFavorite={toggleFavorite}
                now={now}
                showCountdown={todayMatchesType}
                t={t}
              />
            ))}
          </div>
        </section>

        {/* 이용 안내 (접기) */}
        <section className="mt-8">
          <button
            onClick={() => setShowNotices((v) => !v)}
            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl flex items-center justify-between hover:bg-gray-50 transition"
          >
            <span className="text-sm font-semibold" style={{ color: "#11306E" }}>
              📋 {t("shuttleGeneralNotices")}
            </span>
            <span className="text-gray-400">{showNotices ? "▲" : "▼"}</span>
          </button>
          {showNotices && (
            <div className="mt-2 bg-white border border-gray-200 rounded-xl px-4 py-3 space-y-2">
              {SHUTTLE_GENERAL_NOTICES.map((n, i) => (
                <p key={i} className="text-xs text-gray-700 leading-relaxed">
                  • {n}
                </p>
              ))}
              <p className="text-[11px] text-gray-500 leading-relaxed pt-2 border-t border-gray-100">
                {t("shuttleBoardingNotice")}
              </p>
            </div>
          )}
        </section>

        {/* 학교 공식 페이지 링크 */}
        <div className="mt-6 text-center">
          <a
            href="https://seojeong.ac.kr/main/campus-life/school-bus.do"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs underline"
            style={{ color: "#11306E" }}
          >
            🔗 {t("shuttleSourceLink")}
          </a>
        </div>
      </div>
    </main>
  );
}

/* ==================== 노선 카드 ==================== */
function RouteCard({
  route,
  favorite,
  onToggleFavorite,
  now,
  showCountdown,
  t,
}: {
  route: ShuttleRoute;
  favorite: boolean;
  onToggleFavorite: (id: string) => void;
  now: Date;
  showCountdown: boolean;
  t: (key: any) => string;
}) {
  const next = useMemo(() => getNextDeparture(route, now), [route, now]);

  return (
    <article className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
      {/* 카드 헤더 */}
      <header className="px-4 py-3 flex items-center justify-between" style={{ backgroundColor: "#FFF8DD" }}>
        <div className="flex items-center gap-2">
          <span className="font-bold text-base" style={{ color: "#11306E" }}>
            {route.name}
          </span>
          {route.buses > 1 && (
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-white border border-gray-200 text-gray-600">
              {route.buses}{t("shuttleBuses")}
            </span>
          )}
        </div>
        <button
          onClick={() => onToggleFavorite(route.id)}
          className="text-xs px-2 py-1 rounded-md hover:bg-white/60 transition"
          style={{ color: favorite ? "#E6007E" : "#9CA3AF" }}
          title={favorite ? t("shuttleFavoriteRemove") : t("shuttleFavoriteAdd")}
        >
          {favorite ? "★" : "☆"}
        </button>
      </header>

      {/* 다음 출발 카운트다운 */}
      {showCountdown && (
        <div className="px-4 py-3 border-b border-gray-100">
          {next ? (
            <div className="flex items-center justify-between">
              <div className="text-[11px] text-gray-500">{t("shuttleNextDeparture")}</div>
              <div className="text-right">
                <div className="text-sm font-bold" style={{ color: "#11306E" }}>
                  {next.time}
                </div>
                <div className="text-[11px] text-gray-600 truncate max-w-[200px]">
                  {next.stopName}
                </div>
              </div>
              <div className="text-lg font-bold" style={{ color: "#E6007E" }}>
                {next.minutesLeft}
                <span className="text-[11px] text-gray-500 font-normal ml-1">
                  {t("shuttleMinutesLeft")}
                </span>
              </div>
            </div>
          ) : (
            <div className="text-xs text-gray-500 text-center">⏰ {t("shuttleNoMoreToday")}</div>
          )}
        </div>
      )}

      {/* 정류장 + 시간 테이블 */}
      <div className="px-4 py-3">
        <div className="text-[11px] font-semibold text-gray-500 mb-2 grid grid-cols-[1fr_50px_50px] gap-2 px-1">
          <span>{t("shuttleStops")}</span>
          <span className="text-center">{t("shuttleTime1")}</span>
          <span className="text-center">{t("shuttleTime2")}</span>
        </div>
        <div className="space-y-1">
          {route.stops.map((stop, idx) => {
            const isSchool = stop.name === "학교" || stop.name.startsWith("학교");
            return (
              <div
                key={idx}
                className={`grid grid-cols-[1fr_50px_50px] gap-2 items-center px-1 py-1.5 text-xs ${
                  isSchool ? "rounded-md" : ""
                }`}
                style={isSchool ? { backgroundColor: "#F0F4FA" } : {}}
              >
                <div className="flex flex-col">
                  <span className={isSchool ? "font-semibold" : "text-gray-800"} style={isSchool ? { color: "#11306E" } : {}}>
                    {isSchool ? `🏫 ${t("shuttleSchoolDest")}` : stop.name}
                  </span>
                  {stop.note && (
                    <span className="text-[10px] text-orange-600 mt-0.5">
                      ⚠ {stop.note}
                    </span>
                  )}
                </div>
                <span className="text-center text-gray-700 font-mono">
                  {stop.time1 ?? "—"}
                </span>
                <span className="text-center text-gray-700 font-mono">
                  {stop.time2 ?? "—"}
                </span>
              </div>
            );
          })}
        </div>

        {/* 하교 시각 */}
        {route.returnTimes.length > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="text-[11px] font-semibold text-gray-500 mb-1">
              🏫 → 🚌 {t("shuttleReturnTimes")}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {route.returnTimes.map((time, idx) => (
                <span
                  key={idx}
                  className="text-xs px-2 py-1 rounded-md font-mono"
                  style={{ backgroundColor: "#F0F4FA", color: "#11306E" }}
                >
                  {time}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* 노선별 안내사항 */}
        {route.notes && route.notes.length > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="text-[11px] font-semibold text-gray-500 mb-1">
              💡 {t("shuttleRouteNotices")}
            </div>
            {route.notes.map((n, i) => (
              <p key={i} className="text-[11px] text-gray-600 leading-relaxed">
                • {n}
              </p>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}

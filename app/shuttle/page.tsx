"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useLocale } from "@/lib/useLocale";
import LangSwitcher from "@/components/LangSwitcher";
import {
  SHUTTLE_ROUTES,
  SHUTTLE_TERM,
  SHUTTLE_GENERAL_NOTICES,
  getNextDeparture,
  type ShuttleRoute,
} from "@/data/shuttle";
import CityBus91Section from "./CityBus91Section";

const FAVORITE_KEY = "sj-shuttle-favorites";

type TabKey = "school" | "city";

export default function ShuttlePage() {
  return (
    <Suspense fallback={<div className="p-10 text-center text-gray-500">Loading...</div>}>
      <ShuttlePageInner />
    </Suspense>
  );
}

function ShuttlePageInner() {
  const { locale, setLocale, t, mounted } = useLocale();
  const params = useSearchParams();
  const initialTab = (params.get("tab") === "city" ? "city" : "school") as TabKey;
  const [tab, setTab] = useState<TabKey>(initialTab);

  if (!mounted) return null;

  return (
    <main className="min-h-screen bg-gray-50 pb-24">
      {/* 헤더 */}
      <header
        className="px-3 py-3 sticky top-0 z-40 flex items-center justify-between gap-2"
        style={{ backgroundColor: "#11306E" }}
      >
        <Link
          href="/"
          className="flex items-center gap-1 px-2 py-1.5 rounded-md hover:bg-white/10 transition text-white text-sm"
          aria-label="홈으로"
        >
          <span className="text-base">←</span>
          <span className="text-xs">홈</span>
        </Link>
        <h1 className="text-white font-semibold text-base flex items-center gap-2 flex-1 justify-center">
          🚌 {t("catShuttle")}
        </h1>
        <LangSwitcher locale={locale} onChange={setLocale} compact />
      </header>

      {/* 탭 */}
      <div className="bg-white border-b border-gray-200 sticky top-[56px] z-30">
        <div className="max-w-3xl mx-auto px-5 flex">
          <TabButton active={tab === "school"} onClick={() => setTab("school")}>
            🚐 {t("shuttleTabSchool")}
          </TabButton>
          <TabButton active={tab === "city"} onClick={() => setTab("city")}>
            🚌 {t("shuttleTabCity")}
          </TabButton>
        </div>
      </div>

      {tab === "school" ? <SchoolBusSection t={t} /> : <CityBus91Section t={t} />}
    </main>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 py-3 text-sm font-semibold transition border-b-2 ${
        active ? "" : "text-gray-500 border-transparent"
      }`}
      style={
        active
          ? { color: "#11306E", borderColor: "#11306E" }
          : {}
      }
    >
      {children}
    </button>
  );
}

/* ==================== 스쿨버스 섹션 (기존 로직 유지) ==================== */
function SchoolBusSection({ t }: { t: (key: any) => string }) {
  const [now, setNow] = useState(new Date());
  const [favorites, setFavorites] = useState<string[]>([]);
  const [dayType, setDayType] = useState<"weekday" | "weekend">("weekday");
  const [showNotices, setShowNotices] = useState(false);

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const day = new Date().getDay();
    if (day === 6) setDayType("weekend");
    else setDayType("weekday");
  }, []);

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

  const isSunday = new Date().getDay() === 0;
  const todayMatchesType =
    (dayType === "weekday" && [1, 2, 3, 4, 5].includes(new Date().getDay())) ||
    (dayType === "weekend" && new Date().getDay() === 6);

  return (
    <>
      <section className="px-5 py-6 text-white" style={{ backgroundColor: "#213A8F" }}>
        <div className="max-w-3xl mx-auto">
          <h2 className="text-xl font-bold mb-1">{t("shuttleTabSchool")}</h2>
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
        <div
          className="mt-5 px-4 py-3 rounded-lg text-xs"
          style={{ backgroundColor: "#FFF8DD", color: "#7A5C00", border: "1px solid #FFE680" }}
        >
          {t("shuttleGpsComing")}
        </div>

        <div className="mt-5 grid grid-cols-2 gap-2 p-1 bg-white rounded-xl border border-gray-200">
          <button
            onClick={() => setDayType("weekday")}
            className={`py-3 rounded-lg text-sm font-semibold transition ${
              dayType === "weekday" ? "text-white" : "text-gray-600"
            }`}
            style={{ backgroundColor: dayType === "weekday" ? "#11306E" : "transparent" }}
          >
            {t("shuttleWeekday")}
          </button>
          <button
            onClick={() => setDayType("weekend")}
            className={`py-3 rounded-lg text-sm font-semibold transition ${
              dayType === "weekend" ? "text-white" : "text-gray-600"
            }`}
            style={{ backgroundColor: dayType === "weekend" ? "#11306E" : "transparent" }}
          >
            {t("shuttleWeekend")}
          </button>
        </div>

        {isSunday && (
          <div className="mt-3 px-4 py-3 rounded-lg text-xs text-center bg-gray-100 text-gray-600">
            ⚠️ {t("shuttleNoneToday")}
          </div>
        )}

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
                <p key={i} className="text-xs text-gray-700 leading-relaxed">• {n}</p>
              ))}
              <p className="text-[11px] text-gray-500 leading-relaxed pt-2 border-t border-gray-100">
                {t("shuttleBoardingNotice")}
              </p>
            </div>
          )}
        </section>

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
    </>
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
      <header className="px-4 py-3 flex items-center justify-between" style={{ backgroundColor: "#FFF8DD" }}>
        <div className="flex items-center gap-2">
          <span className="font-bold text-base" style={{ color: "#11306E" }}>{route.name}</span>
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

      {showCountdown && (
        <div className="px-4 py-3 border-b border-gray-100">
          {next ? (
            <div className="flex items-center justify-between">
              <div className="text-[11px] text-gray-500">{t("shuttleNextDeparture")}</div>
              <div className="text-right">
                <div className="text-sm font-bold" style={{ color: "#11306E" }}>{next.time}</div>
                <div className="text-[11px] text-gray-600 truncate max-w-[200px]">{next.stopName}</div>
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
                className={`grid grid-cols-[1fr_50px_50px] gap-2 items-center px-1 py-1.5 text-xs ${isSchool ? "rounded-md" : ""}`}
                style={isSchool ? { backgroundColor: "#F0F4FA" } : {}}
              >
                <div className="flex flex-col">
                  <span className={isSchool ? "font-semibold" : "text-gray-800"} style={isSchool ? { color: "#11306E" } : {}}>
                    {isSchool ? `🏫 ${t("shuttleSchoolDest")}` : stop.name}
                  </span>
                  {stop.note && (
                    <span className="text-[10px] text-orange-600 mt-0.5">⚠ {stop.note}</span>
                  )}
                </div>
                <span className="text-center text-gray-700 font-mono">{stop.time1 ?? "—"}</span>
                <span className="text-center text-gray-700 font-mono">{stop.time2 ?? "—"}</span>
              </div>
            );
          })}
        </div>

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

        {route.notes && route.notes.length > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="text-[11px] font-semibold text-gray-500 mb-1">
              💡 {t("shuttleRouteNotices")}
            </div>
            {route.notes.map((n, i) => (
              <p key={i} className="text-[11px] text-gray-600 leading-relaxed">• {n}</p>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}

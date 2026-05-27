/**
 * 경기도 버스도착정보 API v2 프록시
 *
 * 클라이언트 요청 예: /api/bus-arrival?stationId=235001019&routeId=208000064
 *
 * 환경변수:
 *   GBIS_API_KEY              : data.go.kr 발급 인증키
 *   GBIS_ROUTE_ID_91          : 91번 routeId (기본값 208000064)
 *   GBIS_STATION_ID_SCHOOL    : 서정대학교본관 stationId (기본값 235001019)
 *   GBIS_STATION_ID_DEOKJEONG : 덕정역 stationId (학교 방면, 기본값 235000133)
 *
 * direction=school   → 종점(서정대학교본관) 도착 정보
 * direction=deokjeong → 덕정역 도착 정보 (학교 방면)
 * stationId=... 직접 지정도 가능 (개별 정류장 도착 조회)
 */

import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const DEFAULT_ROUTE_ID = "208000064";
const DEFAULT_STATION_SCHOOL = "235001019";
const DEFAULT_STATION_DEOKJEONG = "235000133";

type ArrivalData = {
  remainingSec: number | null;
  remainingStops: number | null; // 남은 정류장 수 (locationNo)
  seats: number | null;
  plateNo: string | null;
  flag: string | null; // 운행 상태
};

type SuccessResponse = {
  ok: true;
  updatedAt: string;
  stationId: string;
  routeId: string;
  next: ArrivalData | null;
  second: ArrivalData | null;
};

type ErrorResponse = {
  ok: false;
  error: "API_KEY_MISSING" | "FETCH_ERROR" | "PARSE_ERROR" | "API_ERROR";
  message: string;
  updatedAt: string;
};

export async function GET(request: NextRequest) {
  const sp = request.nextUrl.searchParams;

  const apiKey = process.env.GBIS_API_KEY;
  const routeId = sp.get("routeId") || process.env.GBIS_ROUTE_ID_91 || DEFAULT_ROUTE_ID;

  // direction 단축어 처리
  let stationId = sp.get("stationId");
  if (!stationId) {
    const direction = sp.get("direction");
    if (direction === "school") {
      stationId = process.env.GBIS_STATION_ID_SCHOOL || DEFAULT_STATION_SCHOOL;
    } else if (direction === "deokjeong") {
      stationId = process.env.GBIS_STATION_ID_DEOKJEONG || DEFAULT_STATION_DEOKJEONG;
    } else {
      stationId = process.env.GBIS_STATION_ID_SCHOOL || DEFAULT_STATION_SCHOOL;
    }
  }

  if (!apiKey) {
    return NextResponse.json<ErrorResponse>(
      {
        ok: false,
        error: "API_KEY_MISSING",
        message: "GBIS_API_KEY 환경변수가 설정되지 않았습니다.",
        updatedAt: new Date().toISOString(),
      },
      { status: 200 }
    );
  }

  try {
    const url =
      `https://apis.data.go.kr/6410000/busarrivalservice/v2/getBusArrivalItemv2?` +
      `serviceKey=${encodeURIComponent(apiKey)}` +
      `&stationId=${encodeURIComponent(stationId)}` +
      `&routeId=${encodeURIComponent(routeId)}` +
      `&format=json`;

    const upstream = await fetch(url, { cache: "no-store" });
    if (!upstream.ok) {
      throw new Error(`Upstream returned ${upstream.status}`);
    }
    const data = await upstream.json();

    // 응답 구조: response.msgBody.busArrivalItem.{predictTime1, locationNo1, remainSeatCnt1, plateNo1, flag, ...}
    const item = data?.response?.msgBody?.busArrivalItem;
    if (!item) {
      const resultCode = data?.response?.msgHeader?.resultCode;
      const resultMessage = data?.response?.msgHeader?.resultMessage || "no data";
      return NextResponse.json<ErrorResponse>(
        {
          ok: false,
          error: resultCode === 4 ? "API_ERROR" : "PARSE_ERROR",
          message: `API: ${resultMessage}`,
          updatedAt: new Date().toISOString(),
        },
        { status: 200 }
      );
    }

    const toNum = (v: any): number | null => {
      if (v === null || v === undefined || v === "") return null;
      const n = Number(v);
      return Number.isFinite(n) ? n : null;
    };

    const next: ArrivalData | null =
      item.predictTime1 !== undefined && item.predictTime1 !== null
        ? {
            remainingSec: toNum(item.predictTime1) !== null ? (toNum(item.predictTime1) as number) * 60 : null,
            remainingStops: toNum(item.locationNo1),
            seats: toNum(item.remainSeatCnt1),
            plateNo: item.plateNo1 ?? null,
            flag: item.flag ?? null,
          }
        : null;

    const second: ArrivalData | null =
      item.predictTime2 !== undefined && item.predictTime2 !== null
        ? {
            remainingSec: toNum(item.predictTime2) !== null ? (toNum(item.predictTime2) as number) * 60 : null,
            remainingStops: toNum(item.locationNo2),
            seats: toNum(item.remainSeatCnt2),
            plateNo: item.plateNo2 ?? null,
            flag: item.flag ?? null,
          }
        : null;

    return NextResponse.json<SuccessResponse>({
      ok: true,
      updatedAt: new Date().toISOString(),
      stationId,
      routeId,
      next,
      second,
    });
  } catch (err) {
    return NextResponse.json<ErrorResponse>(
      {
        ok: false,
        error: "FETCH_ERROR",
        message: err instanceof Error ? err.message : String(err),
        updatedAt: new Date().toISOString(),
      },
      { status: 200 }
    );
  }
}

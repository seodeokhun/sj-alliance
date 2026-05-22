/**
 * 경기도 버스도착정보 API 프록시
 *
 * 클라이언트에서 직접 공공API를 호출하면 CORS 차단 + API key 노출 위험이 있어
 * Next.js 서버 사이드에서 프록시 호출.
 *
 * 환경변수 필요 (Vercel Project Settings → Environment Variables):
 *   GBIS_API_KEY              : data.go.kr 발급 인증키 (Encoding 키)
 *   GBIS_STATION_ID_SCHOOL    : 서정대학교 본관 정류장 ID
 *   GBIS_STATION_ID_DEOKJEONG : 덕정역 정류장 ID (옵션, 학교 출발 방면)
 *   GBIS_ROUTE_ID_91          : 91번 버스 routeId
 *
 * 모든 환경변수가 비어있으면 KEY_MISSING 응답 → 클라이언트에서 시간표만 표시.
 */

import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic"; // 캐시 안 함 (매번 실시간 호출)

type ArrivalData = {
  /** 도착까지 남은 초 (예: 300 = 5분 후) */
  remainingSec: number | null;
  /** 현재 버스가 위치한 정류장 (이전 정류장에서 몇 번째 정류장 떨어졌는지) */
  locationNo: string | null;
  /** 잔여 좌석 (-1 = 정보 없음) */
  seats: number | null;
  /** 차량 번호판 */
  plateNo: string | null;
};

type SuccessResponse = {
  ok: true;
  updatedAt: string;
  direction: "school" | "deokjeong";
  next: ArrivalData | null;
  second: ArrivalData | null;
};

type ErrorResponse = {
  ok: false;
  error: "API_KEY_MISSING" | "CONFIG_MISSING" | "FETCH_ERROR" | "PARSE_ERROR";
  message: string;
  updatedAt: string;
};

export async function GET(request: NextRequest) {
  const direction = (request.nextUrl.searchParams.get("direction") || "school") as
    | "school"
    | "deokjeong";

  const apiKey = process.env.GBIS_API_KEY;
  const stationId =
    direction === "school"
      ? process.env.GBIS_STATION_ID_SCHOOL
      : process.env.GBIS_STATION_ID_DEOKJEONG;
  const routeId = process.env.GBIS_ROUTE_ID_91;

  if (!apiKey) {
    return NextResponse.json<ErrorResponse>(
      {
        ok: false,
        error: "API_KEY_MISSING",
        message: "GBIS_API_KEY 환경변수가 설정되지 않았습니다.",
        updatedAt: new Date().toISOString(),
      },
      { status: 200 } // 200으로 보내서 클라이언트가 폴백 표시할 수 있게
    );
  }
  if (!stationId || !routeId) {
    return NextResponse.json<ErrorResponse>(
      {
        ok: false,
        error: "CONFIG_MISSING",
        message: `정류장/노선 ID가 비어있습니다 (direction=${direction}).`,
        updatedAt: new Date().toISOString(),
      },
      { status: 200 }
    );
  }

  try {
    const url =
      `http://apis.data.go.kr/6410000/busarrivalservice/getBusArrivalItem?` +
      `serviceKey=${encodeURIComponent(apiKey)}` +
      `&stationId=${encodeURIComponent(stationId)}` +
      `&routeId=${encodeURIComponent(routeId)}`;

    const upstream = await fetch(url, {
      cache: "no-store",
      headers: { Accept: "application/xml" },
    });

    if (!upstream.ok) {
      throw new Error(`Upstream returned ${upstream.status}`);
    }

    const xml = await upstream.text();

    // 간단한 XML 태그 파서 (외부 의존성 없음)
    const tag = (name: string): string | null => {
      const m = xml.match(new RegExp(`<${name}>([^<]*)</${name}>`));
      return m ? m[1].trim() : null;
    };
    const num = (name: string): number | null => {
      const v = tag(name);
      if (v === null || v === "") return null;
      const n = Number(v);
      return Number.isFinite(n) ? n : null;
    };

    // 경기버스 API 응답 필드 (대표)
    //   predictTime1 (분), predictTime2 (분)
    //   locationNo1, locationNo2 (현재 위치, 종점에서 몇 번째 정류장 전)
    //   remainSeatCnt1, remainSeatCnt2 (잔여 좌석, -1 = 정보없음)
    //   plateNo1, plateNo2

    const pt1 = num("predictTime1");
    const pt2 = num("predictTime2");

    const next: ArrivalData | null =
      pt1 !== null
        ? {
            remainingSec: pt1 * 60,
            locationNo: tag("locationNo1"),
            seats: num("remainSeatCnt1"),
            plateNo: tag("plateNo1"),
          }
        : null;

    const second: ArrivalData | null =
      pt2 !== null
        ? {
            remainingSec: pt2 * 60,
            locationNo: tag("locationNo2"),
            seats: num("remainSeatCnt2"),
            plateNo: tag("plateNo2"),
          }
        : null;

    return NextResponse.json<SuccessResponse>({
      ok: true,
      updatedAt: new Date().toISOString(),
      direction,
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

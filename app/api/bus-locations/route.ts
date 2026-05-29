/**
 * 경기도 버스위치정보 API v2 프록시
 *
 * 사용 예: /api/bus-locations?routeId=208000064
 *
 * 응답: 운행 중인 모든 버스의 현재 위치 (stationSeq 기준)
 *
 * 환경변수:
 *   GBIS_API_KEY     : data.go.kr 발급 인증키
 *   GBIS_ROUTE_ID_91 : 91번 routeId (기본값 208000064)
 */

import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const DEFAULT_ROUTE_ID = "208000064";

type BusLocation = {
  plateNo: string | null;
  stationSeq: number | null;
  stationId: number | null;
  endBus: string | null; // "Y" = 막차
  lowPlate: string | null; // 저상버스 여부
  remainSeatCnt: number | null;
};

type SuccessResponse = {
  ok: true;
  updatedAt: string;
  routeId: string;
  buses: BusLocation[]; // 운행 중인 버스 목록
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
      `https://apis.data.go.kr/6410000/buslocationservice/v2/getBusLocationListv2?` +
      `serviceKey=${encodeURIComponent(apiKey)}` +
      `&routeId=${encodeURIComponent(routeId)}` +
      `&format=json`;

    const upstream = await fetch(url, { cache: "no-store" });
    if (!upstream.ok) {
      throw new Error(`Upstream ${upstream.status}`);
    }
    const data = await upstream.json();

    const list = data?.response?.msgBody?.busLocationList;

    // 운행 중 버스가 없으면 busLocationList가 없거나 빈 배열
    if (!list) {
      return NextResponse.json<SuccessResponse>({
        ok: true,
        updatedAt: new Date().toISOString(),
        routeId,
        buses: [],
      });
    }

    // 단일 객체일 수도 있고 배열일 수도 있음 (XML→JSON 변환 특성)
    const items = Array.isArray(list) ? list : [list];

    const toNum = (v: any): number | null => {
      if (v === null || v === undefined || v === "") return null;
      const n = Number(v);
      return Number.isFinite(n) ? n : null;
    };

    const buses: BusLocation[] = items.map((item: any) => ({
      plateNo: item.plateNo ?? null,
      stationSeq: toNum(item.stationSeq),
      stationId: toNum(item.stationId),
      endBus: item.endBus ?? null,
      lowPlate: item.lowPlate ?? null,
      remainSeatCnt: toNum(item.remainSeatCnt),
    }));

    return NextResponse.json<SuccessResponse>({
      ok: true,
      updatedAt: new Date().toISOString(),
      routeId,
      buses,
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

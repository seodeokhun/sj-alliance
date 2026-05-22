/**
 * 양주 시내버스 91번 (서정대학교 본관 ↔ 덕정주공6단지)
 * 출처: https://seojeong.ac.kr/main/campus-life/city-bus.do
 *
 * 정적 시간표 + 향후 경기버스 API 도착정보 연동용 정류장 정보.
 */

export type BusStop91 = {
  /** 정류장 표시 이름 (한국어) */
  name: string;
  /** 경기버스 API stationId (사용자가 신청 후 등록) */
  stationId?: string;
  /** 카카오맵 표시용 좌표 (옵션) */
  lat?: number;
  lng?: number;
  /** 주요 경유지인지 (목록에서 강조) */
  major?: boolean;
};

/** 91번 경유 정류장 (주공6단지 → 학교 방향) */
export const BUS91_STOPS: BusStop91[] = [
  { name: "주공6단지",                 major: true },
  { name: "주공8단지" },
  { name: "회전초교 / 덕정주공 4단지" },
  { name: "덕정주공2단지" },
  { name: "융보아파트" },
  { name: "덕정역",                    major: true },
  { name: "덕정사거리" },
  { name: "국군양주병원" },
  { name: "서정대학교 본관",            major: true },
];

/** 운행 일반 정보 */
export const BUS91_INFO = {
  routeNumber: "91",
  routeName: "양주 91번",
  operator: "평안운수",
  /** 운행 시간 */
  weekdayHours: "05:10~21:25",
  weekendHours: "05:30~21:30",
  /** 배차 간격 */
  weekdayInterval: "20~60분",
  weekendInterval: "54~108분",
  /** 하루 운행 횟수 */
  dailyTrips: 102,
  /** 시점: 주공6단지, 종점: 서정대학교 본관 */
  origin: "주공6단지",
  destination: "서정대학교 본관",
};

export type Bus91Trip = {
  /** 운행 회차 (1~102) */
  trip: number;
  /** 덕정역 출발 시각 (HH:MM) */
  deokjeong: string;
  /** 서정대학교 도착 후 출발 시각 (HH:MM) */
  school: string;
  /** 덕정역 회차 시각 (HH:MM) */
  deokjeongReturn: string;
};

/** 91번 운행 시간표 1회 ~ 102회 (학교 공식 페이지 기준) */
export const BUS91_SCHEDULE: Bus91Trip[] = [
  { trip:   1, deokjeong: "05:27", school: "05:37", deokjeongReturn: "05:47" },
  { trip:   2, deokjeong: "05:47", school: "05:57", deokjeongReturn: "06:07" },
  { trip:   3, deokjeong: "06:12", school: "06:22", deokjeongReturn: "06:32" },
  { trip:   4, deokjeong: "06:32", school: "06:42", deokjeongReturn: "06:52" },
  { trip:   5, deokjeong: "06:52", school: "07:02", deokjeongReturn: "07:12" },
  { trip:   6, deokjeong: "06:57", school: "07:07", deokjeongReturn: "07:17" },
  { trip:   7, deokjeong: "07:09", school: "07:19", deokjeongReturn: "07:29" },
  { trip:   8, deokjeong: "07:17", school: "07:27", deokjeongReturn: "07:37" },
  { trip:   9, deokjeong: "07:22", school: "07:32", deokjeongReturn: "07:42" },
  { trip:  10, deokjeong: "07:27", school: "07:37", deokjeongReturn: "07:47" },
  { trip:  11, deokjeong: "07:37", school: "07:47", deokjeongReturn: "07:57" },
  { trip:  12, deokjeong: "07:44", school: "07:54", deokjeongReturn: "08:04" },
  { trip:  13, deokjeong: "07:54", school: "08:04", deokjeongReturn: "08:14" },
  { trip:  14, deokjeong: "08:04", school: "08:14", deokjeongReturn: "08:24" },
  { trip:  15, deokjeong: "08:14", school: "08:24", deokjeongReturn: "08:34" },
  { trip:  16, deokjeong: "08:24", school: "08:34", deokjeongReturn: "08:44" },
  { trip:  17, deokjeong: "08:34", school: "08:44", deokjeongReturn: "08:54" },
  { trip:  18, deokjeong: "08:39", school: "08:49", deokjeongReturn: "08:59" },
  { trip:  19, deokjeong: "08:49", school: "08:59", deokjeongReturn: "09:09" },
  { trip:  20, deokjeong: "08:54", school: "09:04", deokjeongReturn: "09:14" },
  { trip:  21, deokjeong: "09:04", school: "09:14", deokjeongReturn: "09:24" },
  { trip:  22, deokjeong: "09:09", school: "09:19", deokjeongReturn: "09:29" },
  { trip:  23, deokjeong: "09:19", school: "09:29", deokjeongReturn: "09:39" },
  { trip:  24, deokjeong: "09:29", school: "09:39", deokjeongReturn: "09:49" },
  { trip:  25, deokjeong: "09:39", school: "09:49", deokjeongReturn: "09:59" },
  { trip:  26, deokjeong: "09:49", school: "09:59", deokjeongReturn: "10:09" },
  { trip:  27, deokjeong: "09:59", school: "10:09", deokjeongReturn: "10:19" },
  { trip:  28, deokjeong: "10:09", school: "10:19", deokjeongReturn: "10:29" },
  { trip:  29, deokjeong: "10:19", school: "10:29", deokjeongReturn: "10:39" },
  { trip:  30, deokjeong: "10:29", school: "10:39", deokjeongReturn: "10:49" },
  { trip:  31, deokjeong: "10:42", school: "10:52", deokjeongReturn: "11:02" },
  { trip:  32, deokjeong: "10:57", school: "11:07", deokjeongReturn: "11:17" },
  { trip:  33, deokjeong: "11:12", school: "11:22", deokjeongReturn: "11:32" },
  { trip:  34, deokjeong: "11:27", school: "11:37", deokjeongReturn: "11:47" },
  { trip:  35, deokjeong: "11:47", school: "11:57", deokjeongReturn: "12:07" },
  { trip:  36, deokjeong: "11:57", school: "12:07", deokjeongReturn: "12:17" },
  { trip:  37, deokjeong: "12:12", school: "12:22", deokjeongReturn: "12:32" },
  { trip:  38, deokjeong: "12:32", school: "12:42", deokjeongReturn: "12:52" },
  { trip:  39, deokjeong: "12:52", school: "13:02", deokjeongReturn: "13:12" },
  { trip:  40, deokjeong: "13:12", school: "13:22", deokjeongReturn: "13:32" },
  { trip:  41, deokjeong: "13:32", school: "13:42", deokjeongReturn: "13:52" },
  { trip:  42, deokjeong: "13:42", school: "13:52", deokjeongReturn: "14:02" },
  { trip:  43, deokjeong: "13:52", school: "14:02", deokjeongReturn: "14:12" },
  { trip:  44, deokjeong: "14:02", school: "14:12", deokjeongReturn: "14:22" },
  { trip:  45, deokjeong: "14:12", school: "14:22", deokjeongReturn: "14:32" },
  { trip:  46, deokjeong: "14:22", school: "14:32", deokjeongReturn: "14:42" },
  { trip:  47, deokjeong: "14:32", school: "14:42", deokjeongReturn: "14:52" },
  { trip:  48, deokjeong: "14:42", school: "14:52", deokjeongReturn: "15:02" },
  { trip:  49, deokjeong: "14:52", school: "15:02", deokjeongReturn: "15:12" },
  { trip:  50, deokjeong: "15:02", school: "15:12", deokjeongReturn: "15:22" },
  { trip:  51, deokjeong: "15:12", school: "15:22", deokjeongReturn: "15:32" },
  { trip:  52, deokjeong: "15:22", school: "15:32", deokjeongReturn: "15:42" },
  { trip:  53, deokjeong: "15:27", school: "15:37", deokjeongReturn: "15:47" },
  { trip:  54, deokjeong: "15:37", school: "15:47", deokjeongReturn: "15:57" },
  { trip:  55, deokjeong: "15:47", school: "15:57", deokjeongReturn: "16:07" },
  { trip:  56, deokjeong: "15:57", school: "16:07", deokjeongReturn: "16:17" },
  { trip:  57, deokjeong: "16:07", school: "16:17", deokjeongReturn: "16:27" },
  { trip:  58, deokjeong: "16:17", school: "16:27", deokjeongReturn: "16:37" },
  { trip:  59, deokjeong: "16:27", school: "16:37", deokjeongReturn: "16:47" },
  { trip:  60, deokjeong: "16:32", school: "16:42", deokjeongReturn: "16:52" },
  { trip:  61, deokjeong: "16:42", school: "16:52", deokjeongReturn: "17:02" },
  { trip:  62, deokjeong: "16:52", school: "17:02", deokjeongReturn: "17:12" },
  { trip:  63, deokjeong: "17:02", school: "17:12", deokjeongReturn: "17:22" },
  { trip:  64, deokjeong: "17:12", school: "17:22", deokjeongReturn: "17:32" },
  { trip:  65, deokjeong: "17:22", school: "17:32", deokjeongReturn: "17:42" },
  { trip:  66, deokjeong: "17:27", school: "17:37", deokjeongReturn: "17:47" },
  { trip:  67, deokjeong: "17:37", school: "17:47", deokjeongReturn: "17:57" },
  { trip:  68, deokjeong: "17:47", school: "17:57", deokjeongReturn: "18:07" },
  { trip:  69, deokjeong: "17:57", school: "18:07", deokjeongReturn: "18:17" },
  { trip:  70, deokjeong: "18:07", school: "18:17", deokjeongReturn: "18:27" },
  { trip:  71, deokjeong: "18:17", school: "18:27", deokjeongReturn: "18:37" },
  { trip:  72, deokjeong: "18:27", school: "18:37", deokjeongReturn: "18:47" },
  { trip:  73, deokjeong: "18:32", school: "18:42", deokjeongReturn: "18:52" },
  { trip:  74, deokjeong: "18:42", school: "18:52", deokjeongReturn: "19:02" },
  { trip:  75, deokjeong: "18:52", school: "19:02", deokjeongReturn: "19:12" },
  { trip:  76, deokjeong: "19:02", school: "19:12", deokjeongReturn: "19:22" },
  { trip:  77, deokjeong: "19:12", school: "19:22", deokjeongReturn: "19:32" },
  { trip:  78, deokjeong: "19:22", school: "19:32", deokjeongReturn: "19:42" },
  { trip:  79, deokjeong: "19:32", school: "19:42", deokjeongReturn: "19:52" },
  { trip:  80, deokjeong: "19:42", school: "19:52", deokjeongReturn: "20:02" },
  { trip:  81, deokjeong: "19:52", school: "20:02", deokjeongReturn: "20:12" },
  { trip:  82, deokjeong: "20:02", school: "20:12", deokjeongReturn: "20:22" },
  { trip:  83, deokjeong: "20:12", school: "20:22", deokjeongReturn: "20:32" },
  { trip:  84, deokjeong: "20:22", school: "20:32", deokjeongReturn: "20:42" },
  { trip:  85, deokjeong: "20:32", school: "20:42", deokjeongReturn: "20:52" },
  { trip:  86, deokjeong: "20:42", school: "20:52", deokjeongReturn: "21:02" },
  { trip:  87, deokjeong: "20:52", school: "21:02", deokjeongReturn: "21:12" },
  { trip:  88, deokjeong: "21:02", school: "21:12", deokjeongReturn: "21:22" },
  { trip:  89, deokjeong: "21:12", school: "21:22", deokjeongReturn: "21:32" },
  { trip:  90, deokjeong: "21:22", school: "21:32", deokjeongReturn: "21:42" },
  { trip:  91, deokjeong: "21:32", school: "21:42", deokjeongReturn: "21:52" },
  { trip:  92, deokjeong: "21:42", school: "21:52", deokjeongReturn: "22:02" },
  { trip:  93, deokjeong: "21:52", school: "22:02", deokjeongReturn: "22:12" },
  { trip:  94, deokjeong: "22:02", school: "22:12", deokjeongReturn: "22:22" },
  { trip:  95, deokjeong: "22:12", school: "22:22", deokjeongReturn: "22:32" },
  { trip:  96, deokjeong: "22:22", school: "22:32", deokjeongReturn: "22:42" },
  { trip:  97, deokjeong: "22:42", school: "22:42", deokjeongReturn: "23:02" },
  { trip:  98, deokjeong: "22:52", school: "23:02", deokjeongReturn: "23:12" },
  { trip:  99, deokjeong: "23:02", school: "23:12", deokjeongReturn: "23:22" },
  { trip: 100, deokjeong: "23:12", school: "23:22", deokjeongReturn: "23:32" },
  { trip: 101, deokjeong: "23:32", school: "23:42", deokjeongReturn: "23:52" },
  { trip: 102, deokjeong: "23:52", school: "00:02", deokjeongReturn: "00:12" },
];

/**
 * 현재 시각 기준 "다음 N개 운행" 찾기
 * @param direction "school" = 학교 도착시각 기준, "deokjeong" = 덕정역 출발 시각 기준
 */
export function getUpcomingTrips(
  direction: "school" | "deokjeong" = "school",
  count: number = 3,
  now: Date = new Date()
): Bus91Trip[] {
  const currentMin = now.getHours() * 60 + now.getMinutes();

  const upcoming = BUS91_SCHEDULE.filter((trip) => {
    const time = direction === "school" ? trip.school : trip.deokjeong;
    const [h, m] = time.split(":").map(Number);
    const tripMin = h * 60 + m;
    // 자정 넘어가는 102회 처리
    if (trip.trip === 102 && direction === "school") {
      return currentMin <= 24 * 60; // 자정 직전까지는 표시
    }
    return tripMin >= currentMin;
  });

  return upcoming.slice(0, count);
}

/** 어떤 시각 문자열을 분 단위로 변환 (HH:MM) */
export function timeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

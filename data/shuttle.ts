/**
 * 서정대학교 스쿨버스 노선 데이터 (2026학년도 1학기)
 * 출처: https://seojeong.ac.kr/main/campus-life/school-bus.do
 * 운행 기간: 2026년 3월 3일(화) ~ 6월 22일(월)
 *
 * 향후 GPS 실시간 위치 표시를 위해 정류장에 lat/lng 옵션 필드 준비.
 */

export type ShuttleStop = {
  /** 정류장 이름 (한국어 원본) */
  name: string;
  /** 1차 출발 시각 (HH:MM) */
  time1: string | null;
  /** 2차 출발 시각 (HH:MM) */
  time2: string | null;
  /** 비고 (변경 안내 등) */
  note?: string;
  /** 향후 GPS / 카카오맵용 좌표 */
  lat?: number;
  lng?: number;
};

export type ShuttleRoute = {
  /** 노선 고유 ID */
  id: string;
  /** 평일 / 주말 */
  type: "weekday" | "weekend";
  /** 노선 이름 (한국어) */
  name: string;
  /** 운행 대수 */
  buses: number;
  /** 정류장 목록 (출발지 → 학교 순) */
  stops: ShuttleStop[];
  /** 하교 시 출발 시각 목록 */
  returnTimes: string[];
  /** 노선별 안내 사항 */
  notes?: string[];
};

/* ==================== 평일 노선 (8개) ==================== */
const WEEKDAY_ROUTES: ShuttleRoute[] = [
  {
    id: "wd-taereung",
    type: "weekday",
    name: "태릉입구",
    buses: 1,
    stops: [
      { name: "태릉입구역 5번 출구",              time1: "7:20", time2: "9:30" },
      { name: "노원역 7번 출구 (기아자동차 앞)",    time1: "7:35", time2: "9:45" },
      { name: "학교",                              time1: "8:25", time2: "10:35" },
    ],
    returnTimes: ["15:00", "18:10"],
  },
  {
    id: "wd-guri",
    type: "weekday",
    name: "구리",
    buses: 1,
    stops: [
      { name: "구리 롯데백화점 앞 택시승강장", time1: "7:20", time2: "9:30" },
      { name: "고읍 세계로마트 앞",            time1: "7:57", time2: "10:07", note: "신호로 인해 길 건너 정류장으로 변경" },
      { name: "학교",                          time1: "8:35", time2: "10:35" },
    ],
    returnTimes: ["15:00", "18:10"],
  },
  {
    id: "wd-byeollae",
    type: "weekday",
    name: "별내",
    buses: 1,
    stops: [
      { name: "별내역 2번 출구",                  time1: "7:16", time2: "9:20" },
      { name: "탑석역 1번 출구 앞 버스정류장",    time1: "7:38", time2: "9:45", note: "리하트 병원 건너편에서 변경됨" },
      { name: "민락2지구 롯데리아 앞",             time1: "7:45", time2: "9:50" },
      { name: "학교",                              time1: "8:36", time2: "10:40" },
    ],
    returnTimes: ["15:00", "18:10"],
  },
  {
    id: "wd-daegok",
    type: "weekday",
    name: "대곡 및 화정",
    buses: 1,
    stops: [
      { name: "대곡역 1번 출구 택시승강장",       time1: "7:00", time2: "9:30" },
      { name: "화정역 1번 출구 버스터미널 앞",    time1: "7:08", time2: "9:40" },
      { name: "원당역 6번 출구",                   time1: "7:15", time2: "9:45" },
      { name: "학교",                              time1: "8:30", time2: "10:40" },
    ],
    returnTimes: ["15:00", "18:10"],
    notes: ["하교 교통상황 반영, 하교 노선은 등교 노선과 동일하게 운영"],
  },
  {
    id: "wd-yeonsinnae",
    type: "weekday",
    name: "연신내",
    buses: 1,
    stops: [
      { name: "연신내역 1번 출구",                 time1: "6:50", time2: "9:20" },
      { name: "구파발역 중앙차로 버스전용정류장",  time1: "6:55", time2: "9:25" },
      { name: "돈까스클럽 벽제점",                 time1: "7:20", time2: "9:50" },
      { name: "학교",                              time1: "8:30", time2: "10:55" },
    ],
    returnTimes: ["15:00", "18:10"],
  },
  {
    id: "wd-pocheon",
    type: "weekday",
    name: "포천 (25인승)",
    buses: 1,
    stops: [
      { name: "포천시청 게시판 앞",                          time1: "7:40", time2: "9:40" },
      { name: "대진대 임시 버스정류장 옆 초밥매니아",         time1: "7:50", time2: "9:50", note: "대진대 버스정류장(파리바게트 앞)에서 변경됨" },
      { name: "송우리 홈플러스 앞 3006번 버스정류장",         time1: "8:00", time2: "10:00" },
      { name: "옥정 e편한세상 11단지 버스정류장",             time1: "8:15", time2: "10:15" },
      { name: "학교",                                          time1: "8:50", time2: "10:50" },
    ],
    returnTimes: ["15:00", "18:10"],
  },
  {
    id: "wd-daehwa",
    type: "weekday",
    name: "대화 및 파주",
    buses: 1,
    stops: [
      { name: "대화역 6번 출구 우리은행 옆 본죽 앞", time1: "6:40", time2: "9:20" },
      { name: "탄현가구단지 버스정류장 앞",          time1: "6:50", time2: "9:30" },
      { name: "운정역 한길육교 버스정류장 앞",       time1: "7:00", time2: "9:40" },
      { name: "금촌역 앞 지구대",                     time1: "7:10", time2: "9:50", note: "금촌역 버스정류장 뒤 20m에서 변경됨" },
      { name: "문산역 버스터미널 앞",                 time1: "7:30", time2: "10:10" },
      { name: "학교",                                  time1: "8:10", time2: "10:45" },
    ],
    returnTimes: ["15:00", "18:10"],
  },
  {
    id: "wd-deokjeong",
    type: "weekday",
    name: "덕정역",
    buses: 3,
    stops: [
      { name: "덕정역 강준수칼국수 앞", time1: "8:10", time2: null },
      { name: "학교",                    time1: null,   time2: null },
    ],
    returnTimes: [],
    notes: ["8:10부터 유동적으로 운행 (등교 25회, 하교 25회)"],
  },
];

/* ==================== 주말 노선 (6개) ==================== */
const WEEKEND_ROUTES: ShuttleRoute[] = [
  {
    id: "we-incheon",
    type: "weekend",
    name: "인천",
    buses: 1,
    stops: [
      { name: "서구청역 1번 출구", time1: "7:20", time2: null },
      { name: "계산역 1번 출구",   time1: "7:30", time2: null },
      { name: "학교",               time1: "8:40", time2: null },
    ],
    returnTimes: ["16:10"],
  },
  {
    id: "we-gupabal",
    type: "weekend",
    name: "구파발",
    buses: 1,
    stops: [
      { name: "구파발역 중앙차로 버스정류장", time1: "7:15", time2: null, note: "7:20 → 7:15 변경" },
      { name: "대곡역 3번 출구",                time1: "7:35", time2: null },
      { name: "금촌역 건너편 파출소 앞",        time1: "8:05", time2: null },
      { name: "학교",                            time1: "8:50", time2: null },
    ],
    returnTimes: ["16:10"],
  },
  {
    id: "we-bucheon",
    type: "weekend",
    name: "부천",
    buses: 1,
    stops: [
      { name: "부천역 2번 출구 버스정류장 (부천안경백화점 앞)", time1: "7:10", time2: null },
      { name: "송정역 2번 출구",                                  time1: "7:40", time2: null },
      { name: "학교",                                              time1: "8:50", time2: null },
    ],
    returnTimes: ["16:10"],
  },
  {
    id: "we-guri-byeollae",
    type: "weekend",
    name: "구리 및 별내",
    buses: 1,
    stops: [
      { name: "구리 롯데백화점 앞 택시승강장",          time1: "7:10", time2: null, note: "10분 앞당겨짐" },
      { name: "별내역 2번 출구",                          time1: "7:30", time2: null, note: "10분 앞당겨짐" },
      { name: "망월사역 건너편 신일엘리시움 택시승강장", time1: "7:50", time2: null },
      { name: "학교",                                      time1: "8:45", time2: null },
    ],
    returnTimes: ["16:10"],
  },
  {
    id: "we-yangjae",
    type: "weekend",
    name: "양재역 및 잠실",
    buses: 1,
    stops: [
      { name: "양재역 5번 출구 밑 양재 종합사회복지관", time1: "7:20", time2: null },
      { name: "잠실역 7번 출구",                           time1: "7:45", time2: null },
      { name: "학교",                                       time1: "8:50", time2: null },
    ],
    returnTimes: ["16:10"],
  },
  {
    id: "we-deokjeong",
    type: "weekend",
    name: "덕정역",
    buses: 2,
    stops: [
      { name: "덕정역 강준수칼국수 앞 (1호차 45인승)", time1: "8:10", time2: "8:40", note: "3차: 9:10" },
      { name: "학교 (1호차 도착)",                       time1: "8:25", time2: "8:55", note: "3차: 9:25" },
      { name: "대진대 임시 버스정류장 옆 초밥매니아 (2호차)", time1: "7:50", time2: null, note: "대진대 버스정류장(파리바게트 앞)에서 변경됨" },
      { name: "송우리 홈플러스 앞 3006번 버스정류장 (2호차)",  time1: "8:00", time2: null },
      { name: "덕정역 강준수칼국수 앞 (2호차)",          time1: "8:25", time2: "8:55" },
      { name: "학교 (2호차 도착)",                       time1: "8:40", time2: "9:10" },
    ],
    returnTimes: ["15:10", "16:10", "17:10"],
    notes: ["1호차 하교: 15:10 / 16:10 / 17:10", "2호차 하교: 16:10 (대진대, 송우 홈플러스까지 운행)"],
  },
];

export const SHUTTLE_ROUTES: ShuttleRoute[] = [
  ...WEEKDAY_ROUTES,
  ...WEEKEND_ROUTES,
];

/** 운행 기간 */
export const SHUTTLE_TERM = {
  semester: "2026학년도 1학기",
  startDate: "2026-03-03",
  endDate: "2026-06-22",
};

/** 공통 안내사항 (학교 공식 페이지 발췌) */
export const SHUTTLE_GENERAL_NOTICES = [
  "학교버스는 서정대학교 학생들의 통학 편의를 위해 무료로 제공됩니다. 탑승권·예약·학생증 확인 등 별도 절차는 없습니다.",
  "학기 중 평일(월~금) 운행되며, 토요일은 성인반·전공심화 수업을 위해 별도 노선으로 운행됩니다.",
  "수업시간에 맞춰 도착하지 않을 수도 있으니, 개인에 맞는 교통수단을 함께 고려해 주세요. 도착 지연으로 인한 수업 결손에는 학교가 책임지지 않습니다.",
  "탑승자는 반드시 안전벨트를 착용해야 하며, 입석은 허용되지 않습니다.",
  "운행 관련 안내는 헤이영캠퍼스 앱(App) 알림으로도 공지됩니다.",
];

/**
 * 현재 시각 기준으로 해당 노선의 "다음 출발 시각" 찾기 (정류장별)
 * 등교 시간만 계산 (하교 시간은 returnTimes로 별도 표시)
 *
 * @returns { stopName, time, minutesLeft } | null  운행 종료 시 null
 */
export function getNextDeparture(
  route: ShuttleRoute,
  now: Date = new Date()
): { stopName: string; time: string; minutesLeft: number } | null {
  const currentMin = now.getHours() * 60 + now.getMinutes();

  let best: { stopName: string; time: string; minutesLeft: number } | null = null;

  for (const stop of route.stops) {
    if (stop.name === "학교" || stop.name.startsWith("학교")) continue; // 도착지 제외
    for (const t of [stop.time1, stop.time2]) {
      if (!t) continue;
      const [h, m] = t.split(":").map(Number);
      const stopMin = h * 60 + m;
      const diff = stopMin - currentMin;
      if (diff < 0) continue;
      if (!best || diff < best.minutesLeft) {
        best = { stopName: stop.name, time: t, minutesLeft: diff };
      }
    }
  }
  return best;
}

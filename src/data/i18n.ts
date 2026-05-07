/**
 * 다국어 텍스트 (한국어/영어/베트남어/우즈벡어)
 */

export type Locale = "ko" | "en" | "vi" | "uz";

export const LOCALES: { code: Locale; label: string; flag: string }[] = [
  { code: "ko", label: "한국어",       flag: "🇰🇷" },
  { code: "en", label: "English",      flag: "🇺🇸" },
  { code: "vi", label: "Tiếng Việt",   flag: "🇻🇳" },
  { code: "uz", label: "Oʻzbekcha",    flag: "🇺🇿" },
];

export const TEXTS = {
  // 헤더
  siteName: {
    ko: "SJ Alliance",
    en: "SJ Alliance",
    vi: "SJ Alliance",
    uz: "SJ Alliance",
  },
  siteDesc: {
    ko: "서정대 협약 업체",
    en: "SJ Partnered Stores",
    vi: "Cửa hàng liên kết SJ",
    uz: "SJ hamkorlik doʻkonlari",
  },
  // 메인 헤로
  heroTitle: {
    ko: "학교 근처 할인 받는 곳",
    en: "Discounts near campus",
    vi: "Ưu đãi gần trường",
    uz: "Kampus yaqinida chegirmalar",
  },
  heroDesc: {
    ko: "학생증·교직원증 제시 시 할인",
    en: "Show your student/staff ID for discounts",
    vi: "Xuất trình thẻ sinh viên/giáo viên để được giảm giá",
    uz: "Chegirma uchun talaba/xodim ID kartangizni koʻrsating",
  },
  storeCount: {
    ko: "개 협약 업체",
    en: "partner stores",
    vi: "cửa hàng liên kết",
    uz: "ta hamkor doʻkon",
  },
  // 검색
  searchPlaceholder: {
    ko: "업체명·메뉴 검색...",
    en: "Search stores or menu...",
    vi: "Tìm cửa hàng hoặc món...",
    uz: "Doʻkon yoki menyu qidirish...",
  },
  // 필터
  all: {
    ko: "전체",
    en: "All",
    vi: "Tất cả",
    uz: "Hammasi",
  },
  // 카드
  viewMap: {
    ko: "지도에서 보기",
    en: "View on map",
    vi: "Xem trên bản đồ",
    uz: "Xaritada koʻrish",
  },
  navigate: {
    ko: "길찾기",
    en: "Directions",
    vi: "Chỉ đường",
    uz: "Yoʻnalish",
  },
  details: {
    ko: "상세보기",
    en: "Details",
    vi: "Chi tiết",
    uz: "Tafsilotlar",
  },
  noResults: {
    ko: "검색 결과가 없습니다",
    en: "No results found",
    vi: "Không có kết quả",
    uz: "Natijalar topilmadi",
  },
  // 푸터
  footer: {
    ko: "© 2025 서정대학교 SJ Alliance · 비공식 시범 운영 페이지",
    en: "© 2025 Seojeong College SJ Alliance · Unofficial pilot",
    vi: "© 2025 Đại học Seojeong SJ Alliance · Trang thí điểm không chính thức",
    uz: "© 2025 Seojeong Kolleji SJ Alliance · Norasmiy pilot sahifa",
  },
};

export function t(key: keyof typeof TEXTS, locale: Locale): string {
  return TEXTS[key][locale] ?? TEXTS[key].ko;
}

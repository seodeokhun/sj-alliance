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
  // ==================== 공통 ====================
  siteName: {
    ko: "서정대학교 학생 종합 정보",
    en: "Seojeong University Student Info",
    vi: "Thông tin sinh viên ĐH Seojeong",
    uz: "Seojeong universiteti talaba maʼlumotlari",
  },
  loading: {
    ko: "불러오는 중...",
    en: "Loading...",
    vi: "Đang tải...",
    uz: "Yuklanmoqda...",
  },
  noResults: {
    ko: "검색 결과가 없습니다",
    en: "No results found",
    vi: "Không có kết quả",
    uz: "Natijalar topilmadi",
  },
  noPosts: {
    ko: "아직 게시글이 없습니다",
    en: "No posts yet",
    vi: "Chưa có bài viết",
    uz: "Hozircha hech qanday post yoʻq",
  },
  all: {
    ko: "전체",
    en: "All",
    vi: "Tất cả",
    uz: "Hammasi",
  },
  search: {
    ko: "검색",
    en: "Search",
    vi: "Tìm kiếm",
    uz: "Qidirish",
  },
  submit: {
    ko: "등록하기",
    en: "Submit",
    vi: "Gửi",
    uz: "Yuborish",
  },
  submitting: {
    ko: "등록 중...",
    en: "Submitting...",
    vi: "Đang gửi...",
    uz: "Yuborilmoqda...",
  },
  cancel: {
    ko: "취소",
    en: "Cancel",
    vi: "Hủy",
    uz: "Bekor qilish",
  },
  required: {
    ko: "필수",
    en: "Required",
    vi: "Bắt buộc",
    uz: "Majburiy",
  },
  notFound: {
    ko: "게시글을 찾을 수 없습니다",
    en: "Post not found",
    vi: "Không tìm thấy bài viết",
    uz: "Post topilmadi",
  },

  // ==================== 메인 페이지 ====================
  mainHeroTitle: {
    ko: "어떤 정보가 필요하세요?",
    en: "What are you looking for?",
    vi: "Bạn cần tìm thông tin gì?",
    uz: "Sizga qanday maʼlumot kerak?",
  },
  mainHeroDesc: {
    ko: "카테고리를 클릭해서 펼쳐보세요",
    en: "Click a category to expand",
    vi: "Nhấn vào danh mục để mở rộng",
    uz: "Kategoriyani ochish uchun bosing",
  },
  inDevelopment: {
    ko: "구현 준비중",
    en: "Coming soon",
    vi: "Sắp ra mắt",
    uz: "Tez orada",
  },
  catAlliance: {
    ko: "SJ Alliance",
    en: "SJ Alliance",
    vi: "SJ Alliance",
    uz: "SJ Alliance",
  },
  catAllianceDesc: {
    ko: "협약 업체 할인·지도",
    en: "Partner stores · Map",
    vi: "Cửa hàng liên kết · Bản đồ",
    uz: "Hamkor doʻkonlar · Xarita",
  },
  catLost: {
    ko: "분실물",
    en: "Lost & Found",
    vi: "Đồ thất lạc",
    uz: "Yoʻqolgan buyumlar",
  },
  catLostDesc: {
    ko: "분실물 게시판·신고",
    en: "Lost & found board",
    vi: "Bảng đồ thất lạc",
    uz: "Yoʻqolgan buyumlar doskasi",
  },
  catShare: {
    ko: "나눔 게시판",
    en: "Sharing Board",
    vi: "Bảng chia sẻ miễn phí",
    uz: "Bepul ulashish",
  },
  catShareDesc: {
    ko: "교재·생활용품 무료 나눔",
    en: "Free textbooks & supplies",
    vi: "Sách giáo khoa & đồ dùng miễn phí",
    uz: "Bepul darsliklar va buyumlar",
  },
  catShuttle: {
    ko: "셔틀버스",
    en: "Shuttle Bus",
    vi: "Xe buýt đưa đón",
    uz: "Shuttle avtobus",
  },
  catShuttleDesc: {
    ko: "시간표·노선 지도·운행 안내",
    en: "Schedule, routes, service info",
    vi: "Lịch trình, tuyến đường, thông tin",
    uz: "Jadval, marshrutlar, xizmat",
  },
  catVolunteer: {
    ko: "서포터즈·봉사단",
    en: "Supporters & Volunteers",
    vi: "Tình nguyện viên",
    uz: "Koʻngillilar",
  },
  catVolunteerDesc: {
    ko: "지원자 모집·신청서",
    en: "Recruitment & applications",
    vi: "Tuyển dụng & đăng ký",
    uz: "Yollash va arizalar",
  },
  subListStores: {
    ko: "업체 리스트",
    en: "Store list",
    vi: "Danh sách cửa hàng",
    uz: "Doʻkonlar roʻyxati",
  },
  subAllMap: {
    ko: "전체 지도",
    en: "Map view",
    vi: "Bản đồ tổng quát",
    uz: "Umumiy xarita",
  },
  subLostBoard: {
    ko: "분실물 게시판",
    en: "Lost & found board",
    vi: "Bảng đồ thất lạc",
    uz: "Yoʻqolgan buyumlar doskasi",
  },
  subLostRegister: {
    ko: "분실물 신고하기",
    en: "Report lost/found",
    vi: "Báo cáo đồ thất lạc",
    uz: "Yoʻqotgan buyum haqida xabar",
  },
  subShareBoard: {
    ko: "나눔 게시판",
    en: "Sharing board",
    vi: "Bảng chia sẻ",
    uz: "Ulashish doskasi",
  },
  subShareRegister: {
    ko: "나눔 등록하기",
    en: "Register sharing",
    vi: "Đăng chia sẻ",
    uz: "Ulashishni roʻyxatdan oʻtkazish",
  },

  // ==================== SJ Alliance ====================
  allianceHeroTitle: {
    ko: "서정대 협약 업체",
    en: "SJ Partnered Stores",
    vi: "Cửa hàng liên kết SJ",
    uz: "SJ hamkor doʻkonlari",
  },
  allianceHeroDesc: {
    ko: "학생증·교직원증 제시 시 할인 받는 곳을 한 번에 확인하세요",
    en: "Show your student/staff ID for discounts",
    vi: "Xuất trình thẻ SV/giáo viên để được giảm giá",
    uz: "Talaba/xodim kartangizni koʻrsating va chegirma oling",
  },
  storeListTitle: {
    ko: "업체 리스트",
    en: "Store List",
    vi: "Danh sách cửa hàng",
    uz: "Doʻkonlar roʻyxati",
  },
  storeListDesc: {
    ko: "협약된 모든 업체의 할인 정보 보기",
    en: "View all partner stores and discounts",
    vi: "Xem tất cả cửa hàng và ưu đãi",
    uz: "Barcha doʻkonlar va chegirmalar",
  },
  fullMapTitle: {
    ko: "전체 지도",
    en: "Full Map",
    vi: "Bản đồ toàn bộ",
    uz: "Toʻliq xarita",
  },
  fullMapDesc: {
    ko: "지도에서 카테고리별로 핀 확인",
    en: "View pins by category on the map",
    vi: "Xem ghim theo danh mục trên bản đồ",
    uz: "Xaritada kategoriyalar boʻyicha",
  },
  storeSearch: {
    ko: "업체명·메뉴 검색...",
    en: "Search stores or menu...",
    vi: "Tìm cửa hàng hoặc món...",
    uz: "Doʻkon yoki menyu qidirish...",
  },
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

  // ==================== 분실물 ====================
  lostBoardTitle: {
    ko: "분실물 게시판",
    en: "Lost & Found Board",
    vi: "Bảng đồ thất lạc",
    uz: "Yoʻqolgan buyumlar doskasi",
  },
  lostWriteBtn: {
    ko: "+ 글쓰기",
    en: "+ New post",
    vi: "+ Bài mới",
    uz: "+ Yangi post",
  },
  lostRegisterTitle: {
    ko: "분실물 글쓰기",
    en: "Report Lost / Found",
    vi: "Báo cáo thất lạc / nhặt được",
    uz: "Yoʻqotish/topish haqida xabar",
  },
  lostTypeLost: {
    ko: "🔍 잃어버렸어요",
    en: "🔍 I lost something",
    vi: "🔍 Tôi bị mất",
    uz: "🔍 Yoʻqotdim",
  },
  lostTypeFound: {
    ko: "✋ 주웠어요",
    en: "✋ I found something",
    vi: "✋ Tôi nhặt được",
    uz: "✋ Topdim",
  },
  lostFirstPost: {
    ko: "첫 글 작성하기",
    en: "Write the first post",
    vi: "Viết bài đầu tiên",
    uz: "Birinchi postni yozish",
  },
  lostCatWallet: {
    ko: "지갑·카드",
    en: "Wallet · Card",
    vi: "Ví · Thẻ",
    uz: "Hamyon · Karta",
  },
  lostCatPhone: {
    ko: "휴대폰·전자기기",
    en: "Phone · Electronics",
    vi: "Điện thoại · Đồ điện tử",
    uz: "Telefon · Elektronika",
  },
  lostCatBag: {
    ko: "가방·옷",
    en: "Bag · Clothes",
    vi: "Túi · Quần áo",
    uz: "Sumka · Kiyim",
  },
  lostCatUmbrella: {
    ko: "우산",
    en: "Umbrella",
    vi: "Ô",
    uz: "Soyabon",
  },
  lostCatKey: {
    ko: "키·열쇠",
    en: "Key",
    vi: "Chìa khóa",
    uz: "Kalit",
  },
  lostCatBook: {
    ko: "도서·서류",
    en: "Book · Document",
    vi: "Sách · Tài liệu",
    uz: "Kitob · Hujjat",
  },
  lostCatEtc: {
    ko: "기타",
    en: "Other",
    vi: "Khác",
    uz: "Boshqa",
  },

  // ==================== 나눔 ====================
  shareBoardTitle: {
    ko: "나눔 게시판",
    en: "Free Sharing Board",
    vi: "Bảng chia sẻ miễn phí",
    uz: "Bepul ulashish doskasi",
  },
  shareRegisterBtn: {
    ko: "+ 나눔 등록",
    en: "+ New share",
    vi: "+ Đăng chia sẻ",
    uz: "+ Yangi ulashish",
  },
  shareRegisterTitle: {
    ko: "나눔 등록",
    en: "Register Sharing",
    vi: "Đăng chia sẻ",
    uz: "Ulashishni roʻyxatdan oʻtkazish",
  },
  shareSubmitBtn: {
    ko: "나눔 등록하기",
    en: "Submit sharing",
    vi: "Đăng chia sẻ",
    uz: "Ulashishni yuborish",
  },
  shareFirstPost: {
    ko: "첫 나눔 등록하기",
    en: "Register the first share",
    vi: "Đăng chia sẻ đầu tiên",
    uz: "Birinchi ulashishni roʻyxatdan oʻtkazish",
  },
  shareNoPost: {
    ko: "아직 나눔 글이 없습니다",
    en: "No shares yet",
    vi: "Chưa có bài chia sẻ",
    uz: "Hozircha ulashishlar yoʻq",
  },
  shareBanner: {
    ko: "🌱 본 게시판은 무료 나눔 전용입니다. 금전 거래는 금지되며, 발견 시 게시물이 삭제될 수 있습니다.",
    en: "🌱 This board is for free sharing only. Monetary transactions are prohibited; violators will be removed.",
    vi: "🌱 Bảng này chỉ dành cho chia sẻ miễn phí. Cấm giao dịch tiền; vi phạm sẽ bị xóa.",
    uz: "🌱 Bu doska faqat bepul ulashish uchun. Pul tranzaksiyalari taqiqlangan; oʻchirib tashlanadi.",
  },
  shareBannerShort: {
    ko: "🌱 무료 나눔만 가능합니다. 금전 거래 금지, 위반 시 게시물이 삭제됩니다.",
    en: "🌱 Free sharing only. No monetary transactions; violators removed.",
    vi: "🌱 Chỉ chia sẻ miễn phí. Cấm giao dịch tiền; vi phạm sẽ bị xóa.",
    uz: "🌱 Faqat bepul. Pul muomalasi yoʻq; oʻchirib tashlanadi.",
  },
  shareCatBook: {
    ko: "교재·전공책",
    en: "Textbooks",
    vi: "Sách giáo khoa",
    uz: "Darsliklar",
  },
  shareCatFurniture: {
    ko: "가구·생활용품",
    en: "Furniture · Goods",
    vi: "Nội thất · Đồ dùng",
    uz: "Mebel · Buyumlar",
  },
  shareCatElec: {
    ko: "전자기기",
    en: "Electronics",
    vi: "Đồ điện tử",
    uz: "Elektronika",
  },
  shareCatClothes: {
    ko: "의류",
    en: "Clothes",
    vi: "Quần áo",
    uz: "Kiyim",
  },
  shareCatKitchen: {
    ko: "식료품·키친",
    en: "Food · Kitchen",
    vi: "Thực phẩm · Bếp",
    uz: "Oziq-ovqat · Oshxona",
  },
  shareCatEtc: {
    ko: "기타",
    en: "Other",
    vi: "Khác",
    uz: "Boshqa",
  },
  shareStatusOpen: {
    ko: "나눔중",
    en: "Available",
    vi: "Đang chia sẻ",
    uz: "Mavjud",
  },
  shareStatusReserved: {
    ko: "예약중",
    en: "Reserved",
    vi: "Đã đặt",
    uz: "Band qilingan",
  },
  shareStatusDone: {
    ko: "나눔완료",
    en: "Completed",
    vi: "Đã hoàn tất",
    uz: "Tugatildi",
  },
  shareCondNew: {
    ko: "새것 같음",
    en: "Like new",
    vi: "Như mới",
    uz: "Yangi kabi",
  },
  shareCondGood: {
    ko: "사용감 적음",
    en: "Slight wear",
    vi: "Ít sử dụng",
    uz: "Yengil ishlatilgan",
  },
  shareCondFair: {
    ko: "사용감 있음",
    en: "Used",
    vi: "Đã sử dụng",
    uz: "Ishlatilgan",
  },
  shareCondWorn: {
    ko: "오래됨",
    en: "Worn",
    vi: "Cũ",
    uz: "Eski",
  },

  // ==================== 공통 폼 필드 ====================
  fieldTitle: {
    ko: "제목",
    en: "Title",
    vi: "Tiêu đề",
    uz: "Sarlavha",
  },
  fieldCategory: {
    ko: "카테고리",
    en: "Category",
    vi: "Danh mục",
    uz: "Kategoriya",
  },
  fieldLocation: {
    ko: "위치",
    en: "Location",
    vi: "Vị trí",
    uz: "Joylashuv",
  },
  fieldShareLocation: {
    ko: "거래 위치",
    en: "Meetup location",
    vi: "Địa điểm gặp",
    uz: "Uchrashuv joyi",
  },
  fieldLostAt: {
    ko: "분실 시간",
    en: "Time lost",
    vi: "Thời gian mất",
    uz: "Yoʻqotgan vaqt",
  },
  fieldFoundAt: {
    ko: "발견 시간",
    en: "Time found",
    vi: "Thời gian nhặt",
    uz: "Topgan vaqt",
  },
  fieldDescription: {
    ko: "상세 설명",
    en: "Description",
    vi: "Mô tả",
    uz: "Tavsif",
  },
  fieldImages: {
    ko: "사진 (최대 4장)",
    en: "Photos (max 4)",
    vi: "Ảnh (tối đa 4)",
    uz: "Rasmlar (max 4)",
  },
  fieldCondition: {
    ko: "물품 상태",
    en: "Condition",
    vi: "Tình trạng",
    uz: "Holati",
  },
  fieldType: {
    ko: "유형",
    en: "Type",
    vi: "Loại",
    uz: "Turi",
  },
  addPhoto: {
    ko: "+ 사진 추가",
    en: "+ Add photo",
    vi: "+ Thêm ảnh",
    uz: "+ Rasm qoʻshish",
  },
  searchPostsPlaceholder: {
    ko: "제목·위치 검색",
    en: "Search title or location",
    vi: "Tìm tiêu đề hoặc vị trí",
    uz: "Sarlavha yoki joyni qidirish",
  },
  anonymousNotice: {
    ko: "ℹ️ 익명 닉네임이 자동으로 부여됩니다 (예: 익명3492)\n실명·연락처는 노출되지 않습니다.",
    en: "ℹ️ Anonymous nickname auto-assigned (e.g., Anon3492)\nReal name and contact are not shown.",
    vi: "ℹ️ Tên ẩn danh tự động (vd: Anon3492)\nKhông hiển thị tên thật / số điện thoại.",
    uz: "ℹ️ Anonim taxallus avtomatik beriladi (mas: Anon3492)\nHaqiqiy ism va kontakt koʻrsatilmaydi.",
  },

  // ==================== 댓글·채팅 ====================
  comments: {
    ko: "댓글",
    en: "Comments",
    vi: "Bình luận",
    uz: "Izohlar",
  },
  commentPlaceholder: {
    ko: "댓글을 입력하세요 (익명으로 등록됩니다)",
    en: "Write a comment (posted anonymously)",
    vi: "Viết bình luận (đăng ẩn danh)",
    uz: "Izoh yozing (anonim joylashtiriladi)",
  },
  commentNone: {
    ko: "아직 댓글이 없습니다",
    en: "No comments yet",
    vi: "Chưa có bình luận",
    uz: "Hozircha izohlar yoʻq",
  },
  commentSubmit: {
    ko: "댓글 등록",
    en: "Post comment",
    vi: "Đăng bình luận",
    uz: "Izoh yuborish",
  },
  chatWithAuthor: {
    ko: "작성자와 1:1 채팅하기",
    en: "Chat with author",
    vi: "Trò chuyện với tác giả",
    uz: "Muallif bilan chat",
  },
  chatComingSoon: {
    ko: "(준비중)",
    en: "(Coming soon)",
    vi: "(Sắp ra mắt)",
    uz: "(Tez orada)",
  },
  chatAlert: {
    ko: "💬 1:1 채팅 기능은 곧 만나보실 수 있어요!\n현재는 댓글로 소통해주세요.",
    en: "💬 1:1 chat is coming soon!\nFor now, please use comments.",
    vi: "💬 Chat 1:1 sắp ra mắt!\nHiện tại hãy dùng bình luận.",
    uz: "💬 1:1 chat tez orada!\nHozir izohlardan foydalaning.",
  },

  // ==================== 푸터 ====================
  footer: {
    ko: "© 2026 서정대학교 · 학생 종합 정보 사이트",
    en: "© 2026 Seojeong University · Student Information Site",
    vi: "© 2026 Đại học Seojeong · Trang thông tin sinh viên",
    uz: "© 2026 Seojeong universiteti · Talaba maʼlumotlar sayti",
  },

  // ==================== 이전 키 (기존 호환) ====================
  siteDesc: {
    ko: "서정대 협약 업체",
    en: "SJ Partnered Stores",
    vi: "Cửa hàng liên kết SJ",
    uz: "SJ hamkorlik doʻkonlari",
  },
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
  searchPlaceholder: {
    ko: "업체명·메뉴 검색...",
    en: "Search stores or menu...",
    vi: "Tìm cửa hàng hoặc món...",
    uz: "Doʻkon yoki menyu qidirish...",
  },
};

export function t(key: keyof typeof TEXTS, locale: Locale): string {
  return TEXTS[key][locale] ?? TEXTS[key].ko;
}

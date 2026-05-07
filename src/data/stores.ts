/**
 * SJ Alliance 협약 업체 데이터
 * 출처: 2025 SJ Alliance(대학-지역사회 제휴) 업체 리스트
 */

export type StoreCategory =
  | "korean"      // 한식
  | "meat"        // 고기·구이
  | "soup"        // 탕·국
  | "chicken"     // 치킨
  | "jokbal"      // 족발·보쌈
  | "pub"         // 주점
  | "bakery"      // 카페·베이커리
  | "western"     // 양식
  | "etc-food"    // 기타 음식
  | "goods"       // 생활·잡화
  | "auto"        // 차량·운전
  | "fitness"     // 운동·뷰티
  | "real-estate" // 부동산
  | "lodging";    // 숙박

export interface Store {
  id: number;
  name: {
    ko: string;
    en?: string;
  };
  category: StoreCategory;
  industry: string; // 한국어 업종 (PDF 원문)
  benefit: {
    ko: string;
    en?: string;
    vi?: string;
    uz?: string;
  };
  address: {
    ko: string;
    en?: string;
  };
  region: "deokjeong" | "eomsang" | "eunhyeon" | "okjeong" | "samsung" | "mansong" | "dongducheon";
}

export const STORES: Store[] = [
  {
    id: 1,
    name: { ko: "88연탄구이", en: "88 Yeontan-gui" },
    category: "meat",
    industry: "육류·고기구이",
    benefit: {
      ko: "현금 결제 시 10% 할인 또는 3만 원 이상 구매 시 사이다 1캔 증정",
      en: "10% off for cash payment, or free cider when spending over 30,000 KRW",
      vi: "Giảm 10% khi thanh toán bằng tiền mặt, hoặc tặng 1 lon Sprite khi mua trên 30,000 KRW",
      uz: "Naqd toʻlov uchun 10% chegirma yoki 30,000 KRW dan ortiq xaridda 1 dona Sprite hadya",
    },
    address: { ko: "경기 양주시 덕정4길 3" },
    region: "deokjeong",
  },
  {
    id: 3,
    name: { ko: "금강만물사", en: "Geumgang Manmulsa" },
    category: "goods",
    industry: "철물점·문구",
    benefit: {
      ko: "2만 원 이상 구매 시 1,000원 할인",
      en: "1,000 KRW off when spending over 20,000 KRW",
      vi: "Giảm 1,000 KRW khi mua trên 20,000 KRW",
      uz: "20,000 KRW dan ortiq xaridda 1,000 KRW chegirma",
    },
    address: { ko: "경기 양주시 화합로1361번길 11 1층" },
    region: "deokjeong",
  },
  {
    id: 4,
    name: { ko: "꼬꼬옛날통닭", en: "Kkokko Old-style Chicken" },
    category: "chicken",
    industry: "치킨",
    benefit: {
      ko: "3만 원 이상 주문 시 테이블당 튀김 제공",
      en: "Free fried side dish per table when ordering over 30,000 KRW",
      vi: "Tặng món chiên cho mỗi bàn khi đặt trên 30,000 KRW",
      uz: "30,000 KRW dan ortiq buyurtmada har bir stol uchun bepul qovurma",
    },
    address: { ko: "경기 양주시 덕정길 3" },
    region: "deokjeong",
  },
  {
    id: 5,
    name: { ko: "늘봄식당", en: "Neulbom Restaurant" },
    category: "korean",
    industry: "한식",
    benefit: {
      ko: "계좌이체 또는 현금 결제 시 10% 할인",
      en: "10% off for bank transfer or cash payment",
      vi: "Giảm 10% khi chuyển khoản hoặc thanh toán tiền mặt",
      uz: "Bank oʻtkazmasi yoki naqd toʻlov uchun 10% chegirma",
    },
    address: { ko: "경기 양주시 덕정1길 4" },
    region: "deokjeong",
  },
  {
    id: 6,
    name: { ko: "다있어", en: "Daisseo" },
    category: "goods",
    industry: "생활용품·잡화",
    benefit: {
      ko: "2만 원 이상 구매 시 볼펜 1개 증정",
      en: "Free pen when spending over 20,000 KRW",
      vi: "Tặng 1 cây bút bi khi mua trên 20,000 KRW",
      uz: "20,000 KRW dan ortiq xaridda 1 dona ruchka hadya",
    },
    address: { ko: "경기 양주시 화합로1361번길 13" },
    region: "deokjeong",
  },
  {
    id: 7,
    name: { ko: "덕정 한방순대국", en: "Deokjeong Hanbang Sundaeguk" },
    category: "soup",
    industry: "순대",
    benefit: {
      ko: "식사류 2,000원 할인 (10,000원 → 8,000원)",
      en: "2,000 KRW off meals (10,000 KRW → 8,000 KRW)",
      vi: "Giảm 2,000 KRW cho các món ăn (10,000 KRW → 8,000 KRW)",
      uz: "Taomlardan 2,000 KRW chegirma (10,000 KRW → 8,000 KRW)",
    },
    address: { ko: "경기 양주시 덕정4길 3" },
    region: "deokjeong",
  },
  {
    id: 8,
    name: { ko: "미소참옻닭", en: "Misocham Otdak" },
    category: "soup",
    industry: "삼계탕·백숙",
    benefit: {
      ko: "현금 또는 카드 결제 시 10% 할인",
      en: "10% off for cash or card payment",
      vi: "Giảm 10% khi thanh toán tiền mặt hoặc thẻ",
      uz: "Naqd yoki karta toʻlov uchun 10% chegirma",
    },
    address: { ko: "경기 양주시 덕정5길 7 1층" },
    region: "deokjeong",
  },
  {
    id: 9,
    name: { ko: "보성식당", en: "Boseong Restaurant" },
    category: "korean",
    industry: "한식·백반",
    benefit: {
      ko: "테이블당 인원 수에 맞춰 계란후라이 제공",
      en: "Free fried egg per person at the table",
      vi: "Tặng trứng chiên theo số người tại bàn",
      uz: "Stoldagi har bir kishi uchun qovurilgan tuxum",
    },
    address: { ko: "경기 양주시 덕정4길 11" },
    region: "deokjeong",
  },
  {
    id: 10,
    name: { ko: "수양푼물갈비", en: "Suyangpun Mulgalbi" },
    category: "meat",
    industry: "물갈비",
    benefit: {
      ko: "현금 또는 카드 결제 시 10% 할인",
      en: "10% off for cash or card payment",
      vi: "Giảm 10% khi thanh toán tiền mặt hoặc thẻ",
      uz: "Naqd yoki karta toʻlov uchun 10% chegirma",
    },
    address: { ko: "경기 양주시 덕정길 17 1층" },
    region: "deokjeong",
  },
  {
    id: 11,
    name: { ko: "술들다", en: "Suldeulda" },
    category: "pub",
    industry: "맥주·호프",
    benefit: {
      ko: "(카드 결제 시) 황도 제공 / (현금 결제 시) 10% 할인",
      en: "(Card) Free peaches / (Cash) 10% off",
      vi: "(Thẻ) Tặng đào / (Tiền mặt) Giảm 10%",
      uz: "(Karta) Bepul shaftoli / (Naqd) 10% chegirma",
    },
    address: { ko: "경기 양주시 덕정4길 11 1층" },
    region: "deokjeong",
  },
  {
    id: 13,
    name: { ko: "장마당빈대떡", en: "Jangmadang Bindaetteok" },
    category: "korean",
    industry: "한식·빈대떡",
    benefit: {
      ko: "테이블당 3만원 이상 주문 시, 계좌이체 또는 현금 결제에 한해 10% 할인",
      en: "10% off (cash/transfer only) when ordering over 30,000 KRW per table",
      vi: "Giảm 10% (chỉ tiền mặt/chuyển khoản) khi đặt trên 30,000 KRW mỗi bàn",
      uz: "Stol uchun 30,000 KRW dan ortiq buyurtmada 10% chegirma (faqat naqd/oʻtkazma)",
    },
    address: { ko: "경기 양주시 화합로1361번길 5" },
    region: "deokjeong",
  },
  {
    id: 14,
    name: { ko: "장흥숯불갈비", en: "Jangheung Sutbul Galbi" },
    category: "meat",
    industry: "한식·고기구이",
    benefit: {
      ko: "현금 결제 시 10% 할인",
      en: "10% off for cash payment",
      vi: "Giảm 10% khi thanh toán tiền mặt",
      uz: "Naqd toʻlov uchun 10% chegirma",
    },
    address: { ko: "경기 양주시 화합로1361번길 32" },
    region: "deokjeong",
  },
  {
    id: 15,
    name: { ko: "행운마차", en: "Haengun Macha" },
    category: "korean",
    industry: "한식",
    benefit: {
      ko: "계좌이체 또는 현금 결제 시 10% 할인",
      en: "10% off for bank transfer or cash payment",
      vi: "Giảm 10% khi chuyển khoản hoặc tiền mặt",
      uz: "Bank oʻtkazmasi yoki naqd toʻlov uchun 10% chegirma",
    },
    address: { ko: "경기 양주시 덕정길 16 1층" },
    region: "deokjeong",
  },
  {
    id: 16,
    name: { ko: "야한소갈비", en: "Yahan Sogalbi" },
    category: "meat",
    industry: "소고기구이",
    benefit: {
      ko: "소주·맥주 병당 2,000원 할인",
      en: "2,000 KRW off per bottle of soju or beer",
      vi: "Giảm 2,000 KRW mỗi chai soju hoặc bia",
      uz: "Har bir shisha soju yoki pivo uchun 2,000 KRW chegirma",
    },
    address: { ko: "경기 양주시 엄상동길 30-3" },
    region: "eomsang",
  },
  {
    id: 17,
    name: { ko: "한동길감자탕", en: "Handonggil Gamjatang" },
    category: "soup",
    industry: "감자탕",
    benefit: {
      ko: "소주·맥주 병당 2,000원 할인",
      en: "2,000 KRW off per bottle of soju or beer",
      vi: "Giảm 2,000 KRW mỗi chai soju hoặc bia",
      uz: "Har bir shisha soju yoki pivo uchun 2,000 KRW chegirma",
    },
    address: { ko: "경기 양주시 엄상동길 72" },
    region: "eomsang",
  },
  {
    id: 18,
    name: { ko: "구들장생고기", en: "Gudeuljang Saenggogi" },
    category: "meat",
    industry: "고기구이",
    benefit: {
      ko: "소주·맥주 병당 2,000원 할인",
      en: "2,000 KRW off per bottle of soju or beer",
      vi: "Giảm 2,000 KRW mỗi chai soju hoặc bia",
      uz: "Har bir shisha soju yoki pivo uchun 2,000 KRW chegirma",
    },
    address: { ko: "경기 양주시 엄상동길 66" },
    region: "eomsang",
  },
  {
    id: 19,
    name: { ko: "가장맛있는족발", en: "Best Jokbal" },
    category: "jokbal",
    industry: "족발·보쌈",
    benefit: {
      ko: "막국수 10% 할인",
      en: "10% off makguksu (cold buckwheat noodles)",
      vi: "Giảm 10% mì kiều mạch lạnh (makguksu)",
      uz: "Makguksu (sovuq grechka noodle) uchun 10% chegirma",
    },
    address: { ko: "경기 양주시 엄상동길 42-18 1층" },
    region: "eomsang",
  },
  {
    id: 20,
    name: { ko: "석이네 민물 매운탕", en: "Seoki's Freshwater Spicy Stew" },
    category: "soup",
    industry: "매운탕",
    benefit: {
      ko: "각종 매운탕 10% 할인",
      en: "10% off all spicy stews",
      vi: "Giảm 10% các loại lẩu cay",
      uz: "Barcha achchiq sho‘rvalarga 10% chegirma",
    },
    address: { ko: "경기 양주시 엄상동길 22-16 1층" },
    region: "eomsang",
  },
  {
    id: 21,
    name: { ko: "윤쉐프정직한제빵소 은현용암점", en: "Chef Yoon Honest Bakery (Eunhyeon)" },
    category: "bakery",
    industry: "제과·베이커리",
    benefit: {
      ko: "음료 10% 할인",
      en: "10% off beverages",
      vi: "Giảm 10% đồ uống",
      uz: "Ichimliklarga 10% chegirma",
    },
    address: { ko: "경기 양주시 은현면 용암로265번길 51-17" },
    region: "eunhyeon",
  },
  {
    id: 22,
    name: { ko: "덕정 강경불고기", en: "Deokjeong Ganggyeong Bulgogi" },
    category: "korean",
    industry: "불고기·두루치기",
    benefit: {
      ko: "메인메뉴 10% 할인",
      en: "10% off main menu items",
      vi: "Giảm 10% các món chính",
      uz: "Asosiy menyu uchun 10% chegirma",
    },
    address: { ko: "경기 양주시 독바위로 77 1층" },
    region: "deokjeong",
  },
  {
    id: 23,
    name: { ko: "덕정티스테이션 양주덕정점", en: "Deokjeong T-Station (Yangju)" },
    category: "auto",
    industry: "타이어",
    benefit: {
      ko: "타이어 최대 28% 특가 할인 (타이어 장착비 및 휠 밸런스 무료) / 안심서비스: 고객 과실로 인해 파손된 타이어도 새 타이어 교환",
      en: "Up to 28% off tires (free installation & wheel balance) / Safety service: replace damaged tires even from user fault",
      vi: "Giảm tới 28% lốp xe (lắp đặt & cân bằng bánh miễn phí) / Dịch vụ an tâm: đổi lốp mới ngay cả khi do lỗi khách hàng",
      uz: "Shinalarga 28% gacha chegirma (oʻrnatish va gʻildirak balansi bepul) / Xavfsizlik xizmati: mijoz xatosi tufayli buzilgan shinalarni ham yangisiga almashtirish",
    },
    address: { ko: "경기 양주시 평화로 1817 티스테이션 양주덕정점" },
    region: "deokjeong",
  },
  {
    id: 24,
    name: { ko: "옥정 소마필라테스", en: "Okjeong Soma Pilates" },
    category: "fitness",
    industry: "운동·필라테스",
    benefit: {
      ko: "회원권 첫 등록 시 20% 할인",
      en: "20% off first membership registration",
      vi: "Giảm 20% khi đăng ký hội viên lần đầu",
      uz: "Birinchi marta aʼzolikka roʻyxatdan oʻtganda 20% chegirma",
    },
    address: { ko: "경기 양주시 옥정동로7길 30 403호" },
    region: "okjeong",
  },
  {
    id: 25,
    name: { ko: "옥정 대림부동산", en: "Okjeong Daerim Real Estate" },
    category: "real-estate",
    industry: "부동산",
    benefit: {
      ko: "수수료 10% 감면",
      en: "10% off commission fee",
      vi: "Giảm 10% phí hoa hồng",
      uz: "Komissiyaga 10% chegirma",
    },
    address: { ko: "경기 양주시 옥정로 200 시네마엠디 106호" },
    region: "okjeong",
  },
  {
    id: 26,
    name: { ko: "삼숭동 한미자동차운전전문학원", en: "Hanmi Driving School (Samsungdong)" },
    category: "auto",
    industry: "자동차 학원",
    benefit: {
      ko: "대외협력처 문의",
      en: "Contact the External Cooperation Office",
      vi: "Liên hệ Phòng Hợp tác Đối ngoại",
      uz: "Tashqi hamkorlik boshqarmasiga murojaat qiling",
    },
    address: { ko: "경기 양주시 삼숭로129번길 11" },
    region: "samsung",
  },
  {
    id: 27,
    name: { ko: "만송동 휴리조트", en: "Mansongdong Hyu Resort" },
    category: "lodging",
    industry: "캠핑·야영장",
    benefit: {
      ko: "숙박료 10% 할인 (계좌이체 결제)",
      en: "10% off lodging (bank transfer payment)",
      vi: "Giảm 10% phí lưu trú (thanh toán chuyển khoản)",
      uz: "Yotoqxona uchun 10% chegirma (bank oʻtkazmasi orqali)",
    },
    address: { ko: "경기 양주시 만송로366번길 215-29" },
    region: "mansong",
  },
  {
    id: 28,
    name: { ko: "동두천 아는낙곱새", en: "Aneun Nakgopsae (Dongducheon)" },
    category: "korean",
    industry: "한식",
    benefit: {
      ko: "테이블당 음료 또는 주류 1병 무료 제공",
      en: "Free 1 drink or alcoholic beverage per table",
      vi: "Tặng 1 đồ uống hoặc rượu mỗi bàn",
      uz: "Har bir stol uchun 1 ichimlik yoki alkogol bepul",
    },
    address: { ko: "경기 동두천시 평화로2313번길 17-8 1층" },
    region: "dongducheon",
  },
  {
    id: 29,
    name: { ko: "동두천 덱스터버거", en: "Dexter Burger (Dongducheon)" },
    category: "western",
    industry: "햄버거",
    benefit: {
      ko: "총 결제 금액의 10% 할인",
      en: "10% off total payment",
      vi: "Giảm 10% tổng thanh toán",
      uz: "Umumiy toʻlovga 10% chegirma",
    },
    address: { ko: "경기 동두천시 평화로2313번길 8-35 1층" },
    region: "dongducheon",
  },
  {
    id: 30,
    name: { ko: "동두천 RAGU", en: "RAGU (Dongducheon)" },
    category: "western",
    industry: "양식",
    benefit: {
      ko: "테이블당 음료 1병 무료 + 결제 금액의 7% 포인트 적립",
      en: "Free 1 drink per table + 7% reward points on payment",
      vi: "Tặng 1 đồ uống mỗi bàn + tích điểm 7% giá trị thanh toán",
      uz: "Har bir stol uchun 1 ichimlik bepul + toʻlovning 7% ball",
    },
    address: { ko: "경기 동두천시 중앙로7번길 14" },
    region: "dongducheon",
  },
  {
    id: 31,
    name: { ko: "동두천 가마치통닭 동두천지행점", en: "Gamachi Chicken (Dongducheon Jihaeng)" },
    category: "chicken",
    industry: "치킨",
    benefit: {
      ko: "[2인 방문시] 음료 1.25L, 치즈볼 중 택1 / [4인 방문시] 감자튀김, 치즈볼 중 택1",
      en: "[2 guests] Choice of 1.25L drink or cheeseballs / [4 guests] Choice of fries or cheeseballs",
      vi: "[2 khách] Chọn 1 trong: nước 1.25L hoặc cheeseball / [4 khách] Chọn 1 trong: khoai tây chiên hoặc cheeseball",
      uz: "[2 mehmon] 1.25L ichimlik yoki cheeseball tanlovi / [4 mehmon] kartoshka qovurilgan yoki cheeseball tanlovi",
    },
    address: { ko: "경기 동두천시 이담로 13 송내주공1단지 상가 105호" },
    region: "dongducheon",
  },
];

export const CATEGORY_INFO: Record<StoreCategory, { ko: string; en: string; vi: string; uz: string; emoji: string }> = {
  korean:        { ko: "한식",          en: "Korean",        vi: "Hàn Quốc",     uz: "Koreyacha",   emoji: "🥘" },
  meat:          { ko: "고기·구이",     en: "Meat / BBQ",    vi: "Thịt nướng",  uz: "Goʻsht",      emoji: "🍖" },
  soup:          { ko: "탕·국",         en: "Soup / Stew",   vi: "Canh / Lẩu",  uz: "Sho‘rva",     emoji: "🍲" },
  chicken:       { ko: "치킨",          en: "Chicken",       vi: "Gà",          uz: "Tovuq",       emoji: "🍗" },
  jokbal:        { ko: "족발·보쌈",     en: "Jokbal",        vi: "Jokbal",      uz: "Jokbal",      emoji: "🦶" },
  pub:           { ko: "주점",          en: "Pub",           vi: "Quán nhậu",   uz: "Pivo bari",   emoji: "🍻" },
  bakery:        { ko: "카페·베이커리", en: "Cafe / Bakery", vi: "Cafe / Bánh", uz: "Kafe / Non",  emoji: "☕" },
  western:       { ko: "양식",          en: "Western",       vi: "Tây",         uz: "Yevropa",     emoji: "🍔" },
  "etc-food":    { ko: "기타 음식",     en: "Other food",    vi: "Đồ ăn khác",  uz: "Boshqa taom", emoji: "🍴" },
  goods:         { ko: "생활·잡화",     en: "Goods",         vi: "Đồ dùng",     uz: "Tovarlar",    emoji: "🛒" },
  auto:          { ko: "차량·운전",     en: "Auto / Driving", vi: "Xe / Lái xe", uz: "Avtomobil",  emoji: "🚗" },
  fitness:       { ko: "운동·뷰티",     en: "Fitness",       vi: "Thể thao",    uz: "Sport",       emoji: "🏃" },
  "real-estate": { ko: "부동산",        en: "Real Estate",   vi: "Bất động sản", uz: "Koʻchmas mulk", emoji: "🏠" },
  lodging:       { ko: "숙박",          en: "Lodging",       vi: "Lưu trú",     uz: "Yotoqxona",   emoji: "🏕" },
};

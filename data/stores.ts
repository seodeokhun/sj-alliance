/**
 * SJ Alliance 협약 업체 데이터
 * 출처: 2025 SJ Alliance(대학-지역사회 제휴) 업체 리스트
 * 좌표: 시연용 추정값 (지역 기반). 추후 카카오 로컬 API로 정밀 보정.
 */

export type StoreCategory =
  | "korean" | "meat" | "soup" | "chicken" | "jokbal" | "pub"
  | "bakery" | "western" | "etc-food" | "goods" | "auto"
  | "fitness" | "real-estate" | "lodging";

export interface Store {
  id: number;
  name: { ko: string; en?: string };
  category: StoreCategory;
  industry: string;
  benefit: { ko: string; en?: string; vi?: string; uz?: string };
  address: { ko: string; en?: string };
  region: "deokjeong" | "eomsang" | "eunhyeon" | "okjeong" | "samsung" | "mansong" | "dongducheon";
  lat: number;
  lng: number;
}

export const STORES: Store[] = [
  { id: 1, name: { ko: "88연탄구이", en: "88 Yeontan-gui" }, category: "meat", industry: "육류·고기구이",
    benefit: { ko: "현금 결제 시 10% 할인 또는 3만 원 이상 구매 시 사이다 1캔 증정", en: "10% off cash, or free Sprite over 30,000 KRW", vi: "Giảm 10% tiền mặt, tặng Sprite khi mua trên 30,000 KRW", uz: "Naqd uchun 10% chegirma, 30,000 KRW dan ortiq xaridda Sprite hadya" },
    address: { ko: "경기 양주시 덕정4길 3" }, region: "deokjeong", lat: 37.7807, lng: 127.0444 },
  { id: 3, name: { ko: "금강만물사", en: "Geumgang Manmulsa" }, category: "goods", industry: "철물점·문구",
    benefit: { ko: "2만 원 이상 구매 시 1,000원 할인", en: "1,000 KRW off over 20,000 KRW", vi: "Giảm 1,000 KRW khi mua trên 20,000 KRW", uz: "20,000 KRW dan ortiq xaridda 1,000 KRW chegirma" },
    address: { ko: "경기 양주시 화합로1361번길 11 1층" }, region: "deokjeong", lat: 37.7810, lng: 127.0440 },
  { id: 4, name: { ko: "꼬꼬옛날통닭", en: "Kkokko Old-style Chicken" }, category: "chicken", industry: "치킨",
    benefit: { ko: "3만 원 이상 주문 시 테이블당 튀김 제공", en: "Free fried side per table over 30,000 KRW", vi: "Tặng món chiên cho mỗi bàn trên 30,000 KRW", uz: "30,000 KRW dan ortiq buyurtmada qovurma" },
    address: { ko: "경기 양주시 덕정길 3" }, region: "deokjeong", lat: 37.7805, lng: 127.0445 },
  { id: 5, name: { ko: "늘봄식당", en: "Neulbom Restaurant" }, category: "korean", industry: "한식",
    benefit: { ko: "계좌이체 또는 현금 결제 시 10% 할인", en: "10% off transfer/cash", vi: "Giảm 10% tiền mặt/chuyển khoản", uz: "Bank/naqd uchun 10% chegirma" },
    address: { ko: "경기 양주시 덕정1길 4" }, region: "deokjeong", lat: 37.7810, lng: 127.0446 },
  { id: 6, name: { ko: "다있어", en: "Daisseo" }, category: "goods", industry: "생활용품·잡화",
    benefit: { ko: "2만 원 이상 구매 시 볼펜 1개 증정", en: "Free pen over 20,000 KRW", vi: "Tặng bút bi khi mua trên 20,000 KRW", uz: "20,000 KRW dan ortiq xaridda ruchka hadya" },
    address: { ko: "경기 양주시 화합로1361번길 13" }, region: "deokjeong", lat: 37.7810, lng: 127.0441 },
  { id: 7, name: { ko: "덕정 한방순대국", en: "Deokjeong Hanbang Sundaeguk" }, category: "soup", industry: "순대",
    benefit: { ko: "식사류 2,000원 할인 (10,000원 → 8,000원)", en: "2,000 KRW off meals", vi: "Giảm 2,000 KRW các món", uz: "Taomlardan 2,000 KRW chegirma" },
    address: { ko: "경기 양주시 덕정4길 3" }, region: "deokjeong", lat: 37.7808, lng: 127.0443 },
  { id: 8, name: { ko: "미소참옻닭", en: "Misocham Otdak" }, category: "soup", industry: "삼계탕·백숙",
    benefit: { ko: "현금 또는 카드 결제 시 10% 할인", en: "10% off cash/card", vi: "Giảm 10% tiền mặt/thẻ", uz: "Naqd/karta uchun 10% chegirma" },
    address: { ko: "경기 양주시 덕정5길 7 1층" }, region: "deokjeong", lat: 37.7805, lng: 127.0440 },
  { id: 9, name: { ko: "보성식당", en: "Boseong Restaurant" }, category: "korean", industry: "한식·백반",
    benefit: { ko: "테이블당 인원 수에 맞춰 계란후라이 제공", en: "Free fried egg per person", vi: "Tặng trứng chiên theo số người", uz: "Har bir kishi uchun qovurilgan tuxum" },
    address: { ko: "경기 양주시 덕정4길 11" }, region: "deokjeong", lat: 37.7808, lng: 127.0445 },
  { id: 10, name: { ko: "수양푼물갈비", en: "Suyangpun Mulgalbi" }, category: "meat", industry: "물갈비",
    benefit: { ko: "현금 또는 카드 결제 시 10% 할인", en: "10% off cash/card", vi: "Giảm 10% tiền mặt/thẻ", uz: "Naqd/karta uchun 10% chegirma" },
    address: { ko: "경기 양주시 덕정길 17 1층" }, region: "deokjeong", lat: 37.7805, lng: 127.0446 },
  { id: 11, name: { ko: "술들다", en: "Suldeulda" }, category: "pub", industry: "맥주·호프",
    benefit: { ko: "(카드) 황도 제공 / (현금) 10% 할인", en: "(Card) Free peaches / (Cash) 10% off", vi: "(Thẻ) Tặng đào / (Tiền mặt) Giảm 10%", uz: "(Karta) Shaftoli / (Naqd) 10% chegirma" },
    address: { ko: "경기 양주시 덕정4길 11 1층" }, region: "deokjeong", lat: 37.7809, lng: 127.0445 },
  { id: 13, name: { ko: "장마당빈대떡", en: "Jangmadang Bindaetteok" }, category: "korean", industry: "한식·빈대떡",
    benefit: { ko: "테이블당 3만원 이상 주문 시, 계좌이체 또는 현금 결제에 한해 10% 할인", en: "10% off (cash/transfer) over 30,000 KRW per table", vi: "Giảm 10% (tiền mặt/CK) trên 30,000 KRW/bàn", uz: "Stol uchun 30,000 KRW dan ortiq buyurtmada 10% chegirma" },
    address: { ko: "경기 양주시 화합로1361번길 5" }, region: "deokjeong", lat: 37.7807, lng: 127.0439 },
  { id: 14, name: { ko: "장흥숯불갈비", en: "Jangheung Sutbul Galbi" }, category: "meat", industry: "한식·고기구이",
    benefit: { ko: "현금 결제 시 10% 할인", en: "10% off for cash", vi: "Giảm 10% tiền mặt", uz: "Naqd uchun 10% chegirma" },
    address: { ko: "경기 양주시 화합로1361번길 32" }, region: "deokjeong", lat: 37.7805, lng: 127.0442 },
  { id: 15, name: { ko: "행운마차", en: "Haengun Macha" }, category: "korean", industry: "한식",
    benefit: { ko: "계좌이체 또는 현금 결제 시 10% 할인", en: "10% off transfer/cash", vi: "Giảm 10% tiền mặt/CK", uz: "Bank/naqd uchun 10% chegirma" },
    address: { ko: "경기 양주시 덕정길 16 1층" }, region: "deokjeong", lat: 37.7806, lng: 127.0445 },
  { id: 16, name: { ko: "야한소갈비", en: "Yahan Sogalbi" }, category: "meat", industry: "소고기구이",
    benefit: { ko: "소주·맥주 병당 2,000원 할인", en: "2,000 KRW off per soju/beer", vi: "Giảm 2,000 KRW/chai soju/bia", uz: "Soju/pivo shisha uchun 2,000 KRW chegirma" },
    address: { ko: "경기 양주시 엄상동길 30-3" }, region: "eomsang", lat: 37.7773, lng: 127.0507 },
  { id: 17, name: { ko: "한동길감자탕", en: "Handonggil Gamjatang" }, category: "soup", industry: "감자탕",
    benefit: { ko: "소주·맥주 병당 2,000원 할인", en: "2,000 KRW off per soju/beer", vi: "Giảm 2,000 KRW/chai soju/bia", uz: "Soju/pivo shisha uchun 2,000 KRW chegirma" },
    address: { ko: "경기 양주시 엄상동길 72" }, region: "eomsang", lat: 37.7775, lng: 127.0511 },
  { id: 18, name: { ko: "구들장생고기", en: "Gudeuljang Saenggogi" }, category: "meat", industry: "고기구이",
    benefit: { ko: "소주·맥주 병당 2,000원 할인", en: "2,000 KRW off per soju/beer", vi: "Giảm 2,000 KRW/chai soju/bia", uz: "Soju/pivo shisha uchun 2,000 KRW chegirma" },
    address: { ko: "경기 양주시 엄상동길 66" }, region: "eomsang", lat: 37.7774, lng: 127.0510 },
  { id: 19, name: { ko: "가장맛있는족발", en: "Best Jokbal" }, category: "jokbal", industry: "족발·보쌈",
    benefit: { ko: "막국수 10% 할인", en: "10% off makguksu", vi: "Giảm 10% mì kiều mạch", uz: "Makguksu uchun 10% chegirma" },
    address: { ko: "경기 양주시 엄상동길 42-18 1층" }, region: "eomsang", lat: 37.7773, lng: 127.0509 },
  { id: 20, name: { ko: "석이네 민물 매운탕", en: "Seoki's Spicy Stew" }, category: "soup", industry: "매운탕",
    benefit: { ko: "각종 매운탕 10% 할인", en: "10% off all spicy stews", vi: "Giảm 10% các loại lẩu cay", uz: "Achchiq sho‘rvalarga 10% chegirma" },
    address: { ko: "경기 양주시 엄상동길 22-16 1층" }, region: "eomsang", lat: 37.7772, lng: 127.0506 },
  { id: 21, name: { ko: "윤쉐프정직한제빵소 은현용암점", en: "Chef Yoon Bakery (Eunhyeon)" }, category: "bakery", industry: "제과·베이커리",
    benefit: { ko: "음료 10% 할인", en: "10% off beverages", vi: "Giảm 10% đồ uống", uz: "Ichimliklarga 10% chegirma" },
    address: { ko: "경기 양주시 은현면 용암로265번길 51-17" }, region: "eunhyeon", lat: 37.7975, lng: 127.0036 },
  { id: 22, name: { ko: "덕정 강경불고기", en: "Deokjeong Ganggyeong Bulgogi" }, category: "korean", industry: "불고기·두루치기",
    benefit: { ko: "메인메뉴 10% 할인", en: "10% off main menu", vi: "Giảm 10% món chính", uz: "Asosiy menyu 10% chegirma" },
    address: { ko: "경기 양주시 독바위로 77 1층" }, region: "deokjeong", lat: 37.7775, lng: 127.0500 },
  { id: 23, name: { ko: "덕정티스테이션 양주덕정점", en: "Deokjeong T-Station" }, category: "auto", industry: "타이어",
    benefit: { ko: "타이어 최대 28% 특가 할인 (장착비·휠 밸런스 무료) / 안심서비스 포함", en: "Up to 28% off tires (free install) / Safety service", vi: "Giảm tới 28% lốp xe (lắp đặt miễn phí)", uz: "Shinalarga 28% gacha chegirma (oʻrnatish bepul)" },
    address: { ko: "경기 양주시 평화로 1817 티스테이션 양주덕정점" }, region: "deokjeong", lat: 37.7820, lng: 127.0498 },
  { id: 24, name: { ko: "옥정 소마필라테스", en: "Okjeong Soma Pilates" }, category: "fitness", industry: "운동·필라테스",
    benefit: { ko: "회원권 첫 등록 시 20% 할인", en: "20% off first membership", vi: "Giảm 20% lần đầu đăng ký", uz: "Birinchi aʼzolikka 20% chegirma" },
    address: { ko: "경기 양주시 옥정동로7길 30 403호" }, region: "okjeong", lat: 37.7745, lng: 127.0571 },
  { id: 25, name: { ko: "옥정 대림부동산", en: "Okjeong Daerim Real Estate" }, category: "real-estate", industry: "부동산",
    benefit: { ko: "수수료 10% 감면", en: "10% off commission", vi: "Giảm 10% hoa hồng", uz: "Komissiyaga 10% chegirma" },
    address: { ko: "경기 양주시 옥정로 200 시네마엠디 106호" }, region: "okjeong", lat: 37.7740, lng: 127.0560 },
  { id: 26, name: { ko: "삼숭동 한미자동차운전전문학원", en: "Hanmi Driving School" }, category: "auto", industry: "자동차 학원",
    benefit: { ko: "대외협력처 문의", en: "Contact External Cooperation Office", vi: "Liên hệ Phòng Hợp tác Đối ngoại", uz: "Tashqi hamkorlik boshqarmasiga murojaat" },
    address: { ko: "경기 양주시 삼숭로129번길 11" }, region: "samsung", lat: 37.7858, lng: 127.0612 },
  { id: 27, name: { ko: "만송동 휴리조트", en: "Mansong Hyu Resort" }, category: "lodging", industry: "캠핑·야영장",
    benefit: { ko: "숙박료 10% 할인 (계좌이체 결제)", en: "10% off lodging (bank transfer)", vi: "Giảm 10% lưu trú (CK)", uz: "Yotoqxonaga 10% chegirma (bank oʻtkazma)" },
    address: { ko: "경기 양주시 만송로366번길 215-29" }, region: "mansong", lat: 37.7905, lng: 127.0860 },
  { id: 28, name: { ko: "동두천 아는낙곱새", en: "Aneun Nakgopsae" }, category: "korean", industry: "한식",
    benefit: { ko: "테이블당 음료 또는 주류 1병 무료 제공", en: "Free 1 drink/alcohol per table", vi: "Tặng 1 đồ uống/rượu mỗi bàn", uz: "Har bir stol uchun 1 ichimlik/alkogol bepul" },
    address: { ko: "경기 동두천시 평화로2313번길 17-8 1층" }, region: "dongducheon", lat: 37.9035, lng: 127.0606 },
  { id: 29, name: { ko: "동두천 덱스터버거", en: "Dexter Burger" }, category: "western", industry: "햄버거",
    benefit: { ko: "총 결제 금액의 10% 할인", en: "10% off total", vi: "Giảm 10% tổng tiền", uz: "Umumiy toʻlovga 10% chegirma" },
    address: { ko: "경기 동두천시 평화로2313번길 8-35 1층" }, region: "dongducheon", lat: 37.9036, lng: 127.0608 },
  { id: 30, name: { ko: "동두천 RAGU", en: "RAGU" }, category: "western", industry: "양식",
    benefit: { ko: "테이블당 음료 1병 무료 + 결제 금액의 7% 포인트 적립", en: "Free 1 drink + 7% reward points", vi: "Tặng 1 đồ uống + tích 7% điểm", uz: "1 ichimlik bepul + 7% ball" },
    address: { ko: "경기 동두천시 중앙로7번길 14" }, region: "dongducheon", lat: 37.9038, lng: 127.0610 },
  { id: 31, name: { ko: "동두천 가마치통닭 동두천지행점", en: "Gamachi Chicken (Jihaeng)" }, category: "chicken", industry: "치킨",
    benefit: { ko: "[2인 방문시] 음료 1.25L, 치즈볼 중 택1 / [4인 방문시] 감자튀김, 치즈볼 중 택1", en: "[2 guests] 1.25L drink or cheeseballs / [4] fries or cheeseballs", vi: "[2 khách] 1.25L nước hoặc cheeseball / [4] khoai tây hoặc cheeseball", uz: "[2 mehmon] 1.25L ichimlik yoki cheeseball / [4] kartoshka yoki cheeseball" },
    address: { ko: "경기 동두천시 이담로 13 송내주공1단지 상가 105호" }, region: "dongducheon", lat: 37.9050, lng: 127.0620 },
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

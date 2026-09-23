"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useLocale } from "@/lib/useLocale";
import LangSwitcher from "@/components/LangSwitcher";
import { translateFields } from "@/lib/translate";

const PLACE_CATEGORIES = [
  { key: "food", icon: "🍽️", ko: "음식점", en: "Restaurant", vi: "Nhà hàng", uz: "Restoran" },
  { key: "cafe", icon: "☕", ko: "카페", en: "Café", vi: "Quán cà phê", uz: "Kafe" },
  { key: "nature", icon: "🌿", ko: "자연·산책", en: "Nature/Walk", vi: "Thiên nhiên", uz: "Tabiat" },
  { key: "study", icon: "📚", ko: "공부·작업", en: "Study/Work", vi: "Học tập", uz: "Oʻqish" },
  { key: "fun", icon: "🎉", ko: "놀거리", en: "Entertainment", vi: "Giải trí", uz: "Koʻngil ochar" },
  { key: "shopping", icon: "🛍️", ko: "쇼핑", en: "Shopping", vi: "Mua sắm", uz: "Xarid" },
  { key: "life", icon: "🏥", ko: "생활 편의", en: "Convenience", vi: "Tiện ích", uz: "Qulay" },
];

const PLACE_TAGS = [
  { key: "no_pork", icon: "🐷", ko: "돼지고기 없음", en: "No Pork", vi: "Không thịt lợn", uz: "Choʻchqa goʻshti yoʻq" },
  { key: "halal", icon: "🕌", ko: "할랄", en: "Halal", vi: "Halal", uz: "Halol" },
  { key: "vegetarian", icon: "🌱", ko: "채식 가능", en: "Vegetarian", vi: "Có món chay", uz: "Vegetarian" },
  { key: "no_seafood", icon: "🦐", ko: "해산물 없음", en: "No Seafood", vi: "Không hải sản", uz: "Dengiz mahsuloti yoʻq" },
  { key: "gluten_free", icon: "🌾", ko: "글루텐 없음", en: "Gluten-free", vi: "Không gluten", uz: "Glutensiz" },
  { key: "foreign_lang", icon: "🗣️", ko: "외국어 가능", en: "Foreign Language OK", vi: "Hỗ trợ ngoại ngữ", uz: "Xorijiy til mumkin" },
  { key: "quiet", icon: "🔇", ko: "조용함", en: "Quiet", vi: "Yên tĩnh", uz: "Tinch" },
  { key: "parking", icon: "🅿️", ko: "주차 가능", en: "Parking", vi: "Có chỗ đỗ xe", uz: "Avtoturar joy" },
  { key: "budget", icon: "💰", ko: "가성비", en: "Budget-friendly", vi: "Giá rẻ", uz: "Arzon" },
];

export default function PlaceRegister() {
  const router = useRouter();
  const { locale, setLocale } = useLocale();

  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [address, setAddress] = useState("");
  const [reason, setReason] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const localeLabels: Record<string, Record<string, string>> = {
    ko: { title: "장소 추천 등록", namePlaceholder: "장소 이름을 입력하세요", addressPlaceholder: "주소 또는 위치 설명", reasonPlaceholder: "이 장소를 추천하는 이유를 적어주세요", submit: "등록하기", submitting: "번역·등록 중...", catLabel: "카테고리", tagLabel: "특징 태그", nameLabel: "장소 이름", addressLabel: "위치", reasonLabel: "추천 이유", photoLabel: "사진", addPhoto: "사진 추가", notice: "익명으로 등록됩니다. 개인정보는 저장되지 않습니다.", translateNotice: "✨ 등록 시 4개 언어로 자동 번역됩니다.", blocked: "부적절한 내용이 감지되었습니다. 내용을 수정해주세요.", required: "장소 이름과 추천 이유는 필수입니다." },
    en: { title: "Recommend a Place", namePlaceholder: "Place name", addressPlaceholder: "Address or location description", reasonPlaceholder: "Why do you recommend this place?", submit: "Submit", submitting: "Translating & submitting...", catLabel: "Category", tagLabel: "Tags", nameLabel: "Place Name", addressLabel: "Location", reasonLabel: "Why Recommend?", photoLabel: "Photos", addPhoto: "Add Photo", notice: "Posted anonymously. No personal info is stored.", translateNotice: "✨ Your post will be auto-translated into 4 languages.", blocked: "Inappropriate content detected. Please revise.", required: "Place name and reason are required." },
    vi: { title: "Đề xuất địa điểm", namePlaceholder: "Tên địa điểm", addressPlaceholder: "Địa chỉ hoặc mô tả vị trí", reasonPlaceholder: "Lý do bạn đề xuất nơi này?", submit: "Gửi", submitting: "Đang dịch & gửi...", catLabel: "Danh mục", tagLabel: "Thẻ", nameLabel: "Tên địa điểm", addressLabel: "Vị trí", reasonLabel: "Lý do đề xuất", photoLabel: "Ảnh", addPhoto: "Thêm ảnh", notice: "Đăng ẩn danh. Không lưu thông tin cá nhân.", translateNotice: "✨ Bài sẽ được tự động dịch sang 4 ngôn ngữ.", blocked: "Phát hiện nội dung không phù hợp. Vui lòng sửa lại.", required: "Tên địa điểm và lý do là bắt buộc." },
    uz: { title: "Joyni tavsiya qilish", namePlaceholder: "Joy nomi", addressPlaceholder: "Manzil yoki joylashuv tavsifi", reasonPlaceholder: "Bu joyni nima uchun tavsiya qilasiz?", submit: "Yuborish", submitting: "Tarjima qilinmoqda...", catLabel: "Toifa", tagLabel: "Teglar", nameLabel: "Joy nomi", addressLabel: "Joylashuv", reasonLabel: "Tavsiya sababi", photoLabel: "Rasmlar", addPhoto: "Rasm qoʻshish", notice: "Anonim tarzda joylashtiriladi.", translateNotice: "✨ Post 4 tilga avtomatik tarjima qilinadi.", blocked: "Nomaqbul kontent aniqlandi. Iltimos, tahrirlang.", required: "Joy nomi va sabab majburiy." },
  };

  const L = localeLabels[locale] || localeLabels.ko;
  const catLabel = (c: typeof PLACE_CATEGORIES[0]) => ({ ko: c.ko, en: c.en, vi: c.vi, uz: c.uz }[locale] || c.ko);
  const tagLabel = (t: typeof PLACE_TAGS[0]) => ({ ko: t.ko, en: t.en, vi: t.vi, uz: t.uz }[locale] || t.ko);

  function toggleTag(key: string) {
    setTags((prev) => prev.includes(key) ? prev.filter((t) => t !== key) : [...prev, key]);
  }

  function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(e.target.files || []);
    if (!selected.length) return;
    const next = [...files, ...selected].slice(0, 4);
    setFiles(next);
    setPreviews(next.map((f) => URL.createObjectURL(f)));
  }

  function removeImage(idx: number) {
    const next = files.filter((_, i) => i !== idx);
    setFiles(next);
    setPreviews(next.map((f) => URL.createObjectURL(f)));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!name.trim() || !reason.trim()) {
      setError(L.required);
      return;
    }

    setSubmitting(true);

    // AI 욕설 필터
    try {
      const modRes = await fetch("/api/moderate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ text: `${name} ${reason}` }),
      });
      const modData = await modRes.json();
      if (!modData.safe) {
        setError(L.blocked);
        setSubmitting(false);
        return;
      }
    } catch {
      // 필터 실패 시 그냥 진행
    }

    // 이미지 업로드
    const imageUrls: string[] = [];
    for (const file of files) {
      const ext = file.name.split(".").pop() || "jpg";
      const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from("place-images")
        .upload(path, file, { cacheControl: "3600", upsert: false });
      if (upErr) {
        setError("사진 업로드 실패: " + upErr.message);
        setSubmitting(false);
        return;
      }
      const { data: urlData } = supabase.storage.from("place-images").getPublicUrl(path);
      imageUrls.push(urlData.publicUrl);
    }

    // 자동 번역
    const fieldsToTranslate: Record<string, string> = { name: name.trim(), reason: reason.trim() };
    if (address.trim()) fieldsToTranslate.address = address.trim();
    const translations = await translateFields(fieldsToTranslate, locale as any);

    const autoNick = "익명" + Math.floor(1000 + Math.random() * 9000);

    const { error: dbErr } = await supabase.from("places").insert({
      name: name.trim(),
      category: category || null,
      tags,
      address: address.trim() || null,
      reason: reason.trim(),
      images: imageUrls,
      nickname: autoNick,
      original_locale: locale,
      translations,
    });

    setSubmitting(false);

    if (dbErr) {
      setError("저장 실패: " + dbErr.message);
      return;
    }

    router.push("/place/board");
  }

  const COLOR = "#7C3AED";

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="px-5 py-4 sticky top-0 z-40 flex items-center justify-between gap-3" style={{ backgroundColor: COLOR }}>
        <div className="flex items-center gap-3">
          <Link href="/place/board" className="text-white text-xl">←</Link>
          <h1 className="text-white font-semibold">🗺️ {L.title}</h1>
        </div>
        <LangSwitcher locale={locale as any} onChange={setLocale} compact />
      </header>

      <section className="px-5 py-6 max-w-2xl mx-auto">
        <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-2xl p-5 space-y-5">

          {/* 장소 이름 */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-2">{L.nameLabel} *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={L.namePlaceholder}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg outline-none focus:border-purple-500 text-sm"
              maxLength={60}
            />
          </div>

          {/* 카테고리 */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-2">{L.catLabel}</label>
            <div className="flex gap-2 flex-wrap">
              {PLACE_CATEGORIES.map((c) => {
                const active = category === c.key;
                return (
                  <button
                    key={c.key}
                    type="button"
                    onClick={() => setCategory(active ? "" : c.key)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${active ? "text-white" : "bg-gray-100 text-gray-700"}`}
                    style={active ? { backgroundColor: COLOR } : {}}
                  >
                    {c.icon} {catLabel(c)}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 태그 */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-2">{L.tagLabel}</label>
            <div className="flex gap-2 flex-wrap">
              {PLACE_TAGS.map((tg) => {
                const active = tags.includes(tg.key);
                return (
                  <button
                    key={tg.key}
                    type="button"
                    onClick={() => toggleTag(tg.key)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition border ${active ? "text-white border-transparent" : "bg-white border-gray-200 text-gray-700"}`}
                    style={active ? { backgroundColor: "#7C3AED" } : {}}
                  >
                    {tg.icon} {tagLabel(tg)}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 위치 */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-2">{L.addressLabel}</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder={L.addressPlaceholder}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg outline-none focus:border-purple-500 text-sm"
            />
          </div>

          {/* 사진 */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-2">{L.photoLabel}</label>
            {previews.length > 0 && (
              <div className="grid grid-cols-4 gap-2 mb-2">
                {previews.map((src, i) => (
                  <div key={i} className="relative aspect-square">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={src} alt="" className="w-full h-full object-cover rounded-lg" />
                    <button type="button" onClick={() => removeImage(i)} className="absolute top-1 right-1 w-6 h-6 bg-black/60 text-white rounded-full text-xs">✕</button>
                  </div>
                ))}
              </div>
            )}
            {files.length < 4 && (
              <label className="block w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-center text-sm text-gray-500 cursor-pointer hover:border-gray-400">
                {L.addPhoto}
                <input type="file" accept="image/*" multiple onChange={handleFiles} className="hidden" />
              </label>
            )}
          </div>

          {/* 추천 이유 */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-2">{L.reasonLabel} *</label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder={L.reasonPlaceholder}
              rows={4}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg outline-none focus:border-purple-500 text-sm resize-none"
              maxLength={500}
            />
            <p className="text-right text-xs text-gray-400 mt-1">{reason.length}/500</p>
          </div>

          {/* 안내 */}
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
            <p className="text-xs text-gray-600">{L.notice}</p>
          </div>
          <div className="bg-purple-50 border border-purple-100 rounded-lg p-3">
            <p className="text-xs text-purple-800">{L.translateNotice}</p>
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-3 rounded text-xs text-red-700">
              ⚠️ {error}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting || !name.trim() || !reason.trim()}
            className="w-full py-3 rounded-lg font-bold text-white disabled:opacity-50 transition"
            style={{ backgroundColor: COLOR }}
          >
            {submitting ? L.submitting : L.submit}
          </button>
        </form>
      </section>
    </main>
  );
}

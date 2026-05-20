"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useLocale } from "@/lib/useLocale";
import LangSwitcher from "@/components/LangSwitcher";
import { translateFields } from "@/lib/translate";

export default function LostRegister() {
  const router = useRouter();
  const { locale, setLocale, t } = useLocale();

  const CATEGORIES = [
    { key: "wallet", label: t("lostCatWallet") },
    { key: "phone", label: t("lostCatPhone") },
    { key: "bag", label: t("lostCatBag") },
    { key: "umbrella", label: t("lostCatUmbrella") },
    { key: "key", label: t("lostCatKey") },
    { key: "book", label: t("lostCatBook") },
    { key: "etc", label: t("lostCatEtc") },
  ];

  const [type, setType] = useState<"lost" | "found">("lost");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [lostAt, setLostAt] = useState("");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(e.target.files || []);
    if (selected.length === 0) return;
    const next = [...files, ...selected].slice(0, 4); // 최대 4장
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

    if (!title.trim()) {
      setError("제목은 필수입니다");
      return;
    }

    // 익명 닉네임 자동 생성 (4자리 숫자)
    const autoNick = "익명" + Math.floor(1000 + Math.random() * 9000);

    setSubmitting(true);

    // 사진 업로드
    const imageUrls: string[] = [];
    for (const file of files) {
      const ext = file.name.split(".").pop() || "jpg";
      const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from("lost-images")
        .upload(path, file, { cacheControl: "3600", upsert: false });
      if (upErr) {
        setError("사진 업로드 실패: " + upErr.message);
        setSubmitting(false);
        return;
      }
      const { data: urlData } = supabase.storage.from("lost-images").getPublicUrl(path);
      imageUrls.push(urlData.publicUrl);
    }

    // 자동 번역 (사용자 입력 텍스트를 다른 3개 언어로)
    const fieldsToTranslate: Record<string, string> = { title: title.trim() };
    if (location.trim()) fieldsToTranslate.location = location.trim();
    if (description.trim()) fieldsToTranslate.description = description.trim();
    const translations = await translateFields(fieldsToTranslate, locale);

    // 글 저장
    const { error: dbErr } = await supabase.from("lost_items").insert({
      type,
      title: title.trim(),
      category: category || null,
      location: location.trim() || null,
      lost_at: lostAt || null,
      description: description.trim() || null,
      images: imageUrls,
      nickname: autoNick,
      translations,
      original_locale: locale,
    });

    setSubmitting(false);

    if (dbErr) {
      setError("저장 실패: " + dbErr.message);
      return;
    }

    router.push("/lost/board");
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="px-5 py-4 sticky top-0 z-40 flex items-center justify-between gap-3" style={{ backgroundColor: "#11306E" }}>
        <div className="flex items-center gap-3">
          <Link href="/lost/board" className="text-white text-xl">←</Link>
          <h1 className="text-white font-semibold">📦 {t("lostRegisterTitle")}</h1>
        </div>
        <LangSwitcher locale={locale} onChange={setLocale} compact />
      </header>

      <section className="px-5 py-6 max-w-2xl mx-auto">
        <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-2xl p-5 space-y-4">
          {/* 유형 선택 */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-2">{t("fieldType")} *</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setType("lost")}
                className={`flex-1 py-3 rounded-lg text-sm font-bold transition ${type === "lost" ? "text-white" : "bg-gray-100 text-gray-600"}`}
                style={type === "lost" ? { backgroundColor: "#991B1B" } : {}}
              >
                {t("lostTypeLost")}
              </button>
              <button
                type="button"
                onClick={() => setType("found")}
                className={`flex-1 py-3 rounded-lg text-sm font-bold transition ${type === "found" ? "text-white" : "bg-gray-100 text-gray-600"}`}
                style={type === "found" ? { backgroundColor: "#065F46" } : {}}
              >
                {t("lostTypeFound")}
              </button>
            </div>
          </div>

          {/* 제목 */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-2">{t("fieldTitle")} *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg outline-none focus:border-blue-500 text-sm"
              maxLength={80}
            />
          </div>

          {/* 카테고리 */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-2">{t("fieldCategory")}</label>
            <div className="flex gap-1.5 flex-wrap">
              {CATEGORIES.map((c) => {
                const active = category === c.key;
                return (
                  <button
                    key={c.key}
                    type="button"
                    onClick={() => setCategory(active ? "" : c.key)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${active ? "text-white" : "bg-gray-100 text-gray-700"}`}
                    style={active ? { backgroundColor: "#11306E" } : {}}
                  >
                    {c.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 위치 */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-2">{t("fieldLocation")}</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg outline-none focus:border-blue-500 text-sm"
            />
          </div>

          {/* 시간 */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-2">
              {type === "lost" ? t("fieldLostAt") : t("fieldFoundAt")}
            </label>
            <input
              type="datetime-local"
              value={lostAt}
              onChange={(e) => setLostAt(e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg outline-none focus:border-blue-500 text-sm"
            />
          </div>

          {/* 사진 */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-2">{t("fieldImages")}</label>
            {previews.length > 0 && (
              <div className="grid grid-cols-4 gap-2 mb-2">
                {previews.map((src, i) => (
                  <div key={i} className="relative aspect-square">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={src} alt="" className="w-full h-full object-cover rounded-lg" />
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute top-1 right-1 w-6 h-6 bg-black/60 text-white rounded-full text-xs"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
            {files.length < 4 && (
              <label className="block w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-center text-sm text-gray-500 cursor-pointer hover:border-gray-400">
                {t("addPhoto")}
                <input type="file" accept="image/*" multiple onChange={handleFiles} className="hidden" />
              </label>
            )}
          </div>

          {/* 상세설명 */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-2">{t("fieldDescription")}</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg outline-none focus:border-blue-500 text-sm resize-none"
            />
          </div>

          {/* 익명 안내 */}
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
            <p className="text-xs text-gray-600 whitespace-pre-line">
              {t("anonymousNotice")}
            </p>
          </div>

          {/* 자동 번역 안내 */}
          <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-3">
            <p className="text-xs text-emerald-800">
              {t("autoTranslateNotice")}
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-3 rounded text-xs text-red-700">
              ⚠️ {error}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting || !title}
            className="w-full py-3 rounded-lg font-bold text-white disabled:opacity-50"
            style={{ backgroundColor: "#11306E" }}
          >
            {submitting ? t("submitting") : t("submit")}
          </button>
        </form>
      </section>
    </main>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

const CATEGORIES = [
  { key: "book", label: "교재·전공책" },
  { key: "furniture", label: "가구·생활용품" },
  { key: "electronics", label: "전자기기" },
  { key: "clothes", label: "의류" },
  { key: "kitchen", label: "식료품·키친" },
  { key: "etc", label: "기타" },
];

const CONDITIONS = [
  { key: "new", label: "새것 같음" },
  { key: "good", label: "사용감 적음" },
  { key: "fair", label: "사용감 있음" },
  { key: "worn", label: "오래됨" },
];

export default function ShareRegister() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [condition, setCondition] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(e.target.files || []);
    if (selected.length === 0) return;
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

    if (!title.trim()) {
      setError("제목은 필수입니다");
      return;
    }

    const autoNick = "익명" + Math.floor(1000 + Math.random() * 9000);
    setSubmitting(true);

    const imageUrls: string[] = [];
    for (const file of files) {
      const ext = file.name.split(".").pop() || "jpg";
      const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from("share-images")
        .upload(path, file, { cacheControl: "3600", upsert: false });
      if (upErr) {
        setError("사진 업로드 실패: " + upErr.message);
        setSubmitting(false);
        return;
      }
      const { data: urlData } = supabase.storage.from("share-images").getPublicUrl(path);
      imageUrls.push(urlData.publicUrl);
    }

    const { error: dbErr } = await supabase.from("share_items").insert({
      title: title.trim(),
      category: category || null,
      condition: condition || null,
      location: location.trim() || null,
      description: description.trim() || null,
      images: imageUrls,
      nickname: autoNick,
    });

    setSubmitting(false);

    if (dbErr) {
      setError("저장 실패: " + dbErr.message);
      return;
    }

    router.push("/share/board");
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="px-5 py-4 sticky top-0 z-40 flex items-center gap-3" style={{ backgroundColor: "#10B981" }}>
        <Link href="/share/board" className="text-white text-xl">←</Link>
        <h1 className="text-white font-semibold">🎁 나눔 등록</h1>
      </header>

      <div className="bg-emerald-50 border-b border-emerald-100 px-5 py-3">
        <p className="text-xs text-emerald-800 max-w-3xl mx-auto">
          🌱 <strong>무료 나눔만 가능</strong>합니다. 금전 거래 금지, 위반 시 게시물이 삭제됩니다.
        </p>
      </div>

      <section className="px-5 py-6 max-w-2xl mx-auto">
        <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-2xl p-5 space-y-4">
          {/* 제목 */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-2">제목 *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg outline-none focus:border-emerald-500 text-sm"
              placeholder="예: 회계원리 교재 나눔합니다"
              maxLength={80}
            />
          </div>

          {/* 카테고리 */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-2">카테고리</label>
            <div className="flex gap-1.5 flex-wrap">
              {CATEGORIES.map((c) => {
                const active = category === c.key;
                return (
                  <button
                    key={c.key}
                    type="button"
                    onClick={() => setCategory(active ? "" : c.key)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${active ? "text-white" : "bg-gray-100 text-gray-700"}`}
                    style={active ? { backgroundColor: "#10B981" } : {}}
                  >
                    {c.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 상태 */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-2">물품 상태</label>
            <div className="flex gap-1.5 flex-wrap">
              {CONDITIONS.map((c) => {
                const active = condition === c.key;
                return (
                  <button
                    key={c.key}
                    type="button"
                    onClick={() => setCondition(active ? "" : c.key)}
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
            <label className="block text-xs font-bold text-gray-700 mb-2">거래 위치</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg outline-none focus:border-emerald-500 text-sm"
              placeholder="예: 학생회관 1층, 도서관 앞"
            />
          </div>

          {/* 사진 */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-2">사진 (최대 4장)</label>
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
                + 사진 추가
                <input type="file" accept="image/*" multiple onChange={handleFiles} className="hidden" />
              </label>
            )}
          </div>

          {/* 상세설명 */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-2">상세 설명</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg outline-none focus:border-emerald-500 text-sm resize-none"
              placeholder="물품 설명, 거래 가능 시간 등"
            />
          </div>

          {/* 익명 안내 */}
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
            <p className="text-xs text-gray-600">
              ℹ️ 익명 닉네임이 자동으로 부여됩니다 (예: 익명3492)
              <br />
              실명·연락처는 노출되지 않습니다.
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
            style={{ backgroundColor: "#10B981" }}
          >
            {submitting ? "등록 중..." : "나눔 등록하기"}
          </button>
        </form>
      </section>
    </main>
  );
}

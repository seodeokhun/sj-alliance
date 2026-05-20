"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useLocale } from "@/lib/useLocale";
import LangSwitcher from "@/components/LangSwitcher";

type LostItem = {
  id: string;
  type: "lost" | "found";
  title: string;
  category: string | null;
  location: string | null;
  lost_at: string | null;
  description: string | null;
  images: string[];
  nickname: string;
  created_at: string;
};

type Comment = {
  id: string;
  item_id: string;
  nickname: string;
  content: string;
  created_at: string;
};

const CATEGORIES: Record<string, string> = {
  wallet: "지갑·카드",
  phone: "휴대폰·전자기기",
  bag: "가방·옷",
  umbrella: "우산",
  key: "키·열쇠",
  book: "도서·서류",
  etc: "기타",
};

export default function LostDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { locale, setLocale, t } = useLocale();
  const [item, setItem] = useState<LostItem | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewImg, setViewImg] = useState<string | null>(null);

  // 댓글 작성용
  const [commentText, setCommentText] = useState("");
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    (async () => {
      const { data: itemData } = await supabase
        .from("lost_items")
        .select("*")
        .eq("id", id)
        .single();
      setItem(itemData);

      const { data: cmtData } = await supabase
        .from("lost_comments")
        .select("*")
        .eq("item_id", id)
        .order("created_at", { ascending: true });
      setComments(cmtData || []);
      setLoading(false);
    })();
  }, [id]);

  async function handlePostComment(e: React.FormEvent) {
    e.preventDefault();
    if (!commentText.trim()) return;
    setPosting(true);

    // 익명 닉네임 자동 생성
    const autoNick = "익명" + Math.floor(1000 + Math.random() * 9000);

    const { data, error } = await supabase
      .from("lost_comments")
      .insert({
        item_id: id,
        nickname: autoNick,
        content: commentText.trim(),
      })
      .select()
      .single();

    setPosting(false);
    if (error) {
      alert("댓글 작성 실패: " + error.message);
      return;
    }
    if (data) {
      setComments((prev) => [...prev, data]);
      setCommentText("");
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">{t("loading")}</p>
      </main>
    );
  }

  if (!item) {
    return (
      <main className="min-h-screen bg-gray-50">
        <header className="px-5 py-4 sticky top-0 z-40 flex items-center gap-3" style={{ backgroundColor: "#11306E" }}>
          <Link href="/lost/board" className="text-white text-xl">←</Link>
          <h1 className="text-white font-semibold">{t("lostBoardTitle")}</h1>
        </header>
        <p className="text-center text-gray-500 py-16">{t("notFound")}</p>
      </main>
    );
  }

  const typeBadge = item.type === "lost"
    ? { label: t("lostTypeLost"), color: "#991B1B", bg: "#FEE2E2" }
    : { label: t("lostTypeFound"), color: "#065F46", bg: "#D1FAE5" };

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="px-5 py-4 sticky top-0 z-40 flex items-center justify-between gap-3" style={{ backgroundColor: "#11306E" }}>
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <Link href="/lost/board" className="text-white text-xl flex-shrink-0">←</Link>
          <h1 className="text-white font-semibold truncate">{item.title}</h1>
        </div>
        <LangSwitcher locale={locale} onChange={setLocale} compact />
      </header>

      <section className="px-5 py-5 max-w-3xl mx-auto">
        <div className="bg-white border border-gray-200 rounded-2xl p-5">
          {/* 뱃지 + 카테고리 */}
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <span className="px-3 py-1 rounded-full text-xs font-bold" style={{ color: typeBadge.color, backgroundColor: typeBadge.bg }}>
              {typeBadge.label}
            </span>
            {item.category && (
              <span className="text-xs text-gray-500">{CATEGORIES[item.category] || item.category}</span>
            )}
          </div>

          {/* 제목 */}
          <h2 className="text-xl font-bold leading-tight mb-2" style={{ color: "#11306E" }}>
            {item.title}
          </h2>

          {/* 작성자·날짜 */}
          <p className="text-xs text-gray-500 mb-4">
            👤 {item.nickname} · {new Date(item.created_at).toLocaleString("ko-KR")}
          </p>

          {/* 사진 갤러리 */}
          {item.images && item.images.length > 0 && (
            <div className="grid grid-cols-2 gap-2 mb-4">
              {item.images.map((src, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setViewImg(src)}
                  className="block aspect-square overflow-hidden rounded-lg bg-gray-100"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt="" className="w-full h-full object-cover hover:opacity-90 transition" />
                </button>
              ))}
            </div>
          )}

          {/* 위치·시간 */}
          <div className="space-y-1.5 text-sm text-gray-700 mb-4">
            {item.location && <p>📍 {item.location}</p>}
            {item.lost_at && (
              <p>🕒 {item.type === "lost" ? "분실" : "발견"} 시각: {new Date(item.lost_at).toLocaleString("ko-KR")}</p>
            )}
          </div>

          {/* 상세설명 */}
          {item.description && (
            <div className="bg-gray-50 rounded-lg p-3 mb-4">
              <p className="text-sm text-gray-700 whitespace-pre-wrap">{item.description}</p>
            </div>
          )}

          {/* 1:1 채팅 버튼 (준비중) */}
          <button
            type="button"
            onClick={() => alert(t("chatAlert"))}
            className="w-full py-3 rounded-lg font-bold text-white flex items-center justify-center gap-2 hover:opacity-90 transition"
            style={{ backgroundColor: "#11306E" }}
          >
            <span>💬</span>
            <span>{t("chatWithAuthor")}</span>
            <span className="text-[10px] font-normal opacity-80 ml-1">{t("chatComingSoon")}</span>
          </button>
        </div>

        {/* 댓글 섹션 */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5 mt-4">
          <h3 className="text-base font-bold mb-4" style={{ color: "#11306E" }}>
            💬 {t("comments")} {comments.length}
          </h3>

          {/* 댓글 목록 */}
          {comments.length === 0 ? (
            <p className="text-xs text-gray-400 text-center py-6">{t("commentNone")}</p>
          ) : (
            <div className="space-y-3 mb-4">
              {comments.map((c) => (
                <div key={c.id} className="border-b border-gray-100 pb-3 last:border-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold" style={{ color: "#11306E" }}>{c.nickname}</span>
                    <span className="text-[10px] text-gray-400">
                      {new Date(c.created_at).toLocaleString("ko-KR")}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{c.content}</p>
                </div>
              ))}
            </div>
          )}

          {/* 댓글 작성 */}
          <form onSubmit={handlePostComment} className="border-t border-gray-100 pt-4 space-y-2">
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-blue-500 text-sm resize-none"
              placeholder={t("commentPlaceholder")}
              maxLength={300}
            />
            <button
              type="submit"
              disabled={posting || !commentText.trim()}
              className="w-full py-2 rounded-lg text-sm font-bold text-white disabled:opacity-50"
              style={{ backgroundColor: "#11306E" }}
            >
              {posting ? t("submitting") : t("commentSubmit")}
            </button>
          </form>
        </div>
      </section>

      {/* 사진 라이트박스 */}
      {viewImg && (
        <div
          onClick={() => setViewImg(null)}
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 cursor-pointer"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={viewImg} alt="" className="max-w-full max-h-full object-contain" />
        </div>
      )}
    </main>
  );
}

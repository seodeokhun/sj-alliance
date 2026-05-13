"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type ShareItem = {
  id: string;
  title: string;
  category: string | null;
  location: string | null;
  condition: string | null;
  description: string | null;
  images: string[];
  status: "open" | "reserved" | "done";
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
  book: "교재·전공책",
  furniture: "가구·생활용품",
  electronics: "전자기기",
  clothes: "의류",
  kitchen: "식료품·키친",
  etc: "기타",
};

const CONDITIONS: Record<string, string> = {
  new: "새것 같음",
  good: "사용감 적음",
  fair: "사용감 있음",
  worn: "오래됨",
};

const STATUS_LABEL: Record<string, { label: string; color: string; bg: string }> = {
  open:     { label: "🟢 나눔중",   color: "#065F46", bg: "#D1FAE5" },
  reserved: { label: "🟡 예약중",   color: "#92400E", bg: "#FEF3C7" },
  done:     { label: "⚪ 나눔완료", color: "#6B7280", bg: "#F3F4F6" },
};

export default function ShareDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [item, setItem] = useState<ShareItem | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewImg, setViewImg] = useState<string | null>(null);

  const [commentText, setCommentText] = useState("");
  const [posting, setPosting] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    (async () => {
      const { data: itemData } = await supabase
        .from("share_items")
        .select("*")
        .eq("id", id)
        .single();
      setItem(itemData);

      const { data: cmtData } = await supabase
        .from("share_comments")
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

    const autoNick = "익명" + Math.floor(1000 + Math.random() * 9000);

    const { data, error } = await supabase
      .from("share_comments")
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

  async function changeStatus(newStatus: "open" | "reserved" | "done") {
    if (!item) return;
    setUpdatingStatus(true);
    const { error } = await supabase
      .from("share_items")
      .update({ status: newStatus })
      .eq("id", id);
    setUpdatingStatus(false);
    if (error) {
      alert("상태 변경 실패: " + error.message);
      return;
    }
    setItem({ ...item, status: newStatus });
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">불러오는 중...</p>
      </main>
    );
  }

  if (!item) {
    return (
      <main className="min-h-screen bg-gray-50">
        <header className="px-5 py-4 sticky top-0 z-40 flex items-center gap-3" style={{ backgroundColor: "#10B981" }}>
          <Link href="/share/board" className="text-white text-xl">←</Link>
          <h1 className="text-white font-semibold">나눔 상세</h1>
        </header>
        <p className="text-center text-gray-500 py-16">게시글을 찾을 수 없습니다</p>
      </main>
    );
  }

  const status = STATUS_LABEL[item.status] || STATUS_LABEL.open;

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="px-5 py-4 sticky top-0 z-40 flex items-center gap-3" style={{ backgroundColor: "#10B981" }}>
        <Link href="/share/board" className="text-white text-xl">←</Link>
        <h1 className="text-white font-semibold truncate flex-1">{item.title}</h1>
      </header>

      <section className="px-5 py-5 max-w-3xl mx-auto">
        <div className="bg-white border border-gray-200 rounded-2xl p-5">
          {/* 뱃지 + 카테고리 + 상태 */}
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <span className="px-3 py-1 rounded-full text-xs font-bold" style={{ color: status.color, backgroundColor: status.bg }}>
              {status.label}
            </span>
            {item.category && (
              <span className="text-xs text-gray-500">{CATEGORIES[item.category] || item.category}</span>
            )}
            {item.condition && (
              <span className="text-xs text-gray-500">· {CONDITIONS[item.condition] || item.condition}</span>
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

          {/* 위치 */}
          <div className="space-y-1.5 text-sm text-gray-700 mb-4">
            {item.location && <p>📍 거래 위치: {item.location}</p>}
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
            onClick={() => alert("💬 1:1 채팅 기능은 곧 만나보실 수 있어요!\n현재는 댓글로 소통해주세요.")}
            className="w-full py-3 rounded-lg font-bold text-white flex items-center justify-center gap-2 hover:opacity-90 transition mb-3"
            style={{ backgroundColor: "#10B981" }}
          >
            <span>💬</span>
            <span>작성자와 1:1 채팅하기</span>
            <span className="text-[10px] font-normal opacity-80 ml-1">(준비중)</span>
          </button>

          {/* 상태 변경 (작성자 본인용) */}
          <div className="border-t border-gray-100 pt-3 mt-3">
            <p className="text-[11px] text-gray-500 mb-2">📌 작성자만 상태 변경 (로그인 시스템 도입 전 임시 공개)</p>
            <div className="flex gap-2">
              <button
                onClick={() => changeStatus("open")}
                disabled={updatingStatus || item.status === "open"}
                className={`flex-1 py-2 rounded-lg text-xs font-medium disabled:opacity-50 ${item.status === "open" ? "text-white" : "bg-gray-100 text-gray-600"}`}
                style={item.status === "open" ? { backgroundColor: "#065F46" } : {}}
              >
                🟢 나눔중
              </button>
              <button
                onClick={() => changeStatus("reserved")}
                disabled={updatingStatus || item.status === "reserved"}
                className={`flex-1 py-2 rounded-lg text-xs font-medium disabled:opacity-50 ${item.status === "reserved" ? "text-white" : "bg-gray-100 text-gray-600"}`}
                style={item.status === "reserved" ? { backgroundColor: "#92400E" } : {}}
              >
                🟡 예약중
              </button>
              <button
                onClick={() => changeStatus("done")}
                disabled={updatingStatus || item.status === "done"}
                className={`flex-1 py-2 rounded-lg text-xs font-medium disabled:opacity-50 ${item.status === "done" ? "text-white" : "bg-gray-100 text-gray-600"}`}
                style={item.status === "done" ? { backgroundColor: "#6B7280" } : {}}
              >
                ⚪ 완료
              </button>
            </div>
          </div>
        </div>

        {/* 댓글 섹션 */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5 mt-4">
          <h3 className="text-base font-bold mb-4" style={{ color: "#11306E" }}>
            💬 댓글 {comments.length}
          </h3>

          {comments.length === 0 ? (
            <p className="text-xs text-gray-400 text-center py-6">아직 댓글이 없습니다</p>
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

          <form onSubmit={handlePostComment} className="border-t border-gray-100 pt-4 space-y-2">
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-emerald-500 text-sm resize-none"
              placeholder="댓글을 입력하세요 (익명으로 등록됩니다)"
              maxLength={300}
            />
            <button
              type="submit"
              disabled={posting || !commentText.trim()}
              className="w-full py-2 rounded-lg text-sm font-bold text-white disabled:opacity-50"
              style={{ backgroundColor: "#10B981" }}
            >
              {posting ? "등록 중..." : "댓글 등록"}
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

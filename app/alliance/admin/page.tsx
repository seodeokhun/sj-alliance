"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

const ADMIN_PASSWORD = "1234";

type App = {
  id: string;
  business_number: string | null;
  owner_name: string;
  phone: string;
  store_name: string;
  industry: string | null;
  contract_start: string | null;
  contract_end: string | null;
  benefit: string;
  status: string;
  reject_reason: string | null;
  created_at: string;
  edit_token: string;
};

const STATUS_LABEL: Record<string, { label: string; color: string; bg: string }> = {
  pending:  { label: "신청대기",  color: "#92400E", bg: "#FEF3C7" },
  approved: { label: "신청완료",  color: "#065F46", bg: "#D1FAE5" },
  rejected: { label: "신청불가",  color: "#991B1B", bg: "#FEE2E2" },
};

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [apps, setApps] = useState<App[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (password === ADMIN_PASSWORD) {
      // 관리자 — 전체 조회
      const { data, error: dbErr } = await supabase
        .from("alliance_applications")
        .select("*")
        .order("created_at", { ascending: false });
      if (dbErr) {
        setError(dbErr.message);
        setLoading(false);
        return;
      }
      setApps(data || []);
      setIsAdmin(true);
      setAuthed(true);
    } else {
      // 일반 신청자 — 본인 비밀번호와 일치하는 것만
      const { data, error: dbErr } = await supabase
        .from("alliance_applications")
        .select("*")
        .eq("edit_token", password)
        .order("created_at", { ascending: false });
      if (dbErr) {
        setError(dbErr.message);
        setLoading(false);
        return;
      }
      if (!data || data.length === 0) {
        setError("일치하는 신청 내역이 없습니다");
        setLoading(false);
        return;
      }
      setApps(data);
      setIsAdmin(false);
      setAuthed(true);
    }
    setLoading(false);
  }

  async function changeStatus(id: string, status: string, reject_reason?: string) {
    const updates: any = { status, updated_at: new Date().toISOString() };
    if (status === "rejected") updates.reject_reason = reject_reason || "";
    else updates.reject_reason = null;

    const { error: dbErr } = await supabase
      .from("alliance_applications")
      .update(updates)
      .eq("id", id);
    if (dbErr) {
      alert("실패: " + dbErr.message);
      return;
    }
    setApps((prev) => prev.map((a) => (a.id === id ? { ...a, ...updates } : a)));
  }

  if (!authed) {
    return (
      <main className="min-h-screen bg-gray-50">
        <header className="px-5 py-4 sticky top-0 z-40 flex items-center gap-3" style={{ backgroundColor: "#11306E" }}>
          <Link href="/alliance" className="text-white text-xl">←</Link>
          <h1 className="text-white font-semibold">📋 신청 관리</h1>
        </header>
        <section className="px-5 py-12 max-w-md mx-auto">
          <form onSubmit={handleLogin} className="bg-white border border-gray-200 rounded-2xl p-6">
            <h2 className="text-lg font-bold mb-2" style={{ color: "#11306E" }}>비밀번호 입력</h2>
            <p className="text-xs text-gray-500 mb-4">
              신청자: 신청 시 설정한 비밀번호 입력<br />
              관리자: 관리자 비밀번호 입력
            </p>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:border-blue-500 text-sm mb-3"
              placeholder="비밀번호"
              autoFocus
            />
            {error && <p className="text-xs text-red-600 mb-3">⚠️ {error}</p>}
            <button type="submit" disabled={loading || !password}
              className="w-full py-3 rounded-lg font-bold text-white disabled:opacity-50"
              style={{ backgroundColor: "#11306E" }}>
              {loading ? "확인 중..." : "조회"}
            </button>
          </form>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="px-5 py-4 sticky top-0 z-40 flex items-center justify-between" style={{ backgroundColor: "#11306E" }}>
        <div className="flex items-center gap-3">
          <Link href="/alliance" className="text-white text-xl">←</Link>
          <h1 className="text-white font-semibold">📋 신청 관리 {isAdmin && <span className="text-xs ml-2" style={{ color: "#FFD500" }}>(관리자)</span>}</h1>
        </div>
        <button onClick={() => { setAuthed(false); setPassword(""); setApps([]); }} className="text-xs text-white opacity-80 hover:opacity-100">
          로그아웃
        </button>
      </header>

      <section className="px-5 py-6 max-w-3xl mx-auto space-y-3">
        {apps.length === 0 ? (
          <p className="text-center text-gray-500 py-12">신청 내역이 없습니다</p>
        ) : (
          apps.map((a) => <AppCard key={a.id} app={a} isAdmin={isAdmin} onChangeStatus={changeStatus} />)
        )}
      </section>
    </main>
  );
}

function AppCard({ app, isAdmin, onChangeStatus }: { app: App; isAdmin: boolean; onChangeStatus: (id: string, status: string, reason?: string) => void }) {
  const [showRejectInput, setShowRejectInput] = useState(false);
  const [rejectReason, setRejectReason] = useState(app.reject_reason || "");
  const status = STATUS_LABEL[app.status] || STATUS_LABEL.pending;

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-bold leading-tight" style={{ color: "#11306E" }}>{app.store_name}</h3>
          <p className="text-xs text-gray-500 mt-0.5">{app.industry || "업종 미입력"}</p>
        </div>
        <span className="px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap" style={{ color: status.color, backgroundColor: status.bg }}>
          {status.label}
        </span>
      </div>

      <div className="space-y-1 text-xs text-gray-600 mb-3">
        <p>👤 {app.owner_name} · 📞 {app.phone}</p>
        {app.business_number && <p>🏢 사업자: {app.business_number}</p>}
        {app.contract_start && <p>📅 협약: {app.contract_start} ~ {app.contract_end}</p>}
      </div>

      <div className="bg-pink-50 border-l-4 p-3 rounded text-sm mb-3" style={{ borderColor: "#E6007E" }}>
        <p className="text-xs text-gray-500 mb-1">제공 혜택</p>
        <p className="text-gray-800">{app.benefit}</p>
      </div>

      {app.status === "rejected" && app.reject_reason && (
        <div className="bg-red-50 border-l-4 border-red-400 p-3 rounded text-sm mb-3">
          <p className="text-xs text-gray-500 mb-1">불가 사유</p>
          <p className="text-red-700">{app.reject_reason}</p>
        </div>
      )}

      <p className="text-[11px] text-gray-400 mb-2">신청일: {new Date(app.created_at).toLocaleString("ko-KR")}</p>

      {isAdmin && (
        <div className="border-t border-gray-100 pt-3 mt-3">
          {!showRejectInput ? (
            <div className="flex gap-2">
              <button onClick={() => onChangeStatus(app.id, "pending")} className="flex-1 py-2 rounded text-xs font-medium border border-gray-300 hover:bg-gray-50">
                🟡 대기
              </button>
              <button onClick={() => onChangeStatus(app.id, "approved")} className="flex-1 py-2 rounded text-xs font-medium text-white" style={{ backgroundColor: "#10B981" }}>
                🟢 완료
              </button>
              <button onClick={() => setShowRejectInput(true)} className="flex-1 py-2 rounded text-xs font-medium text-white" style={{ backgroundColor: "#EF4444" }}>
                🔴 불가
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <input
                type="text"
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="불가 사유를 한 줄로 입력"
                className="w-full px-3 py-2 border border-gray-300 rounded text-xs outline-none focus:border-red-400"
                autoFocus
              />
              <div className="flex gap-2">
                <button onClick={() => { setShowRejectInput(false); setRejectReason(app.reject_reason || ""); }} className="flex-1 py-2 rounded text-xs border border-gray-300">
                  취소
                </button>
                <button onClick={() => { onChangeStatus(app.id, "rejected", rejectReason); setShowRejectInput(false); }} className="flex-1 py-2 rounded text-xs font-medium text-white" style={{ backgroundColor: "#EF4444" }}>
                  불가 처리
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

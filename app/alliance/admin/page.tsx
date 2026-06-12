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
  const [apps, setApps] = useState<App[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const isAdmin = true;
  const authed = true;

  async function fetchData() {
    setLoading(true);
    const { data } = await supabase
      .from("alliance_applications")
      .select("*")
      .order("created_at", { ascending: false });
    setApps(data || []);
    setLoading(false);
  }

  useEffect(() => {
    fetchData();
    const onVisible = () => {
      if (document.visibilityState === "visible") fetchData();
    };
    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("focus", fetchData);
    return () => {
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("focus", fetchData);
    };
  }, []);

  const filteredApps = statusFilter === "all"
    ? apps
    : apps.filter((a) => a.status === statusFilter);

  const counts = {
    all: apps.length,
    pending: apps.filter((a) => a.status === "pending").length,
    approved: apps.filter((a) => a.status === "approved").length,
    rejected: apps.filter((a) => a.status === "rejected").length,
  };

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

  async function deleteApp(id: string, storeName: string) {
    if (!confirm(`「${storeName}」 신청을 삭제하시겠습니까?\n삭제된 내역은 복구할 수 없습니다.`)) return;
    const { error: dbErr } = await supabase
      .from("alliance_applications")
      .delete()
      .eq("id", id);
    if (dbErr) {
      alert("삭제 실패: " + dbErr.message);
      return;
    }
    setApps((prev) => prev.filter((a) => a.id !== id));
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="px-5 py-4 sticky top-0 z-40 flex items-center gap-3" style={{ backgroundColor: "#11306E" }}>
        <Link href="/alliance" className="text-white text-xl">←</Link>
        <h1 className="text-white font-semibold flex-1">📋 신청 관리 <span className="text-xs ml-2" style={{ color: "#FFD500" }}>(관리자)</span></h1>
        <button
          onClick={fetchData}
          disabled={loading}
          className="text-white text-lg leading-none hover:opacity-70 transition disabled:opacity-40"
          aria-label="새로고침"
          title="새로고침"
        >
          {loading ? "⏳" : "🔄"}
        </button>
      </header>

      <div className="px-5 py-3 bg-white border-b border-gray-200 sticky top-[60px] z-30">
        <div className="max-w-3xl mx-auto flex gap-2 overflow-x-auto">
          {[
            { key: "all", label: "전체", color: "#11306E", count: counts.all },
            { key: "pending", label: "🟡 대기", color: "#92400E", count: counts.pending },
            { key: "approved", label: "🟢 완료", color: "#065F46", count: counts.approved },
            { key: "rejected", label: "🔴 불가", color: "#991B1B", count: counts.rejected },
          ].map((f) => {
            const active = statusFilter === f.key;
            return (
              <button
                key={f.key}
                onClick={() => setStatusFilter(f.key)}
                className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition ${active ? "text-white" : "bg-white text-gray-700 border border-gray-300"}`}
                style={active ? { backgroundColor: f.color } : {}}
              >
                {f.label} <span className="opacity-70">{f.count}</span>
              </button>
            );
          })}
        </div>
      </div>

      <section className="px-5 py-6 max-w-3xl mx-auto space-y-3">
        {filteredApps.length === 0 ? (
          <p className="text-center text-gray-500 py-12">
            {apps.length === 0 ? "신청 내역이 없습니다" : "해당 상태의 신청이 없습니다"}
          </p>
        ) : (
          filteredApps.map((a) => <AppCard key={a.id} app={a} isAdmin={isAdmin} onChangeStatus={changeStatus} onDelete={deleteApp} />)
        )}
      </section>
    </main>
  );
}

function AppCard({ app, isAdmin, onChangeStatus, onDelete }: { app: App; isAdmin: boolean; onChangeStatus: (id: string, status: string, reason?: string) => void; onDelete: (id: string, storeName: string) => void }) {
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
        <div className="border-t border-gray-100 pt-3 mt-3 space-y-2">
          {!showRejectInput ? (
            <>
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
            <button
              onClick={() => onDelete(app.id, app.store_name)}
              className="w-full py-2 rounded text-xs font-medium border border-red-300 text-red-600 hover:bg-red-50"
            >
              🗑 신청 삭제
            </button>
            </>
          ) : (
            <div className="space-y-2">
              <input
                type="text"
                value={rejectReason}
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

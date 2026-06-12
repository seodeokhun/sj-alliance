"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

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

export default function ApplicationDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [storeName, setStoreName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [app, setApp] = useState<App | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("alliance_applications")
        .select("store_name")
        .eq("id", id)
        .single();
      if (data) setStoreName(data.store_name);
    })();
  }, [id]);

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { data, error: dbErr } = await supabase
      .from("alliance_applications")
      .select("*")
      .eq("id", id)
      .eq("phone", phone)
      .eq("edit_token", password)
      .single();

    setLoading(false);

    if (dbErr || !data) {
      setError("연락처 또는 비밀번호가 일치하지 않습니다");
      return;
    }
    setApp(data);
  }

  async function handleDelete() {
    if (!app) return;
    if (!confirm("정말로 신청 내역을 삭제하시겠습니까?\n삭제된 내역은 복구할 수 없습니다.")) return;
    setLoading(true);
    const { error: dbErr } = await supabase
      .from("alliance_applications")
      .delete()
      .eq("id", app.id);
    setLoading(false);
    if (dbErr) {
      alert("삭제 실패: " + dbErr.message);
      return;
    }
    alert("신청 내역이 삭제되었습니다.");
    window.location.href = "/alliance/applications";
  }

  if (!app) {
    return (
      <main className="min-h-screen bg-gray-50">
        <header className="px-5 py-4 sticky top-0 z-40 flex items-center gap-3" style={{ backgroundColor: "#11306E" }}>
          <Link href="/alliance/applications" className="text-white text-xl">←</Link>
          <h1 className="text-white font-semibold">{storeName || "신청 내역"}</h1>
        </header>

        <section className="px-5 py-12 max-w-md mx-auto">
          <form onSubmit={handleVerify} className="bg-white border border-gray-200 rounded-2xl p-6">
            <h2 className="text-lg font-bold mb-2" style={{ color: "#11306E" }}>본인 인증</h2>
            <p className="text-xs text-gray-500 mb-4">
              신청 시 입력한 <strong>연락처</strong>와 <strong>비밀번호</strong>를 입력해주세요
            </p>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:border-blue-500 text-sm mb-2"
              placeholder="연락처 (예: 010-1234-5678)"
              autoFocus
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:border-blue-500 text-sm mb-3"
              placeholder="비밀번호"
            />
            {error && <p className="text-xs text-red-600 mb-3">⚠️ {error}</p>}
            <button type="submit" disabled={loading || !phone || !password}
              className="w-full py-3 rounded-lg font-bold text-white disabled:opacity-50"
              style={{ backgroundColor: "#11306E" }}>
              {loading ? "확인 중..." : "확인"}
            </button>
          </form>
        </section>
      </main>
    );
  }

  const status = STATUS_LABEL[app.status] || STATUS_LABEL.pending;

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="px-5 py-4 sticky top-0 z-40 flex items-center gap-3" style={{ backgroundColor: "#11306E" }}>
        <Link href="/alliance/applications" className="text-white text-xl">←</Link>
        <h1 className="text-white font-semibold">{app.store_name}</h1>
      </header>

      <section className="px-5 py-6 max-w-3xl mx-auto">
        <div className="bg-white border border-gray-200 rounded-2xl p-5">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-bold leading-tight" style={{ color: "#11306E" }}>{app.store_name}</h2>
              <p className="text-xs text-gray-500 mt-0.5">{app.industry || "업종 미입력"}</p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap" style={{ color: status.color, backgroundColor: status.bg }}>
              {status.label}
            </span>
          </div>

          <div className="space-y-1 text-sm text-gray-700 mb-4">
            <p>👤 사업주: {app.owner_name}</p>
            <p>📞 연락처: {app.phone}</p>
            {app.business_number && <p>🏢 사업자: {app.business_number}</p>}
            {app.contract_start && <p>📅 협약 기간: {app.contract_start} ~ {app.contract_end}</p>}
          </div>

          <div className="bg-pink-50 border-l-4 p-3 rounded text-sm mb-3" style={{ borderColor: "#E6007E" }}>
            <p className="text-gray-800">{app.benefit}</p>
          </div>

          {app.status === "rejected" && app.reject_reason && (
            <div className="bg-red-50 border-l-4 border-red-400 p-3 rounded text-sm mb-3">
              <p className="text-xs text-gray-500 mb-1">불가 사유</p>
              <p className="text-red-700">{app.reject_reason}</p>
            </div>
          )}

          <p className="text-[11px] text-gray-400">신청일: {new Date(app.created_at).toLocaleString("ko-KR")}</p>

          <div className="border-t border-gray-100 pt-4 mt-4">
            <button
              onClick={handleDelete}
              disabled={loading}
              className="w-full py-3 rounded-lg text-sm font-semibold text-white disabled:opacity-50"
              style={{ backgroundColor: "#EF4444" }}
            >
              🗑 신청 내역 삭제
            </button>
            <p className="text-[11px] text-gray-400 mt-2 text-center">
              삭제된 신청 내역은 복구할 수 없습니다.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

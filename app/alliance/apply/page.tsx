"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function ApplyPage() {
  const [form, setForm] = useState({
    business_number: "",
    owner_name: "",
    phone: "",
    store_name: "",
    industry: "",
    contract_start: "",
    contract_end: "",
    benefit: "",
    password: "",
    password_confirm: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ id: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  // 시작일 선택 시 자동으로 1년 후 종료일 계산
  function handleStartDate(value: string) {
    update("contract_start", value);
    if (value) {
      const start = new Date(value);
      start.setFullYear(start.getFullYear() + 1);
      const yyyy = start.getFullYear();
      const mm = String(start.getMonth() + 1).padStart(2, "0");
      const dd = String(start.getDate()).padStart(2, "0");
      update("contract_end", `${yyyy}-${mm}-${dd}`);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    // 필수값 검증
    if (!form.owner_name || !form.phone || !form.store_name || !form.benefit) {
      setError("필수 항목을 모두 입력해주세요");
      return;
    }
    if (!form.password || form.password.length < 4) {
      setError("비밀번호는 4자리 이상 입력해주세요");
      return;
    }
    if (form.password !== form.password_confirm) {
      setError("비밀번호 확인이 일치하지 않습니다");
      return;
    }

    setSubmitting(true);
    const { password_confirm, password, ...rest } = form;

    const { data, error: dbError } = await supabase
      .from("alliance_applications")
      .insert({ ...rest, edit_token: password })
      .select()
      .single();

    setSubmitting(false);

    if (dbError) {
      setError("신청 실패: " + dbError.message);
      return;
    }

    setResult({ id: data.id });
  }

  if (result) {
    return (
      <main className="min-h-screen bg-gray-50">
        <header className="px-5 py-4 sticky top-0 z-40 flex items-center gap-3" style={{ backgroundColor: "#11306E" }}>
          <Link href="/alliance" className="text-white text-xl">←</Link>
          <h1 className="text-white font-semibold">신청 완료</h1>
        </header>

        <section className="px-5 py-8 max-w-xl mx-auto">
          <div className="bg-white border border-gray-200 rounded-2xl p-6 text-center">
            <div className="text-4xl mb-3">✅</div>
            <h2 className="text-xl font-bold mb-2" style={{ color: "#11306E" }}>신청 접수 완료!</h2>
            <p className="text-sm text-gray-600 mb-6">
              심사 후 결과가 안내됩니다.<br />
              본인이 설정한 비밀번호로 신청 진행 상태를 조회할 수 있습니다.
            </p>

            <p className="text-xs text-gray-500 mb-6">
              ⚠️ 비밀번호를 잊으면 신청 조회·수정이 불가합니다. 안전한 곳에 보관해주세요.
            </p>

            <Link href="/alliance" className="inline-block px-6 py-3 rounded-lg text-white font-medium" style={{ backgroundColor: "#11306E" }}>
              메인으로 돌아가기
            </Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="px-5 py-4 sticky top-0 z-40 flex items-center gap-3" style={{ backgroundColor: "#11306E" }}>
        <Link href="/alliance" className="text-white text-xl">←</Link>
        <h1 className="text-white font-semibold">📝 협약 업체 신청</h1>
      </header>

      <section className="px-5 py-8 max-w-xl mx-auto">
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-2" style={{ color: "#11306E" }}>SJ Alliance 협약 신청</h2>
          <p className="text-sm text-gray-600">아래 양식을 작성하시면 학교 측 검토 후 협약이 진행됩니다.</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-2xl p-6 space-y-4">
          <Field label="업체명 *" required>
            <input type="text" value={form.store_name} onChange={(e) => update("store_name", e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:border-blue-500 text-sm"
              placeholder="예: 88연탄구이" />
          </Field>

          <Field label="사업주 이름 *" required>
            <input type="text" value={form.owner_name} onChange={(e) => update("owner_name", e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:border-blue-500 text-sm"
              placeholder="홍길동" />
          </Field>

          <Field label="연락처 *" required>
            <input type="tel" value={form.phone} onChange={(e) => update("phone", e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:border-blue-500 text-sm"
              placeholder="010-1234-5678" />
          </Field>

          <Field label="사업자 등록번호">
            <input type="text" value={form.business_number} onChange={(e) => update("business_number", e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:border-blue-500 text-sm"
              placeholder="000-00-00000" />
          </Field>

          <Field label="업종">
            <input type="text" value={form.industry} onChange={(e) => update("industry", e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:border-blue-500 text-sm"
              placeholder="예: 한식, 카페, 미용 등" />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="협약 시작일">
              <input type="date" value={form.contract_start} onChange={(e) => handleStartDate(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:border-blue-500 text-sm" />
            </Field>
            <Field label="협약 종료일 (자동 1년)">
              <input type="date" value={form.contract_end} onChange={(e) => update("contract_end", e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:border-blue-500 text-sm bg-gray-50" />
            </Field>
          </div>

          <Field label="협약 시 혜택 *" required>
            <textarea value={form.benefit} onChange={(e) => update("benefit", e.target.value)} rows={3}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:border-blue-500 text-sm resize-none"
              placeholder="예: 학생증 제시 시 10% 할인, 음료 1잔 무료 제공 등" />
          </Field>

          <div className="pt-3 border-t border-gray-200">
            <p className="text-xs text-gray-500 mb-3">신청 진행 상태 조회용 비밀번호를 설정해주세요</p>
            <div className="grid grid-cols-2 gap-3">
              <Field label="비밀번호 *" required>
                <input type="password" value={form.password} onChange={(e) => update("password", e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:border-blue-500 text-sm"
                  placeholder="4자리 이상" />
              </Field>
              <Field label="비밀번호 확인 *" required>
                <input type="password" value={form.password_confirm} onChange={(e) => update("password_confirm", e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:border-blue-500 text-sm"
                  placeholder="다시 입력" />
              </Field>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              ⚠️ {error}
            </div>
          )}

          <button type="submit" disabled={submitting}
            className="w-full py-3 rounded-lg font-bold text-white disabled:opacity-50"
            style={{ backgroundColor: "#11306E" }}>
            {submitting ? "제출 중..." : "신청 제출"}
          </button>

          <p className="text-xs text-gray-500 text-center">
            제출 후 본인 인증 코드가 발급됩니다.<br />
            이 코드로 신청 수정·취소가 가능합니다.
          </p>
        </form>
      </section>
    </main>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1.5" style={{ color: "#11306E" }}>
        {label}
      </label>
      {children}
    </div>
  );
}

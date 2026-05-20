"use client";

import Link from "next/link";

export default function PartnerHub() {
  const items = [
    {
      href: "/alliance/apply",
      icon: "📝",
      title: "협약 신청",
      desc: "서정대학교 협력 업체로 등록을 원하시면 여기서 신청해주세요",
      bg: "#E6007E",
    },
    {
      href: "/alliance/applications",
      icon: "📄",
      title: "신청 내역 확인",
      desc: "이전에 신청하신 진행 상태를 확인하실 수 있습니다",
      bg: "#FFD500",
    },
  ];

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="px-5 py-4 sticky top-0 z-40 flex items-center gap-3" style={{ backgroundColor: "#11306E" }}>
        <h1 className="text-white font-semibold text-base">🏪 서정대 협약 업체 안내</h1>
      </header>

      <section className="px-5 py-10 text-white" style={{ backgroundColor: "#213A8F" }}>
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold mb-2">서정대학교 협력 업체 사장님 전용 페이지</h2>
          <p className="text-sm leading-relaxed" style={{ color: "#B5D4F4" }}>
            서정대학교 학생·교직원에게 할인 혜택을 제공하는 협력 업체를 모집합니다.<br />
            아래에서 협약 신청과 진행 상태 확인이 가능합니다.
          </p>
        </div>
      </section>

      <section className="px-5 py-6 max-w-3xl mx-auto space-y-4">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="block bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md hover:border-gray-300 transition"
          >
            <div className="flex items-center gap-4">
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                style={{ backgroundColor: item.bg }}
              >
                {item.icon}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold leading-tight mb-1" style={{ color: "#11306E" }}>
                  {item.title}
                </h3>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </div>
              <span className="text-gray-400 text-xl">→</span>
            </div>
          </Link>
        ))}
      </section>

      <section className="px-5 py-6 max-w-3xl mx-auto">
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5">
          <h3 className="text-sm font-bold mb-2" style={{ color: "#11306E" }}>📌 협약 안내</h3>
          <ul className="text-xs text-gray-700 space-y-1.5 list-disc list-inside">
            <li>협약 기간: 신청일로부터 1년</li>
            <li>혜택 예시: 학생증·교직원증 제시 시 5~20% 할인, 사이드 메뉴 제공 등</li>
            <li>학교 공식 홈페이지·앱을 통한 무료 홍보 효과</li>
            <li>심사 후 승인까지 영업일 기준 3~5일 소요</li>
          </ul>
        </div>
      </section>

      <section className="px-5 py-6 max-w-3xl mx-auto">
        <div className="bg-white border border-gray-200 rounded-2xl p-5 text-center">
          <p className="text-xs text-gray-500 mb-2">문의처</p>
          <p className="text-sm font-medium" style={{ color: "#11306E" }}>
            서정대학교 학생처 / 총무처
          </p>
          <p className="text-xs text-gray-500 mt-1">seodh97@seojeong.ac.kr</p>
        </div>
      </section>

      <footer className="mt-8 py-4 px-5 text-center text-xs text-white" style={{ backgroundColor: "#11306E" }}>
        © 2026 서정대학교 · 협력 업체 안내
      </footer>
    </main>
  );
}

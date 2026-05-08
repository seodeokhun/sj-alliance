"use client";

import Link from "next/link";

export default function AllianceHub() {
  const items = [
    {
      href: "/alliance/list",
      icon: "🍽",
      title: "업체 리스트",
      desc: "협약된 모든 업체의 할인 정보 보기",
      bg: "#11306E",
    },
    {
      href: "/map",
      icon: "🗺",
      title: "전체 지도",
      desc: "지도에서 카테고리별로 핀 확인",
      bg: "#213A8F",
    },
    {
      href: "/alliance/apply",
      icon: "📝",
      title: "협약 신청",
      desc: "협력 업체 등록을 원하시면 여기서 신청",
      bg: "#E6007E",
    },
    {
      href: "/alliance/admin",
      icon: "📋",
      title: "신청 관리",
      desc: "신청자 본인 비밀번호 또는 관리자 로그인",
      bg: "#FFD500",
    },
  ];

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="px-5 py-4 sticky top-0 z-40 flex items-center gap-3" style={{ backgroundColor: "#11306E" }}>
        <Link href="/" className="text-white text-xl">←</Link>
        <h1 className="text-white font-semibold text-base">🍽 SJ Alliance</h1>
      </header>

      <section className="px-5 py-8 text-white" style={{ backgroundColor: "#213A8F" }}>
        <h2 className="text-2xl font-bold mb-2">서정대 협약 업체</h2>
        <p className="text-sm" style={{ color: "#B5D4F4" }}>
          학생증·교직원증 제시 시 할인 받는 곳을 한 번에 확인하세요
        </p>
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

      <footer className="mt-8 py-4 px-5 text-center text-xs text-white" style={{ backgroundColor: "#11306E" }}>
        © 2025 서정대학교 SJ Alliance
      </footer>
    </main>
  );
}

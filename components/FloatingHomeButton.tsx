"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function FloatingHomeButton() {
  const pathname = usePathname();

  // 메인 페이지에서는 표시하지 않음
  if (pathname === "/") return null;

  return (
    <Link
      href="/"
      className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-white text-2xl hover:scale-110 active:scale-95 transition-transform"
      style={{ backgroundColor: "#11306E", boxShadow: "0 4px 12px rgba(17, 48, 110, 0.4)" }}
      aria-label="Home"
      title="홈으로"
    >
      🏠
    </Link>
  );
}

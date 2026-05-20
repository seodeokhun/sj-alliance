"use client";

import Link from "next/link";
import { useLocale } from "@/lib/useLocale";
import LangSwitcher from "@/components/LangSwitcher";

export default function AllianceHub() {
  const { locale, setLocale, t } = useLocale();

  const items = [
    {
      href: "/alliance/list",
      icon: "🍽",
      title: t("storeListTitle"),
      desc: t("storeListDesc"),
      bg: "#11306E",
    },
    {
      href: "/map",
      icon: "🗺",
      title: t("fullMapTitle"),
      desc: t("fullMapDesc"),
      bg: "#213A8F",
    },
  ];

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="px-5 py-4 sticky top-0 z-40 flex items-center justify-between gap-3" style={{ backgroundColor: "#11306E" }}>
        <div className="flex items-center gap-3">
          <Link href="/" className="text-white text-xl">←</Link>
          <h1 className="text-white font-semibold text-base">🍽 SJ Alliance</h1>
        </div>
        <LangSwitcher locale={locale} onChange={setLocale} compact />
      </header>

      <section className="px-5 py-8 text-white" style={{ backgroundColor: "#213A8F" }}>
        <h2 className="text-2xl font-bold mb-2">{t("allianceHeroTitle")}</h2>
        <p className="text-sm" style={{ color: "#B5D4F4" }}>
          {t("allianceHeroDesc")}
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
        {t("footer")}
      </footer>
    </main>
  );
}

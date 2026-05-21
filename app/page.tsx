"use client";

import Link from "next/link";
import { useState } from "react";
import { useLocale } from "@/lib/useLocale";
import LangSwitcher from "@/components/LangSwitcher";

type SubItem = { href: string; labelKey: any; ready: boolean };
type Category = {
  key: string;
  icon: string;
  titleKey: any;
  descKey: any;
  bg: string;
  ready?: boolean;
  subs: SubItem[];
};

export default function Home() {
  const { locale, setLocale, t } = useLocale();
  const [openKey, setOpenKey] = useState<string | null>("alliance");

  const categories: Category[] = [
    {
      key: "alliance",
      icon: "🍽",
      titleKey: "catAlliance",
      descKey: "catAllianceDesc",
      bg: "#11306E",
      subs: [
        { href: "/alliance/list", labelKey: "subListStores", ready: true },
        { href: "/map", labelKey: "subAllMap", ready: true },
      ],
    },
    {
      key: "lost",
      icon: "📦",
      titleKey: "catLost",
      descKey: "catLostDesc",
      bg: "#213A8F",
      subs: [
        { href: "/lost/board", labelKey: "subLostBoard", ready: true },
        { href: "/lost/register", labelKey: "subLostRegister", ready: true },
      ],
    },
    {
      key: "share",
      icon: "🎁",
      titleKey: "catShare",
      descKey: "catShareDesc",
      bg: "#10B981",
      subs: [
        { href: "/share/board", labelKey: "subShareBoard", ready: true },
        { href: "/share/register", labelKey: "subShareRegister", ready: true },
      ],
    },
    {
      key: "shuttle",
      icon: "🚌",
      titleKey: "catShuttle",
      descKey: "catShuttleDesc",
      bg: "#FFD500",
      subs: [
        { href: "/shuttle", labelKey: "shuttleTitle", ready: true },
      ],
    },
    {
      key: "volunteer",
      icon: "🤝",
      titleKey: "catVolunteer",
      descKey: "catVolunteerDesc",
      bg: "#E6007E",
      ready: false,
      subs: [
        { href: "/volunteer/recruit", labelKey: "subListStores", ready: false },
        { href: "/volunteer/apply", labelKey: "subShareRegister", ready: false },
      ],
    },
  ];

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="px-5 py-4 flex items-center justify-between" style={{ backgroundColor: "#11306E" }}>
        <div className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/sju-logo.png" alt="SJU 서정대학교" className="h-12 w-auto rounded-md bg-white p-1" />
          <div>
            <h1 className="text-white font-semibold text-base leading-tight">{t("siteName")}</h1>
            <p className="text-xs leading-tight" style={{ color: "#FFD500" }}>Seojeong University</p>
          </div>
        </div>
        <LangSwitcher locale={locale} onChange={setLocale} />
      </header>

      <section className="px-5 py-8 text-white" style={{ backgroundColor: "#213A8F" }}>
        <h2 className="text-xl font-bold mb-1">{t("mainHeroTitle")}</h2>
        <p className="text-sm" style={{ color: "#B5D4F4" }}>{t("mainHeroDesc")}</p>
      </section>

      <section className="px-5 py-6 max-w-3xl mx-auto space-y-3">
        {categories.map((c) => {
          const isOpen = openKey === c.key;
          return (
            <div key={c.key} className="bg-white border border-gray-200 rounded-2xl overflow-hidden transition">
              <button
                onClick={() => setOpenKey(isOpen ? null : c.key)}
                className="w-full px-5 py-4 flex items-center gap-4 text-left hover:bg-gray-50 transition"
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl flex-shrink-0" style={{ backgroundColor: c.bg }}>
                  {c.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-bold leading-tight" style={{ color: "#11306E" }}>
                    {t(c.titleKey)}
                    {c.ready === false && (
                      <span className="ml-2 text-[11px] font-medium text-gray-400 align-middle">({t("inDevelopment")})</span>
                    )}
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">{t(c.descKey)}</p>
                </div>
                <span className="text-gray-400 text-lg">{isOpen ? "▲" : "▼"}</span>
              </button>

              {isOpen && (
                <div className="border-t border-gray-100 bg-gray-50 px-3 py-2">
                  {c.subs.map((sub) => (
                    sub.ready ? (
                      <Link
                        key={sub.href}
                        href={sub.href}
                        className="block px-3 py-3 rounded-lg hover:bg-white transition flex items-center justify-between"
                      >
                        <span className="text-sm font-medium" style={{ color: "#11306E" }}>
                          {t(sub.labelKey)}
                        </span>
                        <span className="text-gray-400">→</span>
                      </Link>
                    ) : (
                      <div key={sub.href} className="px-3 py-3 flex items-center justify-between opacity-60">
                        <span className="text-sm text-gray-500">{t(sub.labelKey)}</span>
                        <span className="text-xs text-gray-400">🚧 {t("inDevelopment")}</span>
                      </div>
                    )
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </section>

      <footer className="mt-8 py-4 px-5 text-center text-xs text-white" style={{ backgroundColor: "#11306E" }}>
        {t("footer")}
      </footer>
    </main>
  );
}

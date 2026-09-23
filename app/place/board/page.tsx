"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useLocale } from "@/lib/useLocale";
import LangSwitcher from "@/components/LangSwitcher";
import { getTranslatedField } from "@/lib/translate";

type PlaceItem = {
  id: string;
  name: string;
  category: string | null;
  tags: string[] | null;
  address: string | null;
  reason: string;
  images: string[];
  nickname: string;
  original_locale: string;
  translations: Record<string, Record<string, string>> | null;
  ai_summary: string | null;
  created_at: string;
};

const CATEGORIES = [
  { key: "food",     label: { ko: "🍽️ 음식점", en: "🍽️ Restaurant",    vi: "🍽️ Nhà hàng",        uz: "🍽️ Restoran"     } },
  { key: "cafe",     label: { ko: "☕ 카페",    en: "☕ Café",           vi: "☕ Cà phê",           uz: "☕ Kafe"          } },
  { key: "nature",   label: { ko: "🌿 자연·산책",en: "🌿 Nature & Walk", vi: "🌿 Thiên nhiên & Dạo",uz: "🌿 Tabiat & Sayr" } },
  { key: "study",    label: { ko: "📚 공부",    en: "📚 Study",          vi: "📚 Học tập",           uz: "📚 Oʻquv"        } },
  { key: "fun",      label: { ko: "🎉 오락",    en: "🎉 Fun",            vi: "🎉 Giải trí",          uz: "🎉 Koʻngil ochar"} },
  { key: "shopping", label: { ko: "🛍️ 쇼핑",   en: "🛍️ Shopping",      vi: "🛍️ Mua sắm",          uz: "🛍️ Xarid"       } },
  { key: "life",     label: { ko: "🏥 생활편의", en: "🏥 Daily Life",    vi: "🏥 Tiện ích",          uz: "🏥 Kundalik"     } },
];

const TAGS = [
  { key: "no_pork",      label: { ko: "🐷 돼지고기 없음",  en: "🐷 No Pork",       vi: "🐷 Không thịt lợn", uz: "🐷 Cho'chqa yo'q"   } },
  { key: "halal",        label: { ko: "🕌 할랄",          en: "🕌 Halal",          vi: "🕌 Halal",          uz: "🕌 Halol"           } },
  { key: "vegetarian",   label: { ko: "🌱 채식",          en: "🌱 Vegetarian",     vi: "🌱 Chay",           uz: "🌱 Vegetarian"      } },
  { key: "no_seafood",   label: { ko: "🦐 해산물 없음",    en: "🦐 No Seafood",    vi: "🦐 Không hải sản", uz: "🦐 Dengiz yo'q"     } },
  { key: "gluten_free",  label: { ko: "🌾 글루텐 프리",    en: "🌾 Gluten-Free",   vi: "🌾 Không gluten",  uz: "🌾 Glutensiz"       } },
  { key: "foreign_lang", label: { ko: "🗣️ 외국어 가능",   en: "🗣️ Foreign Lang",  vi: "🗣️ Ngoại ngữ OK",  uz: "🗣️ Xorijiy til"    } },
  { key: "quiet",        label: { ko: "🔇 조용함",         en: "🔇 Quiet",         vi: "🔇 Yên tĩnh",      uz: "🔇 Sokin"           } },
  { key: "parking",      label: { ko: "🅿️ 주차 가능",     en: "🅿️ Parking",       vi: "🅿️ Đậu xe",        uz: "🅿️ Parkovka"       } },
  { key: "budget",       label: { ko: "💰 가성비",         en: "💰 Budget",        vi: "💰 Tiết kiệm",     uz: "💰 Tejamkor"        } },
];

export default function PlaceBoard() {
  const router = useRouter();
  const { locale, setLocale, t } = useLocale();

  const [items, setItems] = useState<PlaceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [catFilter, setCatFilter] = useState("");
  const [tagFilter, setTagFilter] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function load() {
      setLoading(true);
      let query = supabase
        .from("places")
        .select("*")
        .order("created_at", { ascending: false });

      if (catFilter) query = query.eq("category", catFilter);
      if (tagFilter) query = query.contains("tags", [tagFilter]);

      const { data } = await query;
      setItems(data || []);
      setLoading(false);
    }
    load();
  }, [catFilter, tagFilter]);

  const filtered = items.filter((item) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    const name = getTranslatedField(item.name, item.translations, item.original_locale, locale, "name").toLowerCase();
    const addr = (item.address || "").toLowerCase();
    return name.includes(q) || addr.includes(q);
  });

  const catLabel = (key: string) => {
    const c = CATEGORIES.find((x) => x.key === key);
    return c ? (c.label as Record<string, string>)[locale] ?? c.label.ko : key;
  };

  const tagLabelShort = (key: string) => {
    const tg = TAGS.find((x) => x.key === key);
    if (!tg) return key;
    const full = (tg.label as Record<string, string>)[locale] ?? tg.label.ko;
    return full;
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="px-5 py-4 sticky top-0 z-40 flex items-center justify-between gap-3" style={{ backgroundColor: "#7C3AED" }}>
        <div className="flex items-center gap-3">
          <Link href="/" className="text-white text-xl">←</Link>
          <h1 className="text-white font-semibold">🗺️ {t("placeHeroTitle")}</h1>
        </div>
        <LangSwitcher locale={locale} onChange={setLocale} compact />
      </header>

      {/* Banner */}
      <div className="bg-purple-50 border-b border-purple-100 px-5 py-3">
        <p className="text-xs text-purple-800 max-w-3xl mx-auto">{t("placeBannerShort")}</p>
      </div>

      {/* Search */}
      <div className="px-5 pt-4 max-w-3xl mx-auto">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t("search") + "..."}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm outline-none focus:border-purple-500"
        />
      </div>

      {/* Category filter */}
      <div className="px-5 pt-3 max-w-3xl mx-auto overflow-x-auto">
        <div className="flex gap-2 pb-1 min-w-max">
          <button
            onClick={() => setCatFilter("")}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${catFilter === "" ? "text-white" : "bg-gray-100 text-gray-700"}`}
            style={catFilter === "" ? { backgroundColor: "#7C3AED" } : {}}
          >
            {t("placeFilterAll")}
          </button>
          {CATEGORIES.map((c) => (
            <button
              key={c.key}
              onClick={() => setCatFilter(catFilter === c.key ? "" : c.key)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition whitespace-nowrap ${catFilter === c.key ? "text-white" : "bg-gray-100 text-gray-700"}`}
              style={catFilter === c.key ? { backgroundColor: "#7C3AED" } : {}}
            >
              {(c.label as Record<string, string>)[locale] ?? c.label.ko}
            </button>
          ))}
        </div>
      </div>

      {/* Tag filter */}
      <div className="px-5 pt-2 pb-3 max-w-3xl mx-auto overflow-x-auto">
        <div className="flex gap-2 pb-1 min-w-max">
          {TAGS.map((tg) => (
            <button
              key={tg.key}
              onClick={() => setTagFilter(tagFilter === tg.key ? "" : tg.key)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition whitespace-nowrap border ${tagFilter === tg.key ? "border-purple-500 text-purple-700 bg-purple-50" : "border-gray-200 text-gray-600 bg-white"}`}
            >
              {(tg.label as Record<string, string>)[locale] ?? tg.label.ko}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <section className="px-5 pb-8 max-w-3xl mx-auto">
        {loading ? (
          <p className="text-center text-gray-500 text-sm py-10">{t("loading")}</p>
        ) : filtered.length === 0 ? (
          <div className="text-center py-14">
            <p className="text-4xl mb-3">🗺️</p>
            <p className="text-gray-500 text-sm">{t("placeNoItems")}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filtered.map((item) => {
              const displayName = getTranslatedField(item.name, item.translations, item.original_locale, locale, "name");
              const displayAddr = item.address
                ? getTranslatedField(item.address, item.translations, item.original_locale, locale, "address")
                : null;
              return (
                <Link
                  key={item.id}
                  href={`/place/${item.id}`}
                  className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-md transition"
                >
                  {item.images && item.images.length > 0 && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.images[0]} alt="" className="w-full h-36 object-cover" />
                  )}
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="font-bold text-sm text-gray-900 leading-tight">{displayName}</h3>
                      {item.category && (
                        <span className="text-xs px-2 py-0.5 rounded-full text-white flex-shrink-0" style={{ backgroundColor: "#7C3AED" }}>
                          {catLabel(item.category)}
                        </span>
                      )}
                    </div>
                    {displayAddr && (
                      <p className="text-xs text-gray-500 mb-2">📍 {displayAddr}</p>
                    )}
                    {item.tags && item.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-2">
                        {item.tags.slice(0, 4).map((tag) => (
                          <span key={tag} className="text-xs px-1.5 py-0.5 bg-purple-50 text-purple-700 rounded-full border border-purple-100">
                            {tagLabelShort(tag)}
                          </span>
                        ))}
                      </div>
                    )}
                    {item.ai_summary && (
                      <p className="text-xs text-purple-700 bg-purple-50 rounded-lg px-2 py-1.5 line-clamp-2">
                        ✨ {item.ai_summary}
                      </p>
                    )}
                    <p className="text-xs text-gray-400 mt-2">by {item.nickname}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      {/* FAB */}
      <div className="fixed bottom-6 right-5 z-50">
        <button
          onClick={() => router.push("/place/register")}
          className="px-5 py-3 rounded-full text-white font-bold shadow-lg text-sm"
          style={{ backgroundColor: "#7C3AED" }}
        >
          {t("placeRecommendBtn")}
        </button>
      </div>
    </main>
  );
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
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
  summary_generated_at: string | null;
  created_at: string;
};

type Review = {
  id: string;
  place_id: string;
  reason: string;
  nickname: string;
  original_locale: string;
  translations: Record<string, Record<string, string>> | null;
  created_at: string;
};

const CATEGORY_LABELS: Record<string, Record<string, string>> = {
  food:     { ko: "🍽️ 음식점", en: "🍽️ Restaurant",   vi: "🍽️ Nhà hàng",       uz: "🍽️ Restoran"    },
  cafe:     { ko: "☕ 카페",   en: "☕ Café",          vi: "☕ Cà phê",          uz: "☕ Kafe"         },
  nature:   { ko: "🌿 자연·산책",en: "🌿 Nature & Walk",vi: "🌿 Thiên nhiên",    uz: "🌿 Tabiat"       },
  study:    { ko: "📚 공부",   en: "📚 Study",         vi: "📚 Học tập",         uz: "📚 Oʻquv"        },
  fun:      { ko: "🎉 오락",   en: "🎉 Fun",           vi: "🎉 Giải trí",        uz: "🎉 Koʻngil ochar"},
  shopping: { ko: "🛍️ 쇼핑",  en: "🛍️ Shopping",     vi: "🛍️ Mua sắm",        uz: "🛍️ Xarid"       },
  life:     { ko: "🏥 생활편의",en: "🏥 Daily Life",   vi: "🏥 Tiện ích",       uz: "🏥 Kundalik"    },
};

const TAG_LABELS: Record<string, Record<string, string>> = {
  no_pork:      { ko: "🐷 돼지고기 없음",  en: "🐷 No Pork",       vi: "🐷 Không thịt lợn", uz: "🐷 Cho'chqa yo'q"  },
  halal:        { ko: "🕌 할랄",          en: "🕌 Halal",          vi: "🕌 Halal",          uz: "🕌 Halol"          },
  vegetarian:   { ko: "🌱 채식",          en: "🌱 Vegetarian",     vi: "🌱 Chay",           uz: "🌱 Vegetarian"     },
  no_seafood:   { ko: "🦐 해산물 없음",    en: "🦐 No Seafood",    vi: "🦐 Không hải sản", uz: "🦐 Dengiz yo'q"    },
  gluten_free:  { ko: "🌾 글루텐 프리",    en: "🌾 Gluten-Free",   vi: "🌾 Không gluten",  uz: "🌾 Glutensiz"      },
  foreign_lang: { ko: "🗣️ 외국어 가능",   en: "🗣️ Foreign Lang",  vi: "🗣️ Ngoại ngữ OK",  uz: "🗣️ Xorijiy til"   },
  quiet:        { ko: "🔇 조용함",         en: "🔇 Quiet",         vi: "🔇 Yên tĩnh",      uz: "🔇 Sokin"          },
  parking:      { ko: "🅿️ 주차 가능",     en: "🅿️ Parking",       vi: "🅿️ Đậu xe",        uz: "🅿️ Parkovka"      },
  budget:       { ko: "💰 가성비",         en: "💰 Budget",        vi: "💰 Tiết kiệm",     uz: "💰 Tejamkor"       },
};

export default function PlaceDetail() {
  const params = useParams();
  const id = params?.id as string;
  const { locale, setLocale, t } = useLocale();

  const [place, setPlace] = useState<PlaceItem | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [imgIdx, setImgIdx] = useState(0);

  // Add review state
  const [newReason, setNewReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [reviewError, setReviewError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    async function load() {
      setLoading(true);
      const [{ data: placeData }, { data: reviewData }] = await Promise.all([
        supabase.from("places").select("*").eq("id", id).single(),
        supabase.from("place_reviews").select("*").eq("place_id", id).order("created_at", { ascending: false }),
      ]);
      setPlace(placeData || null);
      setReviews(reviewData || []);
      setLoading(false);
    }
    load();
  }, [id]);

  async function handleReviewSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!newReason.trim() || !place) return;
    setReviewError(null);
    setSubmitting(true);

    // AI moderate
    try {
      const modRes = await fetch("/api/moderate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ text: newReason }),
      });
      const modData = await modRes.json();
      if (!modData.safe) {
        setReviewError(t("placeContentBlocked"));
        setSubmitting(false);
        return;
      }
    } catch {
      // fail open
    }

    // Translate reason
    let translations: Record<string, Record<string, string>> = {};
    try {
      const { translateFields } = await import("@/lib/translate");
      translations = await translateFields({ reason: newReason.trim() }, locale);
    } catch {
      // fail silently
    }

    const nickname = "익명" + Math.floor(1000 + Math.random() * 9000);
    const { error: dbErr } = await supabase.from("place_reviews").insert({
      place_id: id,
      reason: newReason.trim(),
      nickname,
      original_locale: locale,
      translations,
    });

    if (dbErr) {
      setReviewError("저장 실패: " + dbErr.message);
      setSubmitting(false);
      return;
    }

    // Reload reviews
    const { data: refreshed } = await supabase
      .from("place_reviews")
      .select("*")
      .eq("place_id", id)
      .order("created_at", { ascending: false });
    const newReviews = refreshed || [];
    setReviews(newReviews);
    setNewReason("");
    setSubmitting(false);

    // Trigger AI summary if 5+ reasons (count includes initial place reason)
    const allReasons = [
      place.reason,
      ...newReviews.map((r) => r.reason),
    ];
    if (allReasons.length >= 5 && !place.ai_summary) {
      try {
        const sumRes = await fetch("/api/place-summary", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ placeName: place.name, reasons: allReasons }),
        });
        const sumData = await sumRes.json();
        if (sumData.ok && sumData.summary) {
          await supabase.from("places").update({
            ai_summary: sumData.summary,
            summary_generated_at: new Date().toISOString(),
          }).eq("id", id);
          setPlace((prev) => prev ? { ...prev, ai_summary: sumData.summary } : prev);
        }
      } catch {
        // fail silently
      }
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">{t("loading")}</p>
      </main>
    );
  }

  if (!place) {
    return (
      <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4">
        <p className="text-gray-500">{t("notFound")}</p>
        <Link href="/place/board" className="text-purple-600 underline text-sm">{t("placeBackToBoard")}</Link>
      </main>
    );
  }

  const displayName = getTranslatedField(place.name, place.translations, place.original_locale, locale, "name");
  const displayAddr = place.address
    ? getTranslatedField(place.address, place.translations, place.original_locale, locale, "address")
    : null;
  const displayReason = getTranslatedField(place.reason, place.translations, place.original_locale, locale, "reason");

  const catLabel = place.category ? (CATEGORY_LABELS[place.category]?.[locale] ?? place.category) : null;

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="px-5 py-4 sticky top-0 z-40 flex items-center justify-between gap-3" style={{ backgroundColor: "#7C3AED" }}>
        <div className="flex items-center gap-3">
          <Link href="/place/board" className="text-white text-xl">←</Link>
          <h1 className="text-white font-semibold truncate">{displayName}</h1>
        </div>
        <LangSwitcher locale={locale} onChange={setLocale} compact />
      </header>

      <div className="max-w-2xl mx-auto px-5 py-6 space-y-5">

        {/* Image gallery */}
        {place.images && place.images.length > 0 && (
          <div className="relative rounded-2xl overflow-hidden bg-gray-200">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={place.images[imgIdx]}
              alt=""
              className="w-full h-52 object-cover"
            />
            {place.images.length > 1 && (
              <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5">
                {place.images.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setImgIdx(i)}
                    className={`w-2 h-2 rounded-full transition ${i === imgIdx ? "bg-white" : "bg-white/50"}`}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Place info card */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5">
          <div className="flex items-start gap-3 mb-3">
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-900">{displayName}</h2>
              {catLabel && (
                <span className="inline-block mt-1 text-xs px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: "#7C3AED" }}>
                  {catLabel}
                </span>
              )}
            </div>
          </div>

          {displayAddr && (
            <div className="flex items-start gap-2 mb-3 text-sm text-gray-600">
              <span>📍</span>
              <span>{displayAddr}</span>
            </div>
          )}

          {/* Tags */}
          {place.tags && place.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {place.tags.map((tag) => (
                <span key={tag} className="text-xs px-2 py-1 bg-purple-50 text-purple-700 rounded-full border border-purple-100">
                  {TAG_LABELS[tag]?.[locale] ?? tag}
                </span>
              ))}
            </div>
          )}

          {/* AI Summary */}
          {place.ai_summary ? (
            <div className="bg-purple-50 border border-purple-100 rounded-xl p-4 mb-4">
              <p className="text-xs font-bold text-purple-700 mb-1">{t("placeAiSummary")}</p>
              <p className="text-sm text-purple-900 leading-relaxed">{place.ai_summary}</p>
            </div>
          ) : (
            <div className="bg-gray-50 border border-gray-100 rounded-xl p-3 mb-4">
              <p className="text-xs text-gray-500">{t("placeAiSummaryDesc")}</p>
            </div>
          )}

          {/* Original reason */}
          <div>
            <p className="text-xs font-bold text-gray-700 mb-1">{t("placeReasonLabel")}</p>
            <p className="text-sm text-gray-700 leading-relaxed">{displayReason}</p>
            <p className="text-xs text-gray-400 mt-2">by {place.nickname} · {new Date(place.created_at).toLocaleDateString()}</p>
          </div>
        </div>

        {/* Additional reviews */}
        {reviews.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-2xl p-5">
            <h3 className="text-sm font-bold text-gray-800 mb-3">
              💬 {locale === "ko" ? "다른 추천 이유" : locale === "en" ? "More reasons" : locale === "vi" ? "Lý do khác" : "Boshqa sabablar"}
              <span className="ml-1 text-purple-600">({reviews.length})</span>
            </h3>
            <div className="space-y-3">
              {reviews.map((r) => {
                const displayR = getTranslatedField(r.reason, r.translations, r.original_locale, locale, "reason");
                return (
                  <div key={r.id} className="border-l-2 border-purple-200 pl-3">
                    <p className="text-sm text-gray-700 leading-relaxed">{displayR}</p>
                    <p className="text-xs text-gray-400 mt-1">by {r.nickname} · {new Date(r.created_at).toLocaleDateString()}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Add review form */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5">
          <h3 className="text-sm font-bold text-gray-800 mb-3">
            ✍️ {locale === "ko" ? "추천 이유 추가하기" : locale === "en" ? "Add your reason" : locale === "vi" ? "Thêm lý do của bạn" : "Sabab qoʻshish"}
          </h3>
          <form onSubmit={handleReviewSubmit} className="space-y-3">
            <textarea
              value={newReason}
              onChange={(e) => setNewReason(e.target.value.slice(0, 500))}
              rows={3}
              placeholder={t("placeReasonPlaceholder")}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg outline-none focus:border-purple-500 text-sm resize-none"
            />
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">{newReason.length}/500</span>
              <span className="text-xs text-gray-400">{t("anonymousNotice").split("\n")[0]}</span>
            </div>

            <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-2.5">
              <p className="text-xs text-emerald-800">{t("autoTranslateNotice")}</p>
            </div>

            {reviewError && (
              <div className="bg-red-50 border-l-4 border-red-400 p-3 rounded text-xs text-red-700">
                {reviewError}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting || !newReason.trim()}
              className="w-full py-2.5 rounded-lg font-bold text-white disabled:opacity-50 text-sm"
              style={{ backgroundColor: "#7C3AED" }}
            >
              {submitting ? t("submitting") : t("submit")}
            </button>
          </form>
        </div>

      </div>
    </main>
  );
}

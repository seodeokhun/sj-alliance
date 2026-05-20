/**
 * 자동 번역 헬퍼 (MyMemory API)
 * - 무료, 키 불필요
 * - 일일 약 50,000자 제한 (이메일 등록 시 더 늘릴 수 있음)
 */

import type { Locale } from "@/data/i18n";

const ALL_LOCALES: Locale[] = ["ko", "en", "vi", "uz"];

/**
 * 단일 텍스트를 한 언어로 번역
 */
export async function translateText(
  text: string,
  from: Locale,
  to: Locale
): Promise<string> {
  if (!text || !text.trim()) return text;
  if (from === to) return text;

  try {
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
      text
    )}&langpair=${from}|${to}`;
    const res = await fetch(url);
    if (!res.ok) return text;
    const data = await res.json();
    const translated = data?.responseData?.translatedText;
    if (!translated) return text;
    // MyMemory가 에러 메시지를 돌려주는 경우 필터
    if (typeof translated !== "string") return text;
    if (translated.toUpperCase().includes("MYMEMORY WARNING")) return text;
    if (translated.toUpperCase().includes("INVALID")) return text;
    return translated;
  } catch {
    return text;
  }
}

export type TranslatableFields = Record<string, string>;
export type Translations = Record<string, TranslatableFields>; // { en: { title, location, ... }, ... }

/**
 * 여러 필드를 모든 다른 언어로 번역
 * @param fields { title: "...", location: "...", description: "..." }
 * @param sourceLocale 원본 언어
 * @returns { en: { title, location, description }, vi: {...}, uz: {...} }
 */
export async function translateFields(
  fields: TranslatableFields,
  sourceLocale: Locale
): Promise<Translations> {
  const targets = ALL_LOCALES.filter((l) => l !== sourceLocale);
  const result: Translations = {};

  // 각 언어에 대해 순차적으로 번역 (병렬은 MyMemory 레이트 리밋 걸릴 수 있음)
  for (const target of targets) {
    const translated: TranslatableFields = {};
    for (const [key, value] of Object.entries(fields)) {
      translated[key] = await translateText(value, sourceLocale, target);
    }
    result[target] = translated;
  }

  return result;
}

/**
 * 현재 사용자 언어에 맞는 텍스트 가져오기
 * @param original 원본 텍스트
 * @param translations 다른 언어 번역 객체 (DB의 translations 컬럼)
 * @param originalLocale 원본 언어
 * @param currentLocale 현재 사용자 언어
 * @param fieldKey 필드 키 (예: "title", "description")
 */
export function getTranslatedField(
  original: string | null | undefined,
  translations: Translations | null | undefined,
  originalLocale: Locale,
  currentLocale: Locale,
  fieldKey: string
): string {
  if (!original) return "";
  if (currentLocale === originalLocale) return original;
  const t = translations?.[currentLocale]?.[fieldKey];
  return t || original; // 번역 없으면 원본
}

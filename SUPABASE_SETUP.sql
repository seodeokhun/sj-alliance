-- ============================================================
--  장소 추천 커뮤니티 - Supabase 테이블 & 스토리지 설정
--  Seojeong University SJ Alliance — Place Recommendation
-- ============================================================

-- 1. places 테이블 (장소 원본 + 최초 추천자 정보)
CREATE TABLE IF NOT EXISTS places (
  id                    UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name                  TEXT NOT NULL,
  category              TEXT,                   -- food|cafe|nature|study|fun|shopping|life
  tags                  TEXT[],                 -- no_pork|halal|vegetarian|no_seafood|...
  address               TEXT,
  reason                TEXT NOT NULL,          -- 최초 추천 이유
  images                TEXT[],
  nickname              TEXT NOT NULL,
  original_locale       TEXT DEFAULT 'ko',
  translations          JSONB,                  -- {field: {locale: translated_text}}
  ai_summary            TEXT,                   -- AI 자동 요약 (5개 이상 쌓이면 생성)
  summary_generated_at  TIMESTAMPTZ,
  created_at            TIMESTAMPTZ DEFAULT NOW()
);

-- 2. place_reviews 테이블 (추가 추천 이유)
CREATE TABLE IF NOT EXISTS place_reviews (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  place_id        UUID NOT NULL REFERENCES places(id) ON DELETE CASCADE,
  reason          TEXT NOT NULL,
  nickname        TEXT NOT NULL,
  original_locale TEXT DEFAULT 'ko',
  translations    JSONB,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- 3. 인덱스
CREATE INDEX IF NOT EXISTS idx_places_category    ON places(category);
CREATE INDEX IF NOT EXISTS idx_places_created_at  ON places(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reviews_place_id   ON place_reviews(place_id);

-- 4. RLS (Row Level Security) — 모두 읽기/쓰기 가능 (익명 커뮤니티)
ALTER TABLE places       ENABLE ROW LEVEL SECURITY;
ALTER TABLE place_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read places"        ON places        FOR SELECT USING (true);
CREATE POLICY "Anyone can insert places"      ON places        FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update places"      ON places        FOR UPDATE USING (true);  -- AI summary update
CREATE POLICY "Anyone can read reviews"       ON place_reviews FOR SELECT USING (true);
CREATE POLICY "Anyone can insert reviews"     ON place_reviews FOR INSERT WITH CHECK (true);

-- ============================================================
--  5. Storage bucket: place-images
--     Supabase Dashboard > Storage > New bucket
--     Name: place-images
--     Public: ✅ ON
-- ============================================================
-- (버킷은 Dashboard UI에서 직접 생성해야 합니다)
-- 또는 아래 SQL로 생성 (supabase_storage 권한 필요):
-- INSERT INTO storage.buckets (id, name, public) VALUES ('place-images', 'place-images', true);
-- CREATE POLICY "Public read place images"   ON storage.objects FOR SELECT USING (bucket_id = 'place-images');
-- CREATE POLICY "Authenticated upload place" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'place-images');

-- ============================================================
--  완료! 다음 단계:
--  1. Vercel 환경변수에 ANTHROPIC_API_KEY 추가
--  2. Supabase Storage에 place-images 버킷 생성 (public ON)
--  3. 위 SQL을 Supabase SQL Editor에서 실행
-- ============================================================

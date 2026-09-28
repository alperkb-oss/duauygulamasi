/*
# Islamic Prayer Tracking Schema (Single-tenant, no auth)

1. New Tables
- `prayers` (master data): ID, Name, Category, TurkishTransliteration, Meaning, PriorityScore
- `reading_plans` (user plans): ID, PlanName, IsActive
- `plan_details` (junction): ID, PlanID, PrayerID, TargetDays, TargetCountMorning, TargetCountEvening, SequenceOrder
- `user_daily_progress`: ID, PlanDetailID, CurrentDayNumber, MorningCountDone, EveningCountDone, IsMorningCompleted, IsEveningCompleted, Date
2. Security
- RLS enabled on all tables.
- All tables allow anon + authenticated CRUD (single-tenant, no sign-in).
3. Dummy Data
- Sample prayers (Ya Fettah, Ayetel Kürsi, etc.)
- Sample plan "Rızık ve Bereket Planı" with 2 plan details
- Initial progress rows
*/

-- Master data: prayers
CREATE TABLE IF NOT EXISTS prayers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL DEFAULT 'Genel',
  turkish_transliteration text,
  meaning text,
  priority_score integer NOT NULL DEFAULT 999,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE prayers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_prayers" ON prayers;
CREATE POLICY "anon_select_prayers" ON prayers FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_prayers" ON prayers;
CREATE POLICY "anon_insert_prayers" ON prayers FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_prayers" ON prayers;
CREATE POLICY "anon_update_prayers" ON prayers FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_prayers" ON prayers;
CREATE POLICY "anon_delete_prayers" ON prayers FOR DELETE
  TO anon, authenticated USING (true);

-- User plans
CREATE TABLE IF NOT EXISTS reading_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_name text NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE reading_plans ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_reading_plans" ON reading_plans;
CREATE POLICY "anon_select_reading_plans" ON reading_plans FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_reading_plans" ON reading_plans;
CREATE POLICY "anon_insert_reading_plans" ON reading_plans FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_reading_plans" ON reading_plans;
CREATE POLICY "anon_update_reading_plans" ON reading_plans FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_reading_plans" ON reading_plans;
CREATE POLICY "anon_delete_reading_plans" ON reading_plans FOR DELETE
  TO anon, authenticated USING (true);

-- Plan details (junction)
CREATE TABLE IF NOT EXISTS plan_details (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id uuid NOT NULL REFERENCES reading_plans(id) ON DELETE CASCADE,
  prayer_id uuid NOT NULL REFERENCES prayers(id) ON DELETE CASCADE,
  target_days integer NOT NULL DEFAULT 1,
  target_count_morning integer NOT NULL DEFAULT 1,
  target_count_evening integer NOT NULL DEFAULT 1,
  sequence_order integer NOT NULL DEFAULT 1,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE plan_details ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_plan_details" ON plan_details;
CREATE POLICY "anon_select_plan_details" ON plan_details FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_plan_details" ON plan_details;
CREATE POLICY "anon_insert_plan_details" ON plan_details FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_plan_details" ON plan_details;
CREATE POLICY "anon_update_plan_details" ON plan_details FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_plan_details" ON plan_details;
CREATE POLICY "anon_delete_plan_details" ON plan_details FOR DELETE
  TO anon, authenticated USING (true);

-- User daily progress
CREATE TABLE IF NOT EXISTS user_daily_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_detail_id uuid NOT NULL REFERENCES plan_details(id) ON DELETE CASCADE,
  current_day_number integer NOT NULL DEFAULT 1,
  morning_count_done integer NOT NULL DEFAULT 0,
  evening_count_done integer NOT NULL DEFAULT 0,
  is_morning_completed boolean NOT NULL DEFAULT false,
  is_evening_completed boolean NOT NULL DEFAULT false,
  date date NOT NULL DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE user_daily_progress ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_user_daily_progress" ON user_daily_progress;
CREATE POLICY "anon_select_user_daily_progress" ON user_daily_progress FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_user_daily_progress" ON user_daily_progress;
CREATE POLICY "anon_insert_user_daily_progress" ON user_daily_progress FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_user_daily_progress" ON user_daily_progress;
CREATE POLICY "anon_update_user_daily_progress" ON user_daily_progress FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_user_daily_progress" ON user_daily_progress;
CREATE POLICY "anon_delete_user_daily_progress" ON user_daily_progress FOR DELETE
  TO anon, authenticated USING (true);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_plan_details_plan_id ON plan_details(plan_id);
CREATE INDEX IF NOT EXISTS idx_plan_details_prayer_id ON plan_details(prayer_id);
CREATE INDEX IF NOT EXISTS idx_user_daily_progress_plan_detail_id ON user_daily_progress(plan_detail_id);
CREATE INDEX IF NOT EXISTS idx_user_daily_progress_date ON user_daily_progress(date);

-- Dummy data: prayers
DO $$
BEGIN
  INSERT INTO prayers (name, category, turkish_transliteration, meaning, priority_score) VALUES
    ('Ya Fettah', 'Rızık', 'Ey açan / kapıları açan', 'Her türlü kapıyı açan, rızık kapılarını açan Allah', 1),
    ('Ayetel Kürsi', 'Korunma', 'Kürsi ayeti', 'Allah''ın kudsiyetini ve yüceliğini bildiren en büyük ayet', 2),
    ('Ya Rezzak', 'Rızık', 'Ey rızık veren', 'Bütün mahlukatı rızıklandıran Allah', 3),
    ('Ya Şafi', 'Şifa', 'Ey şifa veren', 'Hastalara şifa veren Allah', 4),
    ('Ya Selam', 'Huzur', 'Ey esenlik veren', 'Her türlü tehlikeden koruyan, esenlik veren Allah', 5),
    ('Ya Vehhab', 'Rızık', 'Ey çok bağışlayan', 'Karşılıksız veren, bol ihsan eden Allah', 6),
    ('Ya Latif', 'Huzur', 'Ey lütufkâr', 'Kullarına lütfeden, ince ve nazik davranan Allah', 7),
    ('Ya Hafız', 'Korunma', 'Ey koruyan', 'Her şeyi koruyan ve muhafaza eden Allah', 8)
  ON CONFLICT DO NOTHING;
END $$;

-- Dummy data: sample plan
DO $$
DECLARE
  v_plan_id uuid;
  v_prayer_fettah uuid;
  v_prayer_ayetel uuid;
BEGIN
  SELECT id INTO v_prayer_fettah FROM prayers WHERE name = 'Ya Fettah' LIMIT 1;
  SELECT id INTO v_prayer_ayetel FROM prayers WHERE name = 'Ayetel Kürsi' LIMIT 1;

  IF v_prayer_fettah IS NOT NULL AND v_prayer_ayetel IS NOT NULL THEN
    IF NOT EXISTS (SELECT 1 FROM reading_plans WHERE plan_name = 'Rızık ve Bereket Planı') THEN
      INSERT INTO reading_plans (plan_name, is_active)
      VALUES ('Rızık ve Bereket Planı', true)
      RETURNING id INTO v_plan_id;

      INSERT INTO plan_details (plan_id, prayer_id, target_days, target_count_morning, target_count_evening, sequence_order)
      VALUES
        (v_plan_id, v_prayer_fettah, 7, 489, 489, 1),
        (v_plan_id, v_prayer_ayetel, 12, 7, 7, 2);

      INSERT INTO user_daily_progress (plan_detail_id, current_day_number, morning_count_done, evening_count_done, is_morning_completed, is_evening_completed, date)
      SELECT pd.id, 1, 0, 0, false, false, CURRENT_DATE
      FROM plan_details pd WHERE pd.plan_id = v_plan_id;
    END IF;
  END IF;
END $$;
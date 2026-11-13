/*
# Library content model for system prayers

1. Modified Tables
- `prayers`: added nullable/defaulted columns only, no existing values are overwritten.
  - `content_type` (Dua, Zikir, Esma, Namaz, Abdest). Existing rows whose name starts with "Ya " are classified as Esma; all other existing rows stay unclassified (NULL).
  - `subcategory` (free text, optional).
  - `arabic_text` (optional Arabic text).
  - `source_reference` (optional citation text).
  - `verification_status` (verified, pending, unverified). Defaults to unverified.
  - `recommendation_basis` (hadith, quran, ebced, traditional, unspecified). Defaults to unspecified.
  - `requires_counter` (whether the item uses a repetition counter). Defaults to true.
2. New Tables
- `purpose_groups`: reference list of purpose groups. No rows are seeded because the exact group names were not available in the project.
- `prayer_purposes`: many-to-many link between system prayers and purpose groups.
3. Security
- RLS enabled on both new tables.
- Public read-only access (anon and authenticated) because this is shared reference content. No client write policies are created.

# Notes
1. No existing rows, plans, progress, or policies on `prayers` are changed.
2. Quran content type is intentionally not yet allowed.
*/

ALTER TABLE prayers ADD COLUMN IF NOT EXISTS content_type text;
ALTER TABLE prayers ADD COLUMN IF NOT EXISTS subcategory text;
ALTER TABLE prayers ADD COLUMN IF NOT EXISTS arabic_text text;
ALTER TABLE prayers ADD COLUMN IF NOT EXISTS source_reference text;
ALTER TABLE prayers ADD COLUMN IF NOT EXISTS verification_status text NOT NULL DEFAULT 'unverified';
ALTER TABLE prayers ADD COLUMN IF NOT EXISTS recommendation_basis text NOT NULL DEFAULT 'unspecified';
ALTER TABLE prayers ADD COLUMN IF NOT EXISTS requires_counter boolean NOT NULL DEFAULT true;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'prayers_content_type_check') THEN
    ALTER TABLE prayers ADD CONSTRAINT prayers_content_type_check
      CHECK (content_type IS NULL OR content_type IN ('Dua', 'Zikir', 'Esma', 'Namaz', 'Abdest'));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'prayers_verification_status_check') THEN
    ALTER TABLE prayers ADD CONSTRAINT prayers_verification_status_check
      CHECK (verification_status IN ('verified', 'pending', 'unverified'));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'prayers_recommendation_basis_check') THEN
    ALTER TABLE prayers ADD CONSTRAINT prayers_recommendation_basis_check
      CHECK (recommendation_basis IN ('hadith', 'quran', 'ebced', 'traditional', 'unspecified'));
  END IF;
END $$;

UPDATE prayers SET content_type = 'Esma'
WHERE content_type IS NULL AND name ILIKE 'Ya %';

CREATE TABLE IF NOT EXISTS purpose_groups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  name_tr text NOT NULL,
  name_en text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS prayer_purposes (
  prayer_id uuid NOT NULL REFERENCES prayers(id) ON DELETE CASCADE,
  purpose_id uuid NOT NULL REFERENCES purpose_groups(id) ON DELETE CASCADE,
  PRIMARY KEY (prayer_id, purpose_id)
);

CREATE INDEX IF NOT EXISTS prayer_purposes_purpose_id_idx ON prayer_purposes (purpose_id);

ALTER TABLE purpose_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE prayer_purposes ENABLE ROW LEVEL SECURITY;

GRANT SELECT ON purpose_groups TO anon, authenticated;
GRANT SELECT ON prayer_purposes TO anon, authenticated;

DROP POLICY IF EXISTS "purpose_groups_public_select" ON purpose_groups;
CREATE POLICY "purpose_groups_public_select" ON purpose_groups FOR SELECT
TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "prayer_purposes_public_select" ON prayer_purposes;
CREATE POLICY "prayer_purposes_public_select" ON prayer_purposes FOR SELECT
TO anon, authenticated USING (true);

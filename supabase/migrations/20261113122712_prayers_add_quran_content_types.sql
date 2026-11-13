/*
# Allow Quran recitation content types in the System Library

1. Modified Table
- `prayers.content_type`: the allowed list gains 'Sure' (a full surah recited in prayer) and 'Ayet' (a single verse or verse-based prayer). Existing values are unchanged.

2. Security
- No grants or policies change.

3. Important Notes
- Only the allowed list is widened; no rows are modified or removed.
- The constraint is dropped and re-added so the migration can be re-run safely.
*/

ALTER TABLE prayers DROP CONSTRAINT IF EXISTS prayers_content_type_check;

ALTER TABLE prayers ADD CONSTRAINT prayers_content_type_check
  CHECK (content_type IS NULL OR content_type = ANY (ARRAY['Dua'::text, 'Zikir'::text, 'Esma'::text, 'Namaz'::text, 'Abdest'::text, 'Sure'::text, 'Ayet'::text]));

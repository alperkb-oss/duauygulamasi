/*
# Personal library entries (owner-only, max 100 per user)

1. New Tables
- `personal_library_entries`: a signed-in user's own prayer or dhikr entries.
  - `user_id` (defaults to the signed-in user, required).
  - `arabic_text`, `transliteration`, `meaning` (optional, but at least one must contain text).
  - `purpose_id` (optional link to a purpose group), `category`, `sources`, `suggested_count`, `suggested_time` (all optional).
  - `created_at`.

2. Limits
- A BEFORE INSERT trigger rejects a new entry when the user already has 100 entries.
- The trigger takes a per-user transaction lock before counting, so simultaneous inserts cannot exceed 100.

3. Security
- RLS enabled. Four separate policies (select, insert, update, delete) restrict every action to the owner.
- Grants go only to the authenticated role.
- The limit-check function is not callable by anon or authenticated users directly.

# Notes
1. Personal entries are not linked to plans or daily progress yet.
2. Entries cascade-delete with the owning account.
*/

CREATE TABLE IF NOT EXISTS personal_library_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  arabic_text text,
  transliteration text,
  meaning text,
  purpose_id uuid REFERENCES purpose_groups(id) ON DELETE SET NULL,
  category text,
  sources text,
  suggested_count text,
  suggested_time text,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT personal_library_has_text CHECK (
    coalesce(btrim(arabic_text), '') <> ''
    OR coalesce(btrim(transliteration), '') <> ''
    OR coalesce(btrim(meaning), '') <> ''
  )
);

CREATE INDEX IF NOT EXISTS personal_library_entries_user_id_idx ON personal_library_entries (user_id);

CREATE OR REPLACE FUNCTION enforce_personal_library_limit()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  entry_count integer;
BEGIN
  PERFORM pg_advisory_xact_lock(hashtextextended(NEW.user_id::text, 0));
  SELECT count(*) INTO entry_count FROM personal_library_entries WHERE user_id = NEW.user_id;
  IF entry_count >= 100 THEN
    RAISE EXCEPTION 'personal library limit of 100 entries reached'
      USING ERRCODE = 'check_violation';
  END IF;
  RETURN NEW;
END;
$$;

REVOKE EXECUTE ON FUNCTION enforce_personal_library_limit() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS personal_library_limit_before_insert ON personal_library_entries;
CREATE TRIGGER personal_library_limit_before_insert
BEFORE INSERT ON personal_library_entries
FOR EACH ROW EXECUTE FUNCTION enforce_personal_library_limit();

ALTER TABLE personal_library_entries ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, UPDATE, DELETE ON personal_library_entries TO authenticated;

DROP POLICY IF EXISTS "select_own_personal_library" ON personal_library_entries;
CREATE POLICY "select_own_personal_library" ON personal_library_entries FOR SELECT
TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_personal_library" ON personal_library_entries;
CREATE POLICY "insert_own_personal_library" ON personal_library_entries FOR INSERT
TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_personal_library" ON personal_library_entries;
CREATE POLICY "update_own_personal_library" ON personal_library_entries FOR UPDATE
TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_personal_library" ON personal_library_entries;
CREATE POLICY "delete_own_personal_library" ON personal_library_entries FOR DELETE
TO authenticated USING (auth.uid() = user_id);

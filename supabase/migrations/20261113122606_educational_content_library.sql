/*
# Educational content for Namaz and Abdest

1. New Table
- `educational_content`: read-only reference text for the System Library.
  - `topic` ('namaz' or 'abdest') groups the rows.
  - `sort_order` keeps the original CSV row position; (topic, sort_order) is unique, which makes imports idempotent.
  - `kind` is 'title', 'heading', 'paragraph' or 'table_row'.
  - `cells` holds the row's cell texts in column order (used by table rows).

2. Security
- Row level security is enabled.
- anon and authenticated roles get SELECT only, through a public read policy (this is intentional: educational content is public).
- No INSERT, UPDATE or DELETE grant or policy exists for public roles.
- service_role receives SELECT and INSERT for the one-time content import.
*/

CREATE TABLE IF NOT EXISTS educational_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  topic text NOT NULL CHECK (topic IN ('namaz', 'abdest')),
  sort_order integer NOT NULL,
  kind text NOT NULL CHECK (kind IN ('title', 'heading', 'paragraph', 'table_row')),
  cells jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (topic, sort_order)
);

ALTER TABLE educational_content ENABLE ROW LEVEL SECURITY;

GRANT SELECT ON educational_content TO anon, authenticated;
GRANT SELECT, INSERT ON educational_content TO service_role;

DROP POLICY IF EXISTS "public_select_educational_content" ON educational_content;
CREATE POLICY "public_select_educational_content" ON educational_content
  FOR SELECT
  TO anon, authenticated
  USING (true);

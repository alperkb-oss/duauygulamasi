/*
# Mark primary purpose for each prayer link

1. Modified Table
- `prayer_purposes.is_primary` (boolean, default false): true when the group is the item's main purpose; the other links are secondary.

2. Security
- No grant or policy changes.

3. Important Notes
- Additive only; existing links are unchanged and default to secondary until set.
*/

ALTER TABLE prayer_purposes ADD COLUMN IF NOT EXISTS is_primary boolean NOT NULL DEFAULT false;

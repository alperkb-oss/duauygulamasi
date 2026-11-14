/*
# Namaz prayer-type usage and restored Arabic text

1. New table `prayer_usages`
- One row per prayer and usage class (farz, sunnah, common practice).
- A prayer can have several rows, because the same dua or surah can be Farz in one prayer context and Sünnet in another.
- `stages` lists the prayer contexts from the source usage matrix (Vakit, Teheccüd, Cenaze, Hacet, Teravih, Bayram, Ayat, Kusuf, Vitir, İstihare, Nafile).
- `recitation_method`, `explanation`, `source_reference` and `madhhab_note` are optional and stay empty until they are verified.
- Rows are informational only. They do not restrict plans, counters, progress or obligations.

2. Seeded usage data
- Filled from the usage matrix in the Namaz dua source file. Prayers are matched by name within the Namaz dua category.
- Two legacy duplicate entries (Ayetel Kürsi, İhlas Suresi) receive the same usage rows as their matching entries.

3. Restored Arabic text
- The two legacy duplicate entries that had no Arabic text receive it from their matching entries (Ayet-el Kürsi, İhlâs Suresi), which come from the same source file.
- Their identifiers and plan references are unchanged.

4. Security
- Row level security is enabled.
- Public read-only access for anon and authenticated, matching the other system library tables.
- No write policies. Rows are maintained through migrations only.

Notes
- The migration is safe to re-run: the table is created only if missing, seeded rows are skipped on conflict, and Arabic text is only written when empty.
*/

CREATE TABLE IF NOT EXISTS prayer_usages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  prayer_id uuid NOT NULL REFERENCES prayers(id) ON DELETE CASCADE,
  usage_type text NOT NULL CHECK (usage_type IN ('farz', 'sunnah', 'common')),
  stages text[] NOT NULL DEFAULT '{}',
  recitation_method text,
  explanation text,
  source_reference text,
  madhhab_note text,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (prayer_id, usage_type)
);

ALTER TABLE prayer_usages ENABLE ROW LEVEL SECURITY;

GRANT SELECT ON prayer_usages TO anon, authenticated;

DROP POLICY IF EXISTS "prayer_usages_public_select" ON prayer_usages;
CREATE POLICY "prayer_usages_public_select" ON prayer_usages
  FOR SELECT
  TO anon, authenticated
  USING (true);

INSERT INTO prayer_usages (prayer_id, usage_type, stages)
SELECT p.id, v.usage_type, v.stages
FROM (VALUES
  ('Fatiha Suresi', 'farz', ARRAY['Vakit','Teheccüd','Hacet','Teravih','Bayram','Ayat','Kusuf','Vitir','İstihare','Nafile']),
  ('Ayet-el Kürsi', 'sunnah', ARRAY['Hacet']),
  ('Ayet-el Kürsi', 'common', ARRAY['Vakit','Teheccüd','Teravih','Bayram','Ayat','Kusuf','Vitir','İstihare','Nafile']),
  ('Ayetel Kürsi', 'sunnah', ARRAY['Hacet']),
  ('Ayetel Kürsi', 'common', ARRAY['Vakit','Teheccüd','Teravih','Bayram','Ayat','Kusuf','Vitir','İstihare','Nafile']),
  ('Fil Suresi', 'common', ARRAY['Vakit','Teheccüd','Hacet','Teravih','Bayram','Ayat','Kusuf','Vitir','İstihare','Nafile']),
  ('Kureyş Suresi', 'common', ARRAY['Vakit','Teheccüd','Hacet','Teravih','Bayram','Ayat','Kusuf','Vitir','İstihare','Nafile']),
  ('Maun Suresi', 'common', ARRAY['Vakit','Teheccüd','Hacet','Teravih','Bayram','Ayat','Kusuf','Vitir','İstihare','Nafile']),
  ('Kevser Suresi', 'common', ARRAY['Vakit','Teheccüd','Hacet','Teravih','Bayram','Ayat','Kusuf','Vitir','İstihare','Nafile']),
  ('Kafirun Suresi', 'sunnah', ARRAY['Vakit','İstihare']),
  ('Kafirun Suresi', 'common', ARRAY['Teheccüd','Hacet','Teravih','Bayram','Ayat','Kusuf','Vitir','Nafile']),
  ('Nasr Suresi', 'common', ARRAY['Vakit','Teheccüd','Hacet','Teravih','Bayram','Ayat','Kusuf','Vitir','İstihare','Nafile']),
  ('Tebbet Suresi', 'common', ARRAY['Vakit','Teheccüd','Hacet','Teravih','Bayram','Ayat','Kusuf','Vitir','İstihare','Nafile']),
  ('İhlâs Suresi', 'sunnah', ARRAY['Vakit','Hacet','İstihare']),
  ('İhlâs Suresi', 'common', ARRAY['Teheccüd','Teravih','Bayram','Ayat','Kusuf','Vitir','Nafile']),
  ('İhlas Suresi', 'sunnah', ARRAY['Vakit','Hacet','İstihare']),
  ('İhlas Suresi', 'common', ARRAY['Teheccüd','Teravih','Bayram','Ayat','Kusuf','Vitir','Nafile']),
  ('Felak Suresi', 'sunnah', ARRAY['Vakit','Hacet','Vitir']),
  ('Felak Suresi', 'common', ARRAY['Teheccüd','Teravih','Bayram','Ayat','Kusuf','İstihare','Nafile']),
  ('Nas Suresi', 'sunnah', ARRAY['Vakit','Hacet','Vitir']),
  ('Nas Suresi', 'common', ARRAY['Teheccüd','Teravih','Bayram','Ayat','Kusuf','İstihare','Nafile']),
  ('Subhaneke Duası', 'sunnah', ARRAY['Vakit','Teheccüd','Cenaze','Hacet','Teravih','Bayram','Ayat','Kusuf','Vitir','İstihare','Nafile']),
  ('Yasin Suresi', 'common', ARRAY['Teheccüd','Nafile']),
  ('Duhan Suresi', 'common', ARRAY['Teheccüd','Nafile']),
  ('Secde Suresi', 'sunnah', ARRAY['Vakit']),
  ('Secde Suresi', 'common', ARRAY['Teheccüd','Nafile']),
  ('Mülk Suresi', 'common', ARRAY['Teheccüd','Nafile']),
  ('İstiğfar Duası', 'common', ARRAY['Teheccüd','Hacet','Nafile']),
  ('İnsan Suresi', 'sunnah', ARRAY['Vakit','Teheccüd']),
  ('İnsan Suresi', 'common', ARRAY['Nafile']),
  ('Kadir Suresi', 'common', ARRAY['Vakit','Teheccüd','Hacet','Teravih','Bayram','Ayat','Kusuf','Vitir','İstihare','Nafile']),
  ('Rabbenâ Âtinâ Duası', 'sunnah', ARRAY['Vakit','Teheccüd','Hacet','Teravih','Bayram','Ayat','Kusuf','Vitir','İstihare','Nafile']),
  ('Rabbenağfir lî Duası', 'sunnah', ARRAY['Vakit','Teheccüd','Hacet','Teravih','Bayram','Ayat','Kusuf','Vitir','İstihare','Nafile']),
  ('Rabbenâ Lâ Tüziğ Duası', 'common', ARRAY['Vakit','Teheccüd','Hacet','Teravih','Bayram','Ayat','Kusuf','Vitir','İstihare','Nafile']),
  ('Rabbic''alnî Duası', 'common', ARRAY['Vakit','Teheccüd','Hacet','Teravih','Bayram','Ayat','Kusuf','Vitir','İstihare','Nafile']),
  ('Allahümme Salli Duası', 'sunnah', ARRAY['Vakit','Teheccüd','Cenaze','Hacet','Teravih','Bayram','Ayat','Kusuf','Vitir','İstihare','Nafile']),
  ('Allahümme Bârik Duası', 'sunnah', ARRAY['Vakit','Teheccüd','Cenaze','Hacet','Teravih','Bayram','Ayat','Kusuf','Vitir','İstihare','Nafile']),
  ('Teheccüd Duası', 'sunnah', ARRAY['Teheccüd'])
) AS v(prayer_name, usage_type, stages)
JOIN prayers p
  ON p.name = v.prayer_name
 AND p.category = 'Namazda Okunan Başlıca Dualar'
ON CONFLICT (prayer_id, usage_type) DO NOTHING;

UPDATE prayers
SET arabic_text = (
  SELECT src.arabic_text FROM prayers src
  WHERE src.name = 'Ayet-el Kürsi' AND src.category = 'Namazda Okunan Başlıca Dualar'
)
WHERE name = 'Ayetel Kürsi'
  AND category = 'Namazda Okunan Başlıca Dualar'
  AND (arabic_text IS NULL OR arabic_text = '');

UPDATE prayers
SET arabic_text = (
  SELECT src.arabic_text FROM prayers src
  WHERE src.name = 'İhlâs Suresi' AND src.category = 'Namazda Okunan Başlıca Dualar'
)
WHERE name = 'İhlas Suresi'
  AND category = 'Namazda Okunan Başlıca Dualar'
  AND (arabic_text IS NULL OR arabic_text = '');

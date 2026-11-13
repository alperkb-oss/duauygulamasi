/*
# Purpose group Turkish descriptions

1. Modified Tables
- `purpose_groups`: added nullable `description_tr` (short Turkish description of each purpose).

2. Data
- Populated descriptions for the 12 existing purpose groups, matched by their existing unique codes. Codes and IDs are unchanged.

3. Security
- No policy or grant changes. Existing public read access is unchanged.

# Notes
1. Re-running is safe: the update sets the same values each time and creates no rows.
*/

ALTER TABLE purpose_groups ADD COLUMN IF NOT EXISTS description_tr text;

UPDATE purpose_groups AS g
SET description_tr = v.description
FROM (VALUES
  ('forgiveness', 'Allah’tan bağışlanma dilemek ve manevi arınma'),
  ('gratitude', 'Allah’ı övmek ve nimetleri için şükretmek'),
  ('faith', 'Doğru yolda kalmak ve imanı güçlendirmek'),
  ('protection', 'Allah’a sığınmak ve korunma dilemek'),
  ('peace', 'Sıkıntılı zamanlarda ferahlık ve kolaylık dilemek'),
  ('sustenance', 'Helal rızık, bereket ve geçim kolaylığı dilemek'),
  ('health', 'Sağlık ve esenlik dilemek'),
  ('family', 'Aile ve yakınlar için hayır ve huzur dilemek'),
  ('knowledge', 'Faydalı bilgi ve hayırlı başarı dilemek'),
  ('trust', 'Allah’a dayanmak ve hayırlısını istemek'),
  ('worship', 'İbadet ve manevi kazanımla ilgili okumalar'),
  ('wishes', 'Dünya ve ahiret için hayır dilemek')
) AS v(code, description)
WHERE g.code = v.code;

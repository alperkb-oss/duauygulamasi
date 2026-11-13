/*
# Esma cleanup: remove unreferenced duplicate entries and align one transliteration

## Plain-English summary
The Esma system library was imported from the CSV in a previous step. Seven older
entries named "Ya ..." were left behind and overlap with canonical CSV entries.

1. Four older duplicates that no reading plan and no purpose link refer to are deleted:
   Ya Hafız, Ya Latif, Ya Rezzak, Ya Vehhab.
2. Three older duplicates that are used by existing reading plans (Ya Fettah, Ya Şafi,
   Ya Selam) are preserved so historical plan data is not lost.
3. The transliteration of Zü'l-Celâli ve'l-İkrâm is set to the exact value in esma.csv.

## Security
No RLS, grant or policy changes.

## Notes
- The delete is guarded: rows referenced by plan_details or prayer_purposes are never removed.
*/

DELETE FROM prayers p
WHERE p.content_type = 'Esma'
  AND p.arabic_text IS NULL
  AND p.name IN ('Ya Hafız', 'Ya Latif', 'Ya Rezzak', 'Ya Vehhab')
  AND NOT EXISTS (SELECT 1 FROM plan_details pd WHERE pd.prayer_id = p.id)
  AND NOT EXISTS (SELECT 1 FROM prayer_purposes pp WHERE pp.prayer_id = p.id);

UPDATE prayers
SET turkish_transliteration = 'Zü''l-Celâli ve''l-İkrâm'
WHERE content_type = 'Esma'
  AND name = 'Zü''l-Celâli ve''l-İkrâm'
  AND turkish_transliteration IS DISTINCT FROM 'Zü''l-Celâli ve''l-İkrâm';

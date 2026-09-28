/*
# Add suggested_count and suggested_time columns to prayers table

1. Modified Tables
- `prayers`: Added `suggested_count` (text, e.g. "489 Kez") and `suggested_time` (text, e.g. "Sabah ve Akşam")
2. Data Updates
- Updated existing 8 prayers with suggested_count and suggested_time values
- Inserted new prayers: Salavat-ı Şerife, İstihfar, İhlas Suresi with full data
- Updated categories to match new naming (Rızık & Bolluk, Korunma & Huzur, etc.)
3. Notes
- All text columns use Turkish values
- Priority scores updated to match user-provided values
*/

ALTER TABLE prayers ADD COLUMN IF NOT EXISTS suggested_count text;
ALTER TABLE prayers Add COLUMN IF NOT EXISTS suggested_time text;

-- Update existing prayers with new categories, counts, times, and transliterations
DO $$
BEGIN
  -- Ya Fettah
  UPDATE prayers SET
    category = 'Rızık & Bolluk',
    priority_score = 1,
    suggested_count = '489 Kez',
    suggested_time = 'Sabah ve Akşam',
    turkish_transliteration = 'Yâ Fettâh',
    meaning = 'Her türlü zorluğu açan, maddi-manevi kapıları aralayan.'
  WHERE name = 'Ya Fettah';

  -- Ya Rezzak
  UPDATE prayers SET
    category = 'Rızık & Bolluk',
    priority_score = 2,
    suggested_count = '308 Kez',
    suggested_time = 'Her Vakit',
    turkish_transliteration = 'Yâ Rezzâk',
    meaning = 'Bütün mahlukatın rızkını veren ve ihtiyacını karşılayan.'
  WHERE name = 'Ya Rezzak';

  -- Ayetel Kürsi
  UPDATE prayers SET
    category = 'Korunma & Huzur',
    priority_score = 1,
    suggested_count = '7 Kez',
    suggested_time = 'Her Namaz Sonrası',
    turkish_transliteration = 'Allâhü lâ ilâhe illâ hüvel hayyül kayyûm...',
    meaning = 'Yüce Allah''ın varlığını ve koruyuculuğunu anlatır.'
  WHERE name = 'Ayetel Kürsi';

  -- Ya Şafi
  UPDATE prayers SET
    category = 'Şifa & Sağlık',
    priority_score = 1,
    suggested_count = '391 Kez',
    suggested_time = 'Sabah',
    turkish_transliteration = 'Yâ Şâfî',
    meaning = 'Maddi ve manevi tüm hastalıklara şifa veren, dertleri gideren.'
  WHERE name = 'Ya Şafi';

  -- Ya Selam
  UPDATE prayers SET
    category = 'Huzur',
    priority_score = 5,
    suggested_count = '100 Kez',
    suggested_time = 'Her Vakit',
    turkish_transliteration = 'Yâ Selâm',
    meaning = 'Her türlü tehlikeden koruyan, esenlik veren Allah.'
  WHERE name = 'Ya Selam';

  -- Ya Vehhab
  UPDATE prayers SET
    category = 'Rızık & Bolluk',
    priority_score = 3,
    suggested_count = '100 Kez',
    suggested_time = 'Seher',
    turkish_transliteration = 'Yâ Vehhâb',
    meaning = 'Karşılıksız veren, bol ihsan eden Allah.'
  WHERE name = 'Ya Vehhab';

  -- Ya Latif
  UPDATE prayers SET
    category = 'Huzur',
    priority_score = 7,
    suggested_count = '129 Kez',
    suggested_time = 'Her Vakit',
    turkish_transliteration = 'Yâ Latîf',
    meaning = 'Kullarına lütfeden, ince ve nazik davranan Allah.'
  WHERE name = 'Ya Latif';

  -- Ya Hafız
  UPDATE prayers SET
    category = 'Korunma & Huzur',
    priority_score = 8,
    suggested_count = '100 Kez',
    suggested_time = 'Sabah ve Akşam',
    turkish_transliteration = 'Yâ Hafîz',
    meaning = 'Her şeyi koruyan ve muhafaza eden Allah.'
  WHERE name = 'Ya Hafız';

  -- Insert new prayers
  INSERT INTO prayers (name, category, priority_score, suggested_count, suggested_time, turkish_transliteration, meaning)
  SELECT 'Salavat-ı Şerife', 'Günlük Zikir', 1, '100 Kez', 'Cuma / Her Vakit',
    'Allâhümme salli alâ seyyidinâ Muhammedin...',
    'Efendimiz Muhammed''e (s.a.v.) salat ve selam eylemek.'
  WHERE NOT EXISTS (SELECT 1 FROM prayers WHERE name = 'Salavat-ı Şerife');

  INSERT INTO prayers (name, category, priority_score, suggested_count, suggested_time, turkish_transliteration, meaning)
  SELECT 'İstihfar', 'Günlük Zikir', 2, '100 Kez', 'Akşam / Seher',
    'Estağfirullâhel''azîm ve etûbü ileyh.',
    'Azamet sahibi olan Allah''tan bağışlanma dilemek.'
  WHERE NOT EXISTS (SELECT 1 FROM prayers WHERE name = 'İstihfar');

  INSERT INTO prayers (name, category, priority_score, suggested_count, suggested_time, turkish_transliteration, meaning)
  SELECT 'İhlas Suresi', 'Korunma & Tevhid', 2, '11 Kez', 'Yatmadan Önce',
    'Kul hüvellâhü ehad. Allâhüssamed...',
    'Allah''ın birliğini idrak etmek ve koruma kalkanı.'
  WHERE NOT EXISTS (SELECT 1 FROM prayers WHERE name = 'İhlas Suresi');
END $$;
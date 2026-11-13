/*
# Import Esma-ül Hüsna into the system library

1. Modified Tables
- `prayers`: added nullable `purpose_note` (the CSV "Amaç ve Gerekçe" text) and `count_note` (the CSV "Yayın Notu" text explaining that counts are suggestions).

2. New Rows
- 99 Esma entries (content type Esma, category Esma-ül Hüsna) with Arabic name, Turkish name, recitation form, Turkish meaning, suggested time of day, and the Ebced-based suggested count.
- Every entry is marked as Ebced / traditional practice, requires a counter, and is unverified. No entry is presented as hadith-backed.

3. Security
- No policy or grant changes. Existing public read access applies to the new columns.

# Notes
1. Esma purpose links to the 12 purpose groups are not imported. The CSV purpose labels ("Zikrin 1.amacı" / "2.amacı") do not match the 12 group names and need an editorial mapping first.
2. Re-running is safe: rows are inserted only when no Esma entry with the same name exists.
*/

ALTER TABLE prayers ADD COLUMN IF NOT EXISTS purpose_note text;
ALTER TABLE prayers ADD COLUMN IF NOT EXISTS count_note text;

INSERT INTO prayers (name, category, content_type, arabic_text, turkish_transliteration, meaning, suggested_count, suggested_time, purpose_note, count_note, verification_status, recommendation_basis, requires_counter, priority_score)
SELECT v.name, 'Esma-ül Hüsna', 'Esma', v.arabic, v.translit, v.meaning, v.ebced, v.vakit, v.purpose,
  'Ebced sayısı öneridir; sahih hadisle sabit tekrar sayısı olarak sunulamaz.',
  'unverified', 'ebced', true, v.prio
FROM (VALUES
('Allah', 'اَللّٰه', 'Yâ Allah', 'Eşi benzeri olmayan, tek ilah.', '66', 'Her vakit', 'Her türlü meşru hacet ve kalbi nurlandırmak için.', 101),
('Er-Rahmân', 'اَلرَّحْمٰنُ', 'Yâ Rahmân', 'Dünyada her canlıya merhamet eden.', '298', 'Sabah namazı sonrası', 'Kalp katılığı ve gafletten kurtulmak, merhamet kazanmak.', 102),
('Er-Rahîm', 'اَلرَّحِيمُ', 'Yâ Rahîm', 'Ahirette sadece müminlere merhamet eden.', '258', 'Namazların ardı', 'Rızık bereketi, hane huzuru ve maddi-manevi koruma.', 103),
('El-Melik', 'اَلْمَلِكُ', 'Yâ Melik', 'Mülkün ve tüm kâinatın gerçek sahibi.', '90', 'Zeval (Öğle) vakti', 'Maddi güç, itibar kazanmak ve emir altında kalmamak.', 104),
('El-Kuddûs', 'اَلْقُدُّوسُ', 'Yâ Kuddûs', 'Her türlü eksiklikten uzak, tertemiz.', '170', 'İkindi sonrası', 'Ruhsal sıkıntılardan, vesveseden ve kötü huylardan arınmak.', 105),
('Es-Selâm', 'اَلسَّلَامُ', 'Yâ Selâm', 'Kullarını selamete çıkaran, barışın kaynağı.', '131', 'Güneş doğarken', 'Korkulardan emin olmak, iç huzuru ve bedensel şifa bulmak.', 106),
('El-Mü''min', 'اَلْمُؤْمِنُ', 'Yâ Mü''min', 'Gönüllere iman veren, emniyete kavuşturan.', '137', 'Sabah-Akşam', 'Kötü ahlaktan korunmak, güvende olmak ve hidayet için.', 107),
('El-Müheymin', 'اَلْمُهَيْمِنُ', 'Yâ Müheymin', 'Her şeyi görüp gözeten, koruyan.', '145', 'Yatsı sonrası', 'Gizli şeylerin aşikar olması, korunma ve sırlar ilmi için.', 108),
('El-Azîz', 'اَلْعَزِيزُ', 'Yâ Azîz', 'Sonsuz izzet sahibi, mağlup edilmesi imkansız olan.', '94', 'İkindi sonrası', 'İnsanlar arasında sevilmek, itibar ve rütbe kazanmak.', 109),
('El-Cebbâr', 'اَلْجَبَّارُ', 'Yâ Cebbâr', 'Dilediğini zorla yaptıran, kırılanları onaran.', '206', 'Sabah-Akşam', 'Zalimlerin şerrinden korunmak ve isteklerin kabulü için.', 110),
('El-Mütekkebir', 'اَلْمُتَكَبِّرُ', 'Yâ Mütekkebir', 'Büyüklük ve azametini gösteren, her şeyden yüce.', '662', 'Seher vakti', 'Sözünün geçmesi, heybet kazanmak ve izzet bulmak için.', 111),
('El-Hâlık', 'اَلْخَالِقُ', 'Yâ Hâlık', 'Her şeyi yoktan var eden, yaratan.', '731', 'Gece vakti', 'İşlerde başarı, zorlukların çözülmesi ve kalbin aydınlanması.', 112),
('El-Bâri', 'اَلْبَارِئُ', 'Yâ Bâri', 'Her şeyi kusursuz ve birbiriyle uyumlu yaratan.', '213', 'Gün ortası', 'Sanatta, işte başarı kazanmak ve hastalıklardan şifa.', 113),
('El-Musavvir', 'اَلْمُصَوِّرُ', 'Yâ Musavvir', 'Her şeye bir şekil ve suret veren.', '336', 'Akşam namazı ardı', 'Zor işlerin başarmak, estetik ve ruhi olgunluk için.', 114),
('El-Gaffâr', 'اَلْغَفَّارُ', 'Yâ Gaffâr', 'Günahları çokça bağışlayan, örten.', '1281', 'Cuma günleri', 'Günahların affı, cehennem azabından ve darlıktan korunma.', 115),
('El-Kahhâr', 'اَلْقَهَّارُ', 'Yâ Kahhâr', 'Her şeye galip gelen, gücüyle kahreden.', '306', 'Gece yarısı', 'Nefis terbiyesi, düşmanların ve kötü niyetlilerin şerri.', 116),
('El-Vehhâb', 'اَلْوَهَّابُ', 'Yâ Vehhâb', 'Karşılıksız, bolca nimet veren, hibe eden.', '14', 'Kuşluk vakti', 'Borçtan kurtulmak, rızık bolluğu ve maddi refah için.', 117),
('Er-Rezzâk', 'اَلرَّزَّاقُ', 'Yâ Rezzâk', 'Her canlının rızkını veren ve ihtiyacını karşılayan.', '308', 'Sabah aç karna', 'Maddi ve manevi rızık bolluğu, darlık yüzü görmemek.', 118),
('El-Fettâh', 'اَلْفَتَّاحُ', 'Yâ Fettâh', 'Her türlü zorluğu kolaylaştıran, kapıları açan.', '489', 'Sabah namazı ardı', 'İşlerin açılması, rızık kapıları ve fetihler için.', 119),
('El-Alîm', 'اَلْعَلِيمُ', 'Yâ Alîm', 'Her şeyi en ince detayına kadar hakkıyla bilen.', '150', 'Namazların ardı', 'Zihin açıklığı, ilim tahsili ve gizli ilimlere vakıf olmak.', 120),
('El-Kâbıd', 'اَلْقَابِضُ', 'Yâ Kâbıd', 'Dilediğine rızkı daraltan, ruhları kabzeden.', '903', 'Gece vakti', 'Zalimin zulmünden korunmak ve haddini bildirmek için.', 121),
('El-Bâsit', 'اَلْبَاسِطُ', 'Yâ Bâsit', 'Dilediğine rızkı genişleten, ferahlık veren.', '72', 'Kuşluk vakti', 'Rızık genişliği, kalbi ferahlık ve korkulardan emin olmak.', 122),
('El-Hâfıd', 'اَلْخَافِضُ', 'Yâ Hâfıd', 'Yukarıdan aşağıya indiren, alçaltan.', '1481', 'İkindi sonrası', 'Kötü niyetli kişilerin ve düşmanların hilesini boşa çıkarmak.', 123),
('Er-Râfi', 'اَلرَّافِعُ', 'Yâ Râfi', 'Dilediğini yükselten, şeref bahşeden.', '351', 'Gece vakti', 'Makam mevki sahibi olmak, halk arasında itibar kazanmak.', 124),
('El-Muiz', 'اَلْمُعِزُّ', 'Yâ Muiz', 'Dilediğine izzet veren, aziz kılan.', '117', 'Akşam-Yatsı arası', 'Fakirlikten ve ezilmekten kurtulmak, heybet bulmak.', 125),
('El-Müzil', 'اَلْمُذِلُّ', 'Yâ Müzil', 'Dilediğini zillete düşüren, hor ve hakir kılan.', '770', 'İkindi namazı ardı', 'Haksızlık yapanların şerrinden emin olmak ve korunmak.', 126),
('Es-Semî', 'اَلسَّمِيعُ', 'Yâ Semî', 'Her şeyi en iyi işiten, duaları kabul eden.', '180', 'Perşembe günleri', 'Duaların kabul olması ve kulak rahatsızlıklarından şifa.', 127),
('El-Basîr', 'اَلْبَصِيرُ', 'Yâ Basîr', 'Her şeyi en iyi gören, hiçbir şey gizli kalmayan.', '302', 'Cuma namazı ardı', 'Göz sağlığı, basiret açıklığı ve gizli şeyleri sezmek.', 128),
('El-Hakem', 'اَلْحَكَمُ', 'Yâ Hakem', 'Mutlak hakim, hüküm veren, hakkı yerine getiren.', '68', 'Gece yarısı', 'Adaletin tecellisi, davaları kazanmak ve haklı çıkmak.', 129),
('El-Adl', 'اَلْعَدْلُ', 'Yâ Adl', 'Mutlak adil, her şeyi hakkaniyetle yapan.', '104', 'Cuma gecesi', 'Nefsin itaat etmesi, adaletli olmak ve haksızlıktan korunma.', 130),
('El-Latîf', 'اَللَّطِيفُ', 'Yâ Latîf', 'En ince işlerin detayını bilen, lütufta bulunan.', '129', 'Her vakit', 'Dileklerin kabulü, rızık bolluğu ve sıkıntıların geçmesi.', 131),
('El-Habîr', 'اَلْخَبِيرُ', 'Yâ Habîr', 'Her şeyin iç yüzünden, gizli taraflarından haberdar.', '812', 'Uyumadan önce', 'Hafızanın güçlenmesi, gizli şeylerin rüyada gösterilmesi.', 132),
('El-Halîm', 'اَلْحَلِيمُ', 'Yâ Halîm', 'Cezalandırmada acele etmeyen, yumuşak davranan.', '88', 'Öfke anında', 'Ahlak güzelliği, öfkenin dinmesi ve sinir yatıştırmak.', 133),
('El-Azîm', 'اَلْعَظِيمُ', 'Yâ Azîm', 'Pek yüce, zatının ve sıfatlarının mahiyeti bilinmeyen.', '1020', 'Namazların ardı', 'Korkulardan emin olmak, heybet ve yüksek makamlar için.', 134),
('El-Gafûr', 'اَلْغَفُورُ', 'Yâ Gafûr', 'Mağfireti çok olan, günahları affeden.', '1286', 'Gün batarken', 'Günahların bağışlanması ve kalbin kötü huylardan temizlenmesi.', 135),
('Eş-Şekûr', 'اَلشَّكُورُ', 'Yâ Şekûr', 'Şükredenlere fazlasıyla karşılık veren.', '526', 'Sabah-Akşam', 'Nimetlerin artması, rızık bereketi ve talihin açılması.', 136),
('El-Aliyy', 'اَلْعَلِيُّ', 'Yâ Aliyy', 'Pek yüksek, yüce, kendisinden daha yücesi olmayan.', '110', 'Her vakit', 'İlimde ve makamda yükselmek, fakirlikten kurtulmak.', 137),
('El-Kebîr', 'اَلْكَبِيرُ', 'Yâ Kebîr', 'En büyük, azamet sahibi, büyüklüğüne sınır olmayan.', '232', 'İkindi sonrası', 'Saygınlık kazanmak, borçları ödemede kolaylık.', 138),
('El-Hafîz', 'اَلْحَفِيظُ', 'Yâ Hafîz', 'Her şeyi muhafaza eden, koruyup gözeten.', '998', 'Tehlike anında', 'Belalardan, kazalardan, nazardan ve düşmandan korunma.', 139),
('El-Mukît', 'اَلْمُقِيتُ', 'Yâ Mukît', 'Her canlının gıdasını, azığını veren.', '550', 'Sabah namazı ardı', 'Muhtaç duruma düşmemek, rızık ve bedeni güç kazanmak.', 140),
('El-Hasîb', 'اَلْحَسِيبُ', 'Yâ Hasîb', 'Herkesin hayatının hesabını en iyi gören.', '80', 'Sabah-Akşam', 'Korkulardan emin olmak, haksızlığa karşı korunmak.', 141),
('El-Celîl', 'اَلْجَلِيلُ', 'Yâ Celîl', 'Azamet ve celal sahibi, yücelik sıfatları olan.', '73', 'Gün doğarken', 'Saygınlık, zalimlerin karşısında cesaret ve heybet.', 142),
('El-Kerîm', 'اَلْكَرِيمُ', 'Yâ Kerîm', 'Çok ikram edici, cömert, lütfu bol olan.', '270', 'Uyumadan önce', 'Kolay rızık, cömertlik ahlakı kazanmak ve darlıktan çıkış.', 143),
('Er-Rakîb', 'اَلرَّقِيبُ', 'Yâ Rakîb', 'Her an her şeyi gören, kontrolü altında tutan.', '312', 'Sabah namazı ardı', 'Kayıp eşyayı bulmak, hırsızlıktan ve nazardan korunmak.', 144),
('El-Mucîb', 'اَلْمُجِيبُ', 'Yâ Mucîb', 'Duaları, dilekleri kabul edip karşılık veren.', '55', 'Dua anında', 'Duaların hızlı kabul olması ve çaresizliklerin bitmesi.', 145),
('El-Vâsi', 'اَلْوَاسِعُ', 'Yâ Vâsi', 'İlmi, ihsanı ve rahmeti her şeyi kuşatan.', '137', 'Kuşluk vakti', 'Geçim genişliği, ömür bereketi ve ahlakın güzelleşmesi.', 146),
('El-Hakîm', 'اَلْحَكِيمُ', 'Yâ Hakîm', 'Her işi hikmetli, her şeyi yerli yerinde olan.', '608', 'Yatsı namazı ardı', 'İlim kapılarının açılması, doğru kararlar, huzur bulmak.', 147),
('El-Vedûd', 'اَلْوَدُودُ', 'Yâ Vedûd', 'Kullarını çok seven, sevilmeye en layık olan.', '20', 'Akşam-Yatsı arası', 'Eşler arası muhabbet, insanlar tarafından sevilmek.', 148),
('El-Mecîd', 'اَلْمَجِيدُ', 'Yâ Mecîd', 'Şerefi çok yüce, nimeti ve ihsanı bol olan.', '57', 'Sabah namazı ardı', 'İzzet ve şeref kazanmak, kronik hastalıklardan şifa.', 149),
('El-Bâis', 'اَلْبَاعِثُ', 'Yâ Bâis', 'Ölüleri dirilten, peygamberler gönderen.', '573', 'Gece yarısı', 'İbadet azmi kazanmak, muradına ermek ve ticari başarı.', 150),
('Eş-Şehîd', 'اَلشَّهِيدُ', 'Yâ Şehîd', 'Her zaman ve her yerde hazır ve nazır olan.', '319', 'Seher vakti', 'İnatçı çocukların ıslahı, adaletin yerini bulması.', 151),
('El-Hakk', 'اَلْحَقُّ', 'Yâ Hakk', 'Varlığı hiç değişmeyen, ibadete layık mutlak gerçek.', '108', 'Namazların ardı', 'İmandan ayrılmamak, işlerin yoluna girmesi ve doğruluk.', 152),
('El-Vekîl', 'اَلْوَكِيلُ', 'Yâ Vekîl', 'Kendisine tevekkül edenlerin işini en iyi çözen.', '66', 'Tehlike anında', 'İşlerin kolaylaşması, rızık kapıları, musibetten korunma.', 153),
('El-Kavî', 'اَلْقَوِيُّ', 'Yâ Kavî', 'Pek güçlü, kudretine hiçbir şekilde sınır olmayan.', '116', 'İkindi sonrası', 'Bedensel ve ruhsal güç, düşmanların şerrinden emin olmak.', 154),
('El-Metîn', 'اَلْمَتِينُ', 'Yâ Metîn', 'Çok sağlam, hiçbir şeyden sarsılmayan.', '500', 'Sabah namazı ardı', 'Maddi-manevi direnç, tembellikten kurtulmak ve kararlılık.', 155),
('El-Velî', 'اَلْوَلِيُّ', 'Yâ Velî', 'Müminlerin dostu, yardımcısı ve hamisi.', '46', 'Cuma gecesi', 'Allah dostu olmak, hayırlı evlilik ve işlerin yolunda gitmesi.', 156),
('El-Hamîd', 'اَلْحَمِيدُ', 'Yâ Hamîd', 'Her türlü övgüye ve hamde layık olan.', '62', 'Sabah-Akşam', 'Ahlak güzelliği, rızık genişliği ve dilin tatlı olması.', 157),
('El-Muhsî', 'اَلْمُحْصِي', 'Yâ Muhsî', 'Her şeyin sayısını bir bir bilen, kuşatan.', '148', 'Yatsı namazı ardı', 'Zeka ve hafızanın açılması, hesap gününden emin olmak.', 158),
('El-Mübdî', 'اَلْمُبْدِئُ', 'Yâ Mübdî', 'Maddesiz ve örneksiz olarak ilk baştan yaratan.', '56', 'İş başlangıcında', 'Başlanılan işlerin hayırla bitmesi, projelerde başarı.', 159),
('El-Muîd', 'اَلْمُعِيدُ', 'Yâ Muîd', 'Yarattıklarını yok ettikten sonra tekrar dirilten.', '124', 'Yatsı sonrası', 'Elinden çıkan malın geri gelmesi, kayıpların bulunması.', 160),
('El-Muhyî', 'اَلْمُحْيِي', 'Yâ Muhyî', 'Hayat veren, canlandıran, dirilten.', '68', 'Seher vakti', 'Kalp uyanıklığı, hastalıklardan şifa ve zindelik için.', 161),
('El-Mümît', 'اَلْمُمِيتُ', 'Yâ Mümît', 'Canlıların hayatına son veren, öldüren.', '490', 'Gece vakti', 'Nefsin şerrini kırmak, kötü alışkanlıklardan kurtulmak.', 162),
('El-Hayy', 'اَلْحَيُّ', 'Yâ Hayy', 'Ebedi hayata sahip, hep diri olan.', '18', 'Seher vakti', 'Uzun ve hayırlı ömür, kalbi uyanıklık ve sağlık.', 163),
('El-Kayyûm', 'اَلْقَيُّومُ', 'Yâ Kayyûm', 'Kainatı yöneten, her şeyi ayakta tutan.', '156', 'Seher vakti', 'İşlerin düzene girmesi, rızık sürekliliği ve unutkanlık.', 164),
('El-Vâcid', 'اَلْوَاجِدُ', 'Yâ Vâcid', 'İstediğini istediği an bulan, hiçbir şeye muhtaç olmayan.', '14', 'Yemeklerden sonra', 'Kaybolan nimetlerin geri gelmesi, kalbi zenginlik.', 165),
('El-Mâcid', 'اَلْمَاجِدُ', 'Yâ Mâcid', 'Kadri ve şanı büyük, kerem ve ihsanı bol olan.', '48', 'Kuşluk vakti', 'Mal-mülk bereketi, manevi rütbe ve iç huzur kazanmak.', 166),
('El-Vâhid', 'اَلْوَاحِدُ', 'Yâ Vâhid', 'Zatında, sıfatlarında ve işlerinde tek olan.', '19', 'İkindi sonrası', 'Kalp yalnızlığından kurtulmak, tevhidi idrak etmek.', 167),
('Es-Samed', 'اَلصَّمَدُ', 'Yâ Samed', 'Hiçbir şeye muhtaç olmayan, herkesin muhtaç olduğu.', '134', 'Seher vakti', 'Maddi ihtiyaçların bitmesi, kimseye muhtaç olmamak.', 168),
('El-Kâdir', 'اَلْقَادِرُ', 'Yâ Kâdir', 'İstediğini istediği gibi yapmaya gücü yeten.', '305', 'İş esnasında', 'İsteklerin gerçekleşmesi, acziyetten ve fukaralıktan kurtulma.', 169),
('El-Muktedir', 'اَلْمُقْتَدِرُ', 'Yâ Muktedir', 'Kuvvet ve kudret sahipleri üzerinde mutlak hakim.', '744', 'Uyanınca', 'İşlerde mutlak başarı, gafletten uyanma ve korunma.', 170),
('El-Mukaddim', 'اَلْمُقَدِّمُ', 'Yâ Mukaddim', 'Dilediğini öne geçiren, yükselten.', '184', 'Sınav/İş öncesi', 'Sınavlarda, makamda öne geçmek, başarılı olmak.', 171),
('El-Muahhir', 'اَلْمُؤَخِّرُ', 'Yâ Muahhir', 'Dilediğini arkaya bırakan, erteleyen.', '847', 'Tehlike anında', 'Kötülerin geride kalması, belaların ötelenmesi için.', 172),
('El-Evvel', 'اَلْأَوَّلُ', 'Yâ Evvel', 'Başlangıcı olmayan, her şeyden önce var olan.', '37', 'Gün başlarken', 'Girişilen işlerin ilk seferde başarılı olması niyetiyle.', 173),
('El-Âhir', 'اَلْآخِرُ', 'Yâ Âhir', 'Sonu olmayan, her şey yok olduktan sonra kalan.', '801', 'Akşam namazı ardı', 'Ömür bereketlenmesi, son nefeste imanla gitmek için.', 174),
('Ez-Zâhir', 'اَلظَّاهِرُ', 'Yâ Zâhir', 'Varlığı her şeyle açıkça bilinen, aşikar.', '1106', 'İşrak vakti', 'Gizli şeyleri öğrenmek, kalbin nurlanması ve zafer.', 175),
('El-Bâtın', 'اَلْبَاطِنُ', 'Yâ Bâtın', 'Zatının hakikati gizli olan, gözle görülmeyen.', '62', 'Yatsı namazı ardı', 'Kalp gözünün açılması, iç huzur ve gizli sırlara ermek.', 176),
('El-Vâlî', 'اَلْوَالِي', 'Yâ Vâlî', 'Kainatı tek başına yöneten, idare eden.', '47', 'Sabah-Akşam', 'İşlerin kolay idare edilmesi, ev ve iş yeri düzeni.', 177),
('El-Müteâlî', 'اَلْمُتَعَالِي', 'Yâ Müteâlî', 'Eksikliklerden münezzeh, her şeyden pek yüce.', '541', 'Namazların ardı', 'Makamda yükselmek, devlet işlerinde kolaylık bulmak.', 178),
('El-Berr', 'اَلْبَرُّ', 'Yâ Berr', 'Kullarına iyilik ve ihsanı bol olan.', '202', 'Sabah namazı ardı', 'Kötü alışkanlıkları bırakmak, iyilik ahlakı kazanmak.', 179),
('Et-Tevvâb', 'اَلتَّوَّابُ', 'Yâ Tevvâb', 'Tövbeleri çokça kabul eden, günahları bağışlayan.', '409', 'Kuşluk vakti', 'Tövbede sebat etmek, günahlardan tiksinmek için.', 180),
('El-Müntakım', 'اَلْمُنْتَقِمُ', 'Yâ Müntakım', 'Suçluları adaletiyle cezalandıran, intikam alan.', '630', 'Haksızlık anında', 'Zulmedenlerin şerrinden korunmak, hakkını geri almak.', 181),
('El-Afüvv', 'اَلْعَفُوُّ', 'Yâ Afüvv', 'Günahları tamamen silen, hiç işlememiş gibi yapan.', '156', 'Yatsı namazı ardı', 'Günahların affı ve kalbin kin duygusundan arınması.', 182),
('Er-Raûf', 'اَلرَّؤُوفُ', 'Yâ Raûf', 'Çok şefkatli, merhamet edip acıyan.', '287', 'Namazların ardı', 'İnsanların kalbine merhamet salmak, şefkat görmek.', 183),
('Mâlikü''l-Mülk', 'مَالِكُ الْمُلْكِ', 'Yâ Mâlikü''l-Mülk', 'Mülkün tek ve mutlak hakiki sahibi.', '212', 'Öğle namazı ardı', 'Mal-mülk edinmek, fakirlikten kesin olarak kurtulmak.', 184),
('Zü''l-Celâli ve''l-İkrâm', 'ذُو الْجَلَالِ وَالْإِكْرَامِ', 'Yâ Zü''l-Celâli ve''l-İkrâm', 'Hem azamet hem de fazl-u kerem sahibi olan.', '1100', 'Dua sonunda', 'Duaların kabul olması, her işin hayırla sonuçlanması.', 185),
('El-Muksit', 'اَلْمُقْسِطُ', 'Yâ Muksit', 'Her şeyi yerli yerine koyan, adaletli davranan.', '209', 'Namazların ardı', 'Hane içi huzursuzluğun bitmesi, vesveseden kurtulma.', 186),
('El-Câmi', 'اَلْجَامِعُ', 'Yâ Câmi', 'İstediğini istediği zaman ve yerde toplayan.', '114', 'Gün ortası', 'Ayrılanları birleştirmek, kaybolanı bulmak, evlilik.', 187),
('El-Ganî', 'اَلْغَنِيُّ', 'Yâ Ganî', 'Çok zengin, hiçbir şeye ihtiyacı olmayan.', '1060', 'Kuşluk vakti', 'Büyük maddi genişlik, rızık bolluğu ve kanaat bereketi.', 188),
('El-Muğnî', 'اَلْمُغْنِي', 'Yâ Muğnî', 'Dilediğini zengin kılan, ihtiyaçlarını gideren.', '1100', 'Kuşluk vakti', 'Geçim kolaylığı, borçların bitmesi ve maddi bağımsızlık.', 189),
('El-Mâni', 'اَلْمَانِعُ', 'Yâ Mâni', 'Dilemediği şeylerin gerçekleşmesine engel olan.', '161', 'Gece vakti', 'Kazalardan, belalardan ve düşman şerrinden korunma.', 190),
('Ed-Dârr', 'اَلضَّارُّ', 'Yâ Dârr', 'Elem ve zarar verici şeyleri yaratan.', '1001', 'Haksızlık anında', 'Zalimlerin hilelerini kendi başlarına yıkmak amacıyla.', 191),
('En-Nâfi', 'اَلنَّافِعُ', 'Yâ Nâfi', 'Hayır ve menfaat verici şeyleri yaratan.', '201', 'Sabah-Akşam', 'Sağlık ve şifa bulmak, işlerde kar ve kazanç sağlamak.', 192),
('En-Nûr', 'اَلنُّورُ', 'Yâ Nûr', 'Alemleri nurlandıran, dilediğine hidayet veren.', '256', 'Seher vakti', 'Kalbin aydınlanması, basiret açıklığı ve hidayet için.', 193),
('El-Hâdî', 'اَلْهَادِي', 'Yâ Hâdî', 'Doğru yola ulaştıran, hidayet veren.', '20', 'Namazların ardı', 'Doğru yolu bulmak, evlatların ıslahı ve hidayeti için.', 194),
('El-Bedî', 'اَلْبَدِيعُ', 'Yâ Bedî', 'Sanatıyla benzersiz, harika şeyler yaratan.', '86', 'Yatsı namazı ardı', 'İlimde derinleşmek, sanatta başarı ve iş çözümleri.', 195),
('El-Bâkî', 'اَلْبَاقِي', 'Yâ Bâkî', 'Varlığının sonu olmayan, ebedi olan.', '113', 'Gün batarken', 'Ömür bereketi, kalıcı başarılar ve korkulardan eminlik.', 196),
('El-Vâris', 'اَلْوَارِثُ', 'Yâ Vâris', 'Her şey yok olduktan sonra mülkü baki kalan.', '707', 'Akşam-Yatsı arası', 'Hayırlı evlilik, uzun ömür ve malın telef olmaktan korunması.', 197),
('Er-Raşîd', 'اَلرَّشِيدُ', 'Yâ Raşîd', 'Her şeyi en doğru yola ulaştıran, mürşid.', '514', 'Yatsı namazı ardı', 'Kararsızlıktan kurtulmak, kötü alışkanlıkları bırakmak.', 198),
('Es-Sabûr', 'اَلصَّبُورُ', 'Yâ Sabûr', 'Çok sabırlı, ceza vermede hiç acele etmeyen.', '298', 'Gün doğmadan önce', 'Sabır ve metanet kazanmak, işlerin selametle bitmesi.', 199)
) AS v(name, arabic, translit, meaning, ebced, vakit, purpose, prio)
WHERE NOT EXISTS (
  SELECT 1 FROM prayers p WHERE p.content_type = 'Esma' AND p.name = v.name
);

import { useI18n } from '@/lib/i18n';
import type { Prayer } from '@/lib/supabase';
import { SearchField } from '@/components/system-library/LibraryControls';
import { PrayerEntryList } from '@/components/system-library/PrayerEntries';

export function EsmaSection({
  prayers,
  query,
  onQueryChange,
}: {
  prayers: Prayer[];
  query: string;
  onQueryChange: (query: string) => void;
}) {
  const { t } = useI18n();
  const normalized = query.trim().toLowerCase();
  const filtered = prayers.filter(
    (prayer) =>
      !normalized ||
      [prayer.name, prayer.turkish_transliteration, prayer.meaning].some((value) =>
        (value || '').toLowerCase().includes(normalized)
      )
  );

  return (
    <section className="space-y-4">
      <h2 className="font-display text-xl font-bold text-gold-100">{t('library.sectionEsma')}</h2>
      <p className="rounded-xl border border-gold-400/20 bg-gold-400/5 px-4 py-3 text-xs leading-relaxed text-gold-200/90">
        {t('library.ebcedNote')}
      </p>

      <SearchField value={query} onChange={onQueryChange} placeholder={t('library.searchPrayers')} />

      {filtered.length === 0 ? (
        <p className="py-10 text-center text-sm text-midnight-400">{t('library.noResults')}</p>
      ) : (
        <PrayerEntryList prayers={filtered} variant="standard" showArabic />
      )}
    </section>
  );
}

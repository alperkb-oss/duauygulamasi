import { useI18n } from '@/lib/i18n';
import type { Prayer, PrayerUsage } from '@/lib/supabase';
import type { PurposeLabels } from '@/components/system-library/PrayerEntries';
import { PrayerEntryList } from '@/components/system-library/PrayerEntries';

export function DuaSection({
  prayers,
  getPurposes,
  getUsages,
}: {
  prayers: Prayer[];
  getPurposes: (prayer: Prayer) => PurposeLabels;
  getUsages: (prayer: Prayer) => PrayerUsage[];
}) {
  const { t } = useI18n();

  return (
    <section className="space-y-4">
      <h2 className="font-display text-xl font-bold text-gold-100">{t('library.duaSectionTitle')}</h2>
      {prayers.length === 0 ? (
        <p className="py-10 text-center text-sm text-midnight-400">{t('library.noResults')}</p>
      ) : (
        <PrayerEntryList prayers={prayers} variant="dua" showArabic getPurposes={getPurposes} getUsages={getUsages} />
      )}
    </section>
  );
}

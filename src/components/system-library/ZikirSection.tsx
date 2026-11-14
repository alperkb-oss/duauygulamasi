import { useI18n } from '@/lib/i18n';
import { purposeLabel } from '@/lib/purposes';
import type { Prayer, PurposeGroup } from '@/lib/supabase';
import { FilterChip, FilterRow, SearchField } from '@/components/system-library/LibraryControls';
import { PrayerEntryList, type PurposeLabels } from '@/components/system-library/PrayerEntries';
import type { PurposeSummary } from '@/components/system-library/systemLibraryData';

export type ZikirFilters = {
  query: string;
  purposeId: string | null;
  grouped: boolean;
};

type ZikirSectionProps = {
  prayers: Prayer[];
  purposes: PurposeGroup[];
  summaries: Map<string, PurposeSummary>;
  filters: ZikirFilters;
  onFiltersChange: (patch: Partial<ZikirFilters>) => void;
};

export function ZikirSection({ prayers, purposes, summaries, filters, onFiltersChange }: ZikirSectionProps) {
  const { t, lang } = useI18n();
  const query = filters.query.trim().toLowerCase();
  const activePurpose = purposes.find((purpose) => purpose.id === filters.purposeId) ?? null;

  const labelFor = (purposeId: string | null | undefined) => {
    const purpose = purposes.find((item) => item.id === purposeId);
    return purpose ? purposeLabel(purpose, lang) : null;
  };

  const purposesOf = (prayer: Prayer): PurposeLabels => {
    const summary = summaries.get(prayer.id);
    return {
      primary: labelFor(summary?.primaryId),
      secondary: (summary?.secondaryIds ?? []).map(labelFor).filter((label): label is string => Boolean(label)),
    };
  };

  const filtered = prayers.filter((prayer) => {
    const matchesQuery =
      !query ||
      [prayer.name, prayer.turkish_transliteration, prayer.meaning].some((value) =>
        (value || '').toLowerCase().includes(query)
      );
    const summary = summaries.get(prayer.id);
    const matchesPurpose =
      !filters.purposeId ||
      summary?.primaryId === filters.purposeId ||
      (summary?.secondaryIds.includes(filters.purposeId) ?? false);
    return matchesQuery && matchesPurpose;
  });

  const groups = purposes
    .map((purpose) => ({
      id: purpose.id,
      label: purposeLabel(purpose, lang),
      prayers: filtered.filter((prayer) => summaries.get(prayer.id)?.primaryId === purpose.id),
    }))
    .filter((group) => group.prayers.length > 0);
  const ungrouped = filtered.filter((prayer) => !summaries.get(prayer.id)?.primaryId);

  return (
    <section className="space-y-4">
      <h2 className="font-display text-xl font-bold text-gold-100">{t('library.sectionZikir')}</h2>

      <SearchField
        value={filters.query}
        onChange={(query) => onFiltersChange({ query })}
        placeholder={t('library.searchPrayers')}
      />

      <FilterRow>
        <FilterChip active={filters.purposeId === null} onClick={() => onFiltersChange({ purposeId: null })}>
          {t('library.purpose')}: {t('library.all')}
        </FilterChip>
        {purposes.map((purpose) => (
          <FilterChip
            key={purpose.id}
            active={filters.purposeId === purpose.id}
            onClick={() => onFiltersChange({ purposeId: purpose.id })}
          >
            {purposeLabel(purpose, lang)}
          </FilterChip>
        ))}
      </FilterRow>

      <div className="flex flex-wrap items-center justify-between gap-3">
        {activePurpose?.description_tr ? (
          <p className="max-w-prose animate-slide-up text-sm leading-relaxed text-midnight-300">
            {activePurpose.description_tr}
          </p>
        ) : (
          <span />
        )}
        <FilterChip active={filters.grouped} onClick={() => onFiltersChange({ grouped: !filters.grouped })}>
          {t('library.groupByPurpose')}
        </FilterChip>
      </div>

      {filtered.length === 0 ? (
        <p className="py-10 text-center text-sm text-midnight-400">{t('library.noResults')}</p>
      ) : filters.grouped ? (
        <div className="space-y-8">
          {groups.map((group) => (
            <div key={group.id} className="space-y-3">
              <h3 className="border-b border-emerald-800/30 pb-2 font-display text-base font-semibold text-gold-200">
                {group.label}
                <span className="ml-2 text-xs font-normal text-midnight-400">{group.prayers.length}</span>
              </h3>
              <PrayerEntryList prayers={group.prayers} variant="standard" getPurposes={purposesOf} />
            </div>
          ))}
          {ungrouped.length > 0 && <PrayerEntryList prayers={ungrouped} variant="standard" getPurposes={purposesOf} />}
        </div>
      ) : (
        <PrayerEntryList prayers={filtered} variant="standard" getPurposes={purposesOf} />
      )}
    </section>
  );
}

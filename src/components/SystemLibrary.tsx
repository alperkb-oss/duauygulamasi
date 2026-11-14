import { useState } from 'react';
import { BookOpen } from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import type { TranslationKey } from '@/lib/translations';
import type { SystemLibraryData } from '@/components/system-library/systemLibraryData';
import {
  buildPurposeSummaries,
  isDuaPrayer,
  isEsmaPrayer,
  isZikirPrayer,
  useSystemLibraryData,
} from '@/components/system-library/systemLibraryData';
import { FilterChip, FilterRow } from '@/components/system-library/LibraryControls';
import { DuaSection } from '@/components/system-library/DuaSection';
import { ZikirSection, type ZikirFilters } from '@/components/system-library/ZikirSection';
import { EsmaSection } from '@/components/system-library/EsmaSection';
import { GuideSection } from '@/components/system-library/GuideSection';

type SectionKey = 'quran' | 'dua' | 'zikir' | 'esma' | 'namaz' | 'abdest';

const SECTIONS: { key: SectionKey; labelKey: TranslationKey }[] = [
  { key: 'quran', labelKey: 'library.sectionQuran' },
  { key: 'dua', labelKey: 'library.sectionDua' },
  { key: 'zikir', labelKey: 'library.sectionZikir' },
  { key: 'esma', labelKey: 'library.sectionEsma' },
  { key: 'namaz', labelKey: 'library.sectionNamaz' },
  { key: 'abdest', labelKey: 'library.sectionAbdest' },
];

export function SystemLibrary() {
  const { t } = useI18n();
  const state = useSystemLibraryData();

  if (state.status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="w-8 h-8 border-2 border-gold-400/30 border-t-gold-400 rounded-full animate-spin" />
      </div>
    );
  }

  if (state.status === 'error') {
    return (
      <div className="glass-card p-6 text-center">
        <p className="text-sm text-midnight-300">{t('library.loadError')}</p>
      </div>
    );
  }

  return <SystemLibraryContent data={state.data} />;
}

function SystemLibraryContent({ data }: { data: SystemLibraryData }) {
  const [section, setSection] = useState<SectionKey>('dua');
  const [zikirFilters, setZikirFilters] = useState<ZikirFilters>({ query: '', purposeId: null, grouped: false });
  const [esmaQuery, setEsmaQuery] = useState('');
  const { t } = useI18n();

  const summaries = buildPurposeSummaries(data.purposeLinks);
  const duaPrayers = data.prayers.filter(isDuaPrayer);
  const zikirPrayers = data.prayers.filter(isZikirPrayer);
  const esmaPrayers = data.prayers.filter(isEsmaPrayer);
  const educationRows = (topic: 'namaz' | 'abdest') => data.educationalRows.filter((row) => row.topic === topic);

  return (
    <div className="space-y-6">
      <FilterRow>
        {SECTIONS.map(({ key, labelKey }) => (
          <FilterChip key={key} active={section === key} onClick={() => setSection(key)}>
            {t(labelKey)}
          </FilterChip>
        ))}
      </FilterRow>

      {section === 'quran' && <QuranPlaceholder />}
      {section === 'dua' && <DuaSection prayers={duaPrayers} />}
      {section === 'zikir' && (
        <ZikirSection
          prayers={zikirPrayers}
          purposes={data.purposes}
          summaries={summaries}
          filters={zikirFilters}
          onFiltersChange={(patch) => setZikirFilters((current) => ({ ...current, ...patch }))}
        />
      )}
      {section === 'esma' && (
        <EsmaSection prayers={esmaPrayers} query={esmaQuery} onQueryChange={setEsmaQuery} />
      )}
      {section === 'namaz' && <GuideSection titleKey="library.sectionNamaz" rows={educationRows('namaz')} />}
      {section === 'abdest' && <GuideSection titleKey="library.sectionAbdest" rows={educationRows('abdest')} />}
    </div>
  );
}

function QuranPlaceholder() {
  const { t } = useI18n();
  return (
    <section className="glass-card flex flex-col items-center justify-center gap-3 p-10 text-center">
      <BookOpen className="h-10 w-10 text-midnight-600" />
      <h2 className="font-display text-xl font-bold text-gold-100">{t('library.sectionQuran')}</h2>
      <p className="text-sm text-midnight-400">{t('library.quranComingSoon')}</p>
    </section>
  );
}

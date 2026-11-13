import { useEffect, useState, type ReactNode } from 'react';
import { Search, BookOpen, Hash, Clock, Sparkles, Sunrise, Moon } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { ContentType, Prayer, PurposeGroup, RecommendationBasis } from '@/lib/supabase';
import { useI18n } from '@/lib/i18n';
import { purposeLabel } from '@/lib/purposes';
import type { TranslationKey } from '@/lib/translations';
import { EducationalContent } from '@/components/EducationalContent';

const BASIS_KEYS: Record<RecommendationBasis, TranslationKey> = {
  hadith: 'library.basisHadith',
  quran: 'library.basisQuran',
  ebced: 'library.basisEbced',
  traditional: 'library.basisTraditional',
  unspecified: 'library.basisUnspecified',
};

const BASIS_STYLES: Record<RecommendationBasis, string> = {
  hadith: 'bg-emerald2-500/10 text-emerald2-400 border-emerald2-500/30',
  quran: 'bg-emerald2-500/10 text-emerald2-400 border-emerald2-500/30',
  ebced: 'bg-gold-400/10 text-gold-300 border-gold-400/20',
  traditional: 'bg-midnight-800/60 text-midnight-300 border-midnight-700',
  unspecified: 'bg-midnight-800/60 text-midnight-300 border-midnight-700',
};

const DUA_CONTENT_TYPES: ContentType[] = ['Dua', 'Sure', 'Ayet'];

const CONTENT_TYPE_KEYS: Partial<Record<ContentType, TranslationKey>> = {
  Dua: 'library.typeDua',
  Sure: 'library.typeSure',
  Ayet: 'library.typeAyet',
};

const isDuaPrayer = (prayer: Prayer) =>
  prayer.content_type !== null && DUA_CONTENT_TYPES.includes(prayer.content_type);

export function SystemLibrary() {
  const { t, lang } = useI18n();
  const [prayers, setPrayers] = useState<Prayer[]>([]);
  const [purposes, setPurposes] = useState<PurposeGroup[]>([]);
  const [prayersByPurpose, setPrayersByPurpose] = useState<Map<string, Set<string>>>(new Map());
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activePurpose, setActivePurpose] = useState<string | null>(null);

  useEffect(() => {
    loadLibrary();
  }, []);

  const loadLibrary = async () => {
    const [prayersRes, purposesRes, linksRes] = await Promise.all([
      supabase.from('prayers').select('*').order('priority_score', { ascending: true }),
      supabase.from('purpose_groups').select('*').order('sort_order', { ascending: true }),
      supabase.from('prayer_purposes').select('prayer_id, purpose_id'),
    ]);

    if (prayersRes.error || purposesRes.error || linksRes.error || !prayersRes.data) {
      setLoadError(true);
    } else {
      setPrayers(prayersRes.data as Prayer[]);
      setPurposes((purposesRes.data ?? []) as PurposeGroup[]);
      const links = new Map<string, Set<string>>();
      for (const link of (linksRes.data ?? []) as { prayer_id: string; purpose_id: string }[]) {
        const set = links.get(link.purpose_id) ?? new Set<string>();
        set.add(link.prayer_id);
        links.set(link.purpose_id, set);
      }
      setPrayersByPurpose(links);
    }
    setLoading(false);
  };

  const categories = Array.from(new Set(prayers.map((p) => p.category)));
  const query = search.trim().toLowerCase();

  const filtered = prayers.filter((p) => {
    const matchesSearch =
      !query ||
      [p.name, p.meaning, p.turkish_transliteration, p.category].some((value) =>
        (value || '').toLowerCase().includes(query)
      );
    const matchesCategory = !activeCategory || p.category === activeCategory;
    const matchesPurpose =
      !activePurpose || (prayersByPurpose.get(activePurpose)?.has(p.id) ?? false);
    return matchesSearch && matchesCategory && matchesPurpose;
  });
  const duaPrayers = filtered.filter(isDuaPrayer);
  const otherPrayers = filtered.filter((p) => !isDuaPrayer(p));

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="w-8 h-8 border-2 border-gold-400/30 border-t-gold-400 rounded-full animate-spin" />
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="glass-card p-6 text-center">
        <p className="text-sm text-midnight-300">{t('library.loadError')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm text-midnight-400">
          {prayers.length} {t('library.registered')}
        </p>
      </div>

      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-midnight-500 rtl:left-auto rtl:right-3.5" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t('library.searchPlaceholder')}
          className="w-full bg-emerald-950/40 border border-emerald-800/40 rounded-xl pl-10 pr-4 rtl:pr-10 rtl:pl-4 py-3 text-sm text-midnight-100 placeholder-midnight-500 focus:outline-none focus:border-gold-400/50 transition-colors"
        />
      </div>

      <FilterRow>
        <FilterChip active={activeCategory === null} onClick={() => setActiveCategory(null)}>
          {t('library.all')}
        </FilterChip>
        {categories.map((cat) => (
          <FilterChip key={cat} active={activeCategory === cat} onClick={() => setActiveCategory(cat)}>
            {cat}
          </FilterChip>
        ))}
      </FilterRow>

      {purposes.length > 0 && (
        <FilterRow>
          <FilterChip active={activePurpose === null} onClick={() => setActivePurpose(null)}>
            {t('library.purpose')}: {t('library.all')}
          </FilterChip>
          {purposes.map((purpose) => (
            <FilterChip
              key={purpose.id}
              active={activePurpose === purpose.id}
              onClick={() => setActivePurpose(purpose.id)}
            >
              {purposeLabel(purpose, lang)}
            </FilterChip>
          ))}
        </FilterRow>
      )}

      {activePurpose && purposes.find((p) => p.id === activePurpose)?.description_tr && (
        <p className="text-sm text-midnight-300 leading-relaxed animate-slide-up">
          {purposes.find((p) => p.id === activePurpose)?.description_tr}
        </p>
      )}

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[40vh] text-center">
          <BookOpen className="w-10 h-10 text-midnight-600 mb-3" />
          <p className="text-sm text-midnight-400">{t('library.noResults')}</p>
        </div>
      ) : (
        <div className="space-y-8">
          {otherPrayers.length > 0 && (
            <div className="space-y-3">
              {otherPrayers.map((prayer) => (
                <PrayerCard key={prayer.id} prayer={prayer} />
              ))}
            </div>
          )}
          {duaPrayers.length > 0 && (
            <section className="space-y-3">
              <h2 className="text-lg font-display font-bold text-gold-100 pb-2 border-b border-emerald-800/30">
                {t('library.duaSectionTitle')}
              </h2>
              {duaPrayers.map((prayer) => (
                <PrayerCard key={prayer.id} prayer={prayer} />
              ))}
            </section>
          )}
        </div>
      )}

      {!query && !activeCategory && !activePurpose && <EducationalContent />}
    </div>
  );
}

function FilterRow({ children }: { children: ReactNode }) {
  return <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-4 px-4">{children}</div>;
}

function FilterChip({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap ${
        active
          ? 'bg-gold-400 text-midnight-950'
          : 'bg-emerald-950/40 text-midnight-300 border border-emerald-800/40'
      }`}
    >
      {children}
    </button>
  );
}

function PrayerCard({ prayer }: { prayer: Prayer }) {
  const { t } = useI18n();
  const [expanded, setExpanded] = useState(false);
  const hasDetails = Boolean(prayer.arabic_text || prayer.meaning || prayer.source_reference);
  const typeKey = prayer.content_type ? CONTENT_TYPE_KEYS[prayer.content_type] : undefined;

  return (
    <div className="glass-card overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left p-4"
      >
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-lg font-display font-bold text-gold-100">{prayer.name}</h3>
              {typeKey && (
                <span className="shrink-0 px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald2-500/10 text-emerald2-400 border border-emerald2-500/30">
                  {t(typeKey)}
                </span>
              )}
            </div>
            {prayer.turkish_transliteration && (
              <p className="text-xs text-midnight-500 mt-0.5 italic font-arabic leading-relaxed">
                {prayer.turkish_transliteration}
              </p>
            )}
          </div>
          <span className="shrink-0 px-2.5 py-1 rounded-full text-[10px] font-medium bg-gold-400/10 text-gold-300 border border-gold-400/20 ml-2 rtl:ml-0 rtl:mr-2">
            {prayer.category}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-3 mt-2">
          {prayer.requires_counter && prayer.suggested_count && (
            <div className="flex items-center gap-1">
              <Hash className="w-3 h-3 text-gold-400/70" />
              <span className="text-xs text-midnight-300">{prayer.suggested_count}</span>
            </div>
          )}
          {prayer.suggested_time && (
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-gold-400/70" />
              <span className="text-xs text-midnight-300">{prayer.suggested_time}</span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-gold-400/70" />
            <span className="text-xs text-midnight-300">{t('library.priority')} #{prayer.priority_score}</span>
          </div>
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-medium border ${BASIS_STYLES[prayer.recommendation_basis]}`}
          >
            {t(BASIS_KEYS[prayer.recommendation_basis])}
          </span>
        </div>
      </button>

      {expanded && hasDetails && (
        <div className="px-4 pb-4 animate-slide-up">
          <div className="pt-3 border-t border-emerald-800/30 space-y-3">
            {prayer.arabic_text && (
              <p dir="rtl" className="font-arabic text-lg text-midnight-100 leading-loose text-right">
                {prayer.arabic_text}
              </p>
            )}
            {prayer.meaning && (
              <div className="flex items-start gap-2">
                <div className="flex flex-col gap-2 mt-0.5">
                  {prayer.suggested_time && <TimeIcon time={prayer.suggested_time} />}
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gold-400/70 font-medium uppercase tracking-wider mb-1">
                    {t('library.meaning')}
                  </p>
                  <p className="text-sm text-midnight-200 leading-relaxed">{prayer.meaning}</p>
                </div>
              </div>
            )}
            {prayer.source_reference && (
              <div>
                <p className="text-xs text-gold-400/70 font-medium uppercase tracking-wider mb-1">
                  {t('library.sources')}
                </p>
                <p className="text-xs text-midnight-300 leading-relaxed">{prayer.source_reference}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function TimeIcon({ time }: { time: string }) {
  const hasMorning = time.toLowerCase().includes('sabah') || time.toLowerCase().includes('seher');
  const hasEvening = time.toLowerCase().includes('akşam') || time.toLowerCase().includes('yatmadan');

  if (hasMorning && hasEvening) {
    return (
      <div className="flex gap-1">
        <Sunrise className="w-4 h-4 text-gold-400/60" />
        <Moon className="w-4 h-4 text-gold-400/60" />
      </div>
    );
  }
  if (hasMorning) return <Sunrise className="w-4 h-4 text-gold-400/60" />;
  if (hasEvening) return <Moon className="w-4 h-4 text-gold-400/60" />;
  return <Clock className="w-4 h-4 text-gold-400/60" />;
}

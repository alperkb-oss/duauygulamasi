import { useEffect, useState } from 'react';
import { Search, BookOpen, Hash, Clock, Sparkles, Sunrise, Moon } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { Prayer } from '@/lib/supabase';
import { useI18n } from '@/lib/i18n';

export function Library() {
  const { t } = useI18n();
  const [prayers, setPrayers] = useState<Prayer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState(t('library.all'));

  useEffect(() => {
    loadPrayers();
  }, []);

  const loadPrayers = async () => {
    const { data } = await supabase
      .from('prayers')
      .select('*')
      .order('priority_score', { ascending: true });
    if (data) setPrayers(data as Prayer[]);
    setLoading(false);
  };

  const allLabel = t('library.all');
  const categories = [allLabel, ...Array.from(new Set(prayers.map((p) => p.category)))];

  const filtered = prayers.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.meaning || '').toLowerCase().includes(search.toLowerCase()) ||
      (p.turkish_transliteration || '').toLowerCase().includes(search.toLowerCase()) ||
      (p.category || '').toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === allLabel || p.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-gold-400/30 border-t-gold-400 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="px-4 pt-6 pb-24 space-y-4 animate-fade-in">
      <div>
        <h1 className="text-2xl font-display font-bold text-gold-100">{t('library.title')}</h1>
        <p className="text-sm text-midnight-400 mt-1">
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

      <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-4 px-4">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap ${
              activeCategory === cat
                ? 'bg-gold-400 text-midnight-950'
                : 'bg-emerald-950/40 text-midnight-300 border border-emerald-800/40'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[40vh] text-center">
          <BookOpen className="w-10 h-10 text-midnight-600 mb-3" />
          <p className="text-sm text-midnight-400">{t('library.noResults')}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((prayer) => (
            <PrayerCard key={prayer.id} prayer={prayer} />
          ))}
        </div>
      )}
    </div>
  );
}

function PrayerCard({ prayer }: { prayer: Prayer }) {
  const { t } = useI18n();
  const [expanded, setExpanded] = useState(false);

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
          {prayer.suggested_count && (
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
        </div>
      </button>

      {expanded && prayer.meaning && (
        <div className="px-4 pb-4 animate-slide-up">
          <div className="pt-3 border-t border-emerald-800/30">
            <div className="flex items-start gap-2">
              <div className="flex flex-col gap-2 mt-0.5">
                {prayer.suggested_time && (
                  <TimeIcon time={prayer.suggested_time} />
                )}
              </div>
              <div className="flex-1">
                <p className="text-xs text-gold-400/70 font-medium uppercase tracking-wider mb-1">
                  {t('library.meaning')}
                </p>
                <p className="text-sm text-midnight-200 leading-relaxed">{prayer.meaning}</p>
              </div>
            </div>
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

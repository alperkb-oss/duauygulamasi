import { useState } from 'react';
import { Clock, Hash } from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import type { Prayer } from '@/lib/supabase';
import { LibraryDetailViewer } from '@/components/system-library/LibraryDetailViewer';
import {
  BASIS_KEYS,
  BASIS_STYLES,
  CONTENT_TYPE_KEYS,
  PrayerDetail,
} from '@/components/system-library/PrayerDetail';

export type PurposeLabels = { primary: string | null; secondary: string[] };

type PrayerEntryListProps = {
  prayers: Prayer[];
  variant: 'dua' | 'standard';
  showArabic?: boolean;
  getPurposes?: (prayer: Prayer) => PurposeLabels;
};

const NO_PURPOSES: PurposeLabels = { primary: null, secondary: [] };

export function PrayerEntryList({ prayers, variant, showArabic = false, getPurposes }: PrayerEntryListProps) {
  const [selected, setSelected] = useState<Prayer | null>(null);

  return (
    <>
      <ul className="space-y-3">
        {prayers.map((prayer) => (
          <li key={prayer.id}>
            <PrayerEntryItem
              prayer={prayer}
              showArabic={showArabic}
              purposes={getPurposes?.(prayer) ?? NO_PURPOSES}
              onOpen={() => setSelected(prayer)}
            />
          </li>
        ))}
      </ul>

      {selected && (
        <LibraryDetailViewer title={selected.name} onClose={() => setSelected(null)}>
          <PrayerDetail
            prayer={selected}
            primaryPurpose={getPurposes?.(selected).primary ?? null}
            secondaryPurposes={getPurposes?.(selected).secondary ?? []}
            variant={variant}
          />
        </LibraryDetailViewer>
      )}
    </>
  );
}

function PrayerEntryItem({
  prayer,
  showArabic,
  purposes,
  onOpen,
}: {
  prayer: Prayer;
  showArabic: boolean;
  purposes: PurposeLabels;
  onOpen: () => void;
}) {
  const { t } = useI18n();
  const typeKey = prayer.content_type ? CONTENT_TYPE_KEYS[prayer.content_type] : undefined;

  return (
    <button
      type="button"
      onClick={onOpen}
      aria-haspopup="dialog"
      className="glass-card group w-full p-4 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-gold-400/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1 space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-display text-lg font-bold text-gold-100">{prayer.name}</h3>
            {typeKey && (
              <span className="rounded-full border border-emerald2-500/30 bg-emerald2-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald2-400">
                {t(typeKey)}
              </span>
            )}
          </div>
          {showArabic && prayer.arabic_text && (
            <p dir="rtl" className="font-arabic text-lg leading-relaxed text-right text-midnight-100">
              {prayer.arabic_text}
            </p>
          )}
          {prayer.turkish_transliteration && (
            <p className="font-arabic text-xs italic leading-relaxed text-midnight-400">
              {prayer.turkish_transliteration}
            </p>
          )}
        </div>
        <span
          className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-medium ${BASIS_STYLES[prayer.recommendation_basis]}`}
        >
          {t(BASIS_KEYS[prayer.recommendation_basis])}
        </span>
      </div>

      {(purposes.primary || prayer.suggested_count || prayer.suggested_time) && (
        <div className="mt-3 flex flex-wrap items-center gap-3">
          {purposes.primary && (
            <span className="rounded-full border border-gold-400/20 bg-gold-400/10 px-2 py-0.5 text-[10px] font-medium text-gold-300">
              {purposes.primary}
            </span>
          )}
          {prayer.suggested_count && (
            <span className="flex items-center gap-1 text-xs text-midnight-300">
              <Hash className="h-3 w-3 text-gold-400/70" />
              {prayer.suggested_count}
            </span>
          )}
          {prayer.suggested_time && (
            <span className="flex items-center gap-1 text-xs text-midnight-300">
              <Clock className="h-3 w-3 text-gold-400/70" />
              {prayer.suggested_time}
            </span>
          )}
        </div>
      )}
    </button>
  );
}

import { useState, type ReactNode } from 'react';
import { useI18n } from '@/lib/i18n';
import type { PrayerUsage, PrayerUsageType } from '@/lib/supabase';
import type { TranslationKey } from '@/lib/translations';
import { MissingContent } from '@/components/system-library/MissingContent';

const USAGE_ORDER: PrayerUsageType[] = ['farz', 'sunnah', 'common'];

const USAGE_KEYS: Record<PrayerUsageType, TranslationKey> = {
  farz: 'library.usageFarz',
  sunnah: 'library.usageSunnah',
  common: 'library.usageCommon',
};

export function PrayerUsagePanel({ usages }: { usages: PrayerUsage[] }) {
  const { t } = useI18n();
  const available = USAGE_ORDER.flatMap((type) => usages.filter((usage) => usage.usage_type === type));
  const [selectedType, setSelectedType] = useState<PrayerUsageType | null>(null);
  const selected = available.find((usage) => usage.usage_type === selectedType) ?? available[0] ?? null;

  return (
    <section className="space-y-4 rounded-2xl border border-gold-400/20 bg-gold-400/5 p-4">
      <div className="space-y-1">
        <h3 className="text-xs font-medium uppercase tracking-wider text-gold-300">{t('library.usageTitle')}</h3>
        <p className="text-xs leading-relaxed text-gold-200/80">{t('library.usageHint')}</p>
      </div>

      <div role="group" aria-label={t('library.usageTitle')} className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
        {available.length === 0 ? (
          <span className="shrink-0 rounded-full border border-midnight-700 px-3.5 py-1.5 text-xs font-medium text-midnight-300">
            —
          </span>
        ) : (
          available.map((usage) => {
            const active = selected?.usage_type === usage.usage_type;
            return (
              <button
                key={usage.usage_type}
                type="button"
                aria-pressed={active}
                onClick={() => setSelectedType(usage.usage_type)}
                className={`shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 ${
                  active
                    ? 'border-gold-400/60 bg-gold-400/20 text-gold-100'
                    : 'border-midnight-700 bg-midnight-900/60 text-midnight-200 hover:border-gold-400/40'
                }`}
              >
                {t(USAGE_KEYS[usage.usage_type])}
              </button>
            );
          })
        )}
      </div>

      {selected ? (
        <dl key={selected.usage_type} className="grid animate-fade-in gap-4 sm:grid-cols-2">
          <UsageField label={t('library.usageStage')}>
            {selected.stages.length > 0 ? selected.stages.join(' · ') : <MissingContent />}
          </UsageField>
          <UsageField label={t('library.usageMethod')}>
            {selected.recitation_method ?? <MissingContent />}
          </UsageField>
          <UsageField label={t('library.usageExplanation')}>{selected.explanation ?? <MissingContent />}</UsageField>
          <UsageField label={t('library.sources')}>{selected.source_reference ?? <MissingContent />}</UsageField>
          <UsageField label={t('library.usageMadhhab')}>{selected.madhhab_note ?? <MissingContent />}</UsageField>
        </dl>
      ) : (
        <MissingContent />
      )}
    </section>
  );
}

function UsageField({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="space-y-1.5">
      <dt className="text-xs font-medium text-gold-400/80">{label}</dt>
      <dd className="text-sm leading-relaxed text-midnight-200">{children}</dd>
    </div>
  );
}

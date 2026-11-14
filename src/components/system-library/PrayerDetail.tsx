import type { ReactNode } from 'react';
import { useI18n } from '@/lib/i18n';
import type { ContentType, Prayer, PrayerUsage, RecommendationBasis, VerificationStatus } from '@/lib/supabase';
import type { TranslationKey } from '@/lib/translations';
import { MissingContent } from '@/components/system-library/MissingContent';
import { PrayerUsagePanel } from '@/components/system-library/PrayerUsagePanel';

export const BASIS_KEYS: Record<RecommendationBasis, TranslationKey> = {
  hadith: 'library.basisHadith',
  quran: 'library.basisQuran',
  ebced: 'library.basisEbced',
  traditional: 'library.basisTraditional',
  unspecified: 'library.basisUnspecified',
};

export const BASIS_STYLES: Record<RecommendationBasis, string> = {
  hadith: 'bg-emerald2-500/10 text-emerald2-400 border-emerald2-500/30',
  quran: 'bg-emerald2-500/10 text-emerald2-400 border-emerald2-500/30',
  ebced: 'bg-gold-400/10 text-gold-300 border-gold-400/20',
  traditional: 'bg-midnight-800/60 text-midnight-300 border-midnight-700',
  unspecified: 'bg-midnight-800/60 text-midnight-300 border-midnight-700',
};

export const CONTENT_TYPE_KEYS: Partial<Record<ContentType, TranslationKey>> = {
  Dua: 'library.typeDua',
  Sure: 'library.typeSure',
  Ayet: 'library.typeAyet',
};

const VERIFICATION_KEYS: Record<VerificationStatus, TranslationKey> = {
  verified: 'library.statusVerified',
  pending: 'library.statusPending',
  unverified: 'library.statusUnverified',
};

type PrayerDetailProps = {
  prayer: Prayer;
  primaryPurpose: string | null;
  secondaryPurposes: string[];
  usages: PrayerUsage[];
  variant: 'dua' | 'standard';
};

export function PrayerDetail({ prayer, primaryPurpose, secondaryPurposes, usages, variant }: PrayerDetailProps) {
  const { t } = useI18n();
  const isDua = variant === 'dua';
  const typeKey = prayer.content_type ? CONTENT_TYPE_KEYS[prayer.content_type] : undefined;
  const notes = [prayer.count_note, isDua ? null : prayer.purpose_note].filter(
    (value): value is string => Boolean(value)
  );

  return (
    <article className="space-y-6">
      {prayer.arabic_text ? (
        <p
          dir="rtl"
          className="rounded-2xl border border-emerald-800/40 bg-emerald-950/30 p-5 text-right font-arabic text-2xl leading-loose text-midnight-100"
        >
          {prayer.arabic_text}
        </p>
      ) : (
        <MissingContent />
      )}

      <div className="space-y-5">
        <DetailField label={t('library.transliteration')}>
          {prayer.turkish_transliteration ? (
            <p className="italic text-midnight-300">{prayer.turkish_transliteration}</p>
          ) : (
            <MissingContent />
          )}
        </DetailField>

        <DetailField label={t('library.meaning')}>
          {prayer.meaning ? <p>{prayer.meaning}</p> : <MissingContent />}
        </DetailField>

        <DetailField label={t('library.purpose')}>
          {primaryPurpose || secondaryPurposes.length > 0 ? (
            <div className="space-y-1">
              {primaryPurpose && (
                <p>
                  <span className="text-xs text-midnight-400">{t('library.primaryPurpose')}: </span>
                  {primaryPurpose}
                </p>
              )}
              {secondaryPurposes.length > 0 && (
                <p className="text-xs text-midnight-400">
                  {t('library.secondaryPurpose')}: {secondaryPurposes.join(' · ')}
                </p>
              )}
            </div>
          ) : (
            <MissingContent />
          )}
        </DetailField>

        <DetailField label={t('library.suggestedCount')}>
          {prayer.suggested_count ? <p>{prayer.suggested_count}</p> : <MissingContent />}
        </DetailField>

        <DetailField label={t('library.suggestedTime')}>
          {prayer.suggested_time ? <p>{prayer.suggested_time}</p> : <MissingContent />}
        </DetailField>

        <DetailField label={t('library.sources')}>
          {prayer.source_reference ? <p className="text-midnight-300">{prayer.source_reference}</p> : <MissingContent />}
        </DetailField>

        <DetailField label={t('library.basis')}>
          <div className="flex flex-wrap gap-2">
            <span
              className={`rounded-full border px-2.5 py-1 text-[10px] font-medium ${BASIS_STYLES[prayer.recommendation_basis]}`}
            >
              {t(BASIS_KEYS[prayer.recommendation_basis])}
            </span>
            {typeKey && (
              <span className="rounded-full border border-emerald2-500/30 bg-emerald2-500/10 px-2.5 py-1 text-[10px] font-medium text-emerald2-400">
                {t(typeKey)}
              </span>
            )}
            <span className="rounded-full border border-gold-400/20 bg-gold-400/10 px-2.5 py-1 text-[10px] font-medium text-gold-300">
              {prayer.category}
            </span>
          </div>
        </DetailField>

        <DetailField label={t('library.verification')}>
          <p>{t(VERIFICATION_KEYS[prayer.verification_status])}</p>
        </DetailField>

        <DetailField label={t('library.notes')}>
          {notes.length > 0 ? (
            notes.map((note) => (
              <p key={note} className="text-midnight-300">
                {note}
              </p>
            ))
          ) : (
            <MissingContent />
          )}
        </DetailField>
      </div>

      {isDua && <PrayerUsagePanel usages={usages} />}
    </article>
  );
}

function DetailField({ label, children }: { label: string; children: ReactNode }) {
  return (
    <section className="space-y-1.5 border-t border-emerald-800/30 pt-4">
      <h3 className="text-xs font-medium uppercase tracking-wider text-gold-400/80">{label}</h3>
      <div className="text-sm leading-relaxed text-midnight-200">{children}</div>
    </section>
  );
}

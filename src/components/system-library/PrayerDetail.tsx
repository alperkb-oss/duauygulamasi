import type { ReactNode } from 'react';
import { useI18n } from '@/lib/i18n';
import type { ContentType, Prayer, RecommendationBasis, VerificationStatus } from '@/lib/supabase';
import type { TranslationKey } from '@/lib/translations';

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
  variant: 'dua' | 'standard';
};

export function PrayerDetail({ prayer, primaryPurpose, secondaryPurposes, variant }: PrayerDetailProps) {
  const { t } = useI18n();
  const isDua = variant === 'dua';
  const typeKey = prayer.content_type ? CONTENT_TYPE_KEYS[prayer.content_type] : undefined;
  const notVerified = <span className="italic text-midnight-500">{t('library.notVerified')}</span>;
  const notes = [prayer.count_note, isDua ? null : prayer.purpose_note].filter(
    (value): value is string => Boolean(value)
  );

  return (
    <article className="space-y-6">
      <header className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-gold-400/20 bg-gold-400/10 px-2.5 py-1 text-[10px] font-medium text-gold-300">
            {prayer.category}
          </span>
          {typeKey && (
            <span className="rounded-full border border-emerald2-500/30 bg-emerald2-500/10 px-2.5 py-1 text-[10px] font-medium text-emerald2-400">
              {t(typeKey)}
            </span>
          )}
        </div>
        {prayer.turkish_transliteration && (
          <p className="font-arabic text-base italic leading-relaxed text-midnight-300">
            {prayer.turkish_transliteration}
          </p>
        )}
      </header>

      {prayer.arabic_text && (
        <p
          dir="rtl"
          className="rounded-2xl border border-emerald-800/40 bg-emerald-950/30 p-5 text-right font-arabic text-2xl leading-loose text-midnight-100"
        >
          {prayer.arabic_text}
        </p>
      )}

      <div className="space-y-5">
        <DetailField label={t('library.meaning')}>
          {prayer.meaning ? <p>{prayer.meaning}</p> : notVerified}
        </DetailField>

        <DetailField label={t('library.sources')}>
          {prayer.source_reference ? <p className="text-midnight-300">{prayer.source_reference}</p> : notVerified}
        </DetailField>

        <DetailField label={t('library.verification')}>
          <p>{t(VERIFICATION_KEYS[prayer.verification_status])}</p>
        </DetailField>

        {isDua && (
          <>
            <DetailField label={t('library.recitedIn')}>
              {prayer.purpose_note ? <p className="text-midnight-300">{prayer.purpose_note}</p> : notVerified}
            </DetailField>
            <DetailField label={t('library.recitationReason')}>{notVerified}</DetailField>
            <DetailField label={t('library.religiousStatus')}>{notVerified}</DetailField>
          </>
        )}

        {(primaryPurpose || secondaryPurposes.length > 0) && (
          <DetailField label={t('library.primaryPurpose')}>
            <p>{primaryPurpose ?? t('library.notVerified')}</p>
            {secondaryPurposes.length > 0 && (
              <p className="mt-1 text-xs text-midnight-400">
                {t('library.secondaryPurpose')}: {secondaryPurposes.join(' · ')}
              </p>
            )}
          </DetailField>
        )}

        {prayer.suggested_count && (
          <DetailField label={t('library.suggestedCount')}>
            <p>{prayer.suggested_count}</p>
          </DetailField>
        )}

        {prayer.suggested_time && (
          <DetailField label={t('library.suggestedTime')}>
            <p>{prayer.suggested_time}</p>
          </DetailField>
        )}

        {notes.length > 0 && (
          <DetailField label={t('library.notes')}>
            {notes.map((note) => (
              <p key={note} className="text-midnight-300">
                {note}
              </p>
            ))}
          </DetailField>
        )}
      </div>
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

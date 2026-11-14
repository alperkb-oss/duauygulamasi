import { useI18n } from '@/lib/i18n';

export function MissingContent() {
  const { t } = useI18n();
  return (
    <p className="rounded-lg border border-dashed border-midnight-700 px-3 py-2 text-xs italic text-midnight-400">
      {t('library.missingContent')}
    </p>
  );
}

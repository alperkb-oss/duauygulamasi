import { useState } from 'react';
import { useI18n } from '@/lib/i18n';
import type { TranslationKey } from '@/lib/translations';
import type { EducationalRow } from '@/lib/supabase';
import { LibraryDetailViewer } from '@/components/system-library/LibraryDetailViewer';
import { EducationalBody } from '@/components/system-library/EducationalBody';

export function GuideSection({ titleKey, rows }: { titleKey: TranslationKey; rows: EducationalRow[] }) {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const title = t(titleKey);

  return (
    <section className="space-y-4">
      <h2 className="font-display text-xl font-bold text-gold-100">{title}</h2>
      {rows.length === 0 ? (
        <p className="py-10 text-center text-sm text-midnight-400">{t('library.noResults')}</p>
      ) : (
        <div className="glass-card space-y-4 p-5">
          <p className="text-xs text-midnight-400">{t('library.educationNote')}</p>
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-haspopup="dialog"
            className="rounded-full bg-gold-400 px-5 py-2.5 text-sm font-medium text-midnight-950 transition-all hover:bg-gold-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400"
          >
            {t('library.readFullScreen')}
          </button>
        </div>
      )}

      {open && (
        <LibraryDetailViewer title={title} onClose={() => setOpen(false)}>
          <EducationalBody rows={rows} />
        </LibraryDetailViewer>
      )}
    </section>
  );
}

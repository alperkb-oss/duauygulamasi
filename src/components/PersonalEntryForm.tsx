import { useState, type ReactNode } from 'react';
import { X } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { PersonalLibraryEntry, PurposeGroup } from '@/lib/supabase';
import { useI18n } from '@/lib/i18n';
import { purposeLabel } from '@/lib/purposes';

type PersonalEntryFormProps = {
  entry: PersonalLibraryEntry | null;
  purposes: PurposeGroup[];
  onClose: () => void;
  onSaved: (entry: PersonalLibraryEntry) => void;
};

const LIMIT_VIOLATION_CODE = '23514';

const inputClass =
  'w-full bg-midnight-900/60 border border-midnight-700 rounded-xl px-4 py-3 text-sm text-midnight-100 placeholder-midnight-500 focus:outline-none focus:border-gold-400/50 transition-colors';

function toNullable(value: string): string | null {
  const trimmed = value.trim();
  return trimmed === '' ? null : trimmed;
}

export function PersonalEntryForm({ entry, purposes, onClose, onSaved }: PersonalEntryFormProps) {
  const { t, lang } = useI18n();
  const [arabic, setArabic] = useState(entry?.arabic_text ?? '');
  const [transliteration, setTransliteration] = useState(entry?.transliteration ?? '');
  const [meaning, setMeaning] = useState(entry?.meaning ?? '');
  const [purposeId, setPurposeId] = useState(entry?.purpose_id ?? '');
  const [category, setCategory] = useState(entry?.category ?? '');
  const [sources, setSources] = useState(entry?.sources ?? '');
  const [suggestedCount, setSuggestedCount] = useState(entry?.suggested_count ?? '');
  const [suggestedTime, setSuggestedTime] = useState(entry?.suggested_time ?? '');
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async () => {
    const payload = {
      arabic_text: toNullable(arabic),
      transliteration: toNullable(transliteration),
      meaning: toNullable(meaning),
      purpose_id: purposeId || null,
      category: toNullable(category),
      sources: toNullable(sources),
      suggested_count: toNullable(suggestedCount),
      suggested_time: toNullable(suggestedTime),
    };

    if (!payload.arabic_text && !payload.transliteration && !payload.meaning) {
      setError(t('library.requiresText'));
      return;
    }

    setSaving(true);
    setError(null);
    const result = entry
      ? await supabase
          .from('personal_library_entries')
          .update(payload)
          .eq('id', entry.id)
          .select()
          .maybeSingle()
      : await supabase.from('personal_library_entries').insert(payload).select().maybeSingle();
    setSaving(false);

    if (result.error || !result.data) {
      setError(
        result.error?.code === LIMIT_VIOLATION_CODE ? t('library.personalLimit') : t('library.saveError')
      );
      return;
    }
    onSaved(result.data as PersonalLibraryEntry);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/70 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="glass-card max-w-sm w-full max-h-[85vh] overflow-y-auto p-6 animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-display font-bold text-gold-100">
            {entry ? t('library.editEntry') : t('library.addEntry')}
          </h3>
          <button onClick={onClose} className="text-midnight-400 hover:text-midnight-200 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3">
          <Field label={t('library.arabic')}>
            <textarea
              value={arabic}
              onChange={(e) => setArabic(e.target.value)}
              rows={2}
              maxLength={2000}
              dir="rtl"
              className={`${inputClass} font-arabic resize-none`}
            />
          </Field>

          <Field label={t('library.transliteration')}>
            <input
              type="text"
              value={transliteration}
              onChange={(e) => setTransliteration(e.target.value)}
              maxLength={500}
              className={inputClass}
            />
          </Field>

          <Field label={t('library.meaning')}>
            <textarea
              value={meaning}
              onChange={(e) => setMeaning(e.target.value)}
              rows={3}
              maxLength={2000}
              className={`${inputClass} resize-none`}
            />
          </Field>

          {purposes.length > 0 && (
            <Field label={t('library.purpose')}>
              <select
                value={purposeId}
                onChange={(e) => setPurposeId(e.target.value)}
                className={inputClass}
              >
                <option value="">-</option>
                {purposes.map((purpose) => (
                  <option key={purpose.id} value={purpose.id}>
                    {purposeLabel(purpose, lang)}
                  </option>
                ))}
              </select>
            </Field>
          )}

          <Field label={t('library.category')}>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              maxLength={200}
              className={inputClass}
            />
          </Field>

          <Field label={t('library.sources')}>
            <input
              type="text"
              value={sources}
              onChange={(e) => setSources(e.target.value)}
              maxLength={500}
              className={inputClass}
            />
          </Field>

          <Field label={t('library.suggestedCount')}>
            <input
              type="text"
              value={suggestedCount}
              onChange={(e) => setSuggestedCount(e.target.value)}
              maxLength={100}
              className={inputClass}
            />
          </Field>

          <Field label={t('library.suggestedTime')}>
            <input
              type="text"
              value={suggestedTime}
              onChange={(e) => setSuggestedTime(e.target.value)}
              maxLength={100}
              className={inputClass}
            />
          </Field>

          {error && <p className="text-sm text-red-300">{error}</p>}
        </div>

        <div className="flex gap-3 w-full mt-6">
          <button className="btn-ghost flex-1" onClick={onClose} disabled={saving}>
            {t('common.cancel')}
          </button>
          <button className="btn-primary flex-1" onClick={handleSubmit} disabled={saving}>
            {t('common.confirm')}
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="block text-xs text-midnight-400 mb-1.5">{label}</span>
      {children}
    </label>
  );
}

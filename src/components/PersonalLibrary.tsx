import { useEffect, useState } from 'react';
import { BookOpen, Clock, Hash, Pencil, Plus, Trash2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { PersonalLibraryEntry, PurposeGroup } from '@/lib/supabase';
import { useAuth } from '@/lib/auth';
import { useI18n } from '@/lib/i18n';
import { purposeLabel } from '@/lib/purposes';
import { AuthModal } from '@/components/AuthModal';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { PersonalEntryForm } from '@/components/PersonalEntryForm';

const MAX_PERSONAL_ENTRIES = 100;

export function PersonalLibrary() {
  const { t, lang } = useI18n();
  const { authState } = useAuth();
  const isSignedIn = authState.status === 'authenticated';

  const [entries, setEntries] = useState<PersonalLibraryEntry[]>([]);
  const [purposes, setPurposes] = useState<PurposeGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<PersonalLibraryEntry | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<PersonalLibraryEntry | null>(null);

  useEffect(() => {
    if (!isSignedIn) return;
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setLoadError(false);
      const [entriesRes, purposesRes] = await Promise.all([
        supabase
          .from('personal_library_entries')
          .select('*')
          .order('created_at', { ascending: false }),
        supabase.from('purpose_groups').select('*').order('sort_order', { ascending: true }),
      ]);
      if (cancelled) return;
      if (entriesRes.error || !entriesRes.data || purposesRes.error) {
        setLoadError(true);
      } else {
        setEntries(entriesRes.data as PersonalLibraryEntry[]);
        setPurposes((purposesRes.data ?? []) as PurposeGroup[]);
      }
      setLoading(false);
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [isSignedIn]);

  const purposeNameById = new Map(purposes.map((p) => [p.id, purposeLabel(p, lang)]));
  const atLimit = entries.length >= MAX_PERSONAL_ENTRIES;

  const openCreate = () => {
    setEditing(null);
    setActionError(null);
    setFormOpen(true);
  };

  const openEdit = (entry: PersonalLibraryEntry) => {
    setEditing(entry);
    setActionError(null);
    setFormOpen(true);
  };

  const handleSaved = (saved: PersonalLibraryEntry) => {
    setEntries((prev) =>
      prev.some((e) => e.id === saved.id)
        ? prev.map((e) => (e.id === saved.id ? saved : e))
        : [saved, ...prev]
    );
    setFormOpen(false);
    setEditing(null);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    const target = deleteTarget;
    setDeleteTarget(null);
    const { error } = await supabase.from('personal_library_entries').delete().eq('id', target.id);
    if (error) {
      setActionError(t('library.saveError'));
      return;
    }
    setEntries((prev) => prev.filter((e) => e.id !== target.id));
  };

  if (authState.status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="w-8 h-8 border-2 border-gold-400/30 border-t-gold-400 rounded-full animate-spin" />
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="glass-card p-6 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-gold-400/10 flex items-center justify-center mx-auto border border-gold-400/20">
          <BookOpen className="w-8 h-8 text-gold-400" />
        </div>
        <p className="text-sm text-midnight-300 leading-relaxed">{t('library.signInToUse')}</p>
        <button onClick={() => setShowAuthModal(true)} className="btn-primary w-full">
          {t('auth.signIn')}
        </button>
        <AuthModal open={showAuthModal} onClose={() => setShowAuthModal(false)} />
      </div>
    );
  }

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
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-midnight-400">
          {entries.length} / {MAX_PERSONAL_ENTRIES}
        </p>
        <button
          onClick={openCreate}
          disabled={atLimit}
          className="btn-primary flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Plus className="w-4 h-4" />
          {t('library.addEntry')}
        </button>
      </div>

      {atLimit && <p className="text-sm text-gold-300">{t('library.personalLimit')}</p>}
      {actionError && <p className="text-sm text-red-300">{actionError}</p>}

      {entries.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[30vh] text-center">
          <BookOpen className="w-10 h-10 text-midnight-600 mb-3" />
          <p className="text-sm text-midnight-400 max-w-xs">{t('library.personalEmpty')}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {entries.map((entry) => (
            <div key={entry.id} className="glass-card p-4 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0 space-y-1.5">
                  {entry.arabic_text && (
                    <p dir="rtl" className="font-arabic text-base text-midnight-100 leading-loose text-right">
                      {entry.arabic_text}
                    </p>
                  )}
                  {entry.transliteration && (
                    <p className="text-sm italic text-gold-100 font-medium">{entry.transliteration}</p>
                  )}
                  {entry.meaning && (
                    <p className="text-sm text-midnight-200 leading-relaxed">{entry.meaning}</p>
                  )}
                </div>
                <div className="flex gap-1.5 shrink-0">
                  <button
                    onClick={() => openEdit(entry)}
                    aria-label={t('library.editEntry')}
                    className="w-8 h-8 rounded-full bg-emerald-900/60 flex items-center justify-center text-midnight-300 hover:text-gold-400 transition-colors border border-emerald-800/40"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setDeleteTarget(entry)}
                    aria-label={t('library.deleteEntry')}
                    className="w-8 h-8 rounded-full bg-emerald-900/60 flex items-center justify-center text-midnight-300 hover:text-red-300 transition-colors border border-emerald-800/40"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {entry.category && (
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-medium bg-gold-400/10 text-gold-300 border border-gold-400/20">
                    {entry.category}
                  </span>
                )}
                {entry.purpose_id && purposeNameById.get(entry.purpose_id) && (
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-medium bg-emerald2-500/10 text-emerald2-400 border border-emerald2-500/30">
                    {purposeNameById.get(entry.purpose_id)}
                  </span>
                )}
                {entry.suggested_count && (
                  <div className="flex items-center gap-1">
                    <Hash className="w-3 h-3 text-gold-400/70" />
                    <span className="text-xs text-midnight-300">{entry.suggested_count}</span>
                  </div>
                )}
                {entry.suggested_time && (
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-gold-400/70" />
                    <span className="text-xs text-midnight-300">{entry.suggested_time}</span>
                  </div>
                )}
              </div>

              {entry.sources && (
                <p className="text-xs text-midnight-400">
                  {t('library.sources')}: {entry.sources}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {formOpen && (
        <PersonalEntryForm
          entry={editing}
          purposes={purposes}
          onClose={() => {
            setFormOpen(false);
            setEditing(null);
          }}
          onSaved={handleSaved}
        />
      )}

      <ConfirmDialog
        open={deleteTarget !== null}
        title={t('library.deleteEntry')}
        message={t('library.confirmDeleteEntry')}
        confirmText={t('common.delete')}
        cancelText={t('common.cancel')}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}

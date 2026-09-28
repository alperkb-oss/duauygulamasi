import { useEffect, useState } from 'react';
import { Plus, Trash2, BookPlus, X, Check, ChevronDown } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { ReadingPlan, PlanDetailWithPrayer, Prayer } from '@/lib/supabase';
import { ConfirmDialog } from './ConfirmDialog';
import { useI18n } from '@/lib/i18n';

export function Plans() {
  const { t } = useI18n();
  const [plans, setPlans] = useState<ReadingPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [newPlanName, setNewPlanName] = useState('');
  const [expandedPlanId, setExpandedPlanId] = useState<string | null>(null);
  const [planDetailsMap, setPlanDetailsMap] = useState<Record<string, PlanDetailWithPrayer[]>>({});
  const [allPrayers, setAllPrayers] = useState<Prayer[]>([]);
  const [showAddPrayer, setShowAddPrayer] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ type: 'plan' | 'prayer'; id: string; planId?: string } | null>(null);

  useEffect(() => {
    loadPlans();
    loadPrayers();
  }, []);

  const loadPlans = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('reading_plans')
      .select('*')
      .order('created_at', { ascending: false });

    if (data) {
      setPlans(data as ReadingPlan[]);
      const detailsMap: Record<string, PlanDetailWithPrayer[]> = {};
      for (const plan of data) {
        const { data: details } = await supabase
          .from('plan_details')
          .select('*, prayers(*)')
          .eq('plan_id', plan.id)
          .order('sequence_order', { ascending: true });
        detailsMap[plan.id] = (details || []) as PlanDetailWithPrayer[];
      }
      setPlanDetailsMap(detailsMap);
    }
    setLoading(false);
  };

  const loadPrayers = async () => {
    const { data } = await supabase
      .from('prayers')
      .select('*')
      .order('priority_score', { ascending: true });
    if (data) setAllPrayers(data as Prayer[]);
  };

  const handleCreatePlan = async () => {
    if (!newPlanName.trim()) return;
    const { data } = await supabase
      .from('reading_plans')
      .insert({ plan_name: newPlanName.trim(), is_active: plans.length === 0 })
      .select()
      .single();

    if (data) {
      setNewPlanName('');
      setShowCreate(false);
      await loadPlans();
    }
  };

  const handleToggleActive = async (plan: ReadingPlan) => {
    if (plan.is_active) return;
    await supabase.from('reading_plans').update({ is_active: false }).neq('id', plan.id);
    await supabase.from('reading_plans').update({ is_active: true }).eq('id', plan.id);
    await loadPlans();
  };

  const handleAddPrayer = async (planId: string, prayer: Prayer) => {
    const existing = planDetailsMap[planId] || [];
    const maxSeq = existing.length > 0 ? Math.max(...existing.map((d) => d.sequence_order)) : 0;

    const { data: detail } = await supabase
      .from('plan_details')
      .insert({
        plan_id: planId,
        prayer_id: prayer.id,
        target_days: 7,
        target_count_morning: 100,
        target_count_evening: 100,
        sequence_order: maxSeq + 1,
      })
      .select()
      .single();

    if (detail) {
      await supabase.from('user_daily_progress').insert({
        plan_detail_id: detail.id,
        current_day_number: 1,
        morning_count_done: 0,
        evening_count_done: 0,
        is_morning_completed: false,
        is_evening_completed: false,
        date: new Date().toISOString().split('T')[0],
      });
      setShowAddPrayer(null);
      await loadPlans();
    }
  };

  const handleRemovePrayer = async (planDetailId: string) => {
    await supabase.from('plan_details').delete().eq('id', planDetailId);
    setDeleteTarget(null);
    await loadPlans();
  };

  const handleDeletePlan = async (planId: string) => {
    await supabase.from('reading_plans').delete().eq('id', planId);
    setDeleteTarget(null);
    await loadPlans();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-gold-400/30 border-t-gold-400 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="px-4 pt-6 pb-24 space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-display font-bold text-gold-100">{t('plans.title')}</h1>
        <button
          onClick={() => setShowCreate(true)}
          className="w-10 h-10 rounded-full bg-gold-400 text-midnight-950 flex items-center justify-center active:scale-90 transition-transform"
        >
          <Plus className="w-5 h-5" strokeWidth={2.5} />
        </button>
      </div>

      {plans.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
          <p className="text-sm text-midnight-400 mb-4">{t('plans.noPlans')}</p>
          <button onClick={() => setShowCreate(true)} className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" /> {t('plans.newPlan')}
          </button>
        </div>
      ) : (
        plans.map((plan) => {
          const details = planDetailsMap[plan.id] || [];
          const isExpanded = expandedPlanId === plan.id;

          return (
            <div key={plan.id} className="glass-card overflow-hidden">
              <button
                onClick={() => setExpandedPlanId(isExpanded ? null : plan.id)}
                className="w-full flex items-center justify-between p-4 text-left"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-2 h-2 rounded-full ${plan.is_active ? 'bg-emerald2-400' : 'bg-midnight-600'}`}
                  />
                  <div>
                    <h3 className="text-base font-display font-bold text-gold-100">{plan.plan_name}</h3>
                    <p className="text-xs text-midnight-400">
                      {details.length} {t('plans.prayers')} · {plan.is_active ? t('plans.active') : t('plans.passive')}
                    </p>
                  </div>
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-midnight-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                />
              </button>

              {isExpanded && (
                <div className="px-4 pb-4 space-y-2 animate-slide-up">
                  {!plan.is_active && (
                    <button
                      onClick={() => handleToggleActive(plan)}
                      className="w-full text-sm text-gold-400 py-2 rounded-lg bg-gold-400/5 border border-gold-400/20 hover:bg-gold-400/10 transition-colors"
                    >
                      {t('plans.makeActive')}
                    </button>
                  )}

                  {details.map((detail) => (
                    <div
                      key={detail.id}
                      className="flex items-center gap-3 bg-midnight-700/30 rounded-xl p-3"
                    >
                      <div className="w-7 h-7 rounded-full bg-midnight-800 flex items-center justify-center text-xs font-bold text-gold-400 shrink-0">
                        {detail.sequence_order}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-midnight-100 truncate">
                          {detail.prayers.name}
                        </h4>
                        <p className="text-xs text-midnight-400">
                          {detail.target_days} {t('plans.days')} · S:{detail.target_count_morning} · A:{detail.target_count_evening}
                        </p>
                      </div>
                      <button
                        onClick={() => setDeleteTarget({ type: 'prayer', id: detail.id, planId: plan.id })}
                        className="w-8 h-8 rounded-lg bg-red-900/20 flex items-center justify-center text-red-400 hover:bg-red-900/40 transition-colors shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}

                  <button
                    onClick={() => setShowAddPrayer(plan.id)}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-dashed border-midnight-600 text-midnight-400 hover:border-gold-400/40 hover:text-gold-400 transition-colors text-sm"
                  >
                    <BookPlus className="w-4 h-4" />
                    {t('plans.addPrayer')}
                  </button>

                  <button
                    onClick={() => setDeleteTarget({ type: 'plan', id: plan.id })}
                    className="w-full flex items-center justify-center gap-2 py-2 text-red-400/70 hover:text-red-400 text-xs transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    {t('plans.deletePlan')}
                  </button>
                </div>
              )}
            </div>
          );
        })
      )}

      {showCreate && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/70 backdrop-blur-sm animate-fade-in"
          onClick={() => setShowCreate(false)}
        >
          <div
            className="glass-card max-w-sm w-full p-6 animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-display font-bold text-gold-100">{t('plans.createPlan')}</h3>
              <button onClick={() => setShowCreate(false)} className="text-midnight-400 hover:text-midnight-200">
                <X className="w-5 h-5" />
              </button>
            </div>
            <input
              type="text"
              value={newPlanName}
              onChange={(e) => setNewPlanName(e.target.value)}
              placeholder={t('plans.planNamePlaceholder')}
              className="w-full bg-midnight-900/60 border border-midnight-700 rounded-xl px-4 py-3 text-midnight-100 placeholder-midnight-500 focus:outline-none focus:border-gold-400/50 transition-colors"
              autoFocus
              onKeyDown={(e) => e.key === 'Enter' && handleCreatePlan()}
            />
            <button
              onClick={handleCreatePlan}
              disabled={!newPlanName.trim()}
              className="btn-primary w-full mt-4 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {t('plans.create')}
            </button>
          </div>
        </div>
      )}

      {showAddPrayer && (
        <AddPrayerModal
          planId={showAddPrayer}
          prayers={allPrayers}
          existingPrayerIds={(planDetailsMap[showAddPrayer] || []).map((d) => d.prayer_id)}
          onAdd={(prayer) => handleAddPrayer(showAddPrayer, prayer)}
          onClose={() => setShowAddPrayer(null)}
        />
      )}

      <ConfirmDialog
        open={deleteTarget !== null}
        title={t('counter.confirmTitle')}
        message={
          deleteTarget?.type === 'plan'
            ? t('plans.confirmDeletePlan')
            : t('plans.confirmDeletePrayer')
        }
        confirmText={t('common.yes')}
        cancelText={t('common.cancel')}
        onConfirm={() => {
          if (deleteTarget?.type === 'plan') handleDeletePlan(deleteTarget.id);
          else if (deleteTarget?.type === 'prayer') handleRemovePrayer(deleteTarget.id);
        }}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}

function AddPrayerModal({
  planId: _planId,
  prayers,
  existingPrayerIds,
  onAdd,
  onClose,
}: {
  planId: string;
  prayers: Prayer[];
  existingPrayerIds: string[];
  onAdd: (prayer: Prayer) => void;
  onClose: () => void;
}) {
  const { t } = useI18n();
  const [search, setSearch] = useState('');
  const filtered = prayers.filter(
    (p) =>
      !existingPrayerIds.includes(p.id) &&
      (p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.category.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/70 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="glass-card max-w-sm w-full p-6 animate-scale-in max-h-[80vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-display font-bold text-gold-100">{t('plans.addPrayer')}</h3>
          <button onClick={onClose} className="text-midnight-400 hover:text-midnight-200">
            <X className="w-5 h-5" />
          </button>
        </div>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t('library.searchPlaceholder')}
          className="w-full bg-midnight-900/60 border border-midnight-700 rounded-xl px-4 py-2.5 text-sm text-midnight-100 placeholder-midnight-500 focus:outline-none focus:border-gold-400/50 transition-colors mb-3"
          autoFocus
        />
        <div className="flex-1 overflow-y-auto space-y-2 no-scrollbar">
          {filtered.length === 0 ? (
            <p className="text-sm text-midnight-400 text-center py-4">{t('library.noResults')}</p>
          ) : (
            filtered.map((prayer) => (
              <button
                key={prayer.id}
                onClick={() => onAdd(prayer)}
                className="w-full flex items-center justify-between bg-midnight-700/30 rounded-xl p-3 hover:bg-midnight-700/50 transition-colors text-left"
              >
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-midnight-100 truncate">{prayer.name}</h4>
                  <p className="text-xs text-midnight-400 truncate">
                    {prayer.category} · {prayer.meaning}
                  </p>
                </div>
                <div className="w-7 h-7 rounded-full bg-gold-400/10 flex items-center justify-center shrink-0 ml-2">
                  <Check className="w-4 h-4 text-gold-400" />
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

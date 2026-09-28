import { useEffect, useState } from 'react';
import { Sun, Moon, ChevronRight, Calendar, Sparkles, TrendingUp, Settings as SettingsIcon, BookOpen, Library as LibraryIcon, Clock, CircleDot } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { ReadingPlan, PlanDetailWithProgress, UserDailyProgress } from '@/lib/supabase';
import { DhikrCounter } from './DhikrCounter';
import { DailyQuote } from './DailyQuote';
import { useI18n } from '@/lib/i18n';
import type { TranslationKey } from '@/lib/translations';

type DashboardProps = {
  onNavigate: (page: 'dashboard' | 'plans' | 'library' | 'settings' | 'prayer-times' | 'tasbih') => void;
};

export function Dashboard({ onNavigate }: DashboardProps) {
  const { t, lang } = useI18n();
  const [plans, setPlans] = useState<ReadingPlan[]>([]);
  const [activePlan, setActivePlan] = useState<ReadingPlan | null>(null);
  const [planDetails, setPlanDetails] = useState<PlanDetailWithProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [counterState, setCounterState] = useState<{
    planDetailId: string;
    prayerName: string;
    prayerMeaning: string;
    targetCount: number;
    session: 'morning' | 'evening';
    progress: UserDailyProgress;
  } | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const { data: planData } = await supabase
      .from('reading_plans')
      .select('*')
      .order('created_at', { ascending: false });

    if (!planData || planData.length === 0) {
      setLoading(false);
      return;
    }

    setPlans(planData);
    const active = planData.find((p) => p.is_active) || planData[0];
    setActivePlan(active);
    await loadPlanDetails(active.id);
  };

  const loadPlanDetails = async (planId: string) => {
    const { data } = await supabase
      .from('plan_details')
      .select('*, prayers(*), user_daily_progress(*)')
      .eq('plan_id', planId)
      .order('sequence_order', { ascending: true });

    if (data) {
      setPlanDetails(data as PlanDetailWithProgress[]);
    }
    setLoading(false);
  };

  const handlePlanSwitch = async (plan: ReadingPlan) => {
    setActivePlan(plan);
    setLoading(true);
    await loadPlanDetails(plan.id);
  };

  const handleProgressUpdate = (updated: UserDailyProgress) => {
    setPlanDetails((prev) =>
      prev.map((pd) => ({
        ...pd,
        user_daily_progress: pd.user_daily_progress.map((p) =>
          p.id === updated.id ? updated : p
        ),
      }))
    );
  };

  const currentDetail = planDetails.find((pd) => {
    const progress = pd.user_daily_progress[0];
    if (!progress) return false;
    return !progress.is_morning_completed || !progress.is_evening_completed;
  });

  const completedCount = planDetails.filter((pd) => {
    const p = pd.user_daily_progress[0];
    return p && p.is_morning_completed && p.is_evening_completed;
  }).length;

  const overallProgress = planDetails.length > 0
    ? Math.round((completedCount / planDetails.length) * 100)
    : 0;

  const localeMap: Record<string, string> = {
    tr: 'tr-TR', en: 'en-US', ar: 'ar-SA', de: 'de-DE', fr: 'fr-FR',
  };
  const locale = localeMap[lang] || 'en-US';

  const navCards: { key: TranslationKey; icon: typeof BookOpen; page: 'plans' | 'library' | 'prayer-times' | 'tasbih'; color: string }[] = [
    { key: 'nav.myPlans', icon: BookOpen, page: 'plans', color: 'text-gold-400' },
    { key: 'nav.prayerLibrary', icon: LibraryIcon, page: 'library', color: 'text-emerald2-400' },
    { key: 'nav.prayerTimes', icon: Clock, page: 'prayer-times', color: 'text-gold-300' },
    { key: 'nav.tasbihCounter', icon: CircleDot, page: 'tasbih', color: 'text-emerald2-400' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-gold-400/30 border-t-gold-400 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="px-4 pt-6 pb-24 space-y-5 animate-fade-in">
      {/* Header with settings button */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-midnight-400 uppercase tracking-wider font-medium">
            {new Date().toLocaleDateString(locale, { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
          <h1 className="text-2xl font-display font-bold text-gold-100 mt-1">
            {t('appName')}
          </h1>
        </div>
        <button
          onClick={() => onNavigate('settings')}
          className="w-10 h-10 rounded-full bg-emerald-900/60 flex items-center justify-center text-midnight-300 hover:text-gold-400 transition-colors border border-emerald-800/40 shrink-0"
        >
          <SettingsIcon className="w-5 h-5" />
        </button>
      </div>

      {/* Quick navigation cards */}
      <div>
        <h2 className="text-sm font-semibold text-midnight-200 mb-3 px-1">{t('home.quickActions')}</h2>
        <div className="grid grid-cols-2 gap-3">
          {navCards.map(({ key, icon: Icon, page, color }) => (
            <button
              key={key}
              onClick={() => onNavigate(page)}
              className="glass-card p-4 flex flex-col items-start gap-2 active:scale-95 transition-transform"
            >
              <Icon className={`w-6 h-6 ${color}`} />
              <span className="text-sm font-medium text-midnight-100 text-left">{t(key)}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Daily Quote */}
      <DailyQuote />

      {plans.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[40vh] px-6 text-center">
          <div className="w-16 h-16 rounded-full bg-gold-400/10 flex items-center justify-center mb-4 border border-gold-400/20">
            <Sparkles className="w-8 h-8 text-gold-400" />
          </div>
          <h2 className="text-lg font-display font-bold text-gold-100 mb-2">
            {t('home.noPlanTitle')}
          </h2>
          <p className="text-sm text-midnight-400">{t('home.noPlanDesc')}</p>
        </div>
      ) : (
        <>
          {/* Plan selector */}
          {plans.length > 1 && (
            <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-4 px-4">
              {plans.map((plan) => (
                <button
                  key={plan.id}
                  onClick={() => handlePlanSwitch(plan)}
                  className={`shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                    activePlan?.id === plan.id
                      ? 'bg-gold-400 text-midnight-950'
                      : 'bg-midnight-800/60 text-midnight-300 border border-midnight-700/50'
                  }`}
                >
                  {plan.plan_name}
                </button>
              ))}
            </div>
          )}

          {/* Overall progress card */}
          <div className="glass-card p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-gold-400" />
                <span className="text-sm font-medium text-midnight-200">{t('home.overallProgress')}</span>
              </div>
              <span className="text-2xl font-display font-bold text-gold-100">{overallProgress}%</span>
            </div>
            <div className="h-2 bg-midnight-700/50 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-gold-500 to-gold-300 rounded-full transition-all duration-500"
                style={{ width: `${overallProgress}%` }}
              />
            </div>
            <p className="text-xs text-midnight-400 mt-2">
              {completedCount} / {planDetails.length} {t('home.prayersCompleted')}
            </p>
          </div>

          {/* Current priority prayer */}
          {currentDetail && (
            <div>
              <div className="flex items-center gap-2 mb-3 px-1">
                <Sparkles className="w-4 h-4 text-gold-400" />
                <h2 className="text-sm font-semibold text-midnight-200">{t('home.currentPriority')}</h2>
              </div>
              <div className="glass-card p-5 border-gold-400/20 animate-pulse-gold">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <span className="text-xs text-gold-400 font-medium">
                      {currentDetail.sequence_order}
                    </span>
                    <h3 className="text-xl font-display font-bold text-gold-100 mt-0.5">
                      {currentDetail.prayers.name}
                    </h3>
                    {currentDetail.prayers.meaning && (
                      <p className="text-xs text-midnight-400 mt-1 leading-relaxed">
                        {currentDetail.prayers.meaning}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-4">
                  <Calendar className="w-4 h-4 text-midnight-400" />
                  <span className="text-sm text-midnight-300">
                    {currentDetail.target_days} {t('home.dayXOfY')}{' '}
                    <span className="font-bold text-gold-100">
                      {currentDetail.user_daily_progress[0]?.current_day_number || 1}.
                    </span>
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <SessionSlot
                    icon="morning"
                    label={t('home.morning')}
                    done={currentDetail.user_daily_progress[0]?.morning_count_done || 0}
                    target={currentDetail.target_count_morning}
                    completed={currentDetail.user_daily_progress[0]?.is_morning_completed || false}
                    onTap={() => {
                      const p = currentDetail.user_daily_progress[0];
                      if (p) {
                        setCounterState({
                          planDetailId: currentDetail.id,
                          prayerName: currentDetail.prayers.name,
                          prayerMeaning: currentDetail.prayers.meaning || '',
                          targetCount: currentDetail.target_count_morning,
                          session: 'morning',
                          progress: p,
                        });
                      }
                    }}
                  />
                  <SessionSlot
                    icon="evening"
                    label={t('home.evening')}
                    done={currentDetail.user_daily_progress[0]?.evening_count_done || 0}
                    target={currentDetail.target_count_evening}
                    completed={currentDetail.user_daily_progress[0]?.is_evening_completed || false}
                    onTap={() => {
                      const p = currentDetail.user_daily_progress[0];
                      if (p) {
                        setCounterState({
                          planDetailId: currentDetail.id,
                          prayerName: currentDetail.prayers.name,
                          prayerMeaning: currentDetail.prayers.meaning || '',
                          targetCount: currentDetail.target_count_evening,
                          session: 'evening',
                          progress: p,
                        });
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* All plan items in sequence */}
          <div>
            <h2 className="text-sm font-semibold text-midnight-200 mb-3 px-1">
              {t('home.allPrayers')}
            </h2>
            <div className="space-y-2">
              {planDetails.map((pd) => {
                const progress = pd.user_daily_progress[0];
                const morningDone = progress?.is_morning_completed || false;
                const eveningDone = progress?.is_evening_completed || false;
                const fullyDone = morningDone && eveningDone;
                const isCurrent = currentDetail?.id === pd.id;

                return (
                  <div
                    key={pd.id}
                    className={`glass-card p-4 flex items-center gap-3 ${
                      isCurrent ? 'border-gold-400/30' : ''
                    } ${fullyDone ? 'opacity-50' : ''}`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                        fullyDone
                          ? 'bg-emerald2-500/20 text-emerald2-400'
                          : isCurrent
                            ? 'bg-gold-400 text-midnight-950'
                            : 'bg-midnight-700 text-midnight-400'
                      }`}
                    >
                      {fullyDone ? '✓' : pd.sequence_order}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-midnight-100 truncate">
                        {pd.prayers.name}
                      </h3>
                      <p className="text-xs text-midnight-400">
                        {pd.target_days} {t('plans.days')} · {t('home.morning')} {pd.target_count_morning}x · {t('home.evening')} {pd.target_count_evening}x
                      </p>
                    </div>
                    <div className="flex gap-1.5 shrink-0">
                      <div className={`w-2 h-2 rounded-full ${morningDone ? 'bg-emerald2-400' : 'bg-midnight-600'}`} />
                      <div className={`w-2 h-2 rounded-full ${eveningDone ? 'bg-emerald2-400' : 'bg-midnight-600'}`} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}

      {/* Dhikr Counter overlay */}
      {counterState && (
        <DhikrCounter
          planDetailId={counterState.planDetailId}
          prayerName={counterState.prayerName}
          prayerMeaning={counterState.prayerMeaning}
          targetCount={counterState.targetCount}
          session={counterState.session}
          progress={counterState.progress}
          onProgressUpdate={handleProgressUpdate}
          onClose={() => setCounterState(null)}
        />
      )}
    </div>
  );
}

function SessionSlot({
  icon,
  label,
  done,
  target,
  completed,
  onTap,
}: {
  icon: 'morning' | 'evening';
  label: string;
  done: number;
  target: number;
  completed: boolean;
  onTap: () => void;
}) {
  const Icon = icon === 'morning' ? Sun : Moon;
  const percent = target > 0 ? Math.min((done / target) * 100, 100) : 0;

  return (
    <button
      onClick={onTap}
      className={`relative rounded-xl p-3 text-left transition-all active:scale-95 ${
        completed
          ? 'bg-emerald2-500/10 border border-emerald2-500/30'
          : 'bg-midnight-700/40 border border-midnight-600/30 hover:border-gold-400/30'
      }`}
    >
      <div className="flex items-center gap-1.5 mb-2">
        <Icon className={`w-3.5 h-3.5 ${completed ? 'text-emerald2-400' : 'text-gold-400'}`} />
        <span className={`text-xs font-medium ${completed ? 'text-emerald2-300' : 'text-midnight-200'}`}>
          {label}
        </span>
      </div>
      <div className="flex items-baseline gap-1">
        <span className={`text-lg font-display font-bold ${completed ? 'text-emerald2-300' : 'text-gold-100'}`}>
          {done}
        </span>
        <span className="text-xs text-midnight-400">/ {target}</span>
      </div>
      <div className="h-1 bg-midnight-800/50 rounded-full mt-2 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-300 ${
            completed ? 'bg-emerald2-400' : 'bg-gold-400'
          }`}
          style={{ width: `${percent}%` }}
        />
      </div>
      {!completed && (
        <ChevronRight className="absolute top-2.5 right-2.5 w-3 h-3 text-midnight-500" />
      )}
    </button>
  );
}

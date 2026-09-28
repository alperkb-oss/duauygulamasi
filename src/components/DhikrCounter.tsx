import { useState, useRef, useEffect } from 'react';
import { Check, RotateCcw, CheckCheck, Moon, Sun, ChevronLeft } from 'lucide-react';
import { ConfirmDialog } from './ConfirmDialog';
import { supabase } from '@/lib/supabase';
import type { UserDailyProgress } from '@/lib/supabase';
import { useI18n } from '@/lib/i18n';

type DhikrCounterProps = {
  planDetailId: string;
  prayerName: string;
  prayerMeaning: string;
  targetCount: number;
  session: 'morning' | 'evening';
  progress: UserDailyProgress;
  onProgressUpdate: (progress: UserDailyProgress) => void;
  onClose: () => void;
};

export function DhikrCounter({
  planDetailId: _planDetailId,
  prayerName,
  prayerMeaning,
  targetCount,
  session,
  progress,
  onProgressUpdate,
  onClose,
}: DhikrCounterProps) {
  const { t } = useI18n();
  const isMorning = session === 'morning';
  const currentCount = isMorning ? progress.morning_count_done : progress.evening_count_done;
  const isCompleted = isMorning ? progress.is_morning_completed : progress.is_evening_completed;

  const [count, setCount] = useState(currentCount);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const ringRef = useRef<SVGCircleElement>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    setCount(currentCount);
  }, [currentCount]);

  const progressPercent = Math.min(count / targetCount, 1);
  const circumference = 2 * Math.PI * 120;
  const strokeDashoffset = circumference * (1 - progressPercent);

  const handleTap = async () => {
    if (isCompleted || count >= targetCount) return;

    const newCount = count + 1;
    setCount(newCount);
    setIsAnimating(true);
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
    animationRef.current = requestAnimationFrame(() => setIsAnimating(false));

    const justCompleted = newCount >= targetCount;

    const updateData: Partial<UserDailyProgress> = {};
    if (isMorning) {
      updateData.morning_count_done = newCount;
      updateData.is_morning_completed = justCompleted;
    } else {
      updateData.evening_count_done = newCount;
      updateData.is_evening_completed = justCompleted;
    }

    const { data, error } = await supabase
      .from('user_daily_progress')
      .update(updateData)
      .eq('id', progress.id)
      .select()
      .single();

    if (!error && data) {
      onProgressUpdate(data as UserDailyProgress);
    }
  };

  const handleReset = async () => {
    const updateData: Partial<UserDailyProgress> = {};
    if (isMorning) {
      updateData.morning_count_done = 0;
      updateData.is_morning_completed = false;
    } else {
      updateData.evening_count_done = 0;
      updateData.is_evening_completed = false;
    }

    const { data, error } = await supabase
      .from('user_daily_progress')
      .update(updateData)
      .eq('id', progress.id)
      .select()
      .single();

    if (!error && data) {
      setCount(0);
      onProgressUpdate(data as UserDailyProgress);
    }
  };

  const handleMarkAllComplete = async () => {
    setShowConfirm(false);
    const updateData: Partial<UserDailyProgress> = {};
    if (isMorning) {
      updateData.morning_count_done = targetCount;
      updateData.is_morning_completed = true;
    } else {
      updateData.evening_count_done = targetCount;
      updateData.is_evening_completed = true;
    }

    const { data, error } = await supabase
      .from('user_daily_progress')
      .update(updateData)
      .eq('id', progress.id)
      .select()
      .single();

    if (!error && data) {
      setCount(targetCount);
      onProgressUpdate(data as UserDailyProgress);
      onClose();
    }
  };

  const SessionIcon = isMorning ? Sun : Moon;
  const sessionLabel = isMorning ? t('counter.morningSession') : t('counter.eveningSession');

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-emerald-950/95 backdrop-blur-xl animate-fade-in">
      <div className="flex items-center justify-between px-5 pt-6 pb-2">
        <button
          onClick={onClose}
          className="w-10 h-10 rounded-full bg-emerald-900/60 flex items-center justify-center text-midnight-300 hover:text-gold-400 transition-colors border border-emerald-800/40"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-midnight-800/60 border border-midnight-700/50">
          <SessionIcon className="w-4 h-4 text-gold-400" />
          <span className="text-sm font-medium text-gold-100">{sessionLabel}</span>
        </div>
      </div>

      <div className="text-center px-6 pt-4 pb-2">
        <h2 className="text-2xl font-display font-bold text-gold-100">{prayerName}</h2>
        {prayerMeaning && (
          <p className="text-sm text-midnight-400 mt-1 max-w-xs mx-auto leading-relaxed">
            {prayerMeaning}
          </p>
        )}
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <div className="relative">
          <svg
            width="280"
            height="280"
            viewBox="0 0 280 280"
            className={isCompleted ? 'animate-pulse-gold' : ''}
          >
            <circle cx="140" cy="140" r="120" fill="none" stroke="#0d3527" strokeWidth="6" />
            <circle
              ref={ringRef}
              cx="140"
              cy="140"
              r="120"
              fill="none"
              stroke={isCompleted ? '#34d399' : '#d97706'}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              transform="rotate(-90 140 140)"
              style={{ transition: 'stroke-dashoffset 0.3s ease-out, stroke 0.3s' }}
            />
          </svg>

          <button
            onClick={handleTap}
            disabled={isCompleted}
            className={`absolute inset-0 m-auto w-[200px] h-[200px] rounded-full flex flex-col items-center justify-center transition-all duration-150 ${
              isCompleted
                ? 'bg-emerald2-500/10 cursor-default'
                : 'bg-emerald-900/80 hover:bg-emerald-800/80 active:scale-90 cursor-pointer border-2 border-gold-400/40'
            } ${isAnimating && !isCompleted ? 'scale-95' : ''}`}
          >
            {isCompleted ? (
              <>
                <Check className="w-12 h-12 text-emerald2-400 mb-2" strokeWidth={3} />
                <span className="text-lg font-display font-bold text-emerald2-400">{t('counter.completed')}</span>
                <span className="text-sm text-midnight-400 mt-1">{targetCount} {t('counter.times')}</span>
              </>
            ) : (
              <>
                <span className="text-5xl font-display font-bold text-gold-100 tabular-nums drop-shadow-[0_0_12px_rgba(217,119,6,0.3)]">
                  {count}
                </span>
                <span className="text-sm text-midnight-400 mt-1">/ {targetCount}</span>
                <span className="text-xs text-midnight-500 mt-3">{t('counter.tap')}</span>
              </>
            )}
          </button>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-midnight-400">
            {count === 0
              ? t('counter.tapToStart')
              : isCompleted
                ? t('counter.completed')
                : `${targetCount - count} ${t('counter.remaining')}`}
          </p>
        </div>
      </div>

      <div className="px-6 pb-8 space-y-3 safe-bottom">
        {!isCompleted && (
          <button
            onClick={() => setShowConfirm(true)}
            className="w-full flex items-center justify-center gap-2 bg-emerald-900/60 text-gold-200 font-medium rounded-xl py-3.5 border border-gold-400/30 hover:bg-emerald-800/60 transition-all active:scale-95"
          >
            <CheckCheck className="w-5 h-5" />
            {t('counter.markAllRead')}
          </button>
        )}
        <button
          onClick={handleReset}
          className="w-full flex items-center justify-center gap-2 text-midnight-400 text-sm hover:text-gold-400 transition-colors py-2.5 border border-emerald-800/30 rounded-xl"
        >
          <RotateCcw className="w-4 h-4" />
          {t('counter.reset')}
        </button>
      </div>

      <ConfirmDialog
        open={showConfirm}
        title={t('counter.confirmTitle')}
        message={t('counter.confirmMessage')}
        confirmText={t('counter.confirmYes')}
        cancelText={t('counter.confirmCancel')}
        onConfirm={handleMarkAllComplete}
        onCancel={() => setShowConfirm(false)}
      />
    </div>
  );
}

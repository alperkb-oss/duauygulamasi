import { useState } from 'react';
import { ChevronLeft, Minus, RotateCcw } from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import { useTasbihCounter } from '@/lib/useTasbihCounter';
import { useHaptic } from '@/lib/useHaptic';
import { ConfirmDialog } from './ConfirmDialog';

const STORAGE_KEY = 'standaloneTasbihCount';

type TasbihProps = {
  onBack: () => void;
};

export function Tasbih({ onBack }: TasbihProps) {
  const { t } = useI18n();
  const { vibrate } = useHaptic();
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [tapPulse, setTapPulse] = useState(false);

  const { count, increment, decrement, reset } = useTasbihCounter({
    storageKey: STORAGE_KEY,
    onIncrement: () => vibrate(),
  });

  const handleIncrement = () => {
    increment();
    setTapPulse(true);
    requestAnimationFrame(() => setTapPulse(false));
  };

  const handleDecrement = () => {
    if (count > 0) decrement();
  };

  const handleResetConfirm = () => {
    reset();
    setShowResetConfirm(false);
  };

  return (
    <div className="px-4 pt-6 pb-24 space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="w-10 h-10 rounded-full bg-emerald-900/60 flex items-center justify-center text-midnight-300 hover:text-gold-400 transition-colors border border-emerald-800/40"
          aria-label={t('common.back')}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-display font-bold text-gold-100">{t('tasbih.title')}</h1>
      </div>

      {/* LCD-style counter display */}
      <div className="flex justify-center pt-4">
        <div
          className="relative w-full max-w-xs"
          style={{
            background: 'linear-gradient(180deg, #0a1f1a 0%, #051512 100%)',
            borderRadius: '1.5rem',
            padding: '1.5rem 2rem',
            border: '2px solid rgba(217, 119, 6, 0.15)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.4), inset 0 2px 8px rgba(0,0,0,0.5)',
          }}
        >
          {/* LCD label */}
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] uppercase tracking-widest text-emerald2-400/50 font-mono">
              TASBIH
            </span>
            <span className="text-[10px] uppercase tracking-widest text-emerald2-400/30 font-mono">
              {t('tasbih.count')}
            </span>
          </div>

          {/* LCD digits */}
          <div
            role="status"
            aria-live="polite"
            aria-label={t('tasbih.countLabel')}
            className="text-center py-3"
          >
            <span
              className="font-mono text-7xl font-bold tabular-nums tracking-wider"
              style={{
                color: '#34d399',
                textShadow: '0 0 12px rgba(52, 211, 153, 0.4), 0 0 4px rgba(52, 211, 153, 0.2)',
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {count}
            </span>
          </div>

          {/* LCD bottom indicator line */}
          <div className="flex items-center gap-1.5 justify-center mt-1">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald2-400/30" />
            <div className="w-1.5 h-1.5 rounded-full bg-emerald2-400/15" />
            <div className="w-1.5 h-1.5 rounded-full bg-emerald2-400/10" />
          </div>
        </div>
      </div>

      {/* Main count button */}
      <div className="flex justify-center pt-4">
        <button
          onClick={handleIncrement}
          aria-label={t('tasbih.increment')}
          className={`w-48 h-48 rounded-full bg-gradient-to-b from-emerald-800 to-emerald-950 border-2 border-gold-400/40 flex flex-col items-center justify-center transition-all duration-100 active:scale-90 hover:border-gold-400/60 ${
            tapPulse ? 'scale-95' : ''
          }`}
          style={{
            boxShadow: '0 8px 24px rgba(0,0,0,0.3), inset 0 2px 8px rgba(255,255,255,0.05), inset 0 -4px 12px rgba(0,0,0,0.3)',
          }}
        >
          <span className="text-5xl font-display font-bold text-gold-100 mb-1">+</span>
          <span className="text-xs text-midnight-400 uppercase tracking-wider">{t('tasbih.increment')}</span>
        </button>
      </div>

      {/* Secondary controls */}
      <div className="flex justify-center gap-6 pt-4">
        <button
          onClick={handleDecrement}
          disabled={count === 0}
          aria-label={t('tasbih.decrementLabel')}
          className="w-14 h-14 rounded-full bg-emerald-900/60 border border-emerald-800/40 flex items-center justify-center text-midnight-300 hover:text-gold-400 hover:border-gold-400/30 transition-all active:scale-90 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <Minus className="w-5 h-5" />
        </button>

        <button
          onClick={() => setShowResetConfirm(true)}
          aria-label={t('tasbih.resetLabel')}
          className="w-14 h-14 rounded-full bg-emerald-900/60 border border-emerald-800/40 flex items-center justify-center text-midnight-300 hover:text-gold-400 hover:border-gold-400/30 transition-all active:scale-90"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
      </div>

      {/* Reset confirmation dialog */}
      <ConfirmDialog
        open={showResetConfirm}
        title={t('tasbih.resetConfirmTitle')}
        message={t('tasbih.resetConfirmMessage')}
        confirmText={t('tasbih.resetConfirmBtn')}
        cancelText={t('common.cancel')}
        onConfirm={handleResetConfirm}
        onCancel={() => setShowResetConfirm(false)}
      />
    </div>
  );
}

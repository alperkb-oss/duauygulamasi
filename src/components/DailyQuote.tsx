import { Quote } from 'lucide-react';
import { useI18n } from '@/lib/i18n';

export function DailyQuote() {
  const { t } = useI18n();
  const today = new Date().toLocaleDateString(undefined, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  return (
    <div className="glass-card p-4">
      <div className="flex items-center gap-2 mb-2">
        <Quote className="w-4 h-4 text-gold-400" />
        <h3 className="text-sm font-display font-bold text-gold-100">{t('home.dailyQuote')}</h3>
      </div>
      <p className="text-xs text-midnight-400 mb-2">{today}</p>
      <p className="text-sm text-midnight-300 italic leading-relaxed">
        {t('home.dailyQuotePlaceholder')}
      </p>
    </div>
  );
}

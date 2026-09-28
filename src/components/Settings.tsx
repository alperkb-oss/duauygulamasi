import { useState } from 'react';
import { ChevronLeft, Globe, Check, Clock, Sparkles } from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import { LANGUAGES, type LanguageCode, type TranslationKey } from '@/lib/translations';
import { CALCULATION_METHODS, getMethodById } from '@/lib/prayerTimesTypes';

type SettingsProps = {
  onBack: () => void;
};

const METHOD_MODE_KEY = 'prayer-times-method-mode';
const METHOD_KEY = 'prayer-times-method';

type MethodMode = 'auto' | 'manual';

function loadMethodMode(): MethodMode {
  const stored = localStorage.getItem(METHOD_MODE_KEY);
  return stored === 'manual' ? 'manual' : 'auto';
}

function loadManualMethodId(): number | null {
  const stored = localStorage.getItem(METHOD_KEY);
  return stored ? parseInt(stored, 10) : null;
}

export function Settings({ onBack }: SettingsProps) {
  const { lang, setLang, t } = useI18n();
  const [selectedLang, setSelectedLang] = useState<LanguageCode>(lang);

  const [methodMode, setMethodMode] = useState<MethodMode>(() => loadMethodMode());
  const [manualMethodId, setManualMethodId] = useState<number | null>(() => loadManualMethodId());

  const handleSelect = (code: LanguageCode) => {
    setSelectedLang(code);
    setLang(code);
  };

  const handleMethodModeChange = (mode: MethodMode) => {
    setMethodMode(mode);
    localStorage.setItem(METHOD_MODE_KEY, mode);
    if (mode === 'auto') {
      setManualMethodId(null);
      localStorage.removeItem(METHOD_KEY);
    }
  };

  const handleManualMethodChange = (id: number) => {
    setManualMethodId(id);
    setMethodMode('manual');
    localStorage.setItem(METHOD_MODE_KEY, 'manual');
    localStorage.setItem(METHOD_KEY, String(id));
  };

  const resolvedMethodId = methodMode === 'manual' && manualMethodId != null
    ? manualMethodId
    : 3;
  const currentMethod = getMethodById(resolvedMethodId);

  return (
    <div className="px-4 pt-6 pb-24 space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="w-10 h-10 rounded-full bg-emerald-900/60 flex items-center justify-center text-midnight-300 hover:text-gold-400 transition-colors border border-emerald-800/40"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-display font-bold text-gold-100">{t('settings.title')}</h1>
      </div>

      {/* Language section */}
      <div className="glass-card p-5">
        <div className="flex items-center gap-2 mb-1">
          <Globe className="w-4 h-4 text-gold-400" />
          <h2 className="text-base font-display font-bold text-gold-100">{t('settings.language')}</h2>
        </div>
        <p className="text-xs text-midnight-400 mb-4">{t('settings.languageDesc')}</p>

        <div className="space-y-2">
          {LANGUAGES.map((language) => {
            const active = selectedLang === language.code;
            return (
              <button
                key={language.code}
                onClick={() => handleSelect(language.code)}
                className={`w-full flex items-center justify-between rounded-xl p-3.5 transition-all active:scale-95 ${
                  active
                    ? 'bg-gold-400/10 border border-gold-400/30'
                    : 'bg-emerald-950/30 border border-emerald-800/30 hover:border-emerald-700/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{language.flag}</span>
                  <span className={`text-sm font-medium ${active ? 'text-gold-100' : 'text-midnight-200'}`}>
                    {language.nativeName}
                  </span>
                </div>
                {active && <Check className="w-5 h-5 text-gold-400" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Prayer Times / Calculation Method section */}
      <div className="glass-card p-5">
        <div className="flex items-center gap-2 mb-1">
          <Clock className="w-4 h-4 text-gold-400" />
          <h2 className="text-base font-display font-bold text-gold-100">{t('prayerTimes.calcMethod')}</h2>
        </div>
        <p className="text-xs text-midnight-400 mb-4">{t('prayerTimes.calcMethodDesc')}</p>

        {/* Auto / Recommended option */}
        <button
          onClick={() => handleMethodModeChange('auto')}
          className={`w-full flex items-center justify-between rounded-xl p-3.5 transition-all active:scale-95 mb-2 ${
            methodMode === 'auto'
              ? 'bg-gold-400/10 border border-gold-400/30'
              : 'bg-emerald-950/30 border border-emerald-800/30 hover:border-emerald-700/50'
          }`}
        >
          <div className="flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-gold-400" />
            <div className="text-left">
              <span className={`text-sm font-medium block ${methodMode === 'auto' ? 'text-gold-100' : 'text-midnight-200'}`}>
                {t('prayerTimes.methodAuto')}
              </span>
              {methodMode === 'auto' && currentMethod && (
                <span className="text-xs text-midnight-400">
                  {t('prayerTimes.currently')}: {t(currentMethod.labelKey as TranslationKey)}
                </span>
              )}
            </div>
          </div>
          {methodMode === 'auto' && <Check className="w-5 h-5 text-gold-400" />}
        </button>

        {/* Manual method options */}
        <div className={`space-y-2 ${methodMode === 'auto' ? 'opacity-50' : ''}`}>
          {CALCULATION_METHODS.map((method) => {
            const active = methodMode === 'manual' && manualMethodId === method.id;
            return (
              <button
                key={method.id}
                onClick={() => handleManualMethodChange(method.id)}
                className={`w-full flex items-center justify-between rounded-xl p-3.5 transition-all active:scale-95 ${
                  active
                    ? 'bg-gold-400/10 border border-gold-400/30'
                    : 'bg-emerald-950/30 border border-emerald-800/30 hover:border-emerald-700/50'
                }`}
              >
                <span className={`text-sm font-medium text-left ${active ? 'text-gold-100' : 'text-midnight-200'}`}>
                  {t(method.labelKey as TranslationKey)}
                </span>
                {active && <Check className="w-5 h-5 text-gold-400" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

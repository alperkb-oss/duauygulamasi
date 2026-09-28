import { useState, useMemo } from 'react';
import {
  ChevronLeft, MapPin, Navigation, Map, Clock,
  Sunrise, Sun, Sunset, Moon, CloudSun, RefreshCw, AlertCircle,
} from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import { usePrayerTimes } from '@/lib/usePrayerTimes';
import { LocationPicker } from './LocationPicker';
import type { PrayerId, NextPrayerInfo } from '@/lib/prayerTimesTypes';
import type { TranslationKey } from '@/lib/translations';

type PrayerTimesProps = {
  onBack: () => void;
};

const PRAYER_META: { id: PrayerId; labelKey: TranslationKey; icon: typeof Sunrise; isObligatory: boolean }[] = [
  { id: 'fajr', labelKey: 'prayerTimes.fajr', icon: Sunrise, isObligatory: true },
  { id: 'sunrise', labelKey: 'prayerTimes.sunrise', icon: Sun, isObligatory: false },
  { id: 'dhuhr', labelKey: 'prayerTimes.dhuhr', icon: CloudSun, isObligatory: true },
  { id: 'asr', labelKey: 'prayerTimes.asr', icon: Sun, isObligatory: true },
  { id: 'maghrib', labelKey: 'prayerTimes.magrib', icon: Sunset, isObligatory: true },
  { id: 'isha', labelKey: 'prayerTimes.isha', icon: Moon, isObligatory: true },
];

export function PrayerTimes({ onBack }: PrayerTimesProps) {
  const { t, lang } = useI18n();
  const {
    location, data, loading, error, isCached, geoError,
    requestGeolocation, setManualLocation, retry, nextPrayer,
  methodMode, currentMethod,
  } = usePrayerTimes();
  const [showPicker, setShowPicker] = useState(false);

  const localeMap: Record<string, string> = {
    tr: 'tr-TR', en: 'en-US', ar: 'ar-SA', de: 'de-DE', fr: 'fr-FR',
  };
  const locale = localeMap[lang] || 'en-US';

  const locationLabel = useMemo(() => {
    if (!location) return '';
    if (location.city && location.country) return `${location.city}, ${location.country}`;
    if (location.locationMode === 'auto') {
      return t('prayerTimes.currentLocation');
    }
    return location.country || '';
  }, [location, t]);

  const todayLabel = useMemo(() => {
    if (!data) {
      return new Date().toLocaleDateString(locale, {
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
      });
    }
    const [dd, mm, yyyy] = data.date.split('-');
    const dateObj = new Date(parseInt(yyyy), parseInt(mm) - 1, parseInt(dd));
    return dateObj.toLocaleDateString(locale, {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
      timeZone: data.timezone,
    });
  }, [data, locale]);

  const handlePickerSelect = (country: string, city: string) => {
    setManualLocation(country, city);
    setShowPicker(false);
  };

  const geoErrorMessage: TranslationKey | null =
    geoError === 'denied' ? 'prayerTimes.geoDenied'
    : geoError === 'unavailable' ? 'prayerTimes.geoUnavailable'
    : geoError === 'error' ? 'prayerTimes.geoError'
    : null;

  const isAutoMode = location?.locationMode === 'auto';

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
        <h1 className="text-2xl font-display font-bold text-gold-100">{t('prayerTimes.title')}</h1>
      </div>

      {/* No location: initial choice */}
      {!location && !loading && (
        <div className="flex flex-col items-center justify-center min-h-[50vh] px-6 text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-gold-400/10 flex items-center justify-center border border-gold-400/20">
            <MapPin className="w-8 h-8 text-gold-400" />
          </div>
          <p className="text-sm text-midnight-400 max-w-xs">{t('prayerTimes.noLocation')}</p>

          {geoErrorMessage && (
            <div className="glass-card p-4 flex items-start gap-3 max-w-xs">
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <p className="text-xs text-red-300 leading-relaxed">{t(geoErrorMessage)}</p>
            </div>
          )}

          <div className="space-y-3 w-full max-w-xs">
            <button
              onClick={() => requestGeolocation()}
              className="w-full flex items-center justify-center gap-2 btn-primary"
            >
              <Navigation className="w-4 h-4" />
              {t('prayerTimes.useMyLocation')}
            </button>
            <button
              onClick={() => setShowPicker(true)}
              className="w-full flex items-center justify-center gap-2 btn-ghost"
            >
              <Map className="w-4 h-4" />
              {t('prayerTimes.selectManually')}
            </button>
          </div>
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="flex flex-col items-center justify-center min-h-[50vh]">
          <div className="w-8 h-8 border-2 border-gold-400/30 border-t-gold-400 rounded-full animate-spin mb-4" />
          <p className="text-sm text-midnight-400">{t('prayerTimes.loading')}</p>
        </div>
      )}

      {/* Error with no cached data */}
      {error && !loading && !data && (
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-center space-y-4">
          <div className="w-14 h-14 rounded-full bg-red-900/20 flex items-center justify-center border border-red-800/30">
            <AlertCircle className="w-7 h-7 text-red-400" />
          </div>
          <p className="text-sm text-midnight-400 max-w-xs">{t('prayerTimes.error')}</p>
          <button onClick={retry} className="btn-primary flex items-center gap-2">
            <RefreshCw className="w-4 h-4" />
            {t('prayerTimes.retry')}
          </button>
        </div>
      )}

      {/* Prayer times display */}
      {data && !loading && (
        <>
          {/* Location card */}
          <div className="glass-card p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-full bg-gold-400/10 flex items-center justify-center shrink-0 border border-gold-400/20">
                  <MapPin className="w-5 h-5 text-gold-400" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-midnight-400 uppercase tracking-wider">{t('prayerTimes.currentLocation')}</p>
                  <p className="text-sm font-medium text-gold-100 truncate">{locationLabel || t('prayerTimes.noLocation')}</p>
                </div>
              </div>
              <button
                onClick={() => setShowPicker(true)}
                className="text-xs text-gold-400 hover:text-gold-300 transition-colors shrink-0 px-3 py-1.5 rounded-lg bg-gold-400/10 border border-gold-400/20"
              >
                {t('prayerTimes.changeLocation')}
              </button>
            </div>
          </div>

          {/* Date + cached indicator */}
          <div className="flex items-center justify-between px-1">
            <p className="text-xs text-midnight-400">{todayLabel}</p>
            {isCached && (
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-900/20 border border-amber-700/30">
                <Clock className="w-3 h-3 text-amber-400" />
                <span className="text-[10px] text-amber-300">{t('prayerTimes.cachedData')}</span>
              </div>
            )}
          </div>

          {/* Next prayer banner */}
          {nextPrayer && (
            <div className="glass-card p-4 border-gold-400/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gold-400 uppercase tracking-wider mb-1">{t('prayerTimes.nextPrayer')}</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-lg font-display font-bold text-gold-100">{t(nextPrayer.labelKey as TranslationKey)}</span>
                    {nextPrayer.timeAvailable ? (
                      <>
                        <span className="text-sm text-midnight-300">•</span>
                        <span className="text-sm font-mono text-midnight-200">{nextPrayer.time}</span>
                      </>
                    ) : (
                      <span className="text-sm text-midnight-400">• {t('prayerTimes.timeUnavailable')}</span>
                    )}
                  </div>
                </div>
                {nextPrayer.isTomorrow && (
                  <span className="text-[10px] uppercase tracking-wider text-midnight-500 px-2 py-1 rounded bg-midnight-800/50">
                    {t('prayerTimes.tomorrow')}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Prayer times list */}
          <div className="space-y-2">
            {PRAYER_META.map(({ id, labelKey, icon: Icon, isObligatory }) => {
              const time = data.timings[id];
              const isNext = nextPrayer?.id === id && !nextPrayer.isTomorrow;
              return (
                <div
                  key={id}
                  className={`glass-card p-4 flex items-center justify-between transition-all ${
                    isNext ? 'border-gold-400/40 bg-gold-400/5' : ''
                  } ${!isObligatory ? 'opacity-60' : ''}`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        isNext
                          ? 'bg-gold-400/15 border border-gold-400/30'
                          : 'bg-emerald-900/40 border border-emerald-800/30'
                      }`}
                    >
                      <Icon className={`w-5 h-5 ${isNext ? 'text-gold-400' : 'text-midnight-300'}`} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-medium ${isNext ? 'text-gold-100' : 'text-midnight-200'}`}>
                          {t(labelKey)}
                        </span>
                        {!isObligatory && (
                          <span className="text-[9px] uppercase tracking-wider text-midnight-500 px-1.5 py-0.5 rounded bg-midnight-800/50">
                            ☀
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <span className={`text-lg font-mono font-bold tabular-nums ${isNext ? 'text-gold-100' : 'text-midnight-200'}`}>
                    {time}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Update location button — only for auto mode */}
          {isAutoMode && (
            <button
              onClick={() => requestGeolocation()}
              className="w-full flex items-center justify-center gap-2 text-sm text-midnight-400 hover:text-gold-400 transition-colors py-2.5 border border-emerald-800/30 rounded-xl"
            >
              <Navigation className="w-4 h-4" />
              {t('prayerTimes.updateLocation')}
            </button>
          )}

          {/* Change current location button — always available */}
          <button
            onClick={() => setShowPicker(true)}
            className="w-full flex items-center justify-center gap-2 text-sm text-midnight-400 hover:text-gold-400 transition-colors py-2.5 border border-emerald-800/30 rounded-xl"
          >
            <Map className="w-4 h-4" />
            {t('prayerTimes.changeCurrentLocation')}
          </button>

          {/* Calculation method indicator */}
          {currentMethod && (
            <div className="flex items-center justify-center gap-2 px-1">
              <span className="text-[10px] text-midnight-500">
                {methodMode === 'auto' ? t('prayerTimes.methodAuto') : t('prayerTimes.calcMethod')}:
              </span>
              <span className="text-[10px] text-midnight-400">
                {t(currentMethod.labelKey as TranslationKey)}
              </span>
            </div>
          )}
        </>
      )}

      {/* Location picker modal */}
      {showPicker && (
        <LocationPicker
          onSelect={handlePickerSelect}
          onCancel={() => setShowPicker(false)}
        />
      )}
    </div>
  );
}

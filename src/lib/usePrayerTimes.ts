import { useState, useEffect, useCallback, useRef } from 'react';
import type { PrayerTimesData, SavedLocation, LocationMode, MethodMode, NextPrayerInfo, PrayerId } from './prayerTimesTypes';
import {
  fetchPrayerTimesByCoords,
  fetchPrayerTimesByCity,
} from './prayerTimesService';
import {
  getMethodForCountry,
  getMethodById,
  DEFAULT_METHOD_ID,
  buildCacheKey,
  getLocationDateInTimezone,
  getCurrentTimeInTimezone,
  OBLIGATORY_PRAYERS,
} from './prayerTimesTypes';

const LOCATION_KEY = 'prayer-times-location';
const METHOD_KEY = 'prayer-times-method';
const METHOD_MODE_KEY = 'prayer-times-method-mode';
const LAST_REFRESH_KEY = 'prayer-times-last-refresh';
const REFRESH_INTERVAL_MS = 30 * 60 * 1000;
const CACHE_PREFIX = 'prayer-times-cache:';
const CACHE_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

type GeoError = 'denied' | 'unavailable' | 'error' | null;

type StoredMethod = {
  mode: MethodMode;
  manualMethodId: number | null;
};

function loadStoredMethod(): StoredMethod {
  const modeStored = localStorage.getItem(METHOD_MODE_KEY);
  const mode: MethodMode = modeStored === 'manual' ? 'manual' : 'auto';
  const manualIdStored = localStorage.getItem(METHOD_KEY);
  const manualMethodId = manualIdStored ? parseInt(manualIdStored, 10) : null;
  return { mode, manualMethodId };
}

function saveStoredMethod(stored: StoredMethod) {
  localStorage.setItem(METHOD_MODE_KEY, stored.mode);
  if (stored.manualMethodId != null) {
    localStorage.setItem(METHOD_KEY, String(stored.manualMethodId));
  } else {
    localStorage.removeItem(METHOD_KEY);
  }
}

function resolveMethodId(stored: StoredMethod, location: SavedLocation | null): number {
  if (stored.mode === 'manual' && stored.manualMethodId != null) {
    return stored.manualMethodId;
  }
  if (location && location.country) {
    return getMethodForCountry(location.country).id;
  }
  return DEFAULT_METHOD_ID;
}

export function usePrayerTimes() {
  const [location, setLocation] = useState<SavedLocation | null>(() => loadLocation());
  const [data, setData] = useState<PrayerTimesData | null>(null);
  const [tomorrowData, setTomorrowData] = useState<PrayerTimesData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCached, setIsCached] = useState(false);
  const [geoError, setGeoError] = useState<GeoError>(null);
  const [storedMethod, setStoredMethod] = useState<StoredMethod>(() => loadStoredMethod());

  const locationRef = useRef(location);
  locationRef.current = location;
  const storedMethodRef = useRef(storedMethod);
  storedMethodRef.current = storedMethod;

  const resolvedMethodId = resolveMethodId(storedMethod, location);

  const loadTimes = useCallback(async (loc: SavedLocation, mId: number): Promise<void> => {
    setLoading(true);
    setError(null);
    setIsCached(false);

    try {
      let result: PrayerTimesData;
      if (loc.latitude != null && loc.longitude != null) {
        result = await fetchPrayerTimesByCoords(loc.latitude, loc.longitude, mId);
      } else {
        result = await fetchPrayerTimesByCity(loc.city, loc.country, mId);
      }

      result.city = loc.city;
      result.country = loc.country;
      result.locationMode = loc.locationMode;
      result.methodMode = storedMethodRef.current.mode;

      const cacheKey = buildCacheKey(loc, mId, result.date);
      saveCache(cacheKey, result);

      setData(result);
      setGeoError(null);

      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      let tomorrowResult: PrayerTimesData;
      if (loc.latitude != null && loc.longitude != null) {
        tomorrowResult = await fetchPrayerTimesByCoords(loc.latitude, loc.longitude, mId, tomorrow);
      } else {
        tomorrowResult = await fetchPrayerTimesByCity(loc.city, loc.country, mId, tomorrow);
      }
      tomorrowResult.city = loc.city;
      tomorrowResult.country = loc.country;
      tomorrowResult.locationMode = loc.locationMode;
      tomorrowResult.methodMode = storedMethodRef.current.mode;
      const tomorrowCacheKey = buildCacheKey(loc, mId, tomorrowResult.date);
      saveCache(tomorrowCacheKey, tomorrowResult);
      setTomorrowData(tomorrowResult);
    } catch (e) {
      const cached = loadCacheForLocation(loc, mId);
      if (cached) {
        setData(cached);
        setIsCached(true);
        setError(null);
      } else {
        setError('fetch_error');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Foreground refresh: in AUTO mode, request fresh geolocation before fetching.
  // In MANUAL mode, just fetch with saved location.
  useEffect(() => {
    if (!location) return;

    const lastRefresh = localStorage.getItem(LAST_REFRESH_KEY);
    const now = Date.now();
    const shouldRefresh = !lastRefresh || now - parseInt(lastRefresh, 10) > REFRESH_INTERVAL_MS;

    if (shouldRefresh) {
      if (location.locationMode === 'auto') {
        // AUTO: request fresh geolocation, then load with new coordinates
        requestFreshGeolocation().then((freshLoc) => {
          if (freshLoc) {
            setLocation(freshLoc);
            saveLocation(freshLoc);
            localStorage.setItem(LAST_REFRESH_KEY, String(Date.now()));
            loadTimes(freshLoc, resolveMethodId(storedMethodRef.current, freshLoc));
          } else {
            // Geolocation failed — use last known location
            localStorage.setItem(LAST_REFRESH_KEY, String(now));
            loadTimes(location, resolvedMethodId);
          }
        });
      } else {
        // MANUAL: just fetch with saved location
        localStorage.setItem(LAST_REFRESH_KEY, String(now));
        loadTimes(location, resolvedMethodId);
      }
    } else {
      // Within refresh interval: use cache if available
      const cached = loadCacheForLocation(location, resolvedMethodId);
      if (cached) {
        setData(cached);
        setIsCached(true);
      } else {
        loadTimes(location, resolvedMethodId);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location, resolvedMethodId]);

  // Cache cleanup on mount
  useEffect(() => {
    cleanOldCacheEntries();
  }, []);

  const requestGeolocation = useCallback((): Promise<void> => {
    setLoading(true);
    setGeoError(null);

    return requestFreshGeolocation().then((freshLoc) => {
      if (freshLoc) {
        setLocation(freshLoc);
        saveLocation(freshLoc);
        localStorage.setItem(LAST_REFRESH_KEY, String(Date.now()));
      }
    });
  }, []);

  const setManualLocation = useCallback((country: string, city: string) => {
    const newLoc: SavedLocation = {
      latitude: null,
      longitude: null,
      country,
      city,
      locationMode: 'manual',
      resolvedAt: Date.now(),
    };
    setLocation(newLoc);
    saveLocation(newLoc);
    localStorage.setItem(LAST_REFRESH_KEY, String(Date.now()));
  }, []);

  const changeCalculationMethod = useCallback((newMethodId: number) => {
    const newStored: StoredMethod = { mode: 'manual', manualMethodId: newMethodId };
    setStoredMethod(newStored);
    saveStoredMethod(newStored);
  }, []);

  const setAutoCalculationMethod = useCallback(() => {
    const newStored: StoredMethod = { mode: 'auto', manualMethodId: null };
    setStoredMethod(newStored);
    saveStoredMethod(newStored);
  }, []);

  const retry = useCallback(() => {
    if (locationRef.current) {
      loadTimes(locationRef.current, resolveMethodId(storedMethodRef.current, locationRef.current));
    }
  }, [loadTimes]);

  const nextPrayer = computeNextPrayer(data, tomorrowData);

  return {
    location,
    data,
    loading,
    error,
    isCached,
    geoError,
    methodId: resolvedMethodId,
    methodMode: storedMethod.mode,
    currentMethod: getMethodById(resolvedMethodId),
    requestGeolocation,
    setManualLocation,
    changeCalculationMethod,
    setAutoCalculationMethod,
    retry,
    nextPrayer,
  };
}

function requestFreshGeolocation(): Promise<SavedLocation | null> {
  return new Promise((resolve) => {
    if (!('geolocation' in navigator)) {
      resolve(null);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        resolve({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          country: '',
          city: '',
          locationMode: 'auto',
          resolvedAt: Date.now(),
        });
      },
      () => {
        resolve(null);
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 600000 },
    );
  });
}

function computeNextPrayer(
  data: PrayerTimesData | null,
  tomorrowData: PrayerTimesData | null,
): NextPrayerInfo | null {
  if (!data) return null;

  const timezone = data.timezone;
  const { hours, minutes } = getCurrentTimeInTimezone(timezone);
  const nowMinutes = hours * 60 + minutes;

  const prayerLabels: Record<PrayerId, string> = {
    fajr: 'prayerTimes.fajr',
    sunrise: 'prayerTimes.sunrise',
    dhuhr: 'prayerTimes.dhuhr',
    asr: 'prayerTimes.asr',
    maghrib: 'prayerTimes.magrib',
    isha: 'prayerTimes.isha',
  };

  for (const pid of OBLIGATORY_PRAYERS) {
    const timeStr = data.timings[pid];
    const [h, m] = timeStr.split(':').map(Number);
    const prayerMinutes = h * 60 + m;
    if (prayerMinutes > nowMinutes) {
      return { id: pid, labelKey: prayerLabels[pid], time: timeStr, isTomorrow: false, timeAvailable: true };
    }
  }

  // All of today's prayers have passed — next is tomorrow's Fajr
  if (tomorrowData) {
    return {
      id: 'fajr',
      labelKey: prayerLabels.fajr,
      time: tomorrowData.timings.fajr,
      isTomorrow: true,
      timeAvailable: true,
    };
  }

  // Tomorrow data unavailable — identify as tomorrow's Fajr but don't show a wrong time
  return {
    id: 'fajr',
    labelKey: prayerLabels.fajr,
    time: '',
    isTomorrow: true,
    timeAvailable: false,
  };
}

function loadLocation(): SavedLocation | null {
  const stored = localStorage.getItem(LOCATION_KEY);
  if (!stored) return null;
  try {
    const parsed = JSON.parse(stored);
    if (!parsed.locationMode) {
      parsed.locationMode = parsed.source === 'geo' ? 'auto' : 'manual';
    }
    return parsed as SavedLocation;
  } catch {
    return null;
  }
}

function saveLocation(loc: SavedLocation) {
  localStorage.setItem(LOCATION_KEY, JSON.stringify(loc));
}

function saveCache(key: string, data: PrayerTimesData) {
  localStorage.setItem(key, JSON.stringify(data));
}

function loadCacheForLocation(loc: SavedLocation, methodId: number): PrayerTimesData | null {
  const locationDate = getLocationDateInTimezone('UTC');
  const key = buildCacheKey(loc, methodId, locationDate);
  const stored = localStorage.getItem(key);
  if (!stored) return null;
  try {
    return JSON.parse(stored) as PrayerTimesData;
  } catch {
    return null;
  }
}

function cleanOldCacheEntries() {
  const now = Date.now();
  for (let i = localStorage.length - 1; i >= 0; i--) {
    const key = localStorage.key(i);
    if (!key || !key.startsWith(CACHE_PREFIX)) continue;
    try {
      const raw = localStorage.getItem(key);
      if (!raw) continue;
      const parsed = JSON.parse(raw) as PrayerTimesData;
      if (parsed.fetchedAt && now - parsed.fetchedAt > CACHE_MAX_AGE_MS) {
        localStorage.removeItem(key);
      }
    } catch {
      // Not valid JSON — remove it
      localStorage.removeItem(key);
    }
  }
}

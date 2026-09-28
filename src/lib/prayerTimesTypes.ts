export type PrayerId = 'fajr' | 'sunrise' | 'dhuhr' | 'asr' | 'maghrib' | 'isha';

export const PRAYER_IDS: PrayerId[] = ['fajr', 'sunrise', 'dhuhr', 'asr', 'maghrib', 'isha'];

export const OBLIGATORY_PRAYERS: PrayerId[] = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];

export type PrayerTime = {
  id: PrayerId;
  time: string;
};

export type LocationMode = 'auto' | 'manual';

export type MethodMode = 'auto' | 'manual';

export type PrayerTimesData = {
  date: string;
  timezone: string;
  latitude: number | null;
  longitude: number | null;
  country: string;
  city: string;
  locationMode: LocationMode;
  calculationMethod: string;
  calculationMethodId: number;
  methodMode: MethodMode;
  provider: string;
  timings: Record<PrayerId, string>;
  fetchedAt: number;
};

export type SavedLocation = {
  latitude: number | null;
  longitude: number | null;
  country: string;
  city: string;
  locationMode: LocationMode;
  resolvedAt: number;
};

export type NextPrayerInfo = {
  id: PrayerId;
  labelKey: string;
  time: string;
  isTomorrow: boolean;
  timeAvailable: boolean;
};

export type CalculationMethodId = number;

export type CalculationMethod = {
  id: CalculationMethodId;
  labelKey: string;
  countries: string[];
};

export const CALCULATION_METHODS: CalculationMethod[] = [
  { id: 13, labelKey: 'prayerTimes.method.diyanet', countries: ['TR', 'Turkey', 'Türkiye'] },
  { id: 3, labelKey: 'prayerTimes.method.mwl', countries: [] },
  { id: 2, labelKey: 'prayerTimes.method.isna', countries: ['US', 'United States', 'Canada', 'CA'] },
  { id: 5, labelKey: 'prayerTimes.method.egypt', countries: ['EG', 'Egypt', 'مصر'] },
  { id: 4, labelKey: 'prayerTimes.method.makkah', countries: ['SA', 'Saudi Arabia', 'السعودية', 'AE', 'UAE', 'KW', 'Kuwait', 'QA', 'Qatar', 'BH', 'Bahrain', 'OM', 'Oman', 'YE', 'Yemen'] },
  { id: 1, labelKey: 'prayerTimes.method.karachi', countries: ['PK', 'Pakistan', 'IN', 'India', 'BD', 'Bangladesh'] },
  { id: 7, labelKey: 'prayerTimes.method.tehran', countries: ['IR', 'Iran', 'إيران'] },
  { id: 0, labelKey: 'prayerTimes.method.jafari', countries: ['IQ', 'Iraq', 'LB', 'Lebanon', 'BH'] },
];

export const DEFAULT_METHOD_ID = 3;

export function getMethodForCountry(country: string): CalculationMethod {
  const found = CALCULATION_METHODS.find((m) =>
    m.countries.some((c) => c.toLowerCase() === country.toLowerCase())
  );
  return found || CALCULATION_METHODS.find((m) => m.id === DEFAULT_METHOD_ID)!;
}

export function getMethodById(id: number): CalculationMethod | undefined {
  return CALCULATION_METHODS.find((m) => m.id === id);
}

export function normalizeCoords(lat: number, lng: number, precision = 2): string {
  return `${lat.toFixed(precision)},${lng.toFixed(precision)}`;
}

export function buildCacheKey(
  location: SavedLocation,
  methodId: number,
  locationDate: string,
): string {
  let locationId: string;
  if (location.locationMode === 'auto' && location.latitude != null && location.longitude != null) {
    locationId = `auto:${normalizeCoords(location.latitude, location.longitude)}`;
  } else {
    locationId = `manual:${location.country.toLowerCase()}:${location.city.toLowerCase()}`;
  }
  return `prayer-times-cache:${locationId}:${methodId}:${locationDate}`;
}

export function getLocationDateInTimezone(timezone: string): string {
  const now = new Date();
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  return formatter.format(now);
}

export function getCurrentTimeInTimezone(timezone: string): { hours: number; minutes: number } {
  const now = new Date();
  const formatter = new Intl.DateTimeFormat('en-GB', {
    timeZone: timezone,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
  const parts = formatter.formatToParts(now);
  const hours = parseInt(parts.find((p) => p.type === 'hour')?.value || '0', 10);
  const minutes = parseInt(parts.find((p) => p.type === 'minute')?.value || '0', 10);
  return { hours, minutes };
}

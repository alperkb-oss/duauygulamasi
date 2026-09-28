import type { PrayerTimesData, PrayerId } from './prayerTimesTypes';

const BASE_URL = 'https://api.aladhan.com/v1/timings';

type AlAdhanTimings = {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
};

type AlAdhanResponse = {
  code: number;
  status: string;
  data: {
    timings: AlAdhanTimings;
    date: {
      readable: string;
      timestamp: string;
      gregorian: { date: string; weekday: { en: string } };
      hijri: { date: string; month: { en: string } };
    };
    meta: {
      timezone: string;
      latitude: number;
      longitude: number;
      method: { id: number; name: string };
    };
  };
};

function parseTimeString(timeStr: string): string {
  return timeStr.split(' ')[0];
}

function dateToDDMMYYYY(d: Date): string {
  return `${String(d.getDate()).padStart(2, '0')}-${String(d.getMonth() + 1).padStart(2, '0')}-${d.getFullYear()}`;
}

export async function fetchPrayerTimesByCoords(
  lat: number,
  lng: number,
  methodId: number,
  date?: Date,
): Promise<PrayerTimesData> {
  const d = date || new Date();
  const dateStr = dateToDDMMYYYY(d);
  const url = `${BASE_URL}/${dateStr}?latitude=${lat}&longitude=${lng}&method=${methodId}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`AlAdhan API error: ${res.status}`);
  const json: AlAdhanResponse = await res.json();
  if (json.code !== 200) throw new Error(`AlAdhan API error: ${json.status}`);
  return normalizeResponse(json);
}

export async function fetchPrayerTimesByCity(
  city: string,
  country: string,
  methodId: number,
  date?: Date,
): Promise<PrayerTimesData> {
  const d = date || new Date();
  const dateStr = dateToDDMMYYYY(d);
  const url = `${BASE_URL}/${dateStr}?city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}&method=${methodId}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`AlAdhan API error: ${res.status}`);
  const json: AlAdhanResponse = await res.json();
  if (json.code !== 200) throw new Error(`AlAdhan API error: ${json.status}`);
  return normalizeResponse(json);
}

function normalizeResponse(json: AlAdhanResponse): PrayerTimesData {
  const t = json.data.timings;
  const timings: Record<PrayerId, string> = {
    fajr: parseTimeString(t.Fajr),
    sunrise: parseTimeString(t.Sunrise),
    dhuhr: parseTimeString(t.Dhuhr),
    asr: parseTimeString(t.Asr),
    maghrib: parseTimeString(t.Maghrib),
    isha: parseTimeString(t.Isha),
  };
  return {
    date: json.data.date.gregorian.date,
    timezone: json.data.meta.timezone,
    latitude: json.data.meta.latitude,
    longitude: json.data.meta.longitude,
    country: '',
    city: '',
    locationMode: 'auto',
    calculationMethod: json.data.meta.method.name,
    calculationMethodId: json.data.meta.method.id,
    methodMode: 'auto',
    provider: 'aladhan',
    timings,
    fetchedAt: Date.now(),
  };
}

export function buildLocationLabel(data: PrayerTimesData, savedLocation: { city: string; country: string; locationMode: string; latitude: number | null; longitude: number | null }): string {
  if (savedLocation.city && savedLocation.country) {
    return `${savedLocation.city}, ${savedLocation.country}`;
  }
  if (data.city) return data.city;
  if (savedLocation.locationMode === 'auto' && data.latitude != null && data.longitude != null) {
    return `${data.latitude.toFixed(2)}, ${data.longitude.toFixed(2)}`;
  }
  return savedLocation.country || '';
}

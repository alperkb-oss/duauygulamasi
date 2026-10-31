import type { PostgrestError } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

const MS_PER_DAY = 86_400_000;

export type DayStatus = 'not_started' | 'active' | 'completed';

export function toLocalDateString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getPlanDayNumber(startDate: string, todayDate: string): number {
  const [sy, sm, sd] = startDate.split('-').map(Number);
  const [ty, tm, td] = todayDate.split('-').map(Number);
  const diff = Date.UTC(ty, tm - 1, td) - Date.UTC(sy, sm - 1, sd);
  return Math.round(diff / MS_PER_DAY) + 1;
}

export function getDayStatus(dayNumber: number, targetDays: number): DayStatus {
  if (dayNumber < 1) return 'not_started';
  if (dayNumber > targetDays) return 'completed';
  return 'active';
}

export async function ensureDailyProgress(
  rows: { planDetailId: string; dayNumber: number }[],
  date: string
): Promise<PostgrestError | null> {
  if (rows.length === 0) return null;
  const { error } = await supabase.from('user_daily_progress').upsert(
    rows.map((row) => ({
      plan_detail_id: row.planDetailId,
      current_day_number: row.dayNumber,
      date,
      morning_count_done: 0,
      evening_count_done: 0,
      is_morning_completed: false,
      is_evening_completed: false,
    })),
    { onConflict: 'plan_detail_id,date', ignoreDuplicates: true }
  );
  return error;
}

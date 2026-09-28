import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Prayer = {
  id: string;
  name: string;
  category: string;
  turkish_transliteration: string | null;
  meaning: string | null;
  priority_score: number;
  suggested_count: string | null;
  suggested_time: string | null;
  created_at: string;
};

export type ReadingPlan = {
  id: string;
  plan_name: string;
  is_active: boolean;
  created_at: string;
};

export type PlanDetail = {
  id: string;
  plan_id: string;
  prayer_id: string;
  target_days: number;
  target_count_morning: number;
  target_count_evening: number;
  sequence_order: number;
  created_at: string;
};

export type UserDailyProgress = {
  id: string;
  plan_detail_id: string;
  current_day_number: number;
  morning_count_done: number;
  evening_count_done: number;
  is_morning_completed: boolean;
  is_evening_completed: boolean;
  date: string;
  created_at: string;
};

export type PlanDetailWithPrayer = PlanDetail & {
  prayers: Prayer;
};

export type PlanDetailWithProgress = PlanDetailWithPrayer & {
  user_daily_progress: UserDailyProgress[];
};

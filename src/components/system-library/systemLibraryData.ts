import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { EducationalRow, Prayer, PrayerPurposeLink, PurposeGroup } from '@/lib/supabase';

const DUA_CATEGORY = 'Namazda Okunan Başlıca Dualar';
const ESMA_CATEGORY = 'Esma-ül Hüsna';

export type SystemLibraryData = {
  prayers: Prayer[];
  purposes: PurposeGroup[];
  purposeLinks: PrayerPurposeLink[];
  educationalRows: EducationalRow[];
};

export type SystemLibraryState =
  | { status: 'loading' }
  | { status: 'error' }
  | { status: 'ready'; data: SystemLibraryData };

export function useSystemLibraryData(): SystemLibraryState {
  const [state, setState] = useState<SystemLibraryState>({ status: 'loading' });

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      const [prayersRes, purposesRes, linksRes, educationRes] = await Promise.all([
        supabase.from('prayers').select('*').order('priority_score', { ascending: true }).order('name', { ascending: true }),
        supabase.from('purpose_groups').select('*').order('sort_order', { ascending: true }),
        supabase.from('prayer_purposes').select('prayer_id, purpose_id, is_primary'),
        supabase.from('educational_content').select('*').order('topic', { ascending: true }).order('sort_order', { ascending: true }),
      ]);

      if (cancelled) return;

      if (prayersRes.error || purposesRes.error || linksRes.error || educationRes.error || !prayersRes.data) {
        setState({ status: 'error' });
        return;
      }

      setState({
        status: 'ready',
        data: {
          prayers: prayersRes.data as Prayer[],
          purposes: (purposesRes.data ?? []) as PurposeGroup[],
          purposeLinks: (linksRes.data ?? []) as PrayerPurposeLink[],
          educationalRows: (educationRes.data ?? []) as EducationalRow[],
        },
      });
    };

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}

export const isDuaPrayer = (prayer: Prayer) => prayer.category === DUA_CATEGORY;

export const isEsmaPrayer = (prayer: Prayer) => prayer.category === ESMA_CATEGORY;

export const isZikirPrayer = (prayer: Prayer) => prayer.content_type === 'Zikir';

export type PurposeSummary = {
  primaryId: string | null;
  secondaryIds: string[];
};

export function buildPurposeSummaries(links: PrayerPurposeLink[]): Map<string, PurposeSummary> {
  const summaries = new Map<string, PurposeSummary>();
  for (const link of links) {
    const summary = summaries.get(link.prayer_id) ?? { primaryId: null, secondaryIds: [] };
    if (link.is_primary) {
      summary.primaryId = link.purpose_id;
    } else {
      summary.secondaryIds.push(link.purpose_id);
    }
    summaries.set(link.prayer_id, summary);
  }
  return summaries;
}

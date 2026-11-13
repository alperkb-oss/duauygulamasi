import type { PurposeGroup } from './supabase';
import type { LanguageCode } from './translations';

export function purposeLabel(purpose: PurposeGroup, lang: LanguageCode): string {
  return (lang === 'en' && purpose.name_en) || purpose.name_tr;
}

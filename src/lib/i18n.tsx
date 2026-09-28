import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import {
  translations,
  detectLanguage,
  RTL_LANGUAGES,
  type LanguageCode,
  type TranslationKey,
} from './translations';

type I18nContextValue = {
  lang: LanguageCode;
  setLang: (lang: LanguageCode) => void;
  t: (key: TranslationKey) => string;
  isRTL: boolean;
};

const I18nContext = createContext<I18nContextValue | null>(null);

const STORAGE_KEY = 'app-language';

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<LanguageCode>(() => detectLanguage());

  const isRTL = RTL_LANGUAGES.includes(lang);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
  }, [lang, isRTL]);

  const setLang = (newLang: LanguageCode) => {
    setLangState(newLang);
    localStorage.setItem(STORAGE_KEY, newLang);
  };

  const t = (key: TranslationKey): string => {
    return translations[lang][key] ?? translations.en[key] ?? key;
  };

  return (
    <I18nContext.Provider value={{ lang, setLang, t, isRTL }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within I18nProvider');
  return ctx;
}

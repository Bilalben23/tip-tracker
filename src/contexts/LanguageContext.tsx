import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { ar, fr, enUS, type Locale } from 'date-fns/locale';
import type { Language } from '../types';
import { translations, type T } from '../lib/translations';

interface LanguageContextType {
  lang: Language;
  setLang: (l: Language) => void;
  t: T;
  isRTL: boolean;
  dateLocale: Locale;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>(() => {
    return (localStorage.getItem('tt_lang') as Language) ?? 'fr';
  });

  const setLang = (l: Language) => {
    localStorage.setItem('tt_lang', l);
    setLangState(l);
  };

  const isRTL = lang === 'ar';

  useEffect(() => {
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang, isRTL]);

  const dateLocale = lang === 'ar' ? ar : lang === 'fr' ? fr : enUS;

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: translations[lang], isRTL, dateLocale }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLang = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLang must be used within LanguageProvider');
  return ctx;
};

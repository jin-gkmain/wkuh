import { createContext } from 'react';

export type LangType = 'ko' | 'en';

type LanguageContextState = {
  lang: 'ko' | 'en';
  setLang: (lang: LangType) => void;
};

export const LanguageContext = createContext<LanguageContextState>({
  lang: 'ko',
  setLang() {},
});

import { createContext } from "react";

export type LangType = "ko" | "en" | "kk" | "mn";

type LanguageContextState = {
  lang: LangType;
  webLang: LangType;
  setWebLang: (lang: LangType) => void;
  setLang: (lang: LangType) => void;
};

export const LanguageContext = createContext<LanguageContextState>({
  lang: "ko",
  webLang: "ko",
  setWebLang() {},
  setLang() {},
});

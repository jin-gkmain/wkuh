import { createContext } from "react";

export type LangType = "ko" | "en" | "kk" | "mn";

type LanguageContextState = {
  lang: LangType;
  setLang: (lang: LangType) => void;
};

export const LanguageContext = createContext<LanguageContextState>({
  lang: "ko",
  setLang() {},
});

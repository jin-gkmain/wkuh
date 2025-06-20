import "@/styles/normalize.css";
import "@/styles/globals.css";
import "@/styles/basic.css";
import type { AppProps } from "next/app";
import { NextPage } from "next";
import { ReactElement, ReactNode, useEffect, useState } from "react";
import StoreProvider from "@/store/StoreProvider";
import Head from "next/head";
import { useRouter } from "next/router";
import { LangType, LanguageContext } from "@/context/LanguageContext";
import { Noto_Sans } from "next/font/google";
import SendBirdCall from "sendbird-calls";

const NotoSans = Noto_Sans({ subsets: ["latin"] });

export type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const correctLang = (lang: string): lang is LangType => {
  return lang === "ko" || lang === "en" || lang === "kk" || lang === "mn";
};

const correctWebLang = (lang: string): lang is LangType => {
  return ["ko", "en"].includes(lang);
};

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const [lang, setLang] = useState<LangType>("ko");
  const [webLang, setWebLang] = useState<LangType>("ko");

  const getLayout = Component.getLayout ?? ((page) => page);

  const changeLang = (newLang: LangType) => {
    setLang(newLang);
    if (typeof window !== "undefined") {
      sessionStorage.setItem("lang", newLang);
    }
  };

  const changeWebLang = (newWebLang: LangType) => {
    setWebLang(newWebLang);
    if (typeof window !== "undefined") {
      sessionStorage.setItem("weblang", newWebLang);
    }
  };
  useEffect(() => {
    SendBirdCall.init(process.env.NEXT_PUBLIC_SENDBIRD_APP_ID!);
    if (typeof window !== "undefined") {
      const webLang = navigator.language.slice(0, 2);
      const sessionLang = sessionStorage.getItem("lang");
      const sessionWebLang = sessionStorage.getItem("weblang");

      if (sessionLang && correctLang(sessionLang)) {
        setLang(sessionLang);
      } else {
        if (webLang) {
          if (correctLang(webLang)) {
            setLang(webLang);
            sessionStorage.setItem("lang", webLang);
          } else {
            setLang("ko");
            sessionStorage.setItem("lang", "ko");
          }
        }
      }
      if (sessionWebLang && correctWebLang(sessionWebLang)) {
        setWebLang(sessionWebLang);
      } else {
        if (webLang) {
          if (correctWebLang(webLang)) {
            setWebLang(webLang);
            sessionStorage.setItem("weblang", webLang);
          } else {
            setWebLang("en");
            sessionStorage.setItem("weblang", "en");
          }
        }
      }
    }
  }, []);

  return (
    <StoreProvider>
      <LanguageContext.Provider
        value={{
          lang,
          webLang,
          setLang: changeLang,
          setWebLang: changeWebLang,
        }}
      >
        <Head>
          <title>My Next.js App</title>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <div className={NotoSans.className}>
          {getLayout(<Component {...pageProps} />)}
        </div>
        <div id="root-modal"></div>
        <div id="sub-modal"></div>
      </LanguageContext.Provider>
    </StoreProvider>
  );
}

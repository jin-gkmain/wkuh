import '@/styles/normalize.css';
import '@/styles/globals.css';
import '@/styles/basic.css';
import type { AppProps } from 'next/app';
import { NextPage } from 'next';
import { ReactElement, ReactNode, useEffect, useState } from 'react';
import StoreProvider from '@/store/StoreProvider';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { LangType, LanguageContext } from '@/context/LanguageContext';
import { Noto_Sans } from 'next/font/google';


const NotoSans = Noto_Sans({ subsets: ['latin'] });

export type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const correctLang = (lang: string): lang is LangType => {
  return lang === 'ko' || lang === 'en' || lang === 'kk' || lang === 'mn';
};

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const router = useRouter();
  const [lang, setLang] = useState<LangType>('ko');

  const getLayout = Component.getLayout ?? ((page) => page);

  const changeLang = (newLang: LangType) => {
    setLang(newLang);
    if (typeof window !== 'undefined') {
        sessionStorage.setItem('lang', newLang);
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
        const webLang = navigator.language.slice(0, 2);
        const sessionLang = sessionStorage.getItem('lang');

        if (sessionLang && correctLang(sessionLang)) {
          setLang(sessionLang);
        } else {
          if (webLang) {
            if (correctLang(webLang)) {
                setLang(webLang);
                sessionStorage.setItem('lang', webLang);
            } else {
                setLang('ko');
                sessionStorage.setItem('lang', 'ko');
            }
          }
        }
    }
  }, []);

  useEffect(() => {
    if (router.pathname.startsWith('/mobile/')) {
      import('@/styles/mobile.css').catch(err => console.log("Failed to load mobile.css", err));
    }
  }, [router.pathname]);

  return (
    <StoreProvider>
      <LanguageContext.Provider value={{ lang, setLang: changeLang }}>
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
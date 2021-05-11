/* eslint-disable functional/immutable-data */
import React, { createContext, useState, useRef, useEffect } from 'react';
import rosetta from 'rosetta';
import EN from '../../locales/en.json';
// import VI from "../../locales/vi.json";
import { AnyObject } from '../types';
// import rosetta from 'rosetta/debug';

const i18n = rosetta();

export type TranslateFunction = (
  key: string | readonly (string | number)[],
  params?: any,
  lang?: string
) => string;
type LocaleFunction = (l: string, dict: AnyObject) => void;

export type I18nState = {
  readonly activeLocale: string;
  readonly t: TranslateFunction;
  readonly locale: LocaleFunction;
};

export const defaultLanguage = 'en';
export const languages = ['en', 'vi'];
export const contentLanguageMap = { vi: 'vi-VN', en: 'en-US' };

export const I18nContext = createContext<I18nState>({} as any);

// default language
i18n.locale(defaultLanguage);
i18n.set(defaultLanguage, EN);

export const I18n: React.FunctionComponent<any> = ({
  children,
  locale,
  lngDict,
}) => {
  const [activeDict, setActiveDict] = useState(() => lngDict);
  const activeLocaleRef = useRef(locale || defaultLanguage);
  const [, setTick] = useState(0);
  const firstRender = useRef(true);

  // for initial SSR render
  if (locale && firstRender.current) {
    firstRender.current = false;
    i18n.locale(locale);
    i18n.set(locale, activeDict);
  }

  useEffect(() => {
    if (locale) {
      i18n.locale(locale);
      i18n.set(locale, activeDict);
      activeLocaleRef.current = locale;
      // force rerender
      setTick((tick) => tick + 1);
    }
  }, [locale, activeDict]);

  const i18nWrapper: I18nState = {
    activeLocale: activeLocaleRef.current,
    t: (key, params, lang) => i18n.t(key as any, params, lang),
    locale: (l: string, dict: AnyObject) => {
      i18n.locale(l);
      activeLocaleRef.current = l;
      if (dict) {
        i18n.set(l, dict);
        setActiveDict(dict);
      } else {
        setTick((tick) => tick + 1);
      }
    },
  };

  return (
    <I18nContext.Provider value={i18nWrapper}>{children}</I18nContext.Provider>
  );
};

export default i18n;

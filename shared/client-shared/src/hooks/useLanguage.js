import { useState, createContext } from 'react';
import useCookie from 'react-use-cookie';

export const LANGUAGE_ENGLISH = 'english';
export const LANGUAGE_ARCADIAN = 'voynich';

const DEFAULT_LANGUAGE = LANGUAGE_ENGLISH;
const COOKIE_NAME = 'language';

export const LanguageContext = createContext();

export const useLanguage = () => {
  const [cookie, setCookie] = useCookie(COOKIE_NAME, DEFAULT_LANGUAGE);
  const [language, setLanguage] = useState(cookie);
  const isEnglish = language === LANGUAGE_ENGLISH;

  const changeLanguage = (newLanguage) => {
    setCookie(newLanguage, {
      domain:
        window.location.href.indexOf('localhost') === -1
          ? '.itegoarcanadei.com'
          : 'localhost',
      maxAge: 2147483647,
      secure: process.env.NODE_ENV === 'production',
    });
    setLanguage(newLanguage);
  };

  return { language, isEnglish, changeLanguage };
};

import {createContext, useState, useContext} from 'react';
import translations from './translations';

const LanguageContext = createContext({
  language: 'en',
  setLanguage: (lang: string) => {
  },
  translate: (key: string) => key,
});

export const LanguageProvider = ({children}: any) => {
  const [language, setLanguage] = useState('en');

  const translate = (key: string) => {
    // @ts-ignore
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{language, setLanguage, translate}}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
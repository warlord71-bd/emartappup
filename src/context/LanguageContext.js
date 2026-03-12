import React, { createContext, useContext, useState, useCallback } from 'react';
import en from '../i18n/en';
import bn from '../i18n/bn';

const translations = { en, bn };

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState('en'); // Default to English

  const t = useCallback((key) => {
    return translations[lang]?.[key] || translations.en[key] || key;
  }, [lang]);

  const toggleLanguage = () => {
    setLang(prev => prev === 'en' ? 'bn' : 'en');
  };

  const setLanguage = (code) => {
    if (translations[code]) setLang(code);
  };

  const isEnglish = lang === 'en';
  const isBangla = lang === 'bn';
  const currentLang = lang;
  const langLabel = lang === 'en' ? 'English' : 'বাংলা';

  return (
    <LanguageContext.Provider value={{
      t,
      lang,
      currentLang,
      isEnglish,
      isBangla,
      langLabel,
      toggleLanguage,
      setLanguage,
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
};

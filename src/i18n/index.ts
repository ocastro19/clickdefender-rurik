import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import ptTranslations from './locales/pt.json';
import enTranslations from './locales/en.json';

const resources = {
  pt: {
    translation: ptTranslations
  },
  en: {
    translation: enTranslations
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'pt',
    debug: false,
    
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng',
    },

    interpolation: {
      escapeValue: false,
    },
    
    // Garantir que a mudança de idioma seja aplicada imediatamente
    react: {
      useSuspense: false,
    },
    
    // Forçar re-render quando o idioma mudar
    saveMissing: false,
    saveMissingTo: 'fallback',
    
    // Configurações de namespace
    defaultNS: 'translation',
    ns: ['translation'],
  })
  .then(() => {
    // i18n initialized successfully
  })
  .catch((error) => {
    console.error('i18n initialization failed:', error);
  });

export default i18n;
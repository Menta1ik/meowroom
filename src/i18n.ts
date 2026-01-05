import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import uk from './locales/uk.json';
import en from './locales/en.json';

// CIS countries (Commonwealth of Independent States) + Georgia/Ukraine neighbours
// These languages will be mapped to Ukrainian interface
const CIS_LANGUAGES = ['uk', 'ru', 'be', 'kk', 'az', 'hy', 'ka', 'ky', 'tg', 'uz', 'ro', 'md'];

const resources: Record<string, any> = {
  uk: { translation: uk },
  en: { translation: en }
};

// Map all CIS languages to use 'uk' translation
CIS_LANGUAGES.forEach(lang => {
  if (lang !== 'uk') {
    resources[lang] = { translation: uk };
  }
});

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    
    // Global fallback to English for "Rest of the World"
    fallbackLng: 'en',
    
    // Whitelist supported languages (EN + all CIS variants)
    supportedLngs: ['en', ...CIS_LANGUAGES],
    
    load: 'languageOnly',

    debug: import.meta.env.DEV,
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng',
    },
  });

export default i18n;

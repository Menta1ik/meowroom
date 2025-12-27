import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import uk from './locales/uk.json';
import en from './locales/en.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      uk: {
        translation: uk,
      },
      en: {
        translation: en,
      },
      // Alias Russian, Belarusian, Kazakh to Ukrainian content
      ru: {
        translation: uk,
      },
      be: {
        translation: uk,
      },
      kk: {
        translation: uk,
      }
    },
    // Global fallback to English (for Europe, World, etc.)
    fallbackLng: 'en',
    
    // List all supported/aliased languages so detector accepts them
    supportedLngs: ['uk', 'en', 'ru', 'be', 'kk'],
    
    // Simplify locale codes (e.g., 'ru-RU' -> 'ru')
    load: 'languageOnly',

    debug: import.meta.env.DEV,
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      // If user has 'ru' in localStorage, it will load 'ru' resource (which is 'uk' content)
    },
  });

export default i18n;

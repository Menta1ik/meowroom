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
      // Alias Russian, Belarusian, Kazakh to Ukrainian content (fallback)
      // User asked to remove explicit RU support but fallbacks might be useful for detection
      // However, user said "Верни украинский везде", implying if someone has RU browser, they should see UK.
      // So mapping RU to UK is actually what achieves "Ukrainian everywhere" for RU users without RU translation.
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
    // Global fallback to Ukrainian as per user request ("Верни украинский везде")
    fallbackLng: 'uk',
    
    supportedLngs: ['uk', 'en', 'ru', 'be', 'kk'],
    
    load: 'languageOnly',

    debug: import.meta.env.DEV,
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

export default i18n;

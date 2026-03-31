import i18n, { InitOptions } from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import en from './en.json';
import fr from './fr.json';

export const resources = {
  en: { translation: en },
  fr: { translation: fr },
};

export const i18nOptions: InitOptions = {
  resources,
  fallbackLng: 'fr',
  interpolation: {
    escapeValue: false,
  },
};

export function createI18nInstance(lang?: string) {
  const instance = i18n.createInstance();
  instance.use(initReactI18next);
  
  const options: InitOptions = { ...i18nOptions };
  if (lang) {
    options.lng = lang;
  }
  
  instance.init(options);
  return instance;
}

// Initialize the default instance for client-side
if (typeof window !== 'undefined') {
  i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      ...i18nOptions,
      detection: {
        order: ['localStorage', 'navigator'],
        caches: ['localStorage'],
      },
    });
}

export default i18n;

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enTranslation from './en.json';
import itTranslation from './it.json';

i18n
    .use(initReactI18next)
    .init({
        resources: {
            en: { translation: enTranslation },
            it: { translation: itTranslation },
        },
        lng: 'it', // Lingua di default
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false,
        },
    });

export default i18n;

import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { defaultNS, resources } from "./locales/resources";

i18next
  .use(LanguageDetector) // Detect the user's language
  .use(initReactI18next) // Initialize i18n for React
  .init({
    lng: "en",
    fallbackLng: "en",
    debug: true,
    defaultNS,
    resources,
    interpolation: {
      escapeValue: false,
    },
  });

export default i18next;

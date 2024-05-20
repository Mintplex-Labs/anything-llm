import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { defaultNS, resources } from "./locales/resources";

i18next
  // https://github.com/i18next/i18next-browser-languageDetector/blob/9efebe6ca0271c3797bc09b84babf1ba2d9b4dbb/src/index.js#L11
  .use(LanguageDetector) // Detect the user's language
  .use(initReactI18next) // Initialize i18n for React
  .init({
    lng: window.navigator.language || "en",
    fallbackLng: "en",
    debug: true,
    defaultNS,
    resources,
    interpolation: {
      escapeValue: false,
    },
  });

export default i18next;

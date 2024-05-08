/* eslint-disable max-lines */
// import all namespaces English
var subdir_zh='en' 
import settings_en from "../../../public/locales/en/settings.json"
 
// import all namespaces Simplified Chinese  
import settings_zh from "../../../public/locales/zh/settings.json"

//type all translations
export type Translations = { 
  settings: typeof import("../../../public/locales/en/settings.json"); 
};

enum SupportedLanguages {
  en = "en", 
  zh = "zh",
}

export const defaultNS = "translation";
export const resources: Record<SupportedLanguages, Translations> = {
  en: { 
    settings: settings_en,
  }, 
  zh: { 
    settings: settings_zh,
  },
} as const;

import i18n from "@/i18n";
import { resources as languages } from "@/locales/resources";

i18n.changeLanguage("es");

export function useLanguageOptions() {
  const supportedLanguages = Object.keys(languages);
  const languageNames = new Intl.DisplayNames(supportedLanguages, {
    type: "language",
  });
  const changeLanguage = (newLang = "es") => {
    if (!Object.keys(languages).includes(newLang)) return false;
    i18n.changeLanguage(newLang);
  };

  return {
    currentLanguage: i18n.language || "es",
    supportedLanguages,
    getLanguageName: (lang = "es") => languageNames.of(lang),
    changeLanguage,
  };
}

import { useLanguageOptions } from "@/hooks/useLanguageOptions";
import { useTranslation } from "react-i18next";

export default function LanguagePreference() {
  const { t } = useTranslation();
  const {
    currentLanguage,
    supportedLanguages,
    getLanguageName,
    changeLanguage,
  } = useLanguageOptions();

  return (
    <div className="flex flex-col gap-y-0.5 my-4">
      <p className="text-sm leading-6 font-semibold text-white">
        {t("customization.items.display-language.title")}
      </p>
      <p className="text-xs text-white/60">
        {t("customization.items.display-language.description")}
      </p>
      <div className="flex items-center gap-x-4">
        <select
          name="userLang"
          className="border-none bg-theme-settings-input-bg mt-2 text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-fit py-2 px-4"
          defaultValue={currentLanguage || "en"}
          onChange={(e) => changeLanguage(e.target.value)}
        >
          {supportedLanguages.map((lang) => {
            return (
              <option key={lang} value={lang}>
                {getLanguageName(lang)}
              </option>
            );
          })}
        </select>
      </div>
    </div>
  );
}

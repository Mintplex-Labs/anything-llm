import { useLanguageOptions } from "@/hooks/useLanguageOptions";
import { useTranslation } from "react-i18next";

export default function LanguagePreference() {
  const {
    currentLanguage,
    supportedLanguages,
    getLanguageName,
    changeLanguage,
  } = useLanguageOptions();
  const { t } = useTranslation();

  return (
    <>
      <div className="flex flex-col gap-y-1 mt-6">
        <h2 className="text-base leading-6 font-bold text-white">
          {t("appearance.languages.title")}
        </h2>
        <p className="text-xs leading-[18px] font-base text-white/60">
          {t("appearance.languages.title")}
        </p>
      </div>
      <div className="flex items-center gap-x-4">
        <select
          name="userLang"
          className="border-none bg-theme-settings-input-bg w-fit mt-2 px-4 border-gray-500 text-white text-sm rounded-lg block py-2"
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
    </>
  );
}

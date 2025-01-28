import { useLanguageOptions } from "@/hooks/useLanguageOptions";

export default function LanguagePreference() {
  const {
    currentLanguage,
    supportedLanguages,
    getLanguageName,
    changeLanguage,
  } = useLanguageOptions();

  return (
    <>
      <div className="flex flex-col gap-y-1 mt-6">
        <h2 className="text-base leading-6 font-bold text-white custom-text-secondary">
          Display Language
        </h2>
        <p className="text-xs leading-[18px] font-base text-white/60 custom-text-secondary">
          Select the preferred language to render {process.env.APPLICATION_FALLBACK_NAME || "Prism"}'s UI in, when
          applicable.
        </p>
      </div>
      <div className="flex items-center gap-x-4">
        <select
          name="userLang"
          className="border-none bg-theme-settings-input-bg w-fit mt-2 px-4 border-gray-500 text-white text-sm rounded-lg block py-2 custom-theme-bg-tertiary custom-text-secondary custom-border-secondary"
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

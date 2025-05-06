import { useTheme } from "@/hooks/useTheme";
import { useTranslation } from "react-i18next";

export default function ThemePreference() {
  const { t } = useTranslation();
  const { theme, setTheme, availableThemes } = useTheme();

  return (
    <div className="flex flex-col gap-y-0.5 my-4">
      <p className="text-sm leading-6 font-semibold text-white">
        {t("customization.items.theme.title")}
      </p>
      <p className="text-xs text-white/60">
        {t("customization.items.theme.description")}
      </p>
      <div className="flex items-center gap-x-4">
        <select
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
          className="border-none bg-theme-settings-input-bg mt-2 text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-fit py-2 px-4"
        >
          {Object.entries(availableThemes).map(([key, value]) => (
            <option key={key} value={key}>
              {value}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

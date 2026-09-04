import { useTranslation } from "react-i18next";

export default function ChatTemperatureSettings({ workspace, setHasChanges }) {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col gap-y-[8px]">
      <div className="flex flex-col gap-y-[8px]">
        <label htmlFor="name" className="block input-label">
          {t("chat.temperature.title")}
        </label>
        <p className="text-white text-opacity-60 text-xs font-medium">
          {t("chat.temperature.desc-end")}
        </p>
      </div>
      <input
        name="openAiTemp"
        type="number"
        min={0.0}
        step={0.1}
        onWheel={(e) => e.target.blur()}
        defaultValue={workspace?.openAiTemp ?? ""}
        className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
        placeholder={t("chat.temperature.placeholder")}
        autoComplete="off"
        onChange={() => setHasChanges(true)}
      />
    </div>
  );
}

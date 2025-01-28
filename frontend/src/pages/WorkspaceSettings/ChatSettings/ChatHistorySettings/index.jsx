import { useTranslation } from "react-i18next";
export default function ChatHistorySettings({ workspace, setHasChanges }) {
  const { t } = useTranslation();
  return (
    <div>
      <div className="flex flex-col gap-y-1 mb-4">
        <label htmlFor="name" className="block mb-2 input-label custom-text-secondary">
          {t("chat.history.title")}
        </label>
        <p className="text-white text-opacity-60 text-xs font-medium custom-text-secondary">
          {t("chat.history.desc-start")}
          <i> {t("chat.history.recommend")} </i>
          {t("chat.history.desc-end")}
        </p>
      </div>
      <input
        name="openAiHistory"
        type="number"
        min={1}
        max={45}
        step={1}
        onWheel={(e) => e.target.blur()}
        defaultValue={workspace?.openAiHistory ?? 20}
        className="border-none bg-theme-settings-input-bg text-white text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5 custom-theme-bg-tertiary custom-text-secondary custom-border-secondary"
        placeholder="20"
        required={true}
        autoComplete="off"
        onChange={() => setHasChanges(true)}
      />
    </div>
  );
}

import { useTranslation } from "react-i18next";
export default function ChatMessagesLimitSettings({ workspace, setHasChanges }) {
  const { t } = useTranslation();
  return (
    <div>
      <div className="flex flex-col gap-y-1 mb-4">
        <label htmlFor="name" className="block mb-2 input-label">
          {t("billing.messages-limit.label")}
        </label>
        <p className="text-white text-opacity-60 text-xs font-medium">
          {t("billing.messages-limit.description")}
          <i> {t("billing.messages-limit.default-hint")} </i>
          {t("billing.messages-limit.optional-hint")}
        </p>
      </div>
      <input
        name="messagesLimit"
        type="number"
        min={0}
        step={1}
        onWheel={(e) => e.target.blur()}
        defaultValue={workspace?.messagesLimit ?? ""}
        className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
        placeholder={workspace?.messagesLimit ?? t("billing.messages-limit.unlimited-placeholder")}
        required={false}
        autoComplete="off"
        onChange={() => setHasChanges(true)}
      />
    </div>
  );
}

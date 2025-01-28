import { useTranslation } from "react-i18next";

export default function WorkspaceName({ workspace, setHasChanges }) {
  const { t } = useTranslation();
  return (
    <div>
      <div className="flex flex-col">
        <label htmlFor="name" className="block input-label custom-text-secondary">
          {t("common.workspaces-name")}
        </label>
        <p className="text-white text-opacity-60 text-xs font-medium py-1.5 custom-text-secondary">
          {t("general.names.description")}
        </p>
      </div>
      <input
        name="name"
        type="text"
        minLength={2}
        maxLength={80}
        defaultValue={workspace?.name}
        className="border-none bg-theme-settings-input-bg text-white text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5 custom-theme-bg-tertiary custom-text-secondary custom-border-secondary"
        placeholder="My Workspace"
        required={true}
        autoComplete="off"
        onChange={() => setHasChanges(true)}
      />
    </div>
  );
}

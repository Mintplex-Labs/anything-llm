import { useTranslation } from "react-i18next";
import { SavedIndicator } from "@/components/AutosaveForm";

export default function WorkspaceName({ workspace }) {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col gap-y-[8px]">
      <div className="flex flex-col gap-y-[8px]">
        <label htmlFor="name" className="block input-label">
          {t("common.workspaces-name")}
          <SavedIndicator name="name" />
        </label>
        <p className="text-white text-opacity-60 text-xs font-medium">
          {t("general.names.description")}
        </p>
      </div>
      <input
        name="name"
        type="text"
        minLength={2}
        maxLength={80}
        defaultValue={workspace?.name}
        className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
        placeholder="My Workspace"
        required={true}
        autoComplete="off"
      />
    </div>
  );
}

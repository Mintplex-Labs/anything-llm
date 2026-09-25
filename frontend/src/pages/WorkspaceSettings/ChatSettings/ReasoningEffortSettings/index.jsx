import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Workspace from "@/models/workspace";
import { SavedIndicator } from "@/components/AutosaveForm";
import { effectiveReasoningEffort } from "@/utils/chat/reasoningEffort";

/**
 * @param {object} props
 * @param {object} props.settings - System settings
 * @param {object} props.workspace - Workspace object as last saved
 */
export default function ReasoningEffortSettings({ settings, workspace }) {
  const { t } = useTranslation();
  const [capabilities, setCapabilities] = useState(null);

  useEffect(() => {
    async function fetchCapabilities() {
      setCapabilities(await Workspace.llmCapabilities(workspace.slug));
    }
    fetchCapabilities();
  }, [workspace.slug, workspace.chatProvider, workspace.chatModel]);

  if (
    capabilities?.reasoning !== true ||
    !capabilities?.reasoningOptions?.length
  )
    return null;

  // The system default only applies when this model supports it.
  const systemEffort = effectiveReasoningEffort(
    { systemEffort: settings?.ReasoningEffort },
    capabilities.reasoningOptions
  );

  return (
    <div>
      <div className="flex flex-col gap-y-[8px] mb-[8px]">
        <label htmlFor="reasoningEffort" className="block input-label">
          {t("chat.reasoning_effort.title")}
          <SavedIndicator name="reasoningEffort" />
        </label>
        <p className="text-white text-opacity-60 text-xs font-medium">
          {t("chat.reasoning_effort.description")}
        </p>
      </div>
      <select
        key={`${workspace?.chatProvider}-${workspace?.chatModel}`}
        name="reasoningEffort"
        defaultValue={workspace?.reasoningEffort ?? ""}
        className="border-none bg-theme-settings-input-bg text-white text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5 capitalize"
      >
        <option value="">
          {systemEffort
            ? t("chat.reasoning_effort.global_default", { value: systemEffort })
            : t("chat.reasoning_effort.default")}
        </option>
        {capabilities.reasoningOptions.map((option) => (
          <option key={option} value={option} className="capitalize">
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

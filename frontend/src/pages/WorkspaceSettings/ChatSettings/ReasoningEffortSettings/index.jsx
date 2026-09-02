import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Workspace from "@/models/workspace";

/**
 * @param {object} props
 * @param {object} props.settings - System settings
 * @param {object} props.workspace - Workspace object
 * @param {function} props.setHasChanges - Marks the settings form dirty
 * @param {{provider: string, model: string|null}|null} [props.pendingLLM] - Unsaved provider/model selection to preview capabilities for
 */
export default function ReasoningEffortSettings({
  settings,
  workspace,
  setHasChanges,
  pendingLLM = null,
}) {
  const { t } = useTranslation();
  const [capabilities, setCapabilities] = useState(null);

  useEffect(() => {
    async function fetchCapabilities() {
      setCapabilities(
        await Workspace.llmCapabilities(workspace.slug, pendingLLM)
      );
    }
    fetchCapabilities();
  }, [workspace.slug, workspace.chatProvider, workspace.chatModel, pendingLLM]);

  if (
    capabilities?.reasoning !== true ||
    !capabilities?.reasoningOptions?.length
  )
    return null;

  return (
    <div>
      <div className="flex flex-col gap-y-[8px] mb-[8px]">
        <label htmlFor="reasoningEffort" className="block input-label">
          {t("chat.reasoning_effort.title")}
        </label>
        <p className="text-white text-opacity-60 text-xs font-medium">
          {t("chat.reasoning_effort.description")}
        </p>
      </div>
      <select
        key={`${pendingLLM?.provider ?? workspace?.chatProvider}-${pendingLLM?.model ?? workspace?.chatModel}`}
        name="reasoningEffort"
        defaultValue={workspace?.reasoningEffort ?? ""}
        onChange={() => setHasChanges(true)}
        className="border-none bg-theme-settings-input-bg text-white text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5 capitalize"
      >
        <option value="">
          {settings?.ReasoningEffort
            ? t("chat.reasoning_effort.global_default", {
                value: settings.ReasoningEffort,
              })
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

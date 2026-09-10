import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import System from "@/models/system";

/**
 * Sets the system-wide default reasoning effort for the selected LLM provider.
 * Workspaces without their own reasoning effort fall back to this value.
 * @param {object} props
 * @param {object} props.settings - System settings
 * @param {string|null} props.selectedLLM - Currently selected (possibly unsaved) provider
 * @param {string|null} [props.selectedModel] - Currently selected (possibly unsaved) model
 * @param {string|null} [props.basePath] - Unsaved base path for local providers
 * @param {number} [props.refreshKey] - Bumped by the parent to force a capability refetch (eg: after save)
 */
export default function SystemReasoningEffort({
  settings,
  selectedLLM,
  selectedModel = null,
  basePath = null,
  refreshKey = 0,
}) {
  const { t } = useTranslation();
  const [capabilities, setCapabilities] = useState(null);

  useEffect(() => {
    async function fetchCapabilities() {
      setCapabilities(
        await System.llmCapabilities(selectedLLM, selectedModel, basePath)
      );
    }
    fetchCapabilities();
  }, [selectedLLM, selectedModel, basePath, refreshKey]);

  if (
    capabilities?.reasoning !== true ||
    !capabilities?.reasoningOptions?.length
  )
    return null;

  return (
    <div className="flex flex-col w-60">
      <label className="text-white text-sm font-semibold block mb-3">
        {t("chat.reasoning_effort.title")}
      </label>
      <select
        key={`${selectedLLM}-${selectedModel}`}
        name="ReasoningEffort"
        defaultValue={settings?.ReasoningEffort ?? ""}
        className="border-none bg-theme-settings-input-bg text-white text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5 capitalize"
      >
        <option value="">{t("chat.reasoning_effort.default")}</option>
        {capabilities.reasoningOptions.map((option) => (
          <option key={option} value={option} className="capitalize">
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

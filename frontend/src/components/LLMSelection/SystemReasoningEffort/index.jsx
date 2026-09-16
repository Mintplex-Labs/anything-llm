import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import System from "@/models/system";
import { useSystemReasoningEffort } from "./SystemReasoningEffortContext";

/**
 * Sets the system-wide default reasoning effort for the selected LLM provider.
 * Workspaces without their own reasoning effort fall back to this value.
 * Renders nothing unless mounted under SystemReasoningEffortContext (the LLM
 * preference page), so provider option forms can include it unconditionally.
 * @param {object} props
 * @param {string|null} [props.model] - Unsaved model selection for providers whose model picker is not a form input (eg: Lemonade's model table)
 */
export default function SystemReasoningEffort({ model = null }) {
  const { t } = useTranslation();
  const context = useSystemReasoningEffort();
  const [capabilities, setCapabilities] = useState(null);
  const { settings, selectedLLM, basePath } = context ?? {};
  const selectedModel = model ?? context?.selectedModel;

  useEffect(() => {
    if (!context) return;
    async function fetchCapabilities() {
      setCapabilities(
        await System.llmCapabilities(selectedLLM, selectedModel, basePath)
      );
    }
    fetchCapabilities();
  }, [settings, selectedLLM, selectedModel, basePath]);

  if (
    !context ||
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

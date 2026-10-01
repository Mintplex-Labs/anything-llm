import React, { useState } from "react";
import AnythingLLMIcon from "@/media/logo/anything-llm-icon.png";
import AgentLLMItem from "./AgentLLMItem";
import { ALL_LLM_PROVIDERS } from "@/pages/GeneralSettings/LLMPreference";
import { Gauge } from "@phosphor-icons/react";
import AgentModelSelection from "../AgentModelSelection";
import { useTranslation } from "react-i18next";
import ProviderSearchMenu from "@/components/lib/ProviderSearchMenu";
import { useAutosaveForm, SavedIndicator } from "@/components/AutosaveForm";

const ENABLED_PROVIDERS = [
  "openai",
  "anthropic",
  "lmstudio",
  "ollama",
  "localai",
  "groq",
  "azure",
  "koboldcpp",
  "togetherai",
  "openrouter",
  "novita",
  "mistral",
  "perplexity",
  "textgenwebui",
  "generic-openai",
  "bedrock",
  "vertex",
  "fireworksai",
  "deepseek",
  "ppio",
  "litellm",
  "apipie",
  "xai",
  "nvidia-nim",
  "gemini",
  "moonshotai",
  "cometapi",
  "foundry",
  "zai",
  "giteeai",
  "cohere",
  "llmman",
  "privatemode",
  "sambanova",
  "lemonade",
  "omlx",
  "minimax",
  "cerebras",
];
const WARN_PERFORMANCE = [
  "lmstudio",
  "koboldcpp",
  "ollama",
  "localai",
  "textgenwebui",
  "llmman",
];

const LLM_DEFAULT = {
  name: "System Default",
  value: "none",
  logo: AnythingLLMIcon,
  options: () => <React.Fragment />,
  description:
    "Agents will use the workspace or system LLM unless otherwise specified.",
  requiredConfig: [],
};

const LLMS = [
  LLM_DEFAULT,
  ...ALL_LLM_PROVIDERS.filter((llm) => ENABLED_PROVIDERS.includes(llm.value)),
];

export default function AgentLLMSelection({ settings, workspace }) {
  const [selectedLLM, setSelectedLLM] = useState(
    workspace?.agentProvider ?? "none"
  );
  const { markDirty, save } = useAutosaveForm();
  const { t } = useTranslation();
  function updateLLMChoice(selection) {
    setSelectedLLM(selection);
    markDirty("agentProvider");
    markDirty("agentModel");
    // Other providers save once AgentModelSelection has loaded its models.
    if (selection === "none") save();
  }

  const selectedLLMObject = LLMS.find((llm) => llm.value === selectedLLM);
  return (
    <div className="flex flex-col gap-y-[8px]">
      {WARN_PERFORMANCE.includes(selectedLLM) && (
        <div className="flex flex-col md:flex-row md:items-center gap-x-2 text-white bg-blue-800/30 w-fit rounded-lg px-4 py-2">
          <div className="gap-x-2 flex items-center">
            <Gauge className="shrink-0" size={25} />
            <p className="text-sm">{t("agent.performance-warning")}</p>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-y-[8px]">
        <label htmlFor="name" className="block input-label">
          {t("agent.provider.title")}
          <SavedIndicator name="agentProvider" />
        </label>
        <p className="text-white text-opacity-60 text-xs font-medium">
          {t("agent.provider.description")}
        </p>
      </div>

      <div className="relative">
        <input type="hidden" name="agentProvider" value={selectedLLM} />
        <ProviderSearchMenu
          items={LLMS}
          selected={selectedLLMObject}
          placeholder="Search available LLM providers"
          renderItem={(llm, close) => (
            <AgentLLMItem
              llm={llm}
              availableLLMs={LLMS}
              settings={settings}
              checked={selectedLLM === llm.value}
              onClick={() => {
                updateLLMChoice(llm.value);
                close();
              }}
            />
          )}
        />
      </div>
      {selectedLLM !== "none" && (
        <div className="flex flex-col gap-y-1">
          <AgentModelSelection provider={selectedLLM} workspace={workspace} />
        </div>
      )}
    </div>
  );
}

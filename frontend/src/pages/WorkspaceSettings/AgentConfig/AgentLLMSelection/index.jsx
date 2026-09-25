import React, { useState } from "react";
import AnythingLLMIcon from "@/media/logo/anything-llm-icon.png";
import AgentLLMItem from "./AgentLLMItem";
import { ALL_LLM_PROVIDERS } from "@/pages/GeneralSettings/LLMPreference";
import { CaretUpDown, Gauge } from "@phosphor-icons/react";
import AgentModelSelection from "../AgentModelSelection";
import { useTranslation } from "react-i18next";
import ProviderSearchMenu from "@/components/lib/ProviderSearchMenu";
import useRefocusOnClose from "@/hooks/useRefocusOnClose";

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

export default function AgentLLMSelection({
  settings,
  workspace,
  setHasChanges,
}) {
  const [selectedLLM, setSelectedLLM] = useState(
    workspace?.agentProvider ?? "none"
  );
  const [searchMenuOpen, setSearchMenuOpen] = useState(false);
  const searchMenuTrigger = useRefocusOnClose(searchMenuOpen);
  const { t } = useTranslation();
  function updateLLMChoice(selection) {
    setSelectedLLM(selection);
    setSearchMenuOpen(false);
    setHasChanges(true);
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
        </label>
        <p className="text-white text-opacity-60 text-xs font-medium">
          {t("agent.provider.description")}
        </p>
      </div>

      <div className="relative">
        <input type="hidden" name="agentProvider" value={selectedLLM} />
        {searchMenuOpen ? (
          <ProviderSearchMenu
            items={LLMS}
            placeholder="Search available LLM providers"
            onClose={() => setSearchMenuOpen(false)}
            renderItem={(llm) => (
              <AgentLLMItem
                llm={llm}
                availableLLMs={LLMS}
                settings={settings}
                checked={selectedLLM === llm.value}
                onClick={() => updateLLMChoice(llm.value)}
              />
            )}
          />
        ) : (
          <button
            ref={searchMenuTrigger}
            className="w-full max-w-[640px] h-[64px] bg-theme-settings-input-bg rounded-lg flex items-center p-[14px] justify-between cursor-pointer border-2 border-transparent hover:border-primary-button focus:border-primary-button focus:outline-none transition-all duration-300"
            type="button"
            onClick={() => setSearchMenuOpen(true)}
          >
            <div className="flex gap-x-4 items-center">
              <img
                src={selectedLLMObject.logo}
                alt={`${selectedLLMObject.name} logo`}
                className="w-10 h-10 rounded-md"
              />
              <div className="flex flex-col text-left">
                <div className="text-sm font-semibold text-white">
                  {selectedLLMObject.name}
                </div>
                <div className="mt-1 text-xs text-description">
                  {selectedLLMObject.description}
                </div>
              </div>
            </div>
            <CaretUpDown size={24} weight="bold" className="text-white" />
          </button>
        )}
      </div>
      {selectedLLM !== "none" && (
        <div className="flex flex-col gap-y-1">
          <AgentModelSelection
            provider={selectedLLM}
            workspace={workspace}
            setHasChanges={setHasChanges}
          />
        </div>
      )}
    </div>
  );
}

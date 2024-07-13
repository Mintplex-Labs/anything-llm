import React, { useEffect, useRef, useState } from "react";
import AnythingLLMIcon from "@/media/logo/anything-llm-icon.png";
import AgentLLMItem from "./AgentLLMItem";
import { AVAILABLE_LLM_PROVIDERS } from "@/pages/GeneralSettings/LLMPreference";
import { CaretUpDown, Gauge, MagnifyingGlass, X } from "@phosphor-icons/react";
import AgentModelSelection from "../AgentModelSelection";
import { useTranslation } from "react-i18next";

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
  "mistral",
  "perplexity",
  "textgenwebui",
  "generic-openai",
  // TODO: More agent support.
  // "cohere",         // Has tool calling and will need to build explicit support
  // "huggingface"     // Can be done but already has issues with no-chat templated. Needs to be tested.
  // "gemini",         // Too rate limited and broken in several ways to use for agents.
];
const WARN_PERFORMANCE = [
  "lmstudio",
  "groq",
  "azure",
  "koboldcpp",
  "ollama",
  "localai",
  "openrouter",
  "generic-openai",
  "textgenwebui",
];

const LLM_DEFAULT = {
  name: "Please make a selection",
  value: "none",
  logo: AnythingLLMIcon,
  options: () => <React.Fragment />,
  description: "Agents will not work until a valid selection is made.",
  requiredConfig: [],
};

const LLMS = [
  LLM_DEFAULT,
  ...AVAILABLE_LLM_PROVIDERS.filter((llm) =>
    ENABLED_PROVIDERS.includes(llm.value)
  ),
];

export default function AgentLLMSelection({
  settings,
  workspace,
  setHasChanges,
}) {
  const [filteredLLMs, setFilteredLLMs] = useState([]);
  const [selectedLLM, setSelectedLLM] = useState(
    workspace?.agentProvider ?? "none"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [searchMenuOpen, setSearchMenuOpen] = useState(false);
  const searchInputRef = useRef(null);
  const { t } = useTranslation();
  function updateLLMChoice(selection) {
    setSearchQuery("");
    setSelectedLLM(selection);
    setSearchMenuOpen(false);
    setHasChanges(true);
  }

  function handleXButton() {
    if (searchQuery.length > 0) {
      setSearchQuery("");
      if (searchInputRef.current) searchInputRef.current.value = "";
    } else {
      setSearchMenuOpen(!searchMenuOpen);
    }
  }

  useEffect(() => {
    const filtered = LLMS.filter((llm) =>
      llm.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredLLMs(filtered);
  }, [searchQuery, selectedLLM]);

  const selectedLLMObject = LLMS.find((llm) => llm.value === selectedLLM);
  return (
    <div className="border-b border-white/40 pb-8">
      {WARN_PERFORMANCE.includes(selectedLLM) && (
        <div className="flex flex-col md:flex-row md:items-center gap-x-2 text-white mb-4 bg-blue-800/30 w-fit rounded-lg px-4 py-2">
          <div className="gap-x-2 flex items-center">
            <Gauge className="shrink-0" size={25} />
            <p className="text-sm">{t("agent.performance-warning")}</p>
          </div>
        </div>
      )}

      <div className="flex flex-col">
        <label htmlFor="name" className="block input-label">
          {t("agent.provider.title")}
        </label>
        <p className="text-white text-opacity-60 text-xs font-medium py-1.5">
          {t("agent.provider.description")}
        </p>
      </div>

      <div className="relative">
        <input type="hidden" name="agentProvider" value={selectedLLM} />
        {searchMenuOpen && (
          <div
            className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-70 backdrop-blur-sm z-10"
            onClick={() => setSearchMenuOpen(false)}
          />
        )}
        {searchMenuOpen ? (
          <div className="absolute top-0 left-0 w-full max-w-[640px] max-h-[310px] overflow-auto white-scrollbar min-h-[64px] bg-dark-input rounded-lg flex flex-col justify-between cursor-pointer border-2 border-primary-button z-20">
            <div className="w-full flex flex-col gap-y-1">
              <div className="flex items-center sticky top-0 border-b border-[#9CA3AF] mx-4 bg-dark-input">
                <MagnifyingGlass
                  size={20}
                  weight="bold"
                  className="absolute left-4 z-30 text-white -ml-4 my-2"
                />
                <input
                  type="text"
                  name="llm-search"
                  autoComplete="off"
                  placeholder="Search available LLM providers"
                  className="border-none -ml-4 my-2 bg-transparent z-20 pl-12 h-[38px] w-full px-4 py-1 text-sm outline-none text-white placeholder:text-white placeholder:font-medium"
                  onChange={(e) => setSearchQuery(e.target.value)}
                  ref={searchInputRef}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") e.preventDefault();
                  }}
                />
                <X
                  size={20}
                  weight="bold"
                  className="cursor-pointer text-white hover:text-x-button"
                  onClick={handleXButton}
                />
              </div>
              <div className="flex-1 pl-4 pr-2 flex flex-col gap-y-1 overflow-y-auto white-scrollbar pb-4">
                {filteredLLMs.map((llm) => {
                  return (
                    <AgentLLMItem
                      llm={llm}
                      key={llm.name}
                      availableLLMs={LLMS}
                      settings={settings}
                      checked={selectedLLM === llm.value}
                      onClick={() => updateLLMChoice(llm.value)}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <button
            className="w-full max-w-[640px] h-[64px] bg-dark-input rounded-lg flex items-center p-[14px] justify-between cursor-pointer border-2 border-transparent hover:border-primary-button transition-all duration-300"
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
        <div className="mt-4 flex flex-col gap-y-1">
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

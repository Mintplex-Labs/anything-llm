import React, { useEffect, useRef, useState } from "react";
import AnythingLLMIcon from "@/media/logo/anything-llm-icon.png";
import WorkspaceLLMItem from "./WorkspaceLLMItem";
import { AVAILABLE_LLM_PROVIDERS } from "@/pages/GeneralSettings/LLMPreference";
import { CaretUpDown, MagnifyingGlass, X } from "@phosphor-icons/react";
import ChatModelSelection from "./ChatModelSelection";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import paths from "@/utils/paths";

// Some providers do not support model selection via /models.
// In that case we allow the user to enter the model name manually and hope they
// type it correctly.
const FREE_FORM_LLM_SELECTION = ["bedrock", "azure", "generic-openai"];

// Some providers do not support model selection via /models
// and only have a fixed single-model they can use.
const NO_MODEL_SELECTION = ["default", "huggingface"];

// Some providers we just fully disable for ease of use.
const DISABLED_PROVIDERS = ["native"];

const LLM_DEFAULT = {
  name: "System default",
  value: "default",
  logo: AnythingLLMIcon,
  options: () => <React.Fragment />,
  description: "Use the system LLM preference for this workspace.",
  requiredConfig: [],
};

const LLMS = [LLM_DEFAULT, ...AVAILABLE_LLM_PROVIDERS].filter(
  (llm) => !DISABLED_PROVIDERS.includes(llm.value)
);

export default function WorkspaceLLMSelection({
  settings,
  workspace,
  setHasChanges,
}) {
  const [filteredLLMs, setFilteredLLMs] = useState([]);
  const [selectedLLM, setSelectedLLM] = useState(
    workspace?.chatProvider ?? "default"
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
  }, [LLMS, searchQuery, selectedLLM]);
  const selectedLLMObject = LLMS.find((llm) => llm.value === selectedLLM);

  return (
    <div className="border-b border-white/40 pb-8">
      <div className="flex flex-col">
        <label htmlFor="name" className="block input-label">
          {t("chat.llm.title")}
        </label>
        <p className="text-white text-opacity-60 text-xs font-medium py-1.5">
          {t("chat.llm.description")}
        </p>
      </div>

      <div className="relative">
        <input type="hidden" name="chatProvider" value={selectedLLM} />
        {searchMenuOpen && (
          <div
            className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-70 backdrop-blur-sm z-10"
            onClick={() => setSearchMenuOpen(false)}
          />
        )}
        {searchMenuOpen ? (
          <div className="absolute top-0 left-0 w-full max-w-[640px] max-h-[310px] overflow-auto white-scrollbar min-h-[64px] bg-theme-settings-input-bg rounded-lg flex flex-col justify-between cursor-pointer border-2 border-primary-button z-20">
            <div className="w-full flex flex-col gap-y-1">
              <div className="flex items-center sticky top-0 border-b border-[#9CA3AF] mx-4 bg-theme-settings-input-bg">
                <MagnifyingGlass
                  size={20}
                  weight="bold"
                  className="absolute left-4 z-30 text-theme-text-primary -ml-4 my-2"
                />
                <input
                  type="text"
                  name="llm-search"
                  autoComplete="off"
                  placeholder={t("chat.llm.search")}
                  className="border-none -ml-4 my-2 bg-transparent z-20 pl-12 h-[38px] w-full px-4 py-1 text-sm outline-none focus:outline-primary-button active:outline-primary-button outline-none text-theme-text-primary placeholder:text-theme-text-primary placeholder:font-medium"
                  onChange={(e) => setSearchQuery(e.target.value)}
                  ref={searchInputRef}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") e.preventDefault();
                  }}
                />
                <X
                  size={20}
                  weight="bold"
                  className="cursor-pointer text-theme-text-primary hover:text-x-button"
                  onClick={handleXButton}
                />
              </div>
              <div className="flex-1 pl-4 pr-2 flex flex-col gap-y-1 overflow-y-auto white-scrollbar pb-4">
                {filteredLLMs.map((llm) => {
                  return (
                    <WorkspaceLLMItem
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
            className="w-full max-w-[640px] h-[64px] bg-theme-settings-input-bg rounded-lg flex items-center p-[14px] justify-between cursor-pointer border-2 border-transparent hover:border-primary-button transition-all duration-300"
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
      <ModelSelector
        selectedLLM={selectedLLM}
        workspace={workspace}
        setHasChanges={setHasChanges}
      />
    </div>
  );
}

// TODO: Add this to agent selector as well as make generic component.
function ModelSelector({ selectedLLM, workspace, setHasChanges }) {
  if (NO_MODEL_SELECTION.includes(selectedLLM)) {
    if (selectedLLM !== "default") {
      return (
        <div className="w-full h-10 justify-center items-center flex mt-4">
          <p className="text-sm font-base text-white text-opacity-60 text-center">
            Multi-model support is not supported for this provider yet.
            <br />
            This workspace will use{" "}
            <Link to={paths.settings.llmPreference()} className="underline">
              the model set for the system.
            </Link>
          </p>
        </div>
      );
    }
    return null;
  }

  if (FREE_FORM_LLM_SELECTION.includes(selectedLLM)) {
    return (
      <FreeFormLLMInput workspace={workspace} setHasChanges={setHasChanges} />
    );
  }

  return (
    <ChatModelSelection
      provider={selectedLLM}
      workspace={workspace}
      setHasChanges={setHasChanges}
    />
  );
}

function FreeFormLLMInput({ workspace, setHasChanges }) {
  const { t } = useTranslation();
  return (
    <div className="mt-4 flex flex-col gap-y-1">
      <label className="block input-label">{t("chat.model.title")}</label>
      <p className="text-white text-opacity-60 text-xs font-medium py-1.5">
        {t("chat.model.description")}
      </p>
      <input
        type="text"
        name="chatModel"
        defaultValue={workspace?.chatModel || ""}
        onChange={() => setHasChanges(true)}
        className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
        placeholder="Enter model name exactly as referenced in the API (e.g., gpt-3.5-turbo)"
      />
    </div>
  );
}

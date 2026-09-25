import React, { useState } from "react";
import AnythingLLMIcon from "@/media/logo/anything-llm-icon.png";
import WorkspaceLLMItem from "./WorkspaceLLMItem";
import { ALL_LLM_PROVIDERS } from "@/pages/GeneralSettings/LLMPreference";
import { CaretUpDown } from "@phosphor-icons/react";
import ChatModelSelection from "./ChatModelSelection";
import RouterSelection from "./RouterSelection";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import paths from "@/utils/paths";
import ProviderSearchMenu from "@/components/lib/ProviderSearchMenu";
import useRefocusOnClose from "@/hooks/useRefocusOnClose";

// Some providers do not support model selection via /models.
// In that case we allow the user to enter the model name manually and hope they
// type it correctly.
const FREE_FORM_LLM_SELECTION = ["azure"];

// Some providers do not support model selection via /models
// and only have a fixed single-model they can use.
const NO_MODEL_SELECTION = ["default", "anythingllm-router"];

// Some providers we just fully disable for ease of use.
const DISABLED_PROVIDERS = [];

const LLM_DEFAULT = {
  name: "System default",
  value: "default",
  logo: AnythingLLMIcon,
  options: () => <React.Fragment />,
  description: "Use the system LLM preference for this workspace.",
  requiredConfig: [],
};

const LLMS = [LLM_DEFAULT, ...ALL_LLM_PROVIDERS].filter(
  (llm) => !DISABLED_PROVIDERS.includes(llm.value)
);

export default function WorkspaceLLMSelection({
  settings,
  workspace,
  setHasChanges,
}) {
  const [selectedLLM, setSelectedLLM] = useState(
    workspace?.chatProvider ?? "default"
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
      <div className="flex flex-col gap-y-[8px]">
        <label htmlFor="name" className="block input-label">
          {t("chat.llm.title")}
        </label>
        <p className="text-white text-opacity-60 text-xs font-medium">
          {t("chat.llm.description")}
        </p>
      </div>

      <div className="relative">
        <input type="hidden" name="chatProvider" value={selectedLLM} />
        {searchMenuOpen ? (
          <ProviderSearchMenu
            items={LLMS}
            placeholder={t("chat.llm.search")}
            onClose={() => setSearchMenuOpen(false)}
            renderItem={(llm) => (
              <WorkspaceLLMItem
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
                <div className="text-xs text-description">
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
  if (selectedLLM === "anythingllm-router") {
    return (
      <RouterSelection workspace={workspace} setHasChanges={setHasChanges} />
    );
  }

  if (NO_MODEL_SELECTION.includes(selectedLLM)) {
    if (selectedLLM !== "default") {
      return (
        <div className="w-full h-10 justify-center items-center flex">
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
    <div className="flex flex-col gap-y-[8px]">
      <label className="block input-label">{t("chat.model.title")}</label>
      <p className="text-white text-opacity-60 text-xs font-medium">
        {t("chat.model.description")}
      </p>
      <input
        type="text"
        name="chatModel"
        defaultValue={workspace?.chatModel || ""}
        onChange={() => setHasChanges(true)}
        className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
        placeholder="Enter model name exactly as referenced in the API (e.g., gpt-4.1-nano)"
      />
    </div>
  );
}

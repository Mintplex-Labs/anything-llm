import React, { useEffect, useRef, useState } from "react";
import AnythingLLMIcon from "@/media/logo/anything-llm-icon.png";
import WorkspaceLLMItem from "./WorkspaceLLMItem";
import { AVAILABLE_LLM_PROVIDERS } from "@/pages/GeneralSettings/LLMPreference";
import { CaretUpDown, MagnifyingGlass, X, Plus } from "@phosphor-icons/react";
import ChatModelSelection from "./ChatModelSelection";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import paths from "@/utils/paths";
import System from "@/models/system";

// Some providers do not support model selection via /models.
// In that case we allow the user to enter the model name manually and hope they
// type it correctly.
const FREE_FORM_LLM_SELECTION = ["bedrock", "azure", "generic-openai"];

// Some providers do not support model selection via /models
// and only have a fixed single-model they can use.
const NO_MODEL_SELECTION = ["default", "huggingface"];

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

const LLMS = [LLM_DEFAULT, ...AVAILABLE_LLM_PROVIDERS].filter(
  (llm) => !DISABLED_PROVIDERS.includes(llm.value)
);

export default function WorkspaceLLMSelection({
  settings,
  workspace,
  setHasChanges,
}) {
  const [filteredLLMs, setFilteredLLMs] = useState([]);
  const [llmConnections, setLlmConnections] = useState([]);
  const [loadingConnections, setLoadingConnections] = useState(true);
  const [selectedLLM, setSelectedLLM] = useState(
    workspace?.chatConnectionId
      ? `connection-${workspace.chatConnectionId}`
      : workspace?.chatProvider ?? "default"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [searchMenuOpen, setSearchMenuOpen] = useState(false);
  const searchInputRef = useRef(null);
  const { t } = useTranslation();

  // Fetch LLM connections on mount
  useEffect(() => {
    async function fetchConnections() {
      setLoadingConnections(true);
      const { connections, error } = await System.llmConnections.list({});
      if (!error && connections) {
        setLlmConnections(connections);
      }
      setLoadingConnections(false);
    }
    fetchConnections();
  }, []);
  function updateLLMChoice(selection) {
    // Handle "Create New Connection" option
    if (selection === "create-new") {
      window.open(paths.settings.llmPreference(), "_blank");
      return;
    }

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

  // Build combined list of system default, connections, and create new options
  const allOptions = React.useMemo(() => {
    const options = [LLM_DEFAULT];

    // Add connections grouped by provider
    llmConnections.forEach((conn) => {
      const providerInfo = AVAILABLE_LLM_PROVIDERS.find(p => p.value === conn.provider);
      if (providerInfo) {
        options.push({
          name: conn.name,
          value: `connection-${conn.id}`,
          logo: providerInfo.logo,
          description: `${providerInfo.name} connection`,
          isConnection: true,
          connectionId: conn.id,
          provider: conn.provider,
          connection: conn,
        });
      }
    });

    // Add "Create New Connection" option
    options.push({
      name: "Create New Connection",
      value: "create-new",
      logo: AnythingLLMIcon,
      description: "Set up a new LLM connection",
      isCreateNew: true,
    });

    return options;
  }, [llmConnections]);

  useEffect(() => {
    const filtered = allOptions.filter((llm) =>
      llm.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredLLMs(filtered);
  }, [allOptions, searchQuery, selectedLLM]);

  const selectedLLMObject = allOptions.find((llm) => llm.value === selectedLLM) || LLM_DEFAULT;

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
        {/* Save connection ID if a connection is selected, otherwise save provider */}
        {selectedLLMObject?.isConnection ? (
          <>
            <input type="hidden" name="chatConnectionId" value={selectedLLMObject.connectionId} />
            <input type="hidden" name="chatProvider" value="" />
          </>
        ) : (
          <>
            <input type="hidden" name="chatConnectionId" value="" />
            <input type="hidden" name="chatProvider" value={selectedLLM === "default" ? "" : selectedLLM} />
          </>
        )}
        {searchMenuOpen && (
          <div
            className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-70 backdrop-blur-sm z-10"
            onClick={() => setSearchMenuOpen(false)}
          />
        )}
        {searchMenuOpen ? (
          <div className="absolute top-0 left-0 w-full max-w-[640px] max-h-[310px] min-h-[64px] bg-theme-settings-input-bg rounded-lg flex flex-col justify-between cursor-pointer border-2 border-primary-button z-20">
            <div className="w-full flex flex-col gap-y-1">
              <div className="flex items-center sticky top-0 z-10 border-b border-[#9CA3AF] mx-4 bg-theme-settings-input-bg">
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
              <div className="flex-1 pl-4 pr-2 flex flex-col gap-y-1 overflow-y-auto white-scrollbar pb-4 max-h-[245px]">
                {loadingConnections ? (
                  <div className="w-full text-center py-6 text-white/60 text-sm">
                    Loading connections...
                  </div>
                ) : filteredLLMs.length === 0 ? (
                  <div className="w-full text-center py-6 text-white/60 text-sm">
                    No connections found
                  </div>
                ) : (
                  filteredLLMs.map((llm) => {
                    return (
                      <WorkspaceLLMItem
                        llm={llm}
                        key={llm.value}
                        availableLLMs={allOptions}
                        settings={settings}
                        checked={selectedLLM === llm.value}
                        onClick={() => updateLLMChoice(llm.value)}
                      />
                    );
                  })
                )}
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
        selectedLLMObject={selectedLLMObject}
        workspace={workspace}
        setHasChanges={setHasChanges}
      />
    </div>
  );
}

// TODO: Add this to agent selector as well as make generic component.
function ModelSelector({ selectedLLM, selectedLLMObject, workspace, setHasChanges }) {
  // If a connection is selected, use the connection's provider
  const effectiveProvider = selectedLLMObject?.isConnection
    ? selectedLLMObject.provider
    : selectedLLM;

  // Show default connection info if using a connection
  if (selectedLLMObject?.isConnection) {
    return (
      <div className="mt-4">
        <div className="px-4 py-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
          <p className="text-sm text-blue-200">
            Using connection: <span className="font-semibold">{selectedLLMObject.name}</span>
          </p>
          {selectedLLMObject.connection?.config?.defaultModel && (
            <p className="text-xs text-blue-300/80 mt-1">
              Default model: {selectedLLMObject.connection.config.defaultModel}
            </p>
          )}
        </div>
        {/* Optional model override for connections */}
        <div className="mt-4">
          <label className="block input-label text-sm">
            Model Override (optional)
          </label>
          <p className="text-white text-opacity-60 text-xs font-medium py-1.5">
            Leave blank to use the connection's default model
          </p>
          <input
            type="text"
            name="chatModelOverride"
            defaultValue={workspace?.chatModelOverride || ""}
            onChange={() => setHasChanges(true)}
            className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
            placeholder="e.g., gpt-4"
          />
        </div>
      </div>
    );
  }

  if (NO_MODEL_SELECTION.includes(effectiveProvider)) {
    if (effectiveProvider !== "default") {
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

  if (FREE_FORM_LLM_SELECTION.includes(effectiveProvider)) {
    return (
      <FreeFormLLMInput workspace={workspace} setHasChanges={setHasChanges} />
    );
  }

  return (
    <ChatModelSelection
      provider={effectiveProvider}
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

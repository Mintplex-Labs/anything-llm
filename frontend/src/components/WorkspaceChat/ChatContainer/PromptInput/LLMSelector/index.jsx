import { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import PreLoader from "@/components/Preloader";
import ChatModelSelection from "./ChatModelSelection";
import { useTranslation } from "react-i18next";
import { PROVIDER_SETUP_EVENT, SAVE_LLM_SELECTOR_EVENT } from "./action";
import {
  autoScrollToSelectedLLMProvider,
  hasMissingCredentials,
  validatedModelSelection,
  getFilteredWorkspaceProviders,
} from "./utils";
import LLMSelectorSidePanel from "./LLMSelector";
import { NoSetupWarning } from "./SetupProvider";
import showToast from "@/utils/toast";
import Workspace from "@/models/workspace";
import System from "@/models/system";

export default function LLMSelectorModal() {
  const { slug } = useParams();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState(null);
  const [selectedLLMProvider, setSelectedLLMProvider] = useState(null);
  const [selectedLLMModel, setSelectedLLMModel] = useState("");
  const [availableProviders, setAvailableProviders] = useState([]);
  const [hasChanges, setHasChanges] = useState(false);
  const [saving, setSaving] = useState(false);
  const [missingCredentials, setMissingCredentials] = useState(false);

  // Compute the base filtered provider list based on system settings allowlist
  const baseProviders = useMemo(() => {
    return getFilteredWorkspaceProviders(settings?.WorkspaceAllowedLLMProviders);
  }, [settings?.WorkspaceAllowedLLMProviders]);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    Promise.all([Workspace.bySlug(slug), System.keys()])
      .then(([workspace, systemSettings]) => {
        const filteredProviders = getFilteredWorkspaceProviders(
          systemSettings.WorkspaceAllowedLLMProviders
        );
        const selectedLLMProvider =
          workspace.chatProvider ?? systemSettings.LLMProvider;
        const selectedLLMModel = workspace.chatModel ?? systemSettings.LLMModel;

        setSettings(systemSettings);
        setAvailableProviders(filteredProviders);
        setSelectedLLMProvider(selectedLLMProvider);
        autoScrollToSelectedLLMProvider(selectedLLMProvider);
        setSelectedLLMModel(selectedLLMModel);
      })
      .finally(() => setLoading(false));
  }, [slug]);

  function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase();
    const filteredProviders = baseProviders.filter((provider) =>
      provider.name.toLowerCase().includes(searchTerm)
    );
    setAvailableProviders(filteredProviders);
  }

  function handleProviderSelection(provider) {
    setSelectedLLMProvider(provider);
    setAvailableProviders(baseProviders);
    autoScrollToSelectedLLMProvider(provider, 50);
    document.getElementById("llm-search-input").value = "";
    setHasChanges(true);
    setMissingCredentials(hasMissingCredentials(settings, provider));
  }

  async function handleSave() {
    setSaving(true);
    try {
      setHasChanges(false);
      const validatedModel = validatedModelSelection(selectedLLMModel);
      if (!validatedModel) throw new Error("Invalid model selection");

      const { message } = await Workspace.update(slug, {
        chatProvider: selectedLLMProvider,
        chatModel: validatedModel,
      });

      if (!!message) throw new Error(message);
      window.dispatchEvent(new Event(SAVE_LLM_SELECTOR_EVENT));
    } catch (error) {
      console.error(error);
      showToast(error.message, "error", { clear: true });
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div
        id="llm-selector-modal"
        className="w-full h-[500px] p-0 overflow-y-scroll flex flex-col items-center justify-center"
      >
        <PreLoader size={12} />
        <p className="text-theme-text-secondary text-sm mt-2">
          {t("chat_window.workspace_llm_manager.loading_workspace_settings")}
        </p>
      </div>
    );
  }

  // Hide provider panel if there's only the system-configured provider
  // This simplifies the UI for single-provider deployments
  const showProviderPanel = availableProviders.length > 1;

  return (
    <div
      id="llm-selector-modal"
      className={`w-full h-[500px] p-0 overflow-y-scroll flex`}
    >
      {showProviderPanel && (
        <LLMSelectorSidePanel
          availableProviders={availableProviders}
          selectedLLMProvider={selectedLLMProvider}
          onSearchChange={handleSearch}
          onProviderClick={handleProviderSelection}
        />
      )}
      <div className={`${showProviderPanel ? "w-[60%]" : "w-full"} h-full px-2 flex flex-col gap-y-2`}>
        <NoSetupWarning
          showing={missingCredentials}
          onSetupClick={() => {
            window.dispatchEvent(
              new CustomEvent(PROVIDER_SETUP_EVENT, {
                detail: {
                  provider: baseProviders.find(
                    (p) => p.value === selectedLLMProvider
                  ),
                  settings,
                },
              })
            );
          }}
        />
        <ChatModelSelection
          provider={selectedLLMProvider}
          setHasChanges={setHasChanges}
          selectedLLMModel={selectedLLMModel}
          setSelectedLLMModel={setSelectedLLMModel}
        />
        {hasChanges && (
          <button
            type="button"
            disabled={saving}
            onClick={handleSave}
            className={`border-none text-xs px-4 py-1 font-semibold text-white rounded-lg bg-primary-button hover:bg-secondary hover:text-white light:hover:text-theme-text-primary h-[34px] whitespace-nowrap w-full`}
          >
            {saving
              ? t("chat_window.workspace_llm_manager.saving")
              : t("chat_window.workspace_llm_manager.save")}
          </button>
        )}
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import PreLoader from "@/components/Preloader";
import ChatModelSelection from "./ChatModelSelection";
import { useTranslation } from "react-i18next";
import { PROVIDER_SETUP_EVENT, SAVE_LLM_SELECTOR_EVENT } from "./action";
import {
  WORKSPACE_LLM_PROVIDERS,
  autoScrollToSelectedLLMProvider,
  hasMissingCredentials,
  validatedModelSelection,
} from "./utils";
import LLMSelectorSidePanel from "./LLMSelector";
import { NoSetupWarning } from "./SetupProvider";
import showToast from "@/utils/toast";
import Workspace from "@/models/workspace";
import System from "@/models/system";

export default function LLMSelectorModal({
  workspaceSlug = null,
  initialProvider = null,
}) {
  const { slug: urlSlug } = useParams();
  const slug = urlSlug ?? workspaceSlug;
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState(null);
  const [selectedLLMProvider, setSelectedLLMProvider] = useState(null);
  const [selectedLLMModel, setSelectedLLMModel] = useState("");
  const [availableProviders, setAvailableProviders] = useState(
    WORKSPACE_LLM_PROVIDERS
  );
  const [hasChanges, setHasChanges] = useState(false);
  const [saving, setSaving] = useState(false);
  const [missingCredentials, setMissingCredentials] = useState(false);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    Promise.all([Workspace.bySlug(slug), System.keys()])
      .then(([workspace, systemSettings]) => {
        const savedProvider =
          workspace.chatProvider ?? systemSettings.LLMProvider;
        const savedModel = workspace.chatModel ?? systemSettings.LLMModel;
        const providerToSelect = initialProvider ?? savedProvider;

        setSettings(systemSettings);
        setSelectedLLMProvider(providerToSelect);
        autoScrollToSelectedLLMProvider(providerToSelect);
        setSelectedLLMModel(savedModel);

        if (initialProvider && initialProvider !== savedProvider) {
          setHasChanges(true);
          setMissingCredentials(
            hasMissingCredentials(systemSettings, initialProvider)
          );
        }
      })
      .finally(() => setLoading(false));
  }, [slug]);

  function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase();
    const filteredProviders = WORKSPACE_LLM_PROVIDERS.filter((provider) =>
      provider.name.toLowerCase().includes(searchTerm)
    );
    setAvailableProviders(filteredProviders);
  }

  function handleProviderSelection(provider) {
    setSelectedLLMProvider(provider);
    setAvailableProviders(WORKSPACE_LLM_PROVIDERS);
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

  const providerName =
    WORKSPACE_LLM_PROVIDERS.find((p) => p.value === selectedLLMProvider)
      ?.name || selectedLLMProvider;

  if (loading) {
    return (
      <div
        id="llm-selector-modal"
        className="w-full h-[388px] flex flex-col items-center justify-center gap-2"
      >
        <PreLoader size={12} />
        <p className="text-zinc-400 light:text-slate-500 text-sm">
          {t("chat_window.workspace_llm_manager.loading_workspace_settings")}
        </p>
      </div>
    );
  }

  return (
    <div id="llm-selector-modal" className="w-full h-[388px] flex">
      <LLMSelectorSidePanel
        availableProviders={availableProviders}
        selectedLLMProvider={selectedLLMProvider}
        onSearchChange={handleSearch}
        onProviderClick={handleProviderSelection}
      />
      <div className="w-[60%] h-full p-[18px] flex flex-col gap-2.5">
        <div className="flex flex-col gap-[15px]">
          <div className="flex flex-col gap-1.5">
            <p className="text-sm font-medium text-white light:text-slate-800">
              {t("chat_window.workspace_llm_manager.available_models", {
                provider: providerName,
              })}
            </p>
            <p className="text-xs font-medium text-zinc-400 light:text-slate-500">
              {t(
                "chat_window.workspace_llm_manager.available_models_description"
              )}
            </p>
          </div>
          {!missingCredentials && (
            <ChatModelSelection
              provider={selectedLLMProvider}
              setHasChanges={setHasChanges}
              selectedLLMModel={selectedLLMModel}
              setSelectedLLMModel={setSelectedLLMModel}
            />
          )}
        </div>
        <NoSetupWarning
          showing={missingCredentials}
          onSetupClick={() => {
            window.dispatchEvent(
              new CustomEvent(PROVIDER_SETUP_EVENT, {
                detail: {
                  provider: WORKSPACE_LLM_PROVIDERS.find(
                    (p) => p.value === selectedLLMProvider
                  ),
                  settings,
                },
              })
            );
          }}
        />
        {hasChanges && !missingCredentials && (
          <button
            type="button"
            disabled={saving}
            onClick={handleSave}
            className="border-none text-xs px-4 py-1.5 font-semibold rounded-lg bg-white text-zinc-900 hover:bg-zinc-200 light:bg-slate-800 light:text-white light:hover:bg-slate-700 h-8 w-full cursor-pointer transition-colors mt-auto"
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

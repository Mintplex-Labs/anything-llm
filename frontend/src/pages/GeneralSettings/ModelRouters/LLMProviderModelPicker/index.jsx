import { useEffect, useState } from "react";
import { AVAILABLE_LLM_PROVIDERS } from "@/pages/GeneralSettings/LLMPreference";
import System from "@/models/system";
import ModalWrapper from "@/components/ModalWrapper";
import { useModal } from "@/hooks/useModal";
import { X } from "@phosphor-icons/react";
import showToast from "@/utils/toast";

// Providers that can't be routing targets
const EXCLUDED_PROVIDERS = ["anythingllm-router"];

export default function LLMProviderModelPicker({
  providerFieldName = "fallback_provider",
  modelFieldName = "fallback_model",
  label = "Provider & Model",
  description = "",
  defaultProvider = "",
  defaultModel = "",
}) {
  const [selectedProvider, setSelectedProvider] = useState(defaultProvider);
  const [selectedModel, setSelectedModel] = useState(defaultModel);
  const [models, setModels] = useState([]);
  const [loadingModels, setLoadingModels] = useState(false);
  const [settings, setSettings] = useState(null);
  const { isOpen, openModal, closeModal } = useModal();

  const availableProviders = AVAILABLE_LLM_PROVIDERS.filter(
    (llm) => !EXCLUDED_PROVIDERS.includes(llm.value)
  );

  useEffect(() => {
    async function fetchSettings() {
      const _settings = await System.keys();
      setSettings(_settings ?? {});
    }
    fetchSettings();
  }, []);

  function isConfigured(providerValue) {
    if (!settings) return true;
    const llm = availableProviders.find((l) => l.value === providerValue);
    if (!llm?.requiredConfig?.length) return true;
    return llm.requiredConfig.every((key) => !!settings[key]);
  }

  useEffect(() => {
    if (!selectedProvider || !settings) {
      setModels([]);
      return;
    }
    if (!isConfigured(selectedProvider)) return;

    async function fetchModels() {
      setLoadingModels(true);
      const { models: fetchedModels = [] } =
        await System.customModels(selectedProvider);
      setModels(fetchedModels);
      setLoadingModels(false);
    }
    fetchModels();
  }, [selectedProvider, settings]);

  function handleProviderChange(e) {
    const value = e.target.value;
    setSelectedProvider(value);
    setSelectedModel("");
    setModels([]);
    if (value && !isConfigured(value)) openModal();
  }

  function handleSetupCancel() {
    closeModal();
    if (!isConfigured(selectedProvider)) {
      setSelectedProvider(defaultProvider || "");
      setSelectedModel(defaultModel || "");
    }
  }

  async function handleSetupSave(e) {
    e.preventDefault();
    e.stopPropagation();
    const data = {};
    const form = new FormData(e.target);
    for (const [key, value] of form.entries()) data[key] = value;
    const { error } = await System.updateSystem(data);
    if (error) {
      showToast(`Failed to save settings: ${error}`, "error");
      return;
    }
    const _settings = await System.keys();
    setSettings(_settings ?? {});
    closeModal();
    showToast("Provider configured successfully", "success", { clear: true });
  }

  const selectedLlm = availableProviders.find(
    (l) => l.value === selectedProvider
  );
  const needsSetup =
    selectedProvider && selectedLlm && !isConfigured(selectedProvider);

  return (
    <div className="flex flex-col gap-y-1.5">
      <label className="text-sm font-medium text-zinc-200 light:text-slate-900">
        {label}
      </label>
      {description && (
        <p className="text-xs text-zinc-400 light:text-slate-600">
          {description}
        </p>
      )}
      <div className="flex gap-x-4 mt-1">
        <div className="flex-1">
          <select
            name={providerFieldName}
            value={selectedProvider}
            onChange={handleProviderChange}
            className="bg-zinc-800 light:bg-white light:border light:border-slate-300 text-white light:text-slate-900 text-sm rounded-lg outline-none block w-full p-2.5"
            required
          >
            <option value="">Select provider</option>
            {availableProviders.map((llm) => (
              <option key={llm.value} value={llm.value}>
                {llm.name}
                {!isConfigured(llm.value) ? " (setup required)" : ""}
              </option>
            ))}
          </select>
        </div>
        <div className="flex-1">
          {needsSetup ? (
            <button
              type="button"
              onClick={openModal}
              className="bg-zinc-800 light:bg-white light:border light:border-slate-300 text-blue-400 light:text-blue-500 text-sm rounded-lg block w-full p-2.5 text-left hover:text-blue-300 light:hover:text-blue-600 transition-colors"
            >
              Configure {selectedLlm.name} to continue
            </button>
          ) : loadingModels ? (
            <div className="bg-zinc-800 light:bg-white light:border light:border-slate-300 text-zinc-400 light:text-slate-500 text-sm rounded-lg p-2.5">
              Loading models...
            </div>
          ) : models.length > 0 ? (
            <select
              name={modelFieldName}
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="bg-zinc-800 light:bg-white light:border light:border-slate-300 text-white light:text-slate-900 text-sm rounded-lg outline-none block w-full p-2.5"
              required
            >
              <option value="">Select model</option>
              {models.map((model) => (
                <option key={model.id} value={model.id}>
                  {model.id}
                </option>
              ))}
            </select>
          ) : (
            <input
              type="text"
              name={modelFieldName}
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              placeholder={
                selectedProvider
                  ? "Enter model name"
                  : "Select a provider first"
              }
              disabled={!selectedProvider}
              className="bg-zinc-800 light:bg-white light:border light:border-slate-300 text-white light:text-slate-900 placeholder:text-zinc-400 light:placeholder:text-slate-500 text-sm rounded-lg outline-none block w-full p-2.5 disabled:opacity-50"
              required
            />
          )}
        </div>
      </div>

      <ProviderSetupModal
        isOpen={isOpen}
        provider={selectedLlm}
        settings={settings}
        onSave={handleSetupSave}
        onClose={handleSetupCancel}
      />
    </div>
  );
}

function ProviderSetupModal({ isOpen, provider, settings, onSave, onClose }) {
  if (!isOpen || !provider) return null;

  return (
    <ModalWrapper isOpen={isOpen}>
      <div className="w-full max-w-2xl bg-zinc-900 light:bg-white rounded-lg shadow-lg border border-zinc-700 light:border-slate-300">
        <div className="flex items-center justify-between p-6 border-b border-zinc-700 light:border-slate-300">
          <div className="flex items-center gap-x-3">
            {provider.logo && (
              <img
                src={provider.logo}
                alt={`${provider.name} logo`}
                className="w-8 h-8 rounded-md"
              />
            )}
            <h3 className="text-lg font-semibold text-white light:text-slate-900">
              Configure {provider.name}
            </h3>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="p-1 rounded-lg text-zinc-400 light:text-slate-500 hover:text-white light:hover:text-slate-900 hover:bg-zinc-800 light:hover:bg-slate-100 transition-colors"
          >
            <X size={20} weight="bold" />
          </button>
        </div>
        <form id="provider-setup-form" onSubmit={onSave}>
          <div className="px-6 py-5">
            <p className="text-sm text-zinc-400 light:text-slate-600 mb-4">
              Enter the required credentials to use {provider.name} as a routing
              target.
            </p>
            <div className="space-y-4">{provider.options(settings ?? {})}</div>
          </div>
          <div className="flex justify-end gap-x-3 px-6 py-4 border-t border-zinc-700 light:border-slate-300">
            <button
              type="button"
              onClick={onClose}
              className="text-sm font-medium text-zinc-400 light:text-slate-600 hover:text-white light:hover:text-slate-900 px-4 py-2 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="provider-setup-form"
              className="text-sm font-medium bg-zinc-50 light:bg-slate-900 text-zinc-900 light:text-white rounded-lg px-5 py-2 hover:opacity-90 transition-opacity duration-200"
            >
              Save settings
            </button>
          </div>
        </form>
      </div>
    </ModalWrapper>
  );
}

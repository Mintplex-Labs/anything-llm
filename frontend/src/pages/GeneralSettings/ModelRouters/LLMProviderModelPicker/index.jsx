import { useEffect, useState } from "react";
import { AVAILABLE_LLM_PROVIDERS } from "@/pages/GeneralSettings/LLMPreference";
import System from "@/models/system";

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

  useEffect(() => {
    if (!selectedProvider) {
      setModels([]);
      return;
    }

    async function fetchModels() {
      setLoadingModels(true);
      const { models: fetchedModels = [] } =
        await System.customModels(selectedProvider);
      setModels(fetchedModels);
      setLoadingModels(false);
    }
    fetchModels();
  }, [selectedProvider]);

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
            onChange={(e) => {
              setSelectedProvider(e.target.value);
              setSelectedModel("");
            }}
            className="bg-zinc-800 light:bg-white light:border light:border-slate-300 text-white light:text-slate-900 text-sm rounded-lg outline-none block w-full p-2.5"
            required
          >
            <option value="">Select provider</option>
            {AVAILABLE_LLM_PROVIDERS.map((llm) => (
              <option key={llm.value} value={llm.value}>
                {llm.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex-1">
          {loadingModels ? (
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
    </div>
  );
}

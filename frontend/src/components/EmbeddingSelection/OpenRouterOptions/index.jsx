import { useState, useEffect } from "react";
import System from "@/models/system";

export default function OpenRouterOptions({ settings }) {
  return (
    <div className="w-full flex flex-col gap-y-4">
      <div className="w-full flex items-center gap-[36px] mt-1.5">
        <div className="flex flex-col w-60">
          <label className="text-white text-sm font-semibold block mb-3">
            API Key
          </label>
          <input
            type="password"
            name="OpenRouterApiKey"
            className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
            placeholder="OpenRouter API Key"
            defaultValue={settings?.OpenRouterApiKey ? "*".repeat(20) : ""}
            required={true}
            autoComplete="off"
            spellCheck={false}
          />
        </div>
        <OpenRouterEmbeddingModelSelection settings={settings} />
      </div>
    </div>
  );
}

function OpenRouterEmbeddingModelSelection({ settings }) {
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedModel, setSelectedModel] = useState(
    settings?.EmbeddingModelPref || ""
  );

  useEffect(() => {
    async function fetchModels() {
      setLoading(true);
      const response = await System.customModels("openrouter-embedder");
      const fetchedModels = response?.models || [];
      setModels(fetchedModels);

      if (
        settings?.EmbeddingModelPref &&
        fetchedModels.some((m) => m.id === settings.EmbeddingModelPref)
      ) {
        setSelectedModel(settings.EmbeddingModelPref);
      } else if (fetchedModels.length > 0) {
        setSelectedModel(fetchedModels[0].id);
      }

      setLoading(false);
    }
    fetchModels();
  }, [settings?.EmbeddingModelPref]);

  if (loading) {
    return (
      <div className="flex flex-col w-60">
        <label className="text-white text-sm font-semibold block mb-3">
          Model Preference
        </label>
        <select
          name="EmbeddingModelPref"
          disabled={true}
          className="border-none bg-theme-settings-input-bg border-gray-500 text-white text-sm rounded-lg block w-full p-2.5"
        >
          <option disabled={true} selected={true}>
            -- loading available models --
          </option>
        </select>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-60">
      <label className="text-white text-sm font-semibold block mb-3">
        Model Preference
      </label>
      <select
        name="EmbeddingModelPref"
        required={true}
        value={selectedModel}
        onChange={(e) => setSelectedModel(e.target.value)}
        className="border-none bg-theme-settings-input-bg border-gray-500 text-white text-sm rounded-lg block w-full p-2.5"
      >
        {models.map((model) => (
          <option key={model.id} value={model.id}>
            {model.name}
          </option>
        ))}
      </select>
    </div>
  );
}

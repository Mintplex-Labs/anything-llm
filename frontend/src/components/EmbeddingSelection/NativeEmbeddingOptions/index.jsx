import { useEffect, useState } from "react";

// TODO: Migrate to backend to be part of NativeEmbedder class
// and called via System.customModels()
const AVAILABLE_MODELS = [
  {
    id: "Xenova/all-MiniLM-L6-v2",
    name: "all-MiniLM-L6-v2",
    description: "A super small, fast, and accurate model for embedding text.",
    lang: "English",
    size: "23MB",
  },
  {
    id: "Xenova/nomic-embed-text-v1",
    name: "nomic-embed-text-v1",
    description:
      "A high-performing open embedding model with a large token context window.",
    lang: "English",
    size: "139MB",
  },
  {
    id: "MintplexLabs/multilingual-e5-small",
    name: "multilingual-e5-small",
    description: "A multilingual embedding model that supports 100+ languages.",
    lang: "100+ languages",
    size: "487MB",
  },
];

export default function NativeEmbeddingOptions({ settings }) {
  const [selectedModel, setSelectedModel] = useState(settings?.EmbeddingModelPref);
  const [selectedModelInfo, setSelectedModelInfo] = useState(AVAILABLE_MODELS[0]);

  useEffect(() => {
    setSelectedModelInfo(AVAILABLE_MODELS.find((model) => model.id === selectedModel));
  }, [selectedModel]);

  return (
    <div className="w-full flex flex-col gap-y-4">
      <div className="w-full flex flex-col mt-1.5">
        <div className="flex flex-col w-96">
          <label className="text-white text-sm font-semibold block mb-3">
            Model Preference
          </label>
          <select
            name="EmbeddingModelPref"
            required={true}
            defaultValue={selectedModel}
            className="border-none bg-theme-settings-input-bg border-gray-500 text-white text-sm rounded-lg block w-60 p-2.5"
            onChange={(e) => setSelectedModel(e.target.value)}
          >
            <optgroup label="Supported embedding models">
              {AVAILABLE_MODELS.map((model) => {
                return (
                  <option
                    key={model.id}
                    value={model.id}
                    selected={selectedModel === model.id}
                  >
                    {model.name}
                  </option>
                );
              })}
            </optgroup>
          </select>
        </div>
        <div className="flex flex-col gap-y-2 mt-2">
          <p className="text-theme-text-secondary text-xs font-normal block">
            {selectedModelInfo?.description}
          </p>
          <p className="text-theme-text-secondary text-xs font-normal block">
            Trained on: {selectedModelInfo?.lang}
          </p>
          <p className="text-theme-text-secondary text-xs font-normal block">
            Download Size: {selectedModelInfo?.size}
          </p>
        </div>
      </div>
    </div>
  );
}

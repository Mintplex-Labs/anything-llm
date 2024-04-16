import React, { useEffect, useState } from "react";
import System from "@/models/system";
import InputField from "@/components/lib/InputField";

export default function OllamaEmbeddingOptions({ settings }) {
  const [basePathValue, setBasePathValue] = useState(
    settings?.EmbeddingBasePath
  );
  const [basePath, setBasePath] = useState(settings?.EmbeddingBasePath);

  return (
    <div className="w-full flex flex-col gap-y-4">
      <div className="w-full flex items-center gap-4">
        <InputField
          type="url"
          label="Ollama Base URL"
          name="EmbeddingBasePath"
          placeholder="http://127.0.0.1:11434"
          defaultValue={settings?.EmbeddingBasePath}
          onChange={(e) => setBasePathValue(e.target.value)}
          onBlur={() => setBasePath(basePathValue)}
          required={true}
          autoComplete="off"
          spellCheck={false}
          className="w-60"
        />
        <OllamaLLMModelSelection settings={settings} basePath={basePath} />
        <InputField
          type="number"
          label="Max embedding chunk length"
          name="EmbeddingModelMaxChunkLength"
          placeholder="8192"
          min={1}
          onScroll={(e) => e.target.blur()}
          defaultValue={settings?.EmbeddingModelMaxChunkLength}
          required={false}
          autoComplete="off"
          className="w-60"
        />
      </div>
    </div>
  );
}

function OllamaLLMModelSelection({ settings, basePath = null }) {
  const [customModels, setCustomModels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function findCustomModels() {
      if (!basePath) {
        setCustomModels([]);
        setLoading(false);
        return;
      }
      setLoading(true);
      const { models } = await System.customModels("ollama", null, basePath);
      setCustomModels(models || []);
      setLoading(false);
    }
    findCustomModels();
  }, [basePath]);

  if (loading || customModels.length == 0) {
    return (
      <div className="flex flex-col w-60">
        <label className="text-white text-sm font-semibold block mb-4">
          Embedding Model Selection
        </label>
        <select
          name="EmbeddingModelPref"
          disabled={true}
          className="bg-zinc-900 border-gray-500 text-white text-sm rounded-lg block w-full p-2.5"
        >
          <option disabled={true} selected={true}>
            {!!basePath
              ? "-- loading available models --"
              : "-- waiting for URL --"}
          </option>
        </select>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-60">
      <label className="text-white text-sm font-semibold block mb-4">
        Embedding Model Selection
      </label>
      <select
        name="EmbeddingModelPref"
        required={true}
        className="bg-zinc-900 border-gray-500 text-white text-sm rounded-lg block w-full p-2.5"
      >
        {customModels.length > 0 && (
          <optgroup label="Your loaded models">
            {customModels.map((model) => {
              return (
                <option
                  key={model.id}
                  value={model.id}
                  selected={settings.EmbeddingModelPref === model.id}
                >
                  {model.id}
                </option>
              );
            })}
          </optgroup>
        )}
      </select>
    </div>
  );
}

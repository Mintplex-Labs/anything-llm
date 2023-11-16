import { useEffect, useState } from "react";
import System from "../../../models/system";

export default function LocalAiOptions({ settings }) {
  const [basePathValue, setBasePathValue] = useState(
    settings?.EmbeddingBasePath
  );
  const [basePath, setBasePath] = useState(settings?.EmbeddingBasePath);
  function updateBasePath() {
    setBasePath(basePathValue);
  }

  return (
    <>
      <div className="flex flex-col w-60">
        <label className="text-white text-sm font-semibold block mb-4">
          LocalAI Base URL
        </label>
        <input
          type="url"
          name="EmbeddingBasePath"
          className="bg-zinc-900 text-white placeholder-white placeholder-opacity-60 text-sm rounded-lg focus:border-white block w-full p-2.5"
          placeholder="http://localhost:8080/v1"
          defaultValue={settings?.EmbeddingBasePath}
          onChange={(e) => setBasePathValue(e.target.value)}
          onBlur={updateBasePath}
          required={true}
          autoComplete="off"
          spellCheck={false}
        />
      </div>
      <LocalAIModelSelection settings={settings} basePath={basePath} />
    </>
  );
}

function LocalAIModelSelection({ settings, basePath = null }) {
  const [customModels, setCustomModels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function findCustomModels() {
      if (!basePath || !basePath.includes("/v1")) {
        setCustomModels([]);
        setLoading(false);
        return;
      }
      setLoading(true);
      const { models } = await System.customModels("localai", null, basePath);
      setCustomModels(models || []);
      setLoading(false);
    }
    findCustomModels();
  }, [basePath]);

  if (loading || customModels.length == 0) {
    return (
      <div className="flex flex-col w-60">
        <label className="text-white text-sm font-semibold block mb-4">
          Embedding Model Name
        </label>
        <select
          name="EmbeddingModelPref"
          disabled={true}
          className="bg-zinc-900 border border-gray-500 text-white text-sm rounded-lg block w-full p-2.5"
        >
          <option disabled={true} selected={true}>
            {basePath?.includes("/v1")
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
        Embedding Model Name
      </label>
      <select
        name="EmbeddingModelPref"
        required={true}
        className="bg-zinc-900 border border-gray-500 text-white text-sm rounded-lg block w-full p-2.5"
      >
        {customModels.length > 0 && (
          <optgroup label="Your loaded models">
            {customModels.map((model) => {
              return (
                <option
                  key={model.id}
                  value={model.id}
                  selected={settings?.EmbeddingModelPref === model.id}
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

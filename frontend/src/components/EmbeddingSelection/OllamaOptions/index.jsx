import React, { useEffect, useState } from "react";
import System from "@/models/system";
import showToast from "@/utils/toast";
import PreLoader from "@/components/Preloader";
import { OLLAMA_COMMON_URLS } from "@/utils/constants";

export default function OllamaEmbeddingOptions({ settings }) {
  const [loading, setLoading] = useState(false);
  const [basePathValue, setBasePathValue] = useState(
    settings?.EmbeddingBasePath || ""
  );
  const [basePath, setBasePath] = useState(settings?.EmbeddingBasePath || "");
  const [autoDetectAttempted, setAutoDetectAttempted] = useState(false);

  useEffect(() => {
    if (!settings?.EmbeddingBasePath && !autoDetectAttempted) {
      autoDetectBasePath(true);
    }
  }, [settings?.EmbeddingBasePath, autoDetectAttempted]);

  const autoDetectBasePath = async (firstLoad = false) => {
    setLoading(true);
    setAutoDetectAttempted(true);

    const checkUrl = async (url) => {
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Timeout")), 2000)
      );

      const fetchPromise = System.customModels("ollama", null, url);

      try {
        const { models } = await Promise.race([fetchPromise, timeoutPromise]);
        return models && models.length > 0 ? url : null;
      } catch (error) {
        console.error(`Failed to connect to ${url}:`, error);
        return null;
      }
    };

    for (const url of OLLAMA_COMMON_URLS) {
      const detectedUrl = await checkUrl(url);
      if (detectedUrl) {
        setBasePath(detectedUrl);
        setBasePathValue(detectedUrl);
        setLoading(false);
        if (!firstLoad)
          showToast("Ollama URL detected successfully!", "success", {
            clear: true,
          });
        return;
      }
    }

    setLoading(false);
    showToast(
      "Couldn't automatically detect Ollama. Ollama may not be setup properly. Please enter the URL manually or try again.",
      "info",
      {
        clear: true,
      }
    );
  };

  const handleAutoDetectClick = (e) => {
    e.preventDefault();
    autoDetectBasePath();
  };

  const handleBasePathChange = (e) => {
    const value = e.target.value;
    setBasePathValue(value);
  };

  const handleBasePathBlur = () => {
    setBasePath(basePathValue);
  };

  return (
    <div className="w-full flex flex-col gap-y-4">
      <div className="w-full flex items-start gap-4">
        <div className="flex flex-col w-60">
          <div className="flex justify-between items-center mb-2">
            <label className="text-white text-sm font-semibold">
              Ollama Base URL
            </label>
            {loading ? (
              <PreLoader size="6" />
            ) : (
              <button
                onClick={handleAutoDetectClick}
                className="bg-primary-button text-xs font-medium px-2 py-1 rounded-lg hover:bg-secondary hover:text-white shadow-[0_4px_14px_rgba(0,0,0,0.25)]"
              >
                Auto-Detect
              </button>
            )}
          </div>
          <input
            type="url"
            name="EmbeddingBasePath"
            className="bg-zinc-900 text-white placeholder:text-white/20 text-sm rounded-lg focus:border-white block w-full p-2.5"
            placeholder="http://127.0.0.1:11434"
            value={basePathValue}
            required={true}
            autoComplete="off"
            spellCheck={false}
            onChange={handleBasePathChange}
            onBlur={handleBasePathBlur}
          />
          <p className="text-xs leading-[18px] font-base text-white text-opacity-60 mt-2">
            Enter the URL where Ollama is running. Click "Auto-Detect" if you're
            not sure.
          </p>
        </div>
        <OllamaLLMModelSelection settings={settings} basePath={basePath} />
        <div className="flex flex-col w-60">
          <label className="text-white text-sm font-semibold block mb-2">
            Max Embedding Chunk Length
          </label>
          <input
            type="number"
            name="EmbeddingModelMaxChunkLength"
            className="bg-zinc-900 text-white placeholder:text-white/20 text-sm rounded-lg focus:border-white block w-full p-2.5"
            placeholder="8192"
            min={1}
            onScroll={(e) => e.target.blur()}
            defaultValue={settings?.EmbeddingModelMaxChunkLength}
            required={false}
            autoComplete="off"
          />
          <p className="text-xs leading-[18px] font-base text-white text-opacity-60 mt-2">
            Maximum length of text chunks for embedding.
          </p>
        </div>
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
      try {
        const { models } = await System.customModels("ollama", null, basePath);
        setCustomModels(models || []);
      } catch (error) {
        console.error("Failed to fetch custom models:", error);
        setCustomModels([]);
      }
      setLoading(false);
    }
    findCustomModels();
  }, [basePath]);

  if (loading || customModels.length == 0) {
    return (
      <div className="flex flex-col w-60">
        <label className="text-white text-sm font-semibold block mb-2">
          Embedding Model
        </label>
        <select
          name="EmbeddingModelPref"
          disabled={true}
          className="bg-zinc-900 border-gray-500 text-white text-sm rounded-lg block w-full p-2.5"
        >
          <option disabled={true} selected={true}>
            {!!basePath
              ? "--loading available models--"
              : "Enter Ollama URL first"}
          </option>
        </select>
        <p className="text-xs leading-[18px] font-base text-white text-opacity-60 mt-2">
          Select the Ollama model for embeddings. Models will load after
          entering a valid Ollama URL.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-60">
      <label className="text-white text-sm font-semibold block mb-2">
        Embedding Model
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
      <p className="text-xs leading-[18px] font-base text-white text-opacity-60 mt-2">
        Choose the Ollama model you want to use for generating embeddings.
      </p>
    </div>
  );
}

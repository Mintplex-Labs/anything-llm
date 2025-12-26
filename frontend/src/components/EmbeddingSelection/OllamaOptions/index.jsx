import React, { useEffect, useState } from "react";
import System from "@/models/system";
import PreLoader from "@/components/Preloader";
import { OLLAMA_COMMON_URLS } from "@/utils/constants";
import { CaretDown, CaretUp, Info } from "@phosphor-icons/react";
import { Tooltip } from "react-tooltip";
import useProviderEndpointAutoDiscovery from "@/hooks/useProviderEndpointAutoDiscovery";

export default function OllamaEmbeddingOptions({ settings }) {
  const {
    autoDetecting: loading,
    basePath,
    basePathValue,
    showAdvancedControls,
    setShowAdvancedControls,
    handleAutoDetectClick,
    authToken,
    authTokenValue,
  } = useProviderEndpointAutoDiscovery({
    provider: "ollama",
    initialBasePath: settings?.EmbeddingBasePath,
    ENDPOINTS: OLLAMA_COMMON_URLS,
  });

  const [maxChunkLength, setMaxChunkLength] = useState(
    settings?.EmbeddingModelMaxChunkLength || 8192
  );
  const [batchSize, setBatchSize] = useState(
    settings?.OllamaEmbeddingBatchSize || 1
  );

  const handleMaxChunkLengthChange = (e) => {
    setMaxChunkLength(Number(e.target.value));
  };

  const handleBatchSizeChange = (e) => {
    setBatchSize(Number(e.target.value));
  };

  return (
    <div className="w-full flex flex-col gap-y-7">
      <div className="w-full flex items-start gap-[36px] mt-1.5">
        <OllamaEmbeddingModelSelection
          settings={settings}
          basePath={basePath.value}
        />
        <div className="flex flex-col w-60">
          <div
            data-tooltip-place="top"
            data-tooltip-id="max-embedding-chunk-length-tooltip"
            className="flex gap-x-1 items-center mb-3"
          >
            <label className="text-white text-sm font-semibold block">
              Max embedding chunk length
            </label>
            <Info
              size={16}
              className="text-theme-text-secondary cursor-pointer"
            />
            <Tooltip id="max-embedding-chunk-length-tooltip">
              Maximum length of text chunks, in characters, for embedding.
            </Tooltip>
          </div>
          <input
            type="number"
            name="EmbeddingModelMaxChunkLength"
            className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
            placeholder="8192"
            min={1}
            value={maxChunkLength}
            onChange={handleMaxChunkLengthChange}
            onScroll={(e) => e.target.blur()}
            required={true}
            autoComplete="off"
          />
        </div>
      </div>
      <div className="flex justify-start mt-4">
        <button
          onClick={(e) => {
            e.preventDefault();
            setShowAdvancedControls(!showAdvancedControls);
          }}
          className="border-none text-theme-text-primary hover:text-theme-text-secondary flex items-center text-sm"
        >
          {showAdvancedControls ? "Hide" : "Show"} Advanced Settings
          {showAdvancedControls ? (
            <CaretUp size={14} className="ml-1" />
          ) : (
            <CaretDown size={14} className="ml-1" />
          )}
        </button>
      </div>

      <div hidden={!showAdvancedControls}>
        <div className="w-full flex items-start gap-4">
          <div className="flex flex-col w-60">
            <div className="flex justify-between items-center mb-2">
              <label className="text-white text-sm font-semibold">
                Ollama Base URL
              </label>
              {loading ? (
                <PreLoader size="6" />
              ) : (
                <>
                  {!basePathValue.value && (
                    <button
                      onClick={handleAutoDetectClick}
                      className="bg-primary-button text-xs font-medium px-2 py-1 rounded-lg hover:bg-secondary hover:text-white shadow-[0_4px_14px_rgba(0,0,0,0.25)]"
                    >
                      Auto-Detect
                    </button>
                  )}
                </>
              )}
            </div>
            <input
              type="url"
              name="EmbeddingBasePath"
              className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
              placeholder="http://127.0.0.1:11434"
              value={basePathValue.value}
              required={true}
              autoComplete="off"
              spellCheck={false}
              onChange={basePath.onChange}
              onBlur={basePath.onBlur}
            />
            <p className="text-xs leading-[18px] font-base text-white text-opacity-60 mt-2">
              Enter the URL where Ollama is running.
            </p>
          </div>
          <div className="flex flex-col w-60">
            <div
              data-tooltip-place="top"
              data-tooltip-id="ollama-batch-size-tooltip"
              className="flex gap-x-1 items-center mb-3"
            >
              <label className="text-white text-sm font-semibold block">
                Embedding batch size
              </label>
              <Info
                size={16}
                className="text-theme-text-secondary cursor-pointer"
              />
              <Tooltip id="ollama-batch-size-tooltip">
                Number of text chunks to embed in parallel. Higher values
                improve speed but use more memory. Default is 1.
              </Tooltip>
            </div>
            <input
              type="number"
              name="OllamaEmbeddingBatchSize"
              className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
              placeholder="1"
              min={1}
              value={batchSize}
              onChange={handleBatchSizeChange}
              onScroll={(e) => e.target.blur()}
              required={true}
              autoComplete="off"
            />
            <p className="text-xs leading-[18px] font-base text-white text-opacity-60 mt-2">
              Increase this value to process multiple chunks simultaneously for
              faster embedding.
            </p>
          </div>
          <div>
            <label className="text-white font-semibold block mb-3 text-sm">
              Auth Token (optional)
            </label>
            <input
              type="password"
              name="OllamaLLMAuthToken"
              className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
              placeholder="Enter your Auth Token"
              defaultValue={settings?.OllamaLLMAuthToken ? "*".repeat(20) : ""}
              value={authTokenValue.value}
              onChange={authToken.onChange}
              onBlur={authToken.onBlur}
              required={false}
              autoComplete="off"
              spellCheck={false}
            />
            <p className="text-xs leading-[18px] font-base text-white text-opacity-60 mt-2">
              Enter a <code>Bearer</code> Auth Token for interacting with your
              Ollama server.
              <br />
              Used <b>only</b> if running Ollama behind an authentication
              server.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function OllamaEmbeddingModelSelection({ settings, basePath = null }) {
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
          Ollama Embedding Model
        </label>
        <select
          name="EmbeddingModelPref"
          disabled={true}
          className="border-none bg-theme-settings-input-bg border-gray-500 text-white text-sm rounded-lg block w-full p-2.5"
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
        Ollama Embedding Model
      </label>
      <select
        name="EmbeddingModelPref"
        required={true}
        className="border-none bg-theme-settings-input-bg border-gray-500 text-white text-sm rounded-lg block w-full p-2.5"
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

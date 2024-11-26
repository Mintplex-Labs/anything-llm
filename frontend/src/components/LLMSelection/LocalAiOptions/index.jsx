import React, { useEffect, useState } from "react";
import { Info, CaretDown, CaretUp } from "@phosphor-icons/react";
import paths from "@/utils/paths";
import System from "@/models/system";
import PreLoader from "@/components/Preloader";
import { LOCALAI_COMMON_URLS } from "@/utils/constants";
import useProviderEndpointAutoDiscovery from "@/hooks/useProviderEndpointAutoDiscovery";

export default function LocalAiOptions({ settings, showAlert = false }) {
  const {
    autoDetecting: loading,
    basePath,
    basePathValue,
    showAdvancedControls,
    setShowAdvancedControls,
    handleAutoDetectClick,
  } = useProviderEndpointAutoDiscovery({
    provider: "localai",
    initialBasePath: settings?.LocalAiBasePath,
    ENDPOINTS: LOCALAI_COMMON_URLS,
  });
  const [apiKeyValue, setApiKeyValue] = useState(settings?.LocalAiApiKey);
  const [apiKey, setApiKey] = useState(settings?.LocalAiApiKey);

  return (
    <div className="w-full flex flex-col gap-y-7">
      {showAlert && (
        <div className="flex flex-col md:flex-row md:items-center gap-x-2 text-white mb-6 bg-blue-800/30 w-fit rounded-lg px-4 py-2">
          <div className="gap-x-2 flex items-center">
            <Info size={12} className="hidden md:visible" />
            <p className="text-sm md:text-base">
              LocalAI as your LLM requires you to set an embedding service to
              use.
            </p>
          </div>
          <a
            href={paths.settings.embedder.modelPreference()}
            className="text-sm md:text-base my-2 underline"
          >
            Manage embedding &rarr;
          </a>
        </div>
      )}
      <div className="w-full flex items-center gap-[36px] mt-1.5">
        {!settings?.credentialsOnly && (
          <>
            <LocalAIModelSelection
              settings={settings}
              basePath={basePath.value}
              apiKey={apiKey}
            />
            <div className="flex flex-col w-60">
              <label className="text-white text-sm font-semibold block mb-2">
                Token context window
              </label>
              <input
                type="number"
                name="LocalAiTokenLimit"
                className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
                placeholder="4096"
                min={1}
                onScroll={(e) => e.target.blur()}
                defaultValue={settings?.LocalAiTokenLimit}
                required={true}
                autoComplete="off"
              />
            </div>
          </>
        )}
        <div className="flex flex-col w-60">
          <div className="flex flex-col gap-y-1 mb-2">
            <label className="text-white text-sm font-semibold flex items-center gap-x-2">
              Local AI API Key{" "}
              <p className="!text-xs !italic !font-thin">optional</p>
            </label>
          </div>
          <input
            type="password"
            name="LocalAiApiKey"
            className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
            placeholder="sk-mysecretkey"
            defaultValue={settings?.LocalAiApiKey ? "*".repeat(20) : ""}
            autoComplete="off"
            spellCheck={false}
            onChange={(e) => setApiKeyValue(e.target.value)}
            onBlur={() => setApiKey(apiKeyValue)}
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
          {showAdvancedControls ? "Hide" : "Show"} advanced settings
          {showAdvancedControls ? (
            <CaretUp size={14} className="ml-1" />
          ) : (
            <CaretDown size={14} className="ml-1" />
          )}
        </button>
      </div>
      <div hidden={!showAdvancedControls}>
        <div className="w-full flex items-center gap-4">
          <div className="flex flex-col w-60">
            <div className="flex justify-between items-center mb-2">
              <label className="text-white text-sm font-semibold">
                Local AI Base URL
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
              name="LocalAiBasePath"
              className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
              placeholder="http://localhost:8080/v1"
              value={basePathValue.value}
              required={true}
              autoComplete="off"
              spellCheck={false}
              onChange={basePath.onChange}
              onBlur={basePath.onBlur}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function LocalAIModelSelection({ settings, basePath = null, apiKey = null }) {
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
      const { models } = await System.customModels(
        "localai",
        typeof apiKey === "boolean" ? null : apiKey,
        basePath
      );
      setCustomModels(models || []);
      setLoading(false);
    }
    findCustomModels();
  }, [basePath, apiKey]);

  if (loading || customModels.length == 0) {
    return (
      <div className="flex flex-col w-60">
        <label className="text-white text-sm font-semibold block mb-2">
          Chat Model Selection
        </label>
        <select
          name="LocalAiModelPref"
          disabled={true}
          className="border-none bg-theme-settings-input-bg border-gray-500 text-white text-sm rounded-lg block w-full p-2.5"
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
      <label className="text-white text-sm font-semibold block mb-2">
        Chat Model Selection
      </label>
      <select
        name="LocalAiModelPref"
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
                  selected={settings.LocalAiModelPref === model.id}
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

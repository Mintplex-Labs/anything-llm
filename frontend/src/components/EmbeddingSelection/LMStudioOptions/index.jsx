import React, { useEffect, useState } from "react";
import System from "@/models/system";
import { LMSTUDIO_COMMON_URLS } from "@/utils/constants";
import { CaretDown, CaretUp, Info, CircleNotch } from "@phosphor-icons/react";
import { Tooltip } from "react-tooltip";
import useProviderEndpointAutoDiscovery from "@/hooks/useProviderEndpointAutoDiscovery";

export default function LMStudioEmbeddingOptions({ settings }) {
  const {
    autoDetecting: loading,
    basePath,
    basePathValue,
    authToken,
    authTokenValue,
    showAdvancedControls,
    setShowAdvancedControls,
    handleAutoDetectClick,
  } = useProviderEndpointAutoDiscovery({
    provider: "lmstudio",
    initialBasePath: settings?.EmbeddingBasePath,
    ENDPOINTS: LMSTUDIO_COMMON_URLS,
  });

  const [maxChunkLength, setMaxChunkLength] = useState(
    settings?.EmbeddingModelMaxChunkLength || 8192
  );

  const handleMaxChunkLengthChange = (e) => {
    setMaxChunkLength(Number(e.target.value));
  };

  return (
    <div className="w-full flex flex-col gap-y-7">
      <div className="w-full flex items-start gap-[36px] mt-1.5">
        <LMStudioModelSelection
          settings={settings}
          basePath={basePath.value}
          apiKey={authTokenValue.value}
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
          {showAdvancedControls ? "Hide" : "Show"} Manual Endpoint Input
          {showAdvancedControls ? (
            <CaretUp size={14} className="ml-1" />
          ) : (
            <CaretDown size={14} className="ml-1" />
          )}
        </button>
      </div>

      <div hidden={!showAdvancedControls}>
        <div className="w-full flex items-start gap-4">
          <div className="flex flex-col w-[300px]">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-1">
                <label className="text-white text-sm font-semibold">
                  LM Studio Base URL
                </label>
                <Info
                  size={18}
                  className="text-theme-text-secondary cursor-pointer"
                  data-tooltip-id="lmstudio-base-url"
                  data-tooltip-content="Enter the URL where LM Studio is running."
                />
                <Tooltip
                  id="lmstudio-base-url"
                  place="top"
                  delayShow={300}
                  className="tooltip !text-xs !opacity-100"
                  style={{
                    maxWidth: "250px",
                    whiteSpace: "normal",
                    wordWrap: "break-word",
                  }}
                />
              </div>
              {loading ? (
                <CircleNotch
                  size={16}
                  className="text-theme-text-secondary animate-spin"
                />
              ) : (
                <>
                  {!basePathValue.value && (
                    <button
                      onClick={handleAutoDetectClick}
                      className="border-none bg-primary-button text-xs font-medium px-2 py-1 rounded-lg hover:bg-secondary hover:text-white shadow-[0_4px_14px_rgba(0,0,0,0.25)]"
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
              placeholder="http://localhost:1234/v1"
              value={basePathValue.value}
              required={true}
              autoComplete="off"
              spellCheck={false}
              onChange={basePath.onChange}
              onBlur={basePath.onBlur}
            />
          </div>
          <div className="flex flex-col w-60">
            <div className="flex items-center mb-2 gap-x-1">
              <label className="text-white text-sm font-semibold">
                Authentication Token
              </label>
              <Info
                size={18}
                className="text-theme-text-secondary cursor-pointer"
                data-tooltip-id="lmstudio-authentication-token"
              />
              <Tooltip
                id="lmstudio-authentication-token"
                place="top"
                delayShow={300}
                delayHide={400}
                clickable={true}
                className="tooltip !text-xs !opacity-100"
                style={{
                  maxWidth: "250px",
                  whiteSpace: "normal",
                  wordWrap: "break-word",
                }}
              >
                <p className="text-xs leading-[18px] font-base">
                  Enter a <code>Bearer</code> Auth Token for interacting with
                  your LM Studio server.
                  <br /> <br />
                  Useful if running LM Studio behind an authentication or proxy.
                </p>
              </Tooltip>
            </div>
            <input
              type="password"
              name="LMStudioAuthToken"
              className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg outline-none block w-full p-2.5 focus:outline-primary-button active:outline-primary-button"
              placeholder="LM Studio Auth Token"
              defaultValue={settings?.LMStudioAuthToken ? "*".repeat(20) : ""}
              value={authTokenValue.value}
              onChange={authToken.onChange}
              onBlur={authToken.onBlur}
              required={false}
              autoComplete="off"
              spellCheck={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function LMStudioModelSelection({ settings, basePath = null, apiKey = null }) {
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
        const { models } = await System.customModels(
          "lmstudio",
          apiKey,
          basePath
        );
        setCustomModels(models || []);
      } catch (error) {
        console.error("Failed to fetch custom models:", error);
        setCustomModels([]);
      }
      setLoading(false);
    }
    findCustomModels();
  }, [basePath, apiKey]);

  if (loading || customModels.length == 0) {
    return (
      <div className="flex flex-col w-60">
        <label className="text-white text-sm font-semibold block mb-2">
          LM Studio Embedding Model
        </label>
        <select
          name="EmbeddingModelPref"
          disabled={true}
          className="border-none bg-theme-settings-input-bg border-gray-500 text-white text-sm rounded-lg block w-full p-2.5"
        >
          <option disabled={true} selected={true}>
            {!!basePath
              ? "--loading available models--"
              : "Enter LM Studio URL first"}
          </option>
        </select>
        <p className="text-xs leading-[18px] font-base text-white text-opacity-60 mt-2">
          Select the LM Studio model for embeddings. Models will load after
          entering a valid LM Studio URL.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-60">
      <label className="text-white text-sm font-semibold block mb-2">
        LM Studio Embedding Model
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
        Choose the LM Studio model you want to use for generating embeddings.
      </p>
    </div>
  );
}

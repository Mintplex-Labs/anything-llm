import useProviderEndpointAutoDiscovery from "@/hooks/useProviderEndpointAutoDiscovery";
import System from "@/models/system";
import { BASERT_COMMON_URLS } from "@/utils/constants";
import { CaretDown, CaretUp, CircleNotch, Info } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import { Tooltip } from "react-tooltip";

export default function BaseRTOptions({ settings }) {
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
    provider: "basert",
    initialBasePath: settings?.BaseRTLLMBasePath,
    ENDPOINTS: BASERT_COMMON_URLS,
  });

  const [contextWindowLimit, setContextWindowLimit] = useState(
    settings?.BaseRTLLMTokenLimit ?? ""
  );
  return (
    <div className="w-full flex flex-col gap-y-7">
      <div className="w-full flex items-start gap-[36px] mt-1.5">
        <BaseRTModelSelection
          settings={settings}
          basePath={basePath.value}
          authToken={authToken.value}
        />
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
        <div className="flex flex-col">
          <div className="w-full flex items-start gap-4 mb-4">
            <div className="flex flex-col w-60">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-1">
                  <label className="text-white text-sm font-semibold">
                    BaseRT Base URL
                  </label>
                  <Info
                    size={18}
                    className="text-theme-text-secondary cursor-pointer"
                    data-tooltip-id="basert-base-url"
                    data-tooltip-content="Enter the URL where the BaseRT server is running."
                  />
                  <Tooltip
                    id="basert-base-url"
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
                name="BaseRTLLMBasePath"
                className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
                placeholder="http://127.0.0.1:8080"
                value={basePathValue.value}
                required={true}
                autoComplete="off"
                spellCheck={false}
                onChange={basePath.onChange}
                onBlur={basePath.onBlur}
              />
            </div>
          </div>
          <div className="w-full flex items-start gap-4">
            <div className="flex flex-col w-60">
              <div className="flex items-center mb-2 gap-x-1">
                <label className="text-white text-sm font-semibold block">
                  Model context window
                </label>
                <Info
                  size={18}
                  className="text-theme-text-secondary cursor-pointer"
                  data-tooltip-id="basert-model-context-window"
                />
                <Tooltip
                  id="basert-model-context-window"
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
                    Specify the maximum number of tokens that can be used for
                    the model context window.
                    <br /> <br />
                    If you leave this field blank, the context window limit will
                    be auto-detected from the model and applied to all chats. If
                    auto-detection fails, a fallback context window limit of
                    16000 will be used.
                    <br /> <br />
                    <b>Important:</b> Some models have very large context
                    windows using the full context window limit can dramatically
                    increase the memory usage of your system. For this reason,
                    we will automatically cap the context window limit to 16,384
                    tokens if the model supports more than that and no value is
                    specified.
                    <br /> <br />
                    If an invalid value is entered, AnythingLLM will handle this
                    for you so that chats do not fail.
                  </p>
                </Tooltip>
              </div>
              <input
                type="number"
                name="BaseRTLLMTokenLimit"
                className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
                placeholder="Automatically managed"
                min={1}
                value={contextWindowLimit}
                onChange={(e) =>
                  setContextWindowLimit(
                    e.target.value ? Number(e.target.value) : ""
                  )
                }
                onScroll={(e) => e.target.blur()}
                required={false}
                autoComplete="off"
              />
            </div>

            <div className="flex flex-col w-60">
              <div className="flex items-center mb-2 gap-x-1">
                <label className="text-white text-sm font-semibold">
                  API Key
                </label>
                <Info
                  size={18}
                  className="text-theme-text-secondary cursor-pointer"
                  data-tooltip-id="basert-api-key"
                />
                <Tooltip
                  id="basert-api-key"
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
                    Enter the <code>Bearer</code> API key for your BaseRT
                    server. Only required when serving with{" "}
                    <code>--api-key</code>.
                    <br /> <br />
                  </p>
                </Tooltip>
              </div>
              <input
                type="password"
                name="BaseRTLLMApiKey"
                className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg outline-none block w-full p-2.5 focus:outline-primary-button active:outline-primary-button"
                placeholder="BaseRT API Key"
                defaultValue={settings?.BaseRTLLMApiKey ? "*".repeat(20) : ""}
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
    </div>
  );
}

function BaseRTModelSelection({ settings, basePath = null, authToken = null }) {
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
          "basert",
          authToken,
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
  }, [basePath, authToken]);

  if (loading || customModels.length === 0) {
    return (
      <div className="flex flex-col w-60">
        <label className="text-white text-sm font-semibold block mb-2">
          BaseRT Model
        </label>
        <select
          name="BaseRTLLMModelPref"
          disabled={true}
          className="border-none bg-theme-settings-input-bg border-gray-500 text-white text-sm rounded-lg block w-full p-2.5"
        >
          <option disabled={true} selected={true}>
            {!!basePath
              ? "--loading available models--"
              : "Enter BaseRT URL first"}
          </option>
        </select>
        <p className="text-xs leading-[18px] font-base text-white text-opacity-60 mt-2">
          Select the BaseRT model you want to use. Models will load after
          entering a valid BaseRT URL.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-60">
      <label className="text-white text-sm font-semibold block mb-2">
        BaseRT Model
      </label>
      <select
        name="BaseRTLLMModelPref"
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
                  selected={settings.BaseRTLLMModelPref === model.id}
                >
                  {model.id}
                </option>
              );
            })}
          </optgroup>
        )}
      </select>
      <p className="text-xs leading-[18px] font-base text-white text-opacity-60 mt-2">
        Choose the BaseRT model you want to use for your conversations.
      </p>
    </div>
  );
}

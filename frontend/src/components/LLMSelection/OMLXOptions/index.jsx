import useProviderEndpointAutoDiscovery from "@/hooks/useProviderEndpointAutoDiscovery";
import System from "@/models/system";
import { OMLX_COMMON_URLS } from "@/utils/constants";
import { CaretDown, CaretUp, CircleNotch, Info } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import { Tooltip } from "react-tooltip";

export default function OMLXOptions({ settings }) {
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
    provider: "omlx",
    initialBasePath: settings?.OMLXLLMBasePath,
    ENDPOINTS: OMLX_COMMON_URLS,
  });

  const [contextWindowLimit, setContextWindowLimit] = useState(
    settings?.OMLXLLMTokenLimit ?? ""
  );
  return (
    <div className="w-full flex flex-col gap-y-7">
      <div className="w-full flex items-start gap-[36px] mt-1.5">
        <OMLXModelSelection
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
                    OMLX Base URL
                  </label>
                  <Info
                    size={18}
                    className="text-theme-text-secondary cursor-pointer"
                    data-tooltip-id="omlx-base-url"
                    data-tooltip-content="Enter the URL where OMLX is running."
                  />
                  <Tooltip
                    id="omlx-base-url"
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
                name="OMLXLLMBasePath"
                className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
                placeholder="http://127.0.0.1:8000"
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
                  data-tooltip-id="omlx-model-context-window"
                />
                <Tooltip
                  id="omlx-model-context-window"
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
                name="OMLXLLMTokenLimit"
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
                  Authentication Token
                </label>
                <Info
                  size={18}
                  className="text-theme-text-secondary cursor-pointer"
                  data-tooltip-id="omlx-authentication-token"
                />
                <Tooltip
                  id="omlx-authentication-token"
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
                    your OMLX server.
                    <br /> <br />
                  </p>
                </Tooltip>
              </div>
              <input
                type="password"
                name="OMLXLLMApiKey"
                className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg outline-none block w-full p-2.5 focus:outline-primary-button active:outline-primary-button"
                placeholder="OMLX API Key"
                defaultValue={settings?.OMLXLLMApiKey ? "*".repeat(20) : ""}
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

function OMLXModelSelection({ settings, basePath = null, authToken = null }) {
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
          "omlx",
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
          OMLX Model
        </label>
        <select
          name="OMLXLLMModelPref"
          disabled={true}
          className="border-none bg-theme-settings-input-bg border-gray-500 text-white text-sm rounded-lg block w-full p-2.5"
        >
          <option disabled={true} selected={true}>
            {!!basePath
              ? "--loading available models--"
              : "Enter OMLX URL first"}
          </option>
        </select>
        <p className="text-xs leading-[18px] font-base text-white text-opacity-60 mt-2">
          Select the OMLX model you want to use. Models will load after entering
          a valid OMLX URL.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-60">
      <label className="text-white text-sm font-semibold block mb-2">
        OMLX Model
      </label>
      <select
        name="OMLXLLMModelPref"
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
                  selected={settings.OMLXLLMModelPref === model.id}
                >
                  {model.id}
                </option>
              );
            })}
          </optgroup>
        )}
      </select>
      <p className="text-xs leading-[18px] font-base text-white text-opacity-60 mt-2">
        Choose the OMLX model you want to use for your conversations.
      </p>
    </div>
  );
}

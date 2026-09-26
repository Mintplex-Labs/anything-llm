import { CaretDown, CaretUp, CircleNotch, Info } from "@phosphor-icons/react";
import { Tooltip } from "react-tooltip";
import useProviderEndpointAutoDiscovery from "@/hooks/useProviderEndpointAutoDiscovery";
import { LLMMAN_COMMON_URLS } from "@/utils/constants";
import ImageModelSelection from "../ImageModelSelection";
import ImageDimensionSelection from "../ImageDimensionSelection";

export default function LlmmanImageOptions({ settings }) {
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
    provider: "llmman-imggen",
    initialBasePath: settings?.ImageGenerationLlmmanBasePath,
    initialAuthToken: settings?.ImageGenerationLlmmanAuthToken
      ? "*".repeat(20)
      : "",
    ENDPOINTS: LLMMAN_COMMON_URLS,
  });

  return (
    <div className="w-full flex flex-col gap-y-4">
      <div className="w-full flex items-start gap-[36px] mt-1.5">
        <ImageModelSelection
          provider="llmman-imggen"
          apiKey={authToken.value}
          basePath={basePath.value}
          settings={settings}
          endpointName="llmman URL"
        />
        <ImageDimensionSelection provider="llmman-imggen" settings={settings} />
      </div>
      <p className="text-xs leading-[18px] font-base text-white text-opacity-60">
        Only models that report image generation support will be listed.
      </p>
      <div className="flex justify-start">
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
        <div className="w-full flex items-start gap-4">
          <div className="flex flex-col w-60">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-1">
                <label className="text-white text-sm font-semibold">
                  llmman Base URL
                </label>
                <Info
                  size={18}
                  className="text-theme-text-secondary cursor-pointer"
                  data-tooltip-id="image-gen-llmman-base-url"
                  data-tooltip-content="Enter the URL where llmman is running."
                />
                <Tooltip
                  id="image-gen-llmman-base-url"
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
              name="ImageGenerationLlmmanBasePath"
              className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
              placeholder="http://127.0.0.1:17434"
              value={basePathValue.value || ""}
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
                data-tooltip-id="image-gen-llmman-auth-token"
              />
              <Tooltip
                id="image-gen-llmman-auth-token"
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
                  your llmman server.
                  <br /> <br />
                  Used <b>only</b> if running llmman behind an authentication
                  server.
                </p>
              </Tooltip>
            </div>
            <input
              type="password"
              name="ImageGenerationLlmmanAuthToken"
              className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg outline-none block w-full p-2.5 focus:outline-primary-button active:outline-primary-button"
              placeholder="llmman Auth Token"
              value={authTokenValue.value || ""}
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

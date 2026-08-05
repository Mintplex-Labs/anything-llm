import { CircleNotch, Info } from "@phosphor-icons/react";
import { Tooltip } from "react-tooltip";
import { Link } from "react-router-dom";
import useProviderEndpointAutoDiscovery from "@/hooks/useProviderEndpointAutoDiscovery";
import { LEMONADE_COMMON_URLS } from "@/utils/constants";
import { originOnly } from "@/utils/url";
import ImageModelSelection from "../ImageModelSelection";
import ImageDimensionSelection from "../ImageDimensionSelection";

export default function LemonadeImageOptions({ settings }) {
  const {
    autoDetecting: loading,
    basePath,
    basePathValue,
    authToken,
    authTokenValue,
    handleAutoDetectClick,
  } = useProviderEndpointAutoDiscovery({
    provider: "lemonade-imggen",
    initialBasePath: settings?.ImageGenerationLemonadeBasePath,
    initialAuthToken: settings?.ImageGenerationLemonadeApiKey
      ? "*".repeat(20)
      : "",
    ENDPOINTS: LEMONADE_COMMON_URLS,
    normalizeBasePath: originOnly,
  });

  return (
    <div className="w-full flex flex-col gap-y-4">
      <div className="w-full flex items-start gap-[36px] mt-1.5 flex-wrap">
        <div className="flex flex-col w-60">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-1">
              <label className="text-white text-sm font-semibold">
                Lemonade Base URL
              </label>
              <Info
                size={18}
                className="text-theme-text-secondary cursor-pointer"
                data-tooltip-id="image-gen-lemonade-base-url"
              />
              <Tooltip
                id="image-gen-lemonade-base-url"
                place="top"
                delayShow={300}
                delayHide={800}
                clickable={true}
                className="tooltip !text-xs !opacity-100 z-99"
                style={{
                  maxWidth: "250px",
                  whiteSpace: "normal",
                  wordWrap: "break-word",
                }}
              >
                Enter the URL where Lemonade is running.
                <br />
                <br />
                <Link
                  to="https://lemonade-server.ai/docs"
                  target="_blank"
                  className="text-blue-500 hover:underline"
                >
                  Learn more &rarr;
                </Link>
              </Tooltip>
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
            name="ImageGenerationLemonadeBasePath"
            className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
            placeholder="http://localhost:13305"
            value={basePathValue.value || ""}
            required={true}
            autoComplete="off"
            spellCheck={false}
            onChange={basePath.onChange}
            onBlur={basePath.onBlur}
          />
        </div>
        <div className="flex flex-col w-60">
          <label className="text-white text-sm font-semibold block mb-3">
            API Key <span className="text-white/40">(optional)</span>
          </label>
          <input
            type="password"
            name="ImageGenerationLemonadeApiKey"
            className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
            placeholder="Lemonade API Key"
            value={authTokenValue.value || ""}
            onChange={authToken.onChange}
            onBlur={authToken.onBlur}
            autoComplete="off"
            spellCheck={false}
          />
        </div>
        <ImageModelSelection
          provider="lemonade-imggen"
          apiKey={authToken.value}
          basePath={basePath.value}
          settings={settings}
          endpointName="Lemonade URL"
        />
        <ImageDimensionSelection
          provider="lemonade-imggen"
          settings={settings}
        />
      </div>
    </div>
  );
}

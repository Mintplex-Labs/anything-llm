import { useEffect, useState } from "react";
import System from "@/models/system";
import PreLoader from "@/components/Preloader";
import { KOBOLDCPP_COMMON_URLS } from "@/utils/constants";
import { CaretDown, CaretUp, Info } from "@phosphor-icons/react";
import useProviderEndpointAutoDiscovery from "@/hooks/useProviderEndpointAutoDiscovery";
import { Tooltip } from "react-tooltip";

export default function KoboldCPPOptions({ settings }) {
  const {
    autoDetecting: loading,
    basePath,
    basePathValue,
    showAdvancedControls,
    setShowAdvancedControls,
    handleAutoDetectClick,
  } = useProviderEndpointAutoDiscovery({
    provider: "koboldcpp",
    initialBasePath: settings?.KoboldCPPBasePath,
    ENDPOINTS: KOBOLDCPP_COMMON_URLS,
  });

  const [tokenLimit, setTokenLimit] = useState(
    settings?.KoboldCPPTokenLimit || ""
  );
  const [maxTokens, setMaxTokens] = useState(
    settings?.KoboldCPPMaxTokens || ""
  );

  const handleTokenLimitChange = (e) => {
    setTokenLimit(e.target.value ? Number(e.target.value) : "");
  };

  const handleMaxTokensChange = (e) => {
    setMaxTokens(e.target.value ? Number(e.target.value) : "");
  };

  return (
    <div className="w-full flex flex-col gap-y-7">
      <div className="w-full flex items-start gap-[36px] mt-1.5">
        <KoboldCPPModelSelection
          settings={settings}
          basePath={basePath.value}
        />
        <div className="flex flex-col w-60">
          <div className="flex items-center gap-x-1 mb-2">
            <label className="text-white text-sm font-semibold">
              Model context window
            </label>
            <Info
              size={18}
              className="text-theme-text-secondary cursor-pointer"
              data-tooltip-id="koboldcpp-context-window"
              data-tooltip-content="Override the context window limit. Leave empty to auto-detect from the server (defaults to 16384 if detection fails)."
            />
            <Tooltip
              id="koboldcpp-context-window"
              className="tooltip !text-xs !opacity-100"
              style={{
                maxWidth: "250px",
                whiteSpace: "normal",
                wordWrap: "break-word",
              }}
            />
          </div>
          <input
            type="number"
            name="KoboldCPPTokenLimit"
            className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
            placeholder="Automatically managed"
            min={1}
            value={tokenLimit}
            onChange={handleTokenLimitChange}
            onScroll={(e) => e.target.blur()}
            required={false}
            autoComplete="off"
          />
        </div>
        <div className="flex flex-col w-60">
          <div className="flex items-center gap-x-1 mb-2">
            <label className="text-white text-sm font-semibold">
              Max response tokens
            </label>
            <Info
              size={18}
              className="text-theme-text-secondary cursor-pointer"
              data-tooltip-id="koboldcpp-max-tokens"
              data-tooltip-content="Maximum number of tokens the model can generate in a single response. Leave empty to let the model use the full remaining context."
            />
            <Tooltip
              id="koboldcpp-max-tokens"
              className="tooltip !text-xs !opacity-100"
              style={{
                maxWidth: "250px",
                whiteSpace: "normal",
                wordWrap: "break-word",
              }}
            />
          </div>
          <input
            type="number"
            name="KoboldCPPMaxTokens"
            className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
            placeholder="2048"
            min={1}
            value={maxTokens}
            onChange={handleMaxTokensChange}
            onScroll={(e) => e.target.blur()}
            required={false}
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
          <div className="flex flex-col w-60">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-x-1">
                <label className="text-white text-sm font-semibold">
                  KoboldCPP Base URL
                </label>
                <Info
                  size={18}
                  className="text-theme-text-secondary cursor-pointer"
                  data-tooltip-id="koboldcpp-base-url"
                  data-tooltip-content="Enter the URL where KoboldCPP is running."
                />
                <Tooltip
                  id="koboldcpp-base-url"
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
                <PreLoader size="6" />
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
              name="KoboldCPPBasePath"
              className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
              placeholder="http://127.0.0.1:5001/v1"
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

function KoboldCPPModelSelection({ settings, basePath = null }) {
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
      try {
        const { models } = await System.customModels(
          "koboldcpp",
          null,
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
  }, [basePath]);

  if (loading || customModels.length === 0) {
    return (
      <div className="flex flex-col w-60">
        <div className="flex items-center gap-x-1 mb-2">
          <label className="text-white text-sm font-semibold">
            KoboldCPP Model
          </label>
        </div>
        <select
          name="KoboldCPPModelPref"
          disabled={true}
          className="border-none bg-theme-settings-input-bg border-gray-500 text-white text-sm rounded-lg block w-full p-2.5"
        >
          <option disabled={true} selected={true}>
            {basePath?.includes("/v1")
              ? "--loading available models--"
              : "Enter KoboldCPP URL first"}
          </option>
        </select>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-60">
      <div className="flex items-center gap-x-1 mb-2">
        <label className="text-white text-sm font-semibold">
          KoboldCPP Model
        </label>
      </div>
      <select
        name="KoboldCPPModelPref"
        required={true}
        className="border-none bg-theme-settings-input-bg border-gray-500 text-white text-sm rounded-lg block w-full p-2.5"
      >
        {customModels.map((model) => (
          <option
            key={model.id}
            value={model.id}
            selected={settings.KoboldCPPModelPref === model.id}
          >
            {model.id}
          </option>
        ))}
      </select>
    </div>
  );
}

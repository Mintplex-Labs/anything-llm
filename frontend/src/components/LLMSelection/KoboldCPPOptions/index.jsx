import { useEffect, useState } from "react";
import System from "@/models/system";
import PreLoader from "@/components/Preloader";
import { KOBOLDCPP_COMMON_URLS } from "@/utils/constants";
import { CaretDown, CaretUp } from "@phosphor-icons/react";
import useProviderEndpointAutoDiscovery from "@/hooks/useProviderEndpointAutoDiscovery";

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
    settings?.KoboldCPPTokenLimit || 4096
  );

  const handleTokenLimitChange = (e) => {
    setTokenLimit(Number(e.target.value));
  };

  return (
    <div className="w-full flex flex-col gap-y-7">
      <div className="w-full flex items-start gap-[36px] mt-1.5">
        <KoboldCPPModelSelection
          settings={settings}
          basePath={basePath.value}
        />
        <div className="flex flex-col w-60">
          <label className="text-white text-sm font-semibold block mb-2">
            Token context window
          </label>
          <input
            type="number"
            name="KoboldCPPTokenLimit"
            className="border-none bg-zinc-900 text-white placeholder:text-white/20 text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
            placeholder="4096"
            min={1}
            value={tokenLimit}
            onChange={handleTokenLimitChange}
            onScroll={(e) => e.target.blur()}
            required={true}
            autoComplete="off"
          />
          <p className="text-xs leading-[18px] font-base text-white text-opacity-60 mt-2">
            Maximum number of tokens for context and response.
          </p>
        </div>
      </div>
      <div className="flex justify-start mt-4">
        <button
          onClick={(e) => {
            e.preventDefault();
            setShowAdvancedControls(!showAdvancedControls);
          }}
          className="border-none text-white hover:text-white/70 flex items-center text-sm"
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
              <label className="text-white text-sm font-semibold">
                KoboldCPP Base URL
              </label>
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
              className="border-none bg-zinc-900 text-white placeholder:text-white/20 text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
              placeholder="http://127.0.0.1:5000/v1"
              value={basePathValue.value}
              required={true}
              autoComplete="off"
              spellCheck={false}
              onChange={basePath.onChange}
              onBlur={basePath.onBlur}
            />
            <p className="text-xs leading-[18px] font-base text-white text-opacity-60 mt-2">
              Enter the URL where KoboldCPP is running.
            </p>
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
        <label className="text-white text-sm font-semibold block mb-2">
          KoboldCPP Model
        </label>
        <select
          name="KoboldCPPModelPref"
          disabled={true}
          className="border-none bg-zinc-900 border-gray-500 text-white text-sm rounded-lg block w-full p-2.5"
        >
          <option disabled={true} selected={true}>
            {basePath?.includes("/v1")
              ? "--loading available models--"
              : "Enter KoboldCPP URL first"}
          </option>
        </select>
        <p className="text-xs leading-[18px] font-base text-white text-opacity-60 mt-2">
          Select the KoboldCPP model you want to use. Models will load after
          entering a valid KoboldCPP URL.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-60">
      <label className="text-white text-sm font-semibold block mb-2">
        KoboldCPP Model
      </label>
      <select
        name="KoboldCPPModelPref"
        required={true}
        className="border-none bg-zinc-900 border-gray-500 text-white text-sm rounded-lg block w-full p-2.5"
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
      <p className="text-xs leading-[18px] font-base text-white text-opacity-60 mt-2">
        Choose the KoboldCPP model you want to use for your conversations.
      </p>
    </div>
  );
}

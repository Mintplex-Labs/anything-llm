import { useState, useEffect } from "react";
import System from "@/models/system";
import PreLoader from "@/components/Preloader";
import { CaretDown, CaretUp } from "@phosphor-icons/react";
import useProviderEndpointAutoDiscovery from "@/hooks/useProviderEndpointAutoDiscovery";

export default function JanAiOptions({ settings }) {
  const [inputValue, setInputValue] = useState(settings?.JanAiApiKey);
  const [apiKey, setApiKey] = useState(settings?.JanAiApiKey);

  const {
    autoDetecting: loading,
    basePath,
    basePathValue,
    showAdvancedControls,
    setShowAdvancedControls,
    handleAutoDetectClick,
    runAutoDetect,
  } = useProviderEndpointAutoDiscovery({
    provider: "janai",
    initialBasePath: settings?.JanAiBasePath,
    initialAuthToken: apiKey,
    ENDPOINTS: ["http://127.0.0.1:1337/v1"],
  });

  // Only try auto-discover after API key is set
  useEffect(() => {
    if (apiKey && !basePathValue.value) {
      runAutoDetect();
    }
  }, [apiKey]);

  return (
    <div className="w-full flex flex-col gap-y-7">
      <div className="flex gap-[36px] mt-1.5">
        <div className="flex flex-col w-60">
          <label className="text-white text-sm font-semibold block mb-3">
            API Key
          </label>
          <input
            type="password"
            name="JanAiApiKey"
            className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
            placeholder="Jan AI API Key"
            defaultValue={settings?.JanAiApiKey ? "*".repeat(20) : ""}
            required={true}
            autoComplete="off"
            spellCheck={false}
            onChange={(e) => setInputValue(e.target.value)}
            onBlur={() => setApiKey(inputValue)}
          />
        </div>
        {!settings?.credentialsOnly && (
          <JanAiModelSelection settings={settings} apiKey={apiKey} basePath={basePath.value} />
        )}
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
              <label className="text-white text-sm font-semibold">
                Jan AI Base URL
              </label>
              {loading ? (
                <PreLoader size="6" />
              ) : (
                <>
                  {!basePathValue.value && apiKey && (
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
              name="JanAiBasePath"
              className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
              placeholder="http://127.0.0.1:1337/v1"
              value={basePathValue.value}
              required={true}
              autoComplete="off"
              spellCheck={false}
              onChange={basePath.onChange}
              onBlur={basePath.onBlur}
            />
            <p className="text-xs leading-[18px] font-base text-white text-opacity-60 mt-2">
              Enter the URL where Jan AI is running.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function JanAiModelSelection({ apiKey, settings, basePath }) {
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedModel, setSelectedModel] = useState(settings?.JanAiModelPref || '');

  useEffect(() => {
    async function findCustomModels() {
      if (!apiKey || !basePath) {
        setModels([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const { models } = await System.customModels("janai", apiKey, basePath);
        setModels(models || []);

        // If no model is selected and we have models, select the first one
        if (!selectedModel && models?.length > 0) {
          setSelectedModel(models[0].id);
        }
      } catch (error) {
        console.error("Failed to fetch custom models:", error);
        setModels([]);
      } finally {
        setLoading(false);
      }
    }
    findCustomModels();
  }, [apiKey, basePath]);

  if (!apiKey || !basePath) {
    return (
      <div className="flex flex-col w-60">
        <label className="text-white text-sm font-semibold block mb-3">
          Chat Model Selection
        </label>
        <select
          name="JanAiModelPref"
          disabled={true}
          className="border-none bg-theme-settings-input-bg border-gray-500 text-white text-sm rounded-lg block w-full p-2.5"
        >
          <option disabled={true} selected={true}>
            -- Enter API key and Base URL --
          </option>
        </select>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col w-60">
        <label className="text-white text-sm font-semibold block mb-3">
          Chat Model Selection
        </label>
        <select
          name="JanAiModelPref"
          disabled={true}
          className="border-none bg-theme-settings-input-bg border-gray-500 text-white text-sm rounded-lg block w-full p-2.5"
        >
          <option disabled={true} selected={true}>
            -- loading available models --
          </option>
        </select>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-60">
      <label className="text-white text-sm font-semibold block mb-3">
        Chat Model Selection
      </label>
      <select
        name="JanAiModelPref"
        required={true}
        value={selectedModel}
        onChange={(e) => setSelectedModel(e.target.value)}
        className="border-none bg-theme-settings-input-bg border-gray-500 text-white text-sm rounded-lg block w-full p-2.5"
      >
        {models.map((model) => (
          <option key={model.id} value={model.id}>
            {model.id}
          </option>
        ))}
      </select>
    </div>
  );
}
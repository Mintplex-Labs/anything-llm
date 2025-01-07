import System from "@/models/system";
import { CaretDown, CaretUp } from "@phosphor-icons/react";
import { useState, useEffect } from "react";

export default function OpenRouterOptions({ settings }) {
  return (
    <div className="flex flex-col gap-y-4 mt-1.5">
      <div className="flex gap-[36px]">
        <div className="flex flex-col w-60">
          <label className="text-white text-sm font-semibold block mb-3">
            OpenRouter API Key
          </label>
          <input
            type="password"
            name="OpenRouterApiKey"
            className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
            placeholder="OpenRouter API Key"
            defaultValue={settings?.OpenRouterApiKey ? "*".repeat(20) : ""}
            required={true}
            autoComplete="off"
            spellCheck={false}
          />
        </div>
        {!settings?.credentialsOnly && (
          <OpenRouterModelSelection settings={settings} />
        )}
      </div>
      <AdvancedControls settings={settings} />
    </div>
  );
}

function AdvancedControls({ settings }) {
  const [showAdvancedControls, setShowAdvancedControls] = useState(false);

  return (
    <div className="flex flex-col gap-y-4">
      <button
        type="button"
        onClick={() => setShowAdvancedControls(!showAdvancedControls)}
        className="border-none text-white hover:text-white/70 flex items-center text-sm"
      >
        {showAdvancedControls ? "Hide" : "Show"} advanced controls
        {showAdvancedControls ? (
          <CaretUp size={14} className="ml-1" />
        ) : (
          <CaretDown size={14} className="ml-1" />
        )}
      </button>
      <div hidden={!showAdvancedControls}>
        <div className="flex flex-col w-60">
          <label className="text-white text-sm font-semibold block mb-3">
            Stream Timeout (ms)
          </label>
          <input
            type="number"
            name="OpenRouterTimeout"
            className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
            placeholder="Timeout value between token responses to auto-timeout the stream"
            defaultValue={settings?.OpenRouterTimeout ?? 500}
            autoComplete="off"
            onScroll={(e) => e.target.blur()}
            min={500}
            step={1}
          />
        </div>
      </div>
    </div>
  );
}

function OpenRouterModelSelection({ settings }) {
  const [groupedModels, setGroupedModels] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function findCustomModels() {
      setLoading(true);
      const { models } = await System.customModels("openrouter");
      if (models?.length > 0) {
        const modelsByOrganization = models.reduce((acc, model) => {
          acc[model.organization] = acc[model.organization] || [];
          acc[model.organization].push(model);
          return acc;
        }, {});

        setGroupedModels(modelsByOrganization);
      }

      setLoading(false);
    }
    findCustomModels();
  }, []);

  if (loading || Object.keys(groupedModels).length === 0) {
    return (
      <div className="flex flex-col w-60">
        <label className="text-white text-sm font-semibold block mb-3">
          Chat Model Selection
        </label>
        <select
          name="OpenRouterModelPref"
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
        name="OpenRouterModelPref"
        required={true}
        className="border-none bg-theme-settings-input-bg border-gray-500 text-white text-sm rounded-lg block w-full p-2.5"
      >
        {Object.keys(groupedModels)
          .sort()
          .map((organization) => (
            <optgroup key={organization} label={organization}>
              {groupedModels[organization].map((model) => (
                <option
                  key={model.id}
                  value={model.id}
                  selected={settings?.OpenRouterModelPref === model.id}
                >
                  {model.name}
                </option>
              ))}
            </optgroup>
          ))}
      </select>
    </div>
  );
}

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
        <div className="flex flex-wrap gap-4">
          <div className="flex flex-col w-60">
            <label className="text-white text-sm font-semibold block mb-3">
              Stream Timeout (ms)
            </label>
            <input
              type="number"
              name="OpenRouterTimeout"
              className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
              placeholder="Timeout value between token responses to auto-timeout the stream"
              defaultValue={settings?.OpenRouterTimeout ?? 3_000}
              autoComplete="off"
              onScroll={(e) => e.target.blur()}
              min={500}
              step={1}
            />
          </div>
          <div className="flex flex-col w-60">
            <label className="text-white text-sm font-semibold block mb-3">
              Max Tokens
            </label>
            <input
              type="number"
              name="OpenRouterMaxTokens"
              className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
              placeholder="Provider default"
              defaultValue={settings?.OpenRouterMaxTokens || ""}
              autoComplete="off"
              onScroll={(e) => e.target.blur()}
              min={1}
              step={1}
            />
          </div>
          <div className="flex flex-col w-60">
            <label className="text-white text-sm font-semibold block mb-3">
              Top P
            </label>
            <input
              type="number"
              name="OpenRouterTopP"
              className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
              placeholder="0 to 1 (provider default)"
              defaultValue={settings?.OpenRouterTopP || ""}
              autoComplete="off"
              onScroll={(e) => e.target.blur()}
              min={0}
              max={1}
              step={0.01}
            />
          </div>
          <div className="flex flex-col w-60">
            <label className="text-white text-sm font-semibold block mb-3">
              Top K
            </label>
            <input
              type="number"
              name="OpenRouterTopK"
              className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
              placeholder="Provider default"
              defaultValue={settings?.OpenRouterTopK || ""}
              autoComplete="off"
              onScroll={(e) => e.target.blur()}
              min={0}
              step={1}
            />
          </div>
          <div className="flex flex-col w-60">
            <label className="text-white text-sm font-semibold block mb-3">
              Min P
            </label>
            <input
              type="number"
              name="OpenRouterMinP"
              className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
              placeholder="0 to 1 (provider default)"
              defaultValue={settings?.OpenRouterMinP || ""}
              autoComplete="off"
              onScroll={(e) => e.target.blur()}
              min={0}
              max={1}
              step={0.01}
            />
          </div>
          <div className="flex flex-col w-60">
            <label className="text-white text-sm font-semibold block mb-3">
              Frequency Penalty
            </label>
            <input
              type="number"
              name="OpenRouterFrequencyPenalty"
              className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
              placeholder="-2 to 2 (provider default)"
              defaultValue={settings?.OpenRouterFrequencyPenalty || ""}
              autoComplete="off"
              onScroll={(e) => e.target.blur()}
              min={-2}
              max={2}
              step={0.01}
            />
          </div>
          <div className="flex flex-col w-60">
            <label className="text-white text-sm font-semibold block mb-3">
              Presence Penalty
            </label>
            <input
              type="number"
              name="OpenRouterPresencePenalty"
              className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
              placeholder="-2 to 2 (provider default)"
              defaultValue={settings?.OpenRouterPresencePenalty || ""}
              autoComplete="off"
              onScroll={(e) => e.target.blur()}
              min={-2}
              max={2}
              step={0.01}
            />
          </div>
          <div className="flex flex-col w-60">
            <label className="text-white text-sm font-semibold block mb-3">
              Repetition Penalty
            </label>
            <input
              type="number"
              name="OpenRouterRepetitionPenalty"
              className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
              placeholder="0 to 2 (provider default)"
              defaultValue={settings?.OpenRouterRepetitionPenalty || ""}
              autoComplete="off"
              onScroll={(e) => e.target.blur()}
              min={0}
              max={2}
              step={0.01}
            />
          </div>
          <div className="flex flex-col w-60">
            <label className="text-white text-sm font-semibold block mb-3">
              Top A
            </label>
            <input
              type="number"
              name="OpenRouterTopA"
              className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
              placeholder="0 to 1 (provider default)"
              defaultValue={settings?.OpenRouterTopA || ""}
              autoComplete="off"
              onScroll={(e) => e.target.blur()}
              min={0}
              max={1}
              step={0.01}
            />
          </div>
          <div className="flex flex-col w-60">
            <label className="text-white text-sm font-semibold block mb-3">
              Seed
            </label>
            <input
              type="number"
              name="OpenRouterSeed"
              className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
              placeholder="Provider default"
              defaultValue={settings?.OpenRouterSeed || ""}
              autoComplete="off"
              onScroll={(e) => e.target.blur()}
              step={1}
            />
          </div>
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

import System from "@/models/system";
import { CaretDown, CaretUp, Info } from "@phosphor-icons/react";
import { useState, useEffect } from "react";
import { Tooltip } from "react-tooltip";

export default function OpenRouterOptions({ settings }) {
  const [selectedModel, setSelectedModel] = useState(null);

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
          <>
            <OpenRouterModelSelection
              settings={settings}
              onModelChange={setSelectedModel}
            />
            <ServiceTierSelection settings={settings} model={selectedModel} />
          </>
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
            defaultValue={settings?.OpenRouterTimeout ?? 3_000}
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

function OpenRouterModelSelection({ settings, onModelChange }) {
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

        // Mirror what the <select> will show: the saved preference, or the first
        // option when the preference is no longer in the catalog.
        const firstOrganization = Object.keys(modelsByOrganization).sort()[0];
        const selected = models.some(
          (model) => model.id === settings?.OpenRouterModelPref
        )
          ? settings.OpenRouterModelPref
          : modelsByOrganization[firstOrganization][0].id;
        onModelChange(selected);
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
        onChange={(e) => onModelChange(e.target.value)}
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

function ServiceTierSelection({ settings, model }) {
  const [tiers, setTiers] = useState([]);

  useEffect(() => {
    if (!model) return;
    let stale = false;
    System.openRouterServiceTiers(model).then((tiers) => {
      if (!stale) setTiers(tiers);
    });
    return () => {
      stale = true;
    };
  }, [model]);

  // Keeps a stale tier from silently carrying over to a model that gains tier support later.
  if (tiers.length === 0)
    return <input type="hidden" name="OpenRouterServiceTier" value="default" />;

  return (
    <div className="flex flex-col w-60">
      <div className="flex items-center gap-1 mb-3">
        <label className="text-white text-sm font-semibold block">
          Service Tier
        </label>
        <Tooltip
          id="openrouter-service-tier"
          place="top"
          delayShow={300}
          className="tooltip !text-xs !opacity-100"
          style={{
            maxWidth: "250px",
            whiteSpace: "normal",
            wordWrap: "break-word",
          }}
        />
        <div
          type="button"
          className="text-theme-text-secondary cursor-pointer hover:bg-theme-bg-primary flex items-center justify-center rounded-full"
          data-tooltip-id="openrouter-service-tier"
          data-tooltip-place="top"
          data-tooltip-content="Flex never falls back to the default tier, so requests can fail when flex capacity is exhausted."
        >
          <Info size={18} className="text-theme-text-secondary" />
        </div>
      </div>
      <select
        name="OpenRouterServiceTier"
        defaultValue={settings?.OpenRouterServiceTier ?? "default"}
        className="border-none bg-theme-settings-input-bg border-gray-500 text-white text-sm rounded-lg block w-full p-2.5"
      >
        <option value="default">Default</option>
        {tiers.includes("flex") && (
          <option value="flex">Flex (cheaper, slower)</option>
        )}
        {tiers.includes("priority") && (
          <option value="priority">Priority (faster, pricier)</option>
        )}
      </select>
    </div>
  );
}

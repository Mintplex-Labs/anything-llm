import System from "@/models/system";
import { useState, useEffect } from "react";

export default function SubModelLLMOptions({ settings }) {
  return (
    <div className="w-full flex flex-col gap-y-7">
      <div className="w-full flex items-start gap-[36px] mt-1.5">
        <div className="flex flex-col w-60">
          <label className="text-theme-text-primary text-sm font-semibold block mb-3">
            SubModel Instagen Access Key
          </label>
          <input
            type="password"
            name="SubModelLLMAccessKey"
            className="border-none bg-theme-settings-input-bg text-theme-text-primary placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
            placeholder="SubModel Instagen Access Key"
            defaultValue={settings?.SubModelLLMAccessKey ? "*".repeat(20) : ""}
            required={true}
            autoComplete="off"
            spellCheck={false}
          />
        </div>
        {!settings?.credentialsOnly && (
          <SubModelModelSelection settings={settings} />
        )}
      </div>
    </div>
  );
}

function SubModelModelSelection({ settings }) {
  const [groupedModels, setGroupedModels] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedModelId, setSelectedModelId] = useState(settings?.SubModelModelPref);

  useEffect(() => {
    async function fetchModels() {
      setLoading(true);
      const { models } = await System.customModels("submodel");
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
    fetchModels();
  }, []);

  // Update selected model when settings change
  useEffect(() => {
    setSelectedModelId(settings?.SubModelModelPref);
  }, [settings?.SubModelModelPref]);

  if (loading || Object.keys(groupedModels).length === 0) {
    return (
      <div className="flex flex-col w-60">
        <label className="text-theme-text-primary text-sm font-semibold block mb-3">
          Chat Model Selection
        </label>
        <select
          name="SubModelModelPref"
          required={true}
          disabled={true}
          className="bg-theme-settings-input-bg text-theme-text-primary text-sm rounded-lg focus:ring-primary-button focus:border-primary-button block w-full p-2.5"
        >
          <option disabled={true} selected={true}>
            -- loading available models --
          </option>
        </select>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <label className="text-theme-text-primary text-sm font-semibold block mb-3">
        Chat Model Selection
      </label>
      <select
        name="SubModelModelPref"
        required={true}
        value={selectedModelId || ""}
        onChange={(e) => setSelectedModelId(e.target.value)}
        className="border-none bg-theme-settings-input-bg text-theme-text-primary border-theme-border text-sm rounded-lg block w-full p-2.5"
      >
        {Object.keys(groupedModels)
          .sort()
          .map((organization) => (
            <optgroup key={organization} label={organization}>
              {groupedModels[organization].map((model) => (
                <option
                  key={model.id}
                  value={model.id}
                >
                  {model.name}
                </option>
              ))}
            </optgroup>
          ))}
      </select>
      
      <FreeQuotaInfo 
        groupedModels={groupedModels} 
        selectedModelId={selectedModelId} 
      />

    </div>
  );
}

function FreeQuotaInfo({ groupedModels, selectedModelId }) {
  // Find the currently selected model
  const selectedModel = Object.values(groupedModels)
    .flat()
    .find(model => model.id === selectedModelId);
  
  // Only show models with free_quota structure
  if (!selectedModel?.free_quota) {
    return null;
  }

  return (
    <div className="mt-4 p-4 bg-theme-bg-secondary rounded-lg border border-theme-modal-border">
      <div className="flex items-center gap-x-2 mb-3">
        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
        <h4 className="text-theme-text-primary text-xs font-semibold">
          Free Quota Available
        </h4>
      </div>
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-theme-text-secondary text-xs">
            Daily Tokens:
          </span>
          <span className="text-theme-text-primary text-xs font-medium">
            {selectedModel.free_quota.day_token?.toLocaleString() || 'N/A'}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-theme-text-secondary text-xs">
            Daily Requests:
          </span>
          <span className="text-theme-text-primary text-xs font-medium">
            {selectedModel.free_quota.day_request?.toLocaleString() || 'N/A'}
          </span>
        </div>
      </div>
    </div>
  );
}

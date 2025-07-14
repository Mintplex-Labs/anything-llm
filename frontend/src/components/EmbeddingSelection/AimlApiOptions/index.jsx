import { useState, useEffect } from "react";
import System from "@/models/system";

export default function AimlApiOptions({ settings }) {
  const [inputValue, setInputValue] = useState(settings?.AimlApiKey);
  const [apiKey, setApiKey] = useState(settings?.AimlApiKey);

  return (
    <div className="w-full flex flex-col gap-y-4">
      <div className="w-full flex items-center gap-[36px] mt-1.5">
        <div className="flex flex-col w-60">
          <label className="text-white text-sm font-semibold block mb-3">
            API Key
          </label>
          <input
            type="password"
            name="AimlApiKey"
            className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
            placeholder="AI/ML API Key"
            defaultValue={settings?.AimlApiKey ? "*".repeat(20) : ""}
            required={true}
            autoComplete="off"
            spellCheck={false}
            onChange={(e) => setInputValue(e.target.value)}
            onBlur={() => setApiKey(inputValue)}
          />
        </div>
        <AimlApiEmbeddingModelSelection apiKey={apiKey} settings={settings} />
      </div>
    </div>
  );
}

function AimlApiEmbeddingModelSelection({ apiKey, settings }) {
  const [groupedModels, setGroupedModels] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function findModels() {
      if (!apiKey) {
        setGroupedModels({});
        setLoading(true);
        return;
      }
      setLoading(true);
      const { models } = await System.customModels(
        "aimlapi-embed",
        typeof apiKey === "boolean" ? null : apiKey
      );
      if (models?.length > 0) {
        const byDev = models.reduce((acc, model) => {
          acc[model.organization] = acc[model.organization] || [];
          acc[model.organization].push(model);
          return acc;
        }, {});
        setGroupedModels(byDev);
      }
      setLoading(false);
    }
    findModels();
  }, [apiKey]);

  if (loading || Object.keys(groupedModels).length === 0) {
    return (
      <div className="flex flex-col w-60">
        <label className="text-white text-sm font-semibold block mb-3">
          Model Preference
        </label>
        <select
          name="EmbeddingModelPref"
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
        Model Preference
      </label>
      <select
        name="EmbeddingModelPref"
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
                  selected={settings?.EmbeddingModelPref === model.id}
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

import { useState, useEffect } from "react";
import System from "@/models/system";

export default function BurnCloudOptions({ settings }) {
  const [inputValue, setInputValue] = useState(settings?.BurnCloudApiKey);
  const [burnCloudApiKey, setBurnCloudApiKey] = useState(
    settings?.BurnCloudApiKey
  );

  return (
    <div className="w-full flex flex-col">
      <div className="w-full flex items-center gap-[36px] mt-1.5">
        <div className="flex flex-col w-60">
          <label className="text-white text-sm font-semibold block mb-3">
            BurnCloud API Key
          </label>
          <input
            type="password"
            name="BurnCloudApiKey"
            className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
            placeholder="BurnCloud API Key"
            defaultValue={settings?.BurnCloudApiKey ? "*".repeat(20) : ""}
            required={true}
            autoComplete="off"
            spellCheck={false}
            onChange={(e) => setInputValue(e.target.value)}
            onBlur={() => setBurnCloudApiKey(inputValue)}
          />
        </div>

        <div className="flex flex-col w-60">
          <label className="text-white text-sm font-semibold block mb-3">
            BurnCloud Base URL
          </label>
          <input
            type="url"
            name="BurnCloudBaseUrl"
            className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
            placeholder="https://ai.burncloud.com/v1"
            defaultValue={
              settings?.BurnCloudBaseUrl || "https://ai.burncloud.com/v1"
            }
            autoComplete="off"
            spellCheck={false}
          />
        </div>

        {!settings?.credentialsOnly && (
          <BurnCloudModelSelection
            apiKey={burnCloudApiKey}
            settings={settings}
          />
        )}
      </div>
    </div>
  );
}

const DEFAULT_MODELS = [
  // Claude Models
  {
    id: "claude-sonnet-4-20250514",
    name: "Claude Sonnet 4",
  },
  {
    id: "claude-3-7-sonnet-20250219",
    name: "Claude 3.7 Sonnet",
  },
  {
    id: "claude-3-5-sonnet-20241022",
    name: "Claude 3.5 Sonnet",
  },
  // GPT Models
  {
    id: "gpt-4o",
    name: "GPT-4o",
  },
  {
    id: "gpt-4o-mini",
    name: "GPT-4o Mini",
  },
  {
    id: "o1",
    name: "GPT-o1",
  },
  {
    id: "gpt-4.5-preview",
    name: "GPT-4.5 Preview",
  },
  {
    id: "o1-mini",
    name: "GPT-o1 Mini",
  },
  {
    id: "gpt-image-1",
    name: "GPT Image 1",
  },
  // Gemini Models
  {
    id: "gemini-2.5-pro-preview-05-06",
    name: "Gemini 2.5 Pro Preview",
  },
  // DeepSeek Models
  {
    id: "deepseek-r1",
    name: "DeepSeek R1",
  },
  {
    id: "deepseek-v3",
    name: "DeepSeek V3",
  },
];

function BurnCloudModelSelection({ apiKey, settings }) {
  const [models, setModels] = useState(DEFAULT_MODELS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function findCustomModels() {
      setLoading(true);
      const { models } = await System.customModels(
        "burncloud",
        typeof apiKey === "boolean" ? null : apiKey
      );
      if (models.length > 0) setModels(models);
      setLoading(false);
    }
    findCustomModels();
  }, [apiKey]);

  if (loading) {
    return (
      <div className="flex flex-col w-60">
        <label className="text-white text-sm font-semibold block mb-3">
          Chat Model Selection
        </label>
        <select
          name="BurnCloudModelPref"
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
        name="BurnCloudModelPref"
        required={true}
        className="border-none bg-theme-settings-input-bg border-gray-500 text-white text-sm rounded-lg block w-full p-2.5"
      >
        {models.map((model) => (
          <option
            key={model.id}
            value={model.id}
            selected={settings?.BurnCloudModelPref === model.id}
          >
            {model.name}
          </option>
        ))}
      </select>
    </div>
  );
}

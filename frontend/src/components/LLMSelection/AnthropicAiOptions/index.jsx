import { useState, useEffect } from "react";
import System from "@/models/system";
import { CaretDown, CaretUp } from "@phosphor-icons/react";

export default function AnthropicAiOptions({ settings }) {
  const [showAdvancedControls, setShowAdvancedControls] = useState(false);
  const [inputValue, setInputValue] = useState(settings?.AnthropicApiKey);
  const [anthropicApiKey, setAnthropicApiKey] = useState(
    settings?.AnthropicApiKey
  );

  return (
    <div className="w-full flex flex-col">
      <div className="w-full flex items-center gap-[36px] mt-1.5">
        <div className="flex flex-col w-60">
          <label className="text-white text-sm font-semibold block mb-3">
            Anthropic API Key
          </label>
          <input
            type="password"
            name="AnthropicApiKey"
            className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
            placeholder="Anthropic Claude-2 API Key"
            defaultValue={settings?.AnthropicApiKey ? "*".repeat(20) : ""}
            required={true}
            autoComplete="off"
            spellCheck={false}
            onChange={(e) => setInputValue(e.target.value)}
            onBlur={() => setAnthropicApiKey(inputValue)}
          />
        </div>
        {!settings?.credentialsOnly && (
          <AnthropicModelSelection
            apiKey={anthropicApiKey}
            settings={settings}
          />
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
          {showAdvancedControls ? "Hide" : "Show"} advanced settings
          {showAdvancedControls ? (
            <CaretUp size={14} className="ml-1" />
          ) : (
            <CaretDown size={14} className="ml-1" />
          )}
        </button>
      </div>
      <div hidden={!showAdvancedControls}>
        <div className="w-full flex items-start gap-4 mt-1.5">
          <div className="flex flex-col w-60">
            <div className="flex justify-between items-center mb-2">
              <label className="text-white text-sm font-semibold">
                Prompt Caching
              </label>
            </div>
            <select
              name="AnthropicCacheControl"
              className="border-none bg-theme-settings-input-bg border-gray-500 text-white text-sm rounded-lg block w-full p-2.5"
            >
              <option
                value="none"
                selected={settings?.AnthropicCacheControl === "none"}
              >
                No caching
              </option>
              <option
                value="5m"
                selected={settings?.AnthropicCacheControl === "5m"}
              >
                5 minutes
              </option>
              <option
                value="1h"
                selected={settings?.AnthropicCacheControl === "1h"}
              >
                1 hour
              </option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}

const DEFAULT_MODELS = [
  {
    id: "claude-3-7-sonnet-20250219",
    name: "Claude 3.7 Sonnet",
  },
  {
    id: "claude-3-5-sonnet-20241022",
    name: "Claude 3.5 Sonnet (New)",
  },
  {
    id: "claude-3-5-haiku-20241022",
    name: "Claude 3.5 Haiku",
  },
  {
    id: "claude-3-5-sonnet-20240620",
    name: "Claude 3.5 Sonnet (Old)",
  },
  {
    id: "claude-3-haiku-20240307",
    name: "Claude 3 Haiku",
  },
  {
    id: "claude-3-opus-20240229",
    name: "Claude 3 Opus",
  },
  {
    id: "claude-3-sonnet-20240229",
    name: "Claude 3 Sonnet",
  },
  {
    id: "claude-2.1",
    name: "Claude 2.1",
  },
  {
    id: "claude-2.0",
    name: "Claude 2.0",
  },
];

function AnthropicModelSelection({ apiKey, settings }) {
  const [models, setModels] = useState(DEFAULT_MODELS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function findCustomModels() {
      setLoading(true);
      const { models } = await System.customModels(
        "anthropic",
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
          name="AnthropicModelPref"
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
        name="AnthropicModelPref"
        required={true}
        className="border-none bg-theme-settings-input-bg border-gray-500 text-white text-sm rounded-lg block w-full p-2.5"
      >
        {models.map((model) => (
          <option
            key={model.id}
            value={model.id}
            selected={settings?.AnthropicModelPref === model.id}
          >
            {model.name}
          </option>
        ))}
      </select>
    </div>
  );
}

import { useState, useEffect } from "react";
import System from "@/models/system";

export default function CerebrasLLMOptions({ settings }) {
  const [inputValue, setInputValue] = useState(settings?.CerebrasApiKey);
  const [apiKey, setApiKey] = useState(settings?.CerebrasApiKey);

  return (
    <div className="flex gap-[36px] mt-1.5">
      <div className="flex flex-col w-60">
        <label className="text-white text-sm font-semibold block mb-3">
          Cerebras API Key
        </label>
        <input
          type="password"
          name="CerebrasApiKey"
          className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
          placeholder="Cerebras API Key"
          defaultValue={settings?.CerebrasApiKey ? "*".repeat(20) : ""}
          required={true}
          autoComplete="off"
          spellCheck={false}
          onChange={(e) => setInputValue(e.target.value)}
          onBlur={() => setApiKey(inputValue)}
        />
      </div>

      {!settings?.credentialsOnly && (
        <CerebrasModelSelection settings={settings} apiKey={apiKey} />
      )}
    </div>
  );
}

/**
 * Cerebras model selection component
 * @param {Object} props - The component props
 * @param {string} props.apiKey - The Cerebras API key (not used since we only need public models for now)
 * @param {Object} props.settings - The system settings
 * @returns {JSX.Element} The Cerebras model selection component
 */
function CerebrasModelSelection({ apiKey: _apiKey, settings }) {
  const [customModels, setCustomModels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function findCustomModels() {
      try {
        setLoading(true);
        const { models } = await System.customModels("cerebras");
        setCustomModels(models || []);
      } catch (error) {
        console.error("Failed to fetch custom models:", error);
        setCustomModels([]);
      } finally {
        setLoading(false);
      }
    }
    findCustomModels();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col w-60">
        <label className="text-white text-sm font-semibold block mb-3">
          Chat Model Selection
        </label>
        <select
          name="CerebrasModelPref"
          disabled={true}
          className="border-none bg-theme-settings-input-bg border-gray-500 text-white text-sm rounded-lg block w-full p-2.5"
        >
          <option disabled={true} selected={true}>
            --loading available models--
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
        name="CerebrasModelPref"
        required={true}
        className="border-none bg-theme-settings-input-bg border-gray-500 text-white text-sm rounded-lg block w-full p-2.5"
      >
        {customModels.length > 0 && (
          <optgroup label="Available models">
            {customModels.map((model) => {
              return (
                <option
                  key={model.id}
                  value={model.id}
                  selected={settings?.CerebrasModelPref === model.id}
                >
                  {model.name}
                </option>
              );
            })}
          </optgroup>
        )}
      </select>
    </div>
  );
}

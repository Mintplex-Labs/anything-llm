import System from "@/models/system";
import { useEffect, useState } from "react";

export default function GeminiLLMOptions({ settings }) {
  const [inputValue, setInputValue] = useState(settings?.GeminiLLMApiKey);
  const [geminiApiKey, setGeminiApiKey] = useState(settings?.GeminiLLMApiKey);

  return (
    <div className="w-full flex flex-col">
      <div className="w-full flex items-center gap-[36px] mt-1.5">
        <div className="flex flex-col w-60">
          <label className="text-white text-sm font-semibold block mb-3">
            Google AI API Key
          </label>
          <input
            type="password"
            name="GeminiLLMApiKey"
            className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
            placeholder="Google Gemini API Key"
            defaultValue={settings?.GeminiLLMApiKey ? "*".repeat(20) : ""}
            required={true}
            autoComplete="off"
            spellCheck={false}
            onChange={(e) => setInputValue(e.target.value)}
            onBlur={() => setGeminiApiKey(inputValue)}
          />
        </div>

        {!settings?.credentialsOnly && (
          <>
            <GeminiModelSelection apiKey={geminiApiKey} settings={settings} />
            {/* 
            
            Safety setting is not supported for Gemini yet due to the openai compatible Gemini API.
            We are not using the generativeAPI endpoint and therefore cannot set the safety threshold.

            <div className="flex flex-col w-60">
              <label className="text-white text-sm font-semibold block mb-3">
                Safety Setting
              </label>
              <select
                name="GeminiSafetySetting"
                defaultValue={
                  settings?.GeminiSafetySetting || "BLOCK_MEDIUM_AND_ABOVE"
                }
                required={true}
                className="border-none bg-theme-settings-input-bg border-gray-500 text-white text-sm rounded-lg block w-full p-2.5"
              >
                <option value="BLOCK_NONE">None</option>
                <option value="BLOCK_ONLY_HIGH">Block few</option>
                <option value="BLOCK_MEDIUM_AND_ABOVE">
                  Block some (default)
                </option>
                <option value="BLOCK_LOW_AND_ABOVE">Block most</option>
              </select>
            </div> */}
          </>
        )}
      </div>
    </div>
  );
}

function GeminiModelSelection({ apiKey, settings }) {
  const [groupedModels, setGroupedModels] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function findCustomModels() {
      setLoading(true);
      const { models } = await System.customModels("gemini", apiKey);

      if (models?.length > 0) {
        const modelsByOrganization = models.reduce((acc, model) => {
          acc[model.experimental ? "Experimental" : "Stable"] =
            acc[model.experimental ? "Experimental" : "Stable"] || [];
          acc[model.experimental ? "Experimental" : "Stable"].push(model);
          return acc;
        }, {});
        setGroupedModels(modelsByOrganization);
      }
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
          name="GeminiLLMModelPref"
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
        name="GeminiLLMModelPref"
        required={true}
        className="border-none bg-theme-settings-input-bg border-gray-500 text-white text-sm rounded-lg block w-full p-2.5"
      >
        {Object.keys(groupedModels)
          .sort((a, b) => {
            if (a === "Stable") return -1;
            if (b === "Stable") return 1;
            return a.localeCompare(b);
          })
          .map((organization) => (
            <optgroup key={organization} label={organization}>
              {groupedModels[organization].map((model) => (
                <option
                  key={model.id}
                  value={model.id}
                  selected={settings?.GeminiLLMModelPref === model.id}
                >
                  {model.id}
                </option>
              ))}
            </optgroup>
          ))}
      </select>
    </div>
  );
}

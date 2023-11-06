import { useState, useEffect } from "react";
import System from "../../../models/system";

export default function OpenAiOptions({ settings }) {
  const [inputValue, setInputValue] = useState(settings?.OpenAiKey);
  const [openAIKey, setOpenAIKey] = useState(settings?.OpenAiKey);
  function updateOpenAiKey() {
    setOpenAIKey(inputValue);
  }

  return (
    <>
      <div className="flex flex-col w-60">
        <label className="text-white text-sm font-semibold block mb-4">
          API Key
        </label>
        <input
          type="password"
          name="OpenAiKey"
          className="bg-zinc-900 text-white placeholder-white placeholder-opacity-60 text-sm rounded-lg focus:border-white block w-full p-2.5"
          placeholder="OpenAI API Key"
          defaultValue={settings?.OpenAiKey ? "*".repeat(20) : ""}
          required={true}
          autoComplete="off"
          spellCheck={false}
          onChange={(e) => setInputValue(e.target.value)}
          onBlur={updateOpenAiKey}
        />
      </div>
      <OpenAIModelSelection settings={settings} apiKey={openAIKey} />
    </>
  );
}

function OpenAIModelSelection({ apiKey, settings }) {
  const [customModels, setCustomModels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function findCustomModels() {
      if (!apiKey) {
        setCustomModels([]);
        setLoading(false);
        return;
      }
      setLoading(true);
      const { models } = await System.customModels(
        "openai",
        typeof apiKey === "boolean" ? null : apiKey
      );
      setCustomModels(models || []);
      setLoading(false);
    }
    findCustomModels();
  }, [apiKey]);

  if (loading) {
    return (
      <div className="flex flex-col w-60">
        <label className="text-white text-sm font-semibold block mb-4">
          Chat Model Selection
        </label>
        <select
          name="OpenAiModelPref"
          disabled={true}
          className="bg-zinc-900 border border-gray-500 text-white text-sm rounded-lg block w-full p-2.5"
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
      <label className="text-white text-sm font-semibold block mb-4">
        Chat Model Selection
      </label>
      <select
        name="OpenAiModelPref"
        required={true}
        className="bg-zinc-900 border border-gray-500 text-white text-sm rounded-lg block w-full p-2.5"
      >
        <optgroup label="General LLM models">
          {["gpt-3.5-turbo", "gpt-4", "gpt-4-1106-preview", "gpt-4-32k"].map(
            (model) => {
              return (
                <option
                  key={model}
                  value={model}
                  selected={settings.OpenAiModelPref === model}
                >
                  {model}
                </option>
              );
            }
          )}
        </optgroup>
        {customModels.length > 0 && (
          <optgroup label="Your fine-tuned models">
            {customModels.map((model) => {
              return (
                <option
                  key={model.id}
                  value={model.id}
                  selected={settings.OpenAiModelPref === model.id}
                >
                  {model.id}
                </option>
              );
            })}
          </optgroup>
        )}
      </select>
    </div>
  );
}

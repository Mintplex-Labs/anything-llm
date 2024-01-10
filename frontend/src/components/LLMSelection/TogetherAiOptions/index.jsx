import System from "@/models/system";
import { useState, useEffect } from "react";

export default function TogetherAiOptions({ settings }) {
  return (
    <div className="flex gap-x-4">
      <div className="flex flex-col w-60">
        <label className="text-white text-sm font-semibold block mb-4">
          Together AI API Key
        </label>
        <input
          type="password"
          name="TogetherAiApiKey"
          className="bg-zinc-900 text-white placeholder-white placeholder-opacity-60 text-sm rounded-lg focus:border-white block w-full p-2.5"
          placeholder="Together AI API Key"
          defaultValue={settings?.TogetherAiApiKey ? "*".repeat(20) : ""}
          required={true}
          autoComplete="off"
          spellCheck={false}
        />
      </div>
      <TogetherAiModelSelection settings={settings} />
    </div>
  );
}

function TogetherAiModelSelection({ settings }) {
  const [customModels, setCustomModels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function findCustomModels() {
      setLoading(true);
      const { models } = await System.customModels("togetherai");
      setCustomModels(models || []);
      setLoading(false);
    }
    findCustomModels();
  }, []);

  if (loading || customModels.length == 0) {
    return (
      <div className="flex flex-col w-60">
        <label className="text-white text-sm font-semibold block mb-4">
          Chat Model Selection
        </label>
        <select
          name="TogetherAiModelPref"
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
        name="TogetherAiModelPref"
        required={true}
        className="bg-zinc-900 border border-gray-500 text-white text-sm rounded-lg block w-full p-2.5"
      >
        {customModels.length > 0 && (
          <optgroup label="Available models">
            {customModels.map((model) => {
              return (
                <option
                  key={model.id}
                  value={model.id}
                  selected={settings.TogetherAiModelPref === model.id}
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

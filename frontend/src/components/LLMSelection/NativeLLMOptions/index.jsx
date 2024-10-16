import { useEffect, useState } from "react";
import { Flask } from "@phosphor-icons/react";
import System from "@/models/system";

export default function NativeLLMOptions({ settings }) {
  return (
    <div className="w-full flex flex-col gap-y-4">
      <div className="flex flex-col md:flex-row md:items-center gap-x-2 text-white mb-4 bg-orange-800/30 w-fit rounded-lg px-4 py-2">
        <div className="gap-x-2 flex items-center">
          <Flask size={18} />
          <p className="text-sm md:text-base">
            Using a locally hosted LLM is experimental. Use with caution.
          </p>
        </div>
      </div>
      <div className="w-full flex items-center gap-[36px]">
        <NativeModelSelection settings={settings} />
      </div>
    </div>
  );
}

function NativeModelSelection({ settings }) {
  const [customModels, setCustomModels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function findCustomModels() {
      setLoading(true);
      const { models } = await System.customModels("native-llm", null, null);
      setCustomModels(models || []);
      setLoading(false);
    }
    findCustomModels();
  }, []);

  if (loading || customModels.length == 0) {
    return (
      <div className="flex flex-col w-60">
        <label className="text-white text-sm font-semibold block mb-3">
          Model Selection
        </label>
        <select
          name="NativeLLMModelPref"
          disabled={true}
          className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
        >
          <option disabled={true} selected={true}>
            -- waiting for models --
          </option>
        </select>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col w-60">
        <label className="text-white text-sm font-semibold block mb-3">
          Model Selection
        </label>
        <select
          name="NativeLLMModelPref"
          required={true}
          className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
        >
          {customModels.length > 0 && (
            <optgroup label="Your loaded models">
              {customModels.map((model) => {
                return (
                  <option
                    key={model.id}
                    value={model.id}
                    selected={settings.NativeLLMModelPref === model.id}
                  >
                    {model.id}
                  </option>
                );
              })}
            </optgroup>
          )}
        </select>
      </div>
      <div className="flex flex-col w-60">
        <label className="text-white text-sm font-semibold block mb-3">
          Token context window
        </label>
        <input
          type="number"
          name="NativeLLMTokenLimit"
          className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
          placeholder="4096"
          min={1}
          onScroll={(e) => e.target.blur()}
          defaultValue={settings?.NativeLLMTokenLimit}
          required={true}
          autoComplete="off"
        />
      </div>
    </>
  );
}

import { useEffect, useState } from "react";
import System from "@/models/system";
import InputField from "@/components/lib/InputField";

export default function OllamaLLMOptions({ settings }) {
  const [basePathValue, setBasePathValue] = useState(
    settings?.OllamaLLMBasePath
  );
  const [basePath, setBasePath] = useState(settings?.OllamaLLMBasePath);

  return (
    <div className="w-full flex flex-col gap-y-4">
      <div className="w-full flex items-center gap-4">
        <InputField
          type="url"
          name="OllamaLLMBasePath"
          placeholder="http://127.0.0.1:11434"
          defaultValue={settings?.OllamaLLMBasePath}
          required={true}
          autoComplete="off"
          spellCheck={false}
          label="Ollama Base URL"
          inputClassName="w-full"
          className="w-60"
          onChange={(e) => setBasePathValue(e.target.value)}
          onBlur={() => setBasePath(basePathValue)}
        />
        {!settings?.credentialsOnly && (
          <>
            <OllamaLLMModelSelection settings={settings} basePath={basePath} />
            <InputField
              type="number"
              name="OllamaLLMTokenLimit"
              placeholder="4096"
              min={1}
              onScroll={(e) => e.target.blur()}
              defaultValue={settings?.OllamaLLMTokenLimit}
              required={true}
              autoComplete="off"
              label="Token context window"
              inputClassName="w-full"
              className="w-60"
            />
          </>
        )}
      </div>
    </div>
  );
}

function OllamaLLMModelSelection({ settings, basePath = null }) {
  const [customModels, setCustomModels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function findCustomModels() {
      if (!basePath) {
        setCustomModels([]);
        setLoading(false);
        return;
      }
      setLoading(true);
      const { models } = await System.customModels("ollama", null, basePath);
      setCustomModels(models || []);
      setLoading(false);
    }
    findCustomModels();
  }, [basePath]);

  if (loading || customModels.length == 0) {
    return (
      <div className="flex flex-col w-60">
        <label className="text-white text-sm font-semibold block mb-4">
          Chat Model Selection
        </label>
        <select
          name="OllamaLLMModelPref"
          disabled={true}
          className="bg-zinc-900 border-gray-500 text-white text-sm rounded-lg block w-full p-2.5"
        >
          <option disabled={true} selected={true}>
            {!!basePath
              ? "-- loading available models --"
              : "-- waiting for URL --"}
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
        name="OllamaLLMModelPref"
        required={true}
        className="bg-zinc-900 border-gray-500 text-white text-sm rounded-lg block w-full p-2.5"
      >
        {customModels.length > 0 && (
          <optgroup label="Your loaded models">
            {customModels.map((model) => {
              return (
                <option
                  key={model.id}
                  value={model.id}
                  selected={settings.OllamaLLMModelPref === model.id}
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

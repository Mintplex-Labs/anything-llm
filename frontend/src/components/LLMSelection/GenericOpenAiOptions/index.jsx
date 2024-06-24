import { useEffect, useState } from "react";
import System from "@/models/system";

export default function GenericOpenAiOptions({ settings }) {
  const [basePathValue, setBasePathValue] = useState(
    settings?.GenericOpenAiBasePath
  );

  const [basePath, setBasePath] = useState(settings?.GenericOpenAiBasePath);

  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex gap-4 flex-wrap">
        <div className="flex flex-col w-60">
          <label className="text-white text-sm font-semibold block mb-4">
            Generic OpenAi Base URL
          </label>
          <input
            type="url"
            name="GenericOpenAiBasePath"
            className="bg-zinc-900 text-white placeholder:text-white/20 text-sm rounded-lg focus:border-white block w-full p-2.5"
            placeholder="eg: https://proxy.openai.com"
            defaultValue={settings?.GenericOpenAiBasePath}
            required={true}
            autoComplete="off"
            spellCheck={false}
            onChange={(e) => setBasePathValue(e.target.value)}
            onBlur={() => setBasePath(basePathValue)}
          />
        </div>
        <div className="flex flex-col w-60">
          <label className="text-white text-sm font-semibold block mb-4">
            API Key
          </label>
          <input
            type="password"
            name="GenericOpenAiKey"
            className="bg-zinc-900 text-white placeholder:text-white/20 text-sm rounded-lg focus:border-white block w-full p-2.5"
            placeholder="Generic service API Key"
            defaultValue={settings?.GenericOpenAiKey ? "*".repeat(20) : ""}
            required={false}
            autoComplete="off"
            spellCheck={false}
          />
        </div>
        {!settings?.credentialsOnly && (
          <>
            <GenericOpenAiModelSelection
              settings={settings}
              basePath={basePath}
            />
          </>
        )}
      </div>
      <div className="flex gap-x-4 flex-wrap">
        <div className="flex flex-col w-60">
          <label className="text-white text-sm font-semibold block mb-4">
            Token context window
          </label>
          <input
            type="number"
            name="GenericOpenAiTokenLimit"
            className="bg-zinc-900 text-white placeholder:text-white/20 text-sm rounded-lg focus:border-white block w-full p-2.5"
            placeholder="Content window limit (eg: 4096)"
            min={1}
            onScroll={(e) => e.target.blur()}
            defaultValue={settings?.GenericOpenAiTokenLimit}
            required={true}
            autoComplete="off"
          />
        </div>
        <div className="flex flex-col w-60">
          <label className="text-white text-sm font-semibold block mb-4">
            Max Tokens
          </label>
          <input
            type="number"
            name="GenericOpenAiMaxTokens"
            className="bg-zinc-900 text-white placeholder:text-white/20 text-sm rounded-lg focus:border-white block w-full p-2.5"
            placeholder="Max tokens per request (eg: 1024)"
            min={1}
            defaultValue={settings?.GenericOpenAiMaxTokens || 1024}
            required={true}
            autoComplete="off"
          />
        </div>
      </div>
    </div>
  );
}

function GenericOpenAiModelSelection({ settings, basePath = null }) {
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
      const { models } = await System.customModels(
        "generic-openai",
        null,
        basePath
      );
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
          name="GenericOpenAiModelPref"
          disabled={true}
          className="bg-zinc-900 border-gray-500 text-white text-sm rounded-lg block w-full p-2.5"
        >
          <option disabled={true} selected={true}>
            {basePath
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
        name="GenericOpenAiLLMModelPref"
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
                  selected={settings.GenericOpenAiModelPref === model.id}
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

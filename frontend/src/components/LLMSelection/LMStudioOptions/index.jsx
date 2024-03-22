import { useEffect, useState } from "react";
import { Info } from "@phosphor-icons/react";
import paths from "@/utils/paths";
import System from "@/models/system";

export default function LMStudioOptions({ settings, showAlert = false }) {
  const [basePathValue, setBasePathValue] = useState(
    settings?.LMStudioBasePath
  );
  const [basePath, setBasePath] = useState(settings?.LMStudioBasePath);

  return (
    <div className="w-full flex flex-col">
      {showAlert && (
        <div className="flex flex-col md:flex-row md:items-center gap-x-2 text-white mb-6 bg-blue-800/30 w-fit rounded-lg px-4 py-2">
          <div className="gap-x-2 flex items-center">
            <Info size={12} className="hidden md:visible" />
            <p className="text-sm md:text-base">
              LMStudio as your LLM requires you to set an embedding service to
              use.
            </p>
          </div>
          <a
            href={paths.settings.embeddingPreference()}
            className="text-sm md:text-base my-2 underline"
          >
            Manage embedding &rarr;
          </a>
        </div>
      )}
      <div className="w-full flex items-center gap-4">
        <div className="flex flex-col w-60">
          <label className="text-white text-sm font-semibold block mb-4">
            LMStudio Base URL
          </label>
          <input
            type="url"
            name="LMStudioBasePath"
            className="bg-zinc-900 text-white placeholder:text-white/20 text-sm rounded-lg focus:border-white block w-full p-2.5"
            placeholder="http://localhost:1234/v1"
            defaultValue={settings?.LMStudioBasePath}
            required={true}
            autoComplete="off"
            spellCheck={false}
            onChange={(e) => setBasePathValue(e.target.value)}
            onBlur={() => setBasePath(basePathValue)}
          />
        </div>
        <LMStudioModelSelection settings={settings} basePath={basePath} />
        <div className="flex flex-col w-60">
          <label className="text-white text-sm font-semibold block mb-4">
            Token context window
          </label>
          <input
            type="number"
            name="LMStudioTokenLimit"
            className="bg-zinc-900 text-white placeholder:text-white/20 text-sm rounded-lg focus:border-white block w-full p-2.5"
            placeholder="4096"
            min={1}
            onScroll={(e) => e.target.blur()}
            defaultValue={settings?.LMStudioTokenLimit}
            required={true}
            autoComplete="off"
          />
        </div>
      </div>
    </div>
  );
}

function LMStudioModelSelection({ settings, basePath = null }) {
  const [customModels, setCustomModels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function findCustomModels() {
      if (!basePath || !basePath.includes("/v1")) {
        setCustomModels([]);
        setLoading(false);
        return;
      }
      setLoading(true);
      const { models } = await System.customModels("lmstudio", null, basePath);
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
          name="LMStudioModelPref"
          disabled={true}
          className="bg-zinc-900 border-gray-500 text-white text-sm rounded-lg block w-full p-2.5"
        >
          <option disabled={true} selected={true}>
            {basePath?.includes("/v1")
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
        name="LMStudioModelPref"
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
                  selected={settings.LMStudioModelPref === model.id}
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

import { useState, useEffect } from "react";
import System from "@/models/system";

export default function KoboldCPPOptions({ settings }) {
  const [basePathValue, setBasePathValue] = useState(
    settings?.KoboldCPPBasePath
  );
  const [basePath, setBasePath] = useState(settings?.KoboldCPPBasePath);

  return (
    <div className="flex gap-[36px] mt-1.5 flex-wrap">
      <div className="flex flex-col w-60">
        <label className="text-white text-sm font-semibold block mb-3">
          Base URL
        </label>
        <input
          type="url"
          name="KoboldCPPBasePath"
          className="bg-zinc-900 text-white placeholder:text-white/20 text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
          placeholder="http://127.0.0.1:5000/v1"
          defaultValue={settings?.KoboldCPPBasePath}
          required={true}
          autoComplete="off"
          spellCheck={false}
          onChange={(e) => setBasePathValue(e.target.value)}
          onBlur={() => setBasePath(basePathValue)}
        />
      </div>
      <KoboldCPPModelSelection settings={settings} basePath={basePath} />
      <div className="flex flex-col w-60">
        <label className="text-white text-sm font-semibold block mb-3">
          Token context window
        </label>
        <input
          type="number"
          name="KoboldCPPTokenLimit"
          className="bg-zinc-900 text-white placeholder:text-white/20 text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
          placeholder="4096"
          min={1}
          onScroll={(e) => e.target.blur()}
          defaultValue={settings?.KoboldCPPTokenLimit}
          required={true}
          autoComplete="off"
        />
      </div>
    </div>
  );
}

function KoboldCPPModelSelection({ settings, basePath = null }) {
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
      const { models } = await System.customModels("koboldcpp", null, basePath);
      setCustomModels(models || []);
      setLoading(false);
    }
    findCustomModels();
  }, [basePath]);

  if (loading || customModels.length === 0) {
    return (
      <div className="flex flex-col w-60">
        <label className="text-white text-sm font-semibold block mb-3">
          Chat Model Selection
        </label>
        <select
          name="KoboldCPPModelPref"
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
      <label className="text-white text-sm font-semibold block mb-3">
        Chat Model Selection
      </label>
      <select
        name="KoboldCPPModelPref"
        required={true}
        className="bg-zinc-900 border-gray-500 text-white text-sm rounded-lg block w-full p-2.5"
      >
        {customModels.map((model) => (
          <option
            key={model.id}
            value={model.id}
            selected={settings?.KoboldCPPModelPref === model.id}
          >
            {model.id}
          </option>
        ))}
      </select>
    </div>
  );
}

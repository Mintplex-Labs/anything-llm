import { useState, useEffect } from "react";
import System from "@/models/system";

export default function AtlasCloudOptions({ settings }) {
  return (
    <div className="flex flex-col gap-y-7">
      <div className="flex gap-[36px] mt-1.5 flex-wrap">
        <div className="flex flex-col w-60">
          <label className="text-white text-sm font-semibold block mb-3">
            Atlas Cloud API Key
          </label>
          <input
            type="password"
            name="AtlasCloudApiKey"
            className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
            placeholder="Atlas Cloud API Key"
            defaultValue={settings?.AtlasCloudApiKey ? "*".repeat(20) : ""}
            required={true}
            autoComplete="off"
            spellCheck={false}
          />
        </div>
        {!settings?.credentialsOnly && (
          <AtlasCloudModelSelection settings={settings} />
        )}
      </div>
      <div className="flex gap-[36px] flex-wrap">
        <div className="flex flex-col w-60">
          <label className="text-white text-sm font-semibold block mb-3">
            Model context window
          </label>
          <input
            type="number"
            name="AtlasCloudTokenLimit"
            className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
            placeholder="Content window limit (eg: 8192)"
            min={1}
            onScroll={(e) => e.target.blur()}
            defaultValue={settings?.AtlasCloudTokenLimit}
            required={false}
            autoComplete="off"
          />
        </div>
        <div className="flex flex-col w-60">
          <label className="text-white text-sm font-semibold block mb-3">
            Max Tokens
          </label>
          <input
            type="number"
            name="AtlasCloudMaxTokens"
            className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
            placeholder="Max tokens per request (eg: 1024)"
            min={1}
            defaultValue={settings?.AtlasCloudMaxTokens || 1024}
            required={false}
            autoComplete="off"
          />
        </div>
      </div>
    </div>
  );
}

function AtlasCloudModelSelection({ settings }) {
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function findCustomModels() {
      setLoading(true);
      try {
        const { models } = await System.customModels("atlascloud");
        setModels(models || []);
      } catch (error) {
        console.error("Failed to fetch Atlas Cloud models:", error);
        setModels([]);
      }
      setLoading(false);
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
          name="AtlasCloudModelPref"
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
        name="AtlasCloudModelPref"
        required={true}
        className="border-none bg-theme-settings-input-bg border-gray-500 text-white text-sm rounded-lg block w-full p-2.5"
      >
        {models.map((model) => {
          return (
            <option
              key={model.id}
              value={model.id}
              selected={settings?.AtlasCloudModelPref === model.id}
            >
              {model.name}
            </option>
          );
        })}
      </select>
    </div>
  );
}

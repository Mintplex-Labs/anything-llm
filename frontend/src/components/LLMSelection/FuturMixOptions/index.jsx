import System from "@/models/system";
import { useState, useEffect } from "react";

export default function FuturMixOptions({ settings }) {
  return (
    <div className="w-full flex flex-col gap-y-7">
      <div className="w-full flex items-start gap-[36px] mt-1.5">
        <div className="flex flex-col w-60">
          <label className="text-theme-text-primary text-sm font-semibold block mb-3">
            FuturMix API Key
          </label>
          <input
            type="password"
            name="FuturMixApiKey"
            className="border-none bg-theme-settings-input-bg text-theme-text-primary placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
            placeholder="FuturMix API Key"
            defaultValue={settings?.FuturMixApiKey ? "*".repeat(20) : ""}
            required={true}
            autoComplete="off"
            spellCheck={false}
          />
        </div>
        {!settings?.credentialsOnly && (
          <FuturMixModelSelection settings={settings} />
        )}
      </div>
    </div>
  );
}

function FuturMixModelSelection({ settings }) {
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function findCustomModels() {
      setLoading(true);
      const { models: fetched = [] } = await System.customModels("futurmix");
      if (fetched?.length > 0) {
        setModels(fetched);
      } else {
        setModels([]);
      }
      setLoading(false);
    }
    findCustomModels();
  }, []);

  if (loading || models.length === 0) {
    return (
      <div className="flex flex-col w-60">
        <label className="text-theme-text-primary text-sm font-semibold block mb-3">
          Chat Model Selection
        </label>
        <select
          name="FuturMixModelPref"
          disabled={true}
          className="border-none bg-theme-settings-input-bg border-gray-500 text-theme-text-primary text-sm rounded-lg block w-full p-2.5"
        >
          <option disabled={true} selected={true}>
            -- loading available models --
          </option>
        </select>
      </div>
    );
  }

  // Group models by organization
  const groupedModels = models.reduce((acc, model) => {
    const org = model.organization || "Other";
    if (!acc[org]) acc[org] = [];
    acc[org].push(model);
    return acc;
  }, {});

  return (
    <div className="flex flex-col w-60">
      <label className="text-theme-text-primary text-sm font-semibold block mb-3">
        Chat Model Selection
      </label>
      <select
        name="FuturMixModelPref"
        required={true}
        className="border-none bg-theme-settings-input-bg border-gray-500 text-theme-text-primary text-sm rounded-lg block w-full p-2.5"
        defaultValue={settings?.FuturMixModelPref || "claude-sonnet-4-20250514"}
      >
        {Object.entries(groupedModels).map(([org, orgModels]) => (
          <optgroup key={org} label={org}>
            {orgModels.map((model) => (
              <option key={model.id} value={model.id}>
                {model.name || model.id}
              </option>
            ))}
          </optgroup>
        ))}
      </select>
    </div>
  );
}

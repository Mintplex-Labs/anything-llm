import System from "@/models/system";
import { useState, useEffect } from "react";

export default function FireworksAiOptions({
  settings,
  inputBgClassName = "bg-theme-bg-input-dark",
}) {
  return (
    <div className="flex gap-[36px] mt-1.5">
      <div className="flex flex-col w-60">
        <label className="text-white text-sm font-semibold block mb-3">
          Fireworks AI API Key
        </label>
        <input
          type="password"
          name="FireworksAiLLMApiKey"
          className={`border-none ${inputBgClassName} text-theme-text-primary placeholder:text-theme-text-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5`}
          placeholder="Fireworks AI API Key"
          defaultValue={settings?.FireworksAiLLMApiKey ? "*".repeat(20) : ""}
          required={true}
          autoComplete="off"
          spellCheck={false}
        />
      </div>
      {!settings?.credentialsOnly && (
        <FireworksAiModelSelection
          settings={settings}
          inputBgClassName={inputBgClassName}
        />
      )}
    </div>
  );
}
function FireworksAiModelSelection({
  settings,
  inputBgClassName = "bg-theme-bg-input-dark",
}) {
  const [groupedModels, setGroupedModels] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function findCustomModels() {
      setLoading(true);
      const { models } = await System.customModels("fireworksai");

      if (models?.length > 0) {
        const modelsByOrganization = models.reduce((acc, model) => {
          acc[model.organization] = acc[model.organization] || [];
          acc[model.organization].push(model);
          return acc;
        }, {});

        setGroupedModels(modelsByOrganization);
      }

      setLoading(false);
    }
    findCustomModels();
  }, []);

  if (loading || Object.keys(groupedModels).length === 0) {
    return (
      <div className="flex flex-col w-60">
        <label className="text-white text-sm font-semibold block mb-3">
          Chat Model Selection
        </label>
        <select
          name="FireworksAiLLMModelPref"
          disabled={true}
          className={`border-none ${inputBgClassName} text-theme-text-primary placeholder:text-theme-text-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5`}
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
        name="FireworksAiLLMModelPref"
        required={true}
        className={`border-none ${inputBgClassName} text-theme-text-primary placeholder:text-theme-text-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5`}
      >
        {Object.keys(groupedModels)
          .sort()
          .map((organization) => (
            <optgroup key={organization} label={organization}>
              {groupedModels[organization].map((model) => (
                <option
                  key={model.id}
                  value={model.id}
                  selected={settings?.FireworksAiLLMModelPref === model.id}
                >
                  {model.name}
                </option>
              ))}
            </optgroup>
          ))}
      </select>
    </div>
  );
}

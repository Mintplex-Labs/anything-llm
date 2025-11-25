import { useEffect, useState } from "react";
import System from "@/models/system";

export default function FoundryOptions({ settings }) {
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(!!settings?.FoundryBasePath);
  const [basePath, setBasePath] = useState(settings?.FoundryBasePath);
  const [model, setModel] = useState(settings?.FoundryModelPref || "");

  useEffect(() => {
    setModel(settings?.FoundryModelPref || "");
  }, [settings?.FoundryModelPref]);

  useEffect(() => {
    async function fetchModels() {
      try {
        setLoading(true);
        if (!basePath) throw new Error("Base path is required");
        const { models, error } = await System.customModels(
          "foundry",
          null,
          basePath
        );
        if (error) throw new Error(error);
        setModels(models);
      } catch (error) {
        console.error("Error fetching Foundry models:", error);
        setModels([]);
      } finally {
        setLoading(false);
      }
    }
    fetchModels();
  }, [basePath]);

  return (
    <div className="flex flex-col gap-y-7">
      <div className="flex gap-[36px] mt-1.5 flex-wrap">
        <div className="flex flex-col w-60">
          <label className="text-white text-sm font-semibold block mb-3">
            Base URL
          </label>
          <input
            type="url"
            name="FoundryBasePath"
            className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
            placeholder="eg: http://127.0.0.1:8080"
            defaultValue={settings?.FoundryBasePath}
            required={true}
            autoComplete="off"
            spellCheck={false}
            onChange={(e) => setBasePath(e.target.value)}
          />
        </div>
        <div className="flex flex-col w-60">
          <label className="text-white text-sm font-semibold block mb-3">
            Chat Model
          </label>
          {loading ? (
            <select
              name="FoundryModelPref"
              required={true}
              disabled={true}
              className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
            >
              <option>---- Loading ----</option>
            </select>
          ) : (
            <select
              name="FoundryModelPref"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              required={true}
              className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
            >
              {models.length > 0 ? (
                <>
                  <option value="">-- Select a model --</option>
                  {models.map((model) => (
                    <option key={model.id} value={model.id}>
                      {model.id}
                    </option>
                  ))}
                </>
              ) : (
                <option disabled value="">
                  No models found
                </option>
              )}
            </select>
          )}
        </div>
        <div className="flex flex-col w-60">
          <label className="text-white text-sm font-semibold block mb-3">
            Token Context Window
          </label>
          <input
            type="number"
            name="FoundryModelTokenLimit"
            className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
            placeholder="4096"
            defaultValue={settings?.FoundryModelTokenLimit}
            autoComplete="off"
            min={0}
          />
        </div>
      </div>
    </div>
  );
}

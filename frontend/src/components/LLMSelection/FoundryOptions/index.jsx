import { useEffect, useState } from "react";
import System from "@/models/system";
import showToast from "@/utils/toast";

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
      if (!basePath) {
        setLoading(false);
        setModels([]);
        return;
      }

      setLoading(true);
      const { models, error } = await System.customModels(
        "foundry",
        null,
        basePath
      );
      if (error) {
        showToast(`Error fetching models: ${error}`, "error");
        setModels([]);
      } else {
        setModels(models);
      }
      setLoading(false);
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
            placeholder="eg: http://127.0.0.1:64459"
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
                models.map((model) => (
                  <option key={model.id} value={model.id}>
                    {model.name}
                    {model.downloaded === false ? " (not downloaded)" : ""}
                  </option>
                ))
              ) : (
                <option disabled value="">
                  No models found
                </option>
              )}
            </select>
          )}
          <p className="text-xs leading-[18px] font-base text-white text-opacity-60 mt-2">
            Models that are not downloaded will begin downloading when you
            select them.
          </p>
        </div>
      </div>
    </div>
  );
}

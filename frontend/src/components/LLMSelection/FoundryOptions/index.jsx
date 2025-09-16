import { useEffect, useState } from "react";
import System from "@/models/system";
import showToast from "@/utils/toast";

export default function FoundryOptions({ settings }) {
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [basePath, setBasePath] = useState(settings?.FoundryBasePath);

  useEffect(() => {
    async function fetchModels() {
      if (!basePath) return;
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

  const handleDownload = async (modelId) => {
    showToast("Downloading model... This may take a while.", "info");
    const { success, error } = await System.downloadFoundryModel(modelId);
    if (success) {
      showToast("Model downloaded successfully.", "success");
      // Refresh models
      const { models, error: fetchError } = await System.customModels(
        "foundry",
        null,
        basePath
      );
      if (!fetchError) setModels(models);
    } else {
      showToast(`Error downloading model: ${error}`, "error");
    }
  };

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
            API Key (optional)
          </label>
          <input
            type="password"
            name="FoundryApiKey"
            className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
            placeholder="Foundry API Key"
            defaultValue={settings?.FoundryApiKey ? "*".repeat(20) : ""}
            autoComplete="off"
            spellCheck={false}
          />
        </div>

        <div className="flex flex-col w-60">
          <label className="text-white text-sm font-semibold block mb-3">
            Chat Model
          </label>
          <select
            name="FoundryModelPref"
            defaultValue={settings?.FoundryModelPref}
            required={true}
            className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
          >
            {loading ? (
              <option disabled>Loading models...</option>
            ) : (
              models.map((model) => (
                <option key={model.id} value={model.id} disabled={model.status !== 'downloaded'}>
                  {model.name} ({model.status})
                </option>
              ))
            )}
          </select>
        </div>
      </div>
      <div>
        <h3 className="text-white text-sm font-semibold mb-3">Available Models</h3>
        {loading ? <p className="text-white">Loading models...</p> :
          <div className="flex flex-col gap-y-2">
            {models.map(model => (
              <div key={model.id} className="flex items-center gap-x-4 p-2 bg-theme-settings-input-bg rounded-lg">
                <p className="text-white flex-grow">{model.name}</p>
                {model.status !== 'downloaded' ?
                  <button type="button" onClick={() => handleDownload(model.id)} className="text-white bg-primary-button p-1 rounded">Download</button> :
                  <p className="text-green-500">Downloaded</p>}
              </div>
            ))}
          </div>
        }
      </div>
    </div>
  );
}

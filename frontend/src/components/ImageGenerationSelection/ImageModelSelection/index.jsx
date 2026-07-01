import { useEffect, useState } from "react";
import System from "@/models/system";

const INPUT_CLASSES =
  "border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5";

/**
 * Model picker for image generation providers. Fetches the provider's available
 * models and renders a dropdown. When none can be fetched it falls back to a
 * free-text input so the user can still enter a model name manually.
 * @param {object} props
 * @param {string} props.provider - customModels provider key (e.g. "openai-image")
 * @param {string|boolean|null} [props.apiKey] - current API key (or true when already saved)
 * @param {string|null} [props.basePath] - current base path for self-hosted providers
 * @param {object} props.settings - system settings (for the saved model preference)
 */
export default function ImageModelSelection({
  provider,
  apiKey = null,
  basePath = null,
  settings,
}) {
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchModels() {
      setLoading(true);
      const { models } = await System.customModels(
        provider,
        typeof apiKey === "boolean" ? null : apiKey,
        basePath
      );
      setModels(models || []);
      setLoading(false);
    }
    fetchModels();
  }, [provider, apiKey, basePath]);

  if (loading) {
    return (
      <div className="flex flex-col w-60">
        <label className="text-white text-sm font-semibold block mb-3">
          Model
        </label>
        <select
          name="ImageGenerationModelPref"
          disabled
          className={INPUT_CLASSES}
        >
          <option>-- loading available models --</option>
        </select>
      </div>
    );
  }

  // No models could be fetched - let the user enter a model name manually.
  if (models.length === 0) {
    return (
      <div className="flex flex-col w-60">
        <label className="text-white text-sm font-semibold block mb-3">
          Model
        </label>
        <input
          type="text"
          name="ImageGenerationModelPref"
          className={INPUT_CLASSES}
          placeholder="Image model name"
          defaultValue={settings?.ImageGenerationModelPref || ""}
          required={true}
          autoComplete="off"
          spellCheck={false}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col w-60">
      <label className="text-white text-sm font-semibold block mb-3">
        Model
      </label>
      <select
        name="ImageGenerationModelPref"
        required
        className={INPUT_CLASSES}
      >
        {models.map((model) => (
          <option
            key={model.id}
            value={model.id}
            selected={settings?.ImageGenerationModelPref === model.id}
          >
            {model.name || model.id}
          </option>
        ))}
      </select>
    </div>
  );
}

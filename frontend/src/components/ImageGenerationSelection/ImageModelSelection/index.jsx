import { useEffect, useState } from "react";
import System from "@/models/system";

const INPUT_CLASSES =
  "border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5";

/**
 * Model picker for image generation providers. Fetches the provider's
 * image-capable models and renders a dropdown - grouped by organization when the
 * provider reports one. When none can be fetched it falls back to a free-text
 * input so the user can still enter a model name manually.
 * @param {object} props
 * @param {string} props.provider - customModels provider key (e.g. "openai-imggen")
 * @param {string|boolean|null} [props.apiKey] - current API key (or true when already saved)
 * @param {string|null} [props.basePath] - current base path for self-hosted providers
 * @param {object} props.settings - system settings (for the saved model preference)
 * @param {string|null} [props.endpointName] - when set, models are only fetched
 * once a basePath is present and this name is used in the placeholder prompt
 * (e.g. "Ollama URL").
 */
export default function ImageModelSelection({
  provider,
  apiKey = null,
  basePath = null,
  settings,
  endpointName = null,
}) {
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const needsBasePath = !!endpointName && !basePath;

  useEffect(() => {
    async function fetchModels() {
      if (needsBasePath) {
        setModels([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const { models } = await System.customModels(
          provider,
          typeof apiKey === "boolean" ? null : apiKey,
          basePath
        );
        setModels(models || []);
      } catch (error) {
        console.error("Failed to fetch image generation models:", error);
        setModels([]);
      }
      setLoading(false);
    }
    fetchModels();
  }, [provider, apiKey, basePath, needsBasePath]);

  if (loading || needsBasePath) {
    return (
      <ModelSelectionWrapper>
        <select
          name="ImageGenerationModelPref"
          disabled={true}
          className={INPUT_CLASSES}
        >
          <option disabled={true} selected={true}>
            {needsBasePath
              ? `Enter ${endpointName} first`
              : "-- loading available models --"}
          </option>
        </select>
      </ModelSelectionWrapper>
    );
  }

  if (models.length === 0) {
    return (
      <ModelSelectionWrapper hint="No image models could be found for this provider - enter the model name manually.">
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
      </ModelSelectionWrapper>
    );
  }

  const groupedModels = groupModelsByOrganization(models);
  return (
    <ModelSelectionWrapper>
      <select
        name="ImageGenerationModelPref"
        required={true}
        className={INPUT_CLASSES}
      >
        {Object.keys(groupedModels).length > 0
          ? Object.entries(groupedModels).map(([organization, models]) => (
              <optgroup key={organization} label={organization}>
                {models.map((model) => (
                  <ModelOption
                    key={model.id}
                    model={model}
                    settings={settings}
                  />
                ))}
              </optgroup>
            ))
          : models.map((model) => (
              <ModelOption key={model.id} model={model} settings={settings} />
            ))}
      </select>
    </ModelSelectionWrapper>
  );
}

function ModelSelectionWrapper({ children, hint = null }) {
  return (
    <div className="flex flex-col w-60">
      <label className="text-white text-sm font-semibold block mb-3">
        Model
      </label>
      {children}
      {hint && (
        <p className="text-xs leading-[18px] font-base text-white text-opacity-60 mt-2">
          {hint}
        </p>
      )}
    </div>
  );
}

function ModelOption({ model, settings }) {
  const name = model.name || model.id;
  const prefix = model.organization ? `${model.organization}:` : null;
  const label =
    prefix && name.startsWith(prefix) ? name.slice(prefix.length) : name;
  return (
    <option
      value={model.id}
      selected={settings?.ImageGenerationModelPref === model.id}
    >
      {label}
    </option>
  );
}

/**
 * Groups models by their reported organization - providers that do not report
 * one (eg: openai, ollama) return an empty object so the models are rendered as
 * a flat list.
 * @param {{id: string, name?: string, organization?: string}[]} models
 * @returns {Record<string, object[]>}
 */
function groupModelsByOrganization(models = []) {
  if (!models.some((model) => !!model.organization)) return {};
  return models.reduce((acc, model) => {
    const organization = model.organization || "Other";
    acc[organization] = acc[organization] || [];
    acc[organization].push(model);
    return acc;
  }, {});
}

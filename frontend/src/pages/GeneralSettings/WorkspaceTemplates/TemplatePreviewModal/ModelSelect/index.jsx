import useGetProviderModels from "@/hooks/useGetProvidersModels";
import CustomSelect from "../CustomSelect";

// Providers that require manual model name entry (no model list API)
const FREE_FORM_PROVIDERS = ["bedrock", "azure", "generic-openai"];

// Providers with no model selection needed
const NO_MODEL_PROVIDERS = ["default", "huggingface", "none", ""];

export default function ModelSelect({
  provider,
  value,
  onChange,
  className = "",
}) {
  const { defaultModels, customModels, loading } = useGetProviderModels(
    provider && !NO_MODEL_PROVIDERS.includes(provider) ? provider : null
  );

  // No model selection needed
  if (!provider || NO_MODEL_PROVIDERS.includes(provider)) {
    return (
      <CustomSelect
        value=""
        options={[{ value: "", label: "Uses system model" }]}
        onChange={() => { }}
        disabled
        className={className}
      />
    );
  }

  // Free-form text input for providers that require manual model entry
  if (FREE_FORM_PROVIDERS.includes(provider)) {
    return (
      <input
        type="text"
        value={value || ""}
        onChange={(e) => onChange(e.target.value === "" ? null : e.target.value)}
        placeholder="Enter model name"
        className={`w-full bg-theme-settings-input-bg text-theme-text-primary text-sm rounded px-2 py-1 outline-none focus:ring-1 focus:ring-primary-button border border-theme-modal-border h-8 text-right ${className}`}
      />
    );
  }

  if (loading) {
    return (
      <CustomSelect
        value=""
        options={[{ value: "", label: "Loading models..." }]}
        onChange={() => { }}
        disabled
        className={className}
      />
    );
  }

  const options = [{ value: "", label: "System default" }];

  if (defaultModels.length > 0) {
    defaultModels.forEach((model) => {
      options.push({ value: model, label: model });
    });
  }

  if (Array.isArray(customModels)) {
    customModels.forEach((model) => {
      const id = model.id || model;
      options.push({ value: id, label: id });
    });
  } else if (customModels && typeof customModels === "object") {
    Object.entries(customModels).forEach(([org, models]) => {
      models.forEach((model) => {
        options.push({
          value: model.id,
          label: `${model.name || model.id} (${org})`,
        });
      });
    });
  }

  if (options.length === 1) {
    return (
      <input
        type="text"
        value={value || ""}
        onChange={(e) => onChange(e.target.value === "" ? null : e.target.value)}
        placeholder="Enter model name"
        className={`w-full bg-theme-settings-input-bg text-theme-text-primary text-sm rounded px-2 py-1 outline-none focus:ring-1 focus:ring-primary-button border border-theme-modal-border h-8 text-right ${className}`}
      />
    );
  }

  return (
    <CustomSelect
      value={value || ""}
      options={options}
      onChange={onChange}
      placeholder="System default"
      className={className}
    />
  );
}

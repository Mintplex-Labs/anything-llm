import { useEffect, useState } from "react";
import System from "@/models/system";
import { Flask } from "@phosphor-icons/react";
import showToast from "@/utils/toast";

export default function DynamicConfigForm({
  provider,
  config,
  onChange,
  providerConfig,
}) {
  const [availableModels, setAvailableModels] = useState([]);
  const [loadingModels, setLoadingModels] = useState(false);
  const [testingConnection, setTestingConnection] = useState(false);

  useEffect(() => {
    // Auto-fetch models when basePath is provided
    if (config.basePath) {
      fetchModels();
    }
  }, [config.basePath, config.apiKey]);

  const fetchModels = async () => {
    if (!config.basePath) return;

    setLoadingModels(true);
    try {
      const { models } = await System.customModels(
        provider,
        config.apiKey || null,
        config.basePath,
        10000 // 10 second timeout
      );
      setAvailableModels(models || []);

      // Auto-select first model if none selected
      if (models && models.length > 0 && !config.defaultModel) {
        handleFieldChange("defaultModel", models[0].id);
      }
    } catch (error) {
      console.error("Error fetching models:", error);
      showToast(`Failed to fetch models: ${error.message}`, "error");
      setAvailableModels([]);
    } finally {
      setLoadingModels(false);
    }
  };

  const handleTestConnection = async () => {
    if (!config.basePath) {
      showToast("Please enter a base path first", "error");
      return;
    }

    setTestingConnection(true);
    try {
      await fetchModels();
      if (availableModels.length > 0) {
        showToast(
          `Connection successful! Found ${availableModels.length} models`,
          "success"
        );
      } else {
        showToast("Connection test failed: No models returned", "error");
      }
    } catch (error) {
      showToast(`Connection test failed: ${error.message}`, "error");
    } finally {
      setTestingConnection(false);
    }
  };

  if (!providerConfig || !providerConfig.fields) {
    return (
      <div className="text-theme-text-secondary text-sm">
        No configuration fields available for this provider.
      </div>
    );
  }

  const handleFieldChange = (fieldName, value) => {
    onChange({
      ...config,
      [fieldName]: value,
    });
  };

  return (
    <div className="space-y-4">
      <div className="border-t border-theme-modal-border pt-4">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-semibold text-theme-text-primary">
            Provider Configuration
          </h4>
          <button
            type="button"
            onClick={handleTestConnection}
            disabled={testingConnection || !config.basePath}
            className="flex items-center gap-x-2 px-3 py-1.5 text-xs bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500/20 transition-colors disabled:opacity-50"
          >
            <Flask className="h-4 w-4" />
            {testingConnection ? "Testing..." : "Test Connection"}
          </button>
        </div>
        {providerConfig.fields.map((field) => (
          <div key={field.name} className="mb-4">
            <label className="block mb-2 text-sm font-medium text-theme-text-primary">
              {field.label} {field.required && "*"}
            </label>
            {field.type === "password" ? (
              <input
                type="password"
                value={config[field.name] || ""}
                onChange={(e) => handleFieldChange(field.name, e.target.value)}
                className="bg-theme-settings-input-bg border border-theme-settings-input-border text-theme-text-primary text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder={field.placeholder}
                required={field.required}
              />
            ) : field.type === "number" ? (
              <input
                type="number"
                value={config[field.name] || ""}
                onChange={(e) =>
                  handleFieldChange(
                    field.name,
                    e.target.value ? parseInt(e.target.value) : ""
                  )
                }
                className="bg-theme-settings-input-bg border border-theme-settings-input-border text-theme-text-primary text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder={field.placeholder}
                required={field.required}
              />
            ) : (
              <input
                type="text"
                value={config[field.name] || ""}
                onChange={(e) => handleFieldChange(field.name, e.target.value)}
                className="bg-theme-settings-input-bg border border-theme-settings-input-border text-theme-text-primary text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder={field.placeholder}
                required={field.required}
              />
            )}
            {field.description && (
              <p className="text-xs text-theme-text-secondary mt-1">
                {field.description}
              </p>
            )}
          </div>
        ))}

        {/* Model Selection - appears after basePath is provided */}
        {config.basePath && (
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium text-theme-text-primary">
              Default Model {loadingModels ? "(loading...)" : ""}
            </label>
            {loadingModels ? (
              <select
                disabled
                className="bg-theme-settings-input-bg border border-theme-settings-input-border text-theme-text-secondary text-sm rounded-lg block w-full p-2.5"
              >
                <option>Loading available models...</option>
              </select>
            ) : availableModels.length > 0 ? (
              <select
                value={config.defaultModel || ""}
                onChange={(e) => handleFieldChange("defaultModel", e.target.value)}
                className="bg-theme-settings-input-bg border border-theme-settings-input-border text-theme-text-primary text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              >
                {availableModels.map((model) => (
                  <option key={model.id} value={model.id}>
                    {model.id}
                  </option>
                ))}
              </select>
            ) : (
              <select
                disabled
                className="bg-theme-settings-input-bg border border-theme-settings-input-border text-theme-text-secondary text-sm rounded-lg block w-full p-2.5"
              >
                <option>No models found - check connection</option>
              </select>
            )}
            <p className="text-xs text-theme-text-secondary mt-1">
              The default model to use for this connection
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

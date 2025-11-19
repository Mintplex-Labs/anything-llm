import { useEffect, useState, useRef } from "react";
import System from "@/models/system";
import { Flask, CheckCircle, XCircle } from "@phosphor-icons/react";
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
  const [connectionStatus, setConnectionStatus] = useState(null); // { success: boolean, message: string, modelCount: number }
  const testDebounceTimer = useRef(null);

  useEffect(() => {
    // Clear connection status when config changes
    setConnectionStatus(null);

    // Auto-fetch models when basePath is provided
    if (config.basePath) {
      fetchModels();
    }
  }, [config.basePath, config.apiKey]);

  const fetchModels = async () => {
    if (!config.basePath) return [];

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

      return models || [];
    } catch (error) {
      console.error("Error fetching models:", error);
      setAvailableModels([]);
      throw error; // Re-throw so handleTestConnection can catch it
    } finally {
      setLoadingModels(false);
    }
  };

  const handleTestConnection = async () => {
    // Debounce - only allow one test every 500ms
    if (testDebounceTimer.current) {
      return; // Already testing or within debounce period
    }

    if (!config.basePath) {
      setConnectionStatus({
        success: false,
        message: "Please enter a base path first",
        modelCount: 0,
      });
      return;
    }

    setTestingConnection(true);
    setConnectionStatus(null); // Clear previous status

    // Set debounce timer
    testDebounceTimer.current = setTimeout(() => {
      testDebounceTimer.current = null;
    }, 500);

    try {
      const models = await fetchModels();
      if (models && models.length > 0) {
        setConnectionStatus({
          success: true,
          message: `Successfully connected to ${provider}`,
          modelCount: models.length,
        });
        showToast(
          `Connection successful! Found ${models.length} models`,
          "success"
        );
      } else {
        setConnectionStatus({
          success: false,
          message: "No models returned from the provider",
          modelCount: 0,
        });
        showToast("Connection test failed: No models returned", "error");
      }
    } catch (error) {
      setConnectionStatus({
        success: false,
        message: error.message || "Connection failed",
        modelCount: 0,
      });
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
        <div className="flex items-center justify-between mb-2">
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

        {/* Connection Status Indicator */}
        {connectionStatus && (
          <div
            className={`flex items-start gap-x-2 px-3 py-2 mb-4 rounded text-xs ${
              connectionStatus.success
                ? "bg-green-500/10 text-green-400"
                : "bg-red-500/10 text-red-400"
            }`}
          >
            {connectionStatus.success ? (
              <CheckCircle className="h-4 w-4 flex-shrink-0 mt-0.5" weight="fill" />
            ) : (
              <XCircle className="h-4 w-4 flex-shrink-0 mt-0.5" weight="fill" />
            )}
            <div className="flex-1">
              <div className="font-medium">
                {connectionStatus.success ? "✓ Connected" : "✗ Connection Failed"}
              </div>
              <div className="text-xs opacity-80 mt-0.5">
                {connectionStatus.message}
                {connectionStatus.success &&
                  ` • Found ${connectionStatus.modelCount} model${
                    connectionStatus.modelCount !== 1 ? "s" : ""
                  }`}
              </div>
            </div>
          </div>
        )}

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

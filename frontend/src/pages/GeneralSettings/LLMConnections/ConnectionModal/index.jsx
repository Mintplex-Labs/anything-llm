import { useState, useEffect } from "react";
import { X } from "@phosphor-icons/react";
import System from "@/models/system";
import showToast from "@/utils/toast";
import DynamicConfigForm from "../DynamicConfigForm";

// Provider definitions with required and optional fields
const PROVIDER_CONFIGS = {
  litellm: {
    label: "LiteLLM",
    description: "Connect to a LiteLLM proxy server",
    fields: [
      {
        name: "basePath",
        label: "Base Path",
        type: "text",
        required: true,
        placeholder: "http://localhost:4000",
        description: "The base URL of your LiteLLM proxy",
      },
      {
        name: "apiKey",
        label: "API Key",
        type: "password",
        required: false,
        placeholder: "sk-...",
        description: "Optional API key for authentication",
      },
      {
        name: "defaultModel",
        label: "Default Model",
        type: "text",
        required: false,
        placeholder: "gpt-4",
        description: "Default model to use if not specified",
      },
      {
        name: "modelTokenLimit",
        label: "Model Token Limit",
        type: "number",
        required: false,
        placeholder: "4096",
        description: "Maximum tokens for the model",
      },
    ],
  },
  ollama: {
    label: "Ollama",
    description: "Connect to an Ollama instance",
    fields: [
      {
        name: "baseUrl",
        label: "Base URL",
        type: "text",
        required: true,
        placeholder: "http://localhost:11434",
        description: "The base URL of your Ollama instance",
      },
      {
        name: "authToken",
        label: "Auth Token",
        type: "password",
        required: false,
        placeholder: "Optional authentication token",
        description: "Optional token for authentication",
      },
      {
        name: "defaultModel",
        label: "Default Model",
        type: "text",
        required: false,
        placeholder: "llama2",
        description: "Default model to use if not specified",
      },
    ],
  },
  openai: {
    label: "OpenAI",
    description: "Connect to OpenAI API",
    fields: [
      {
        name: "apiKey",
        label: "API Key",
        type: "password",
        required: true,
        placeholder: "sk-...",
        description: "Your OpenAI API key",
      },
      {
        name: "defaultModel",
        label: "Default Model",
        type: "text",
        required: false,
        placeholder: "gpt-4",
        description: "Default model to use if not specified",
      },
    ],
  },
  anthropic: {
    label: "Anthropic",
    description: "Connect to Anthropic API",
    fields: [
      {
        name: "apiKey",
        label: "API Key",
        type: "password",
        required: true,
        placeholder: "sk-ant-...",
        description: "Your Anthropic API key",
      },
      {
        name: "defaultModel",
        label: "Default Model",
        type: "text",
        required: false,
        placeholder: "claude-3-opus-20240229",
        description: "Default model to use if not specified",
      },
    ],
  },
};

export default function ConnectionModal({ connection, closeModal, onSuccess }) {
  const isEditing = !!connection;
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    provider: "litellm",
    config: {},
    isDefault: false,
  });

  useEffect(() => {
    if (connection) {
      setFormData({
        name: connection.name || "",
        provider: connection.provider || "litellm",
        config: connection.config || {},
        isDefault: connection.isDefault || false,
      });
    }
  }, [connection]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { connection: savedConnection, error } = isEditing
        ? await System.llmConnections.update(connection.id, formData)
        : await System.llmConnections.create(formData);

      if (error) {
        showToast(
          `Error ${isEditing ? "updating" : "creating"} connection: ${error}`,
          "error"
        );
      } else {
        showToast(
          `Connection ${isEditing ? "updated" : "created"} successfully`,
          "success"
        );
        onSuccess();
        closeModal();
      }
    } catch (err) {
      showToast(
        `Error ${isEditing ? "updating" : "creating"} connection: ${
          err.message
        }`,
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleConfigChange = (config) => {
    setFormData((prev) => ({ ...prev, config }));
  };

  const providerConfig = PROVIDER_CONFIGS[formData.provider];

  return (
    <div className="relative w-full max-w-2xl max-h-full">
      <div className="relative bg-theme-bg-secondary rounded-lg shadow border-2 border-theme-modal-border">
        <div className="flex items-start justify-between p-4 border-b rounded-t border-theme-modal-border">
          <h3 className="text-xl font-semibold text-theme-text-primary">
            {isEditing ? "Edit" : "Create"} LLM Connection
          </h3>
          <button
            onClick={closeModal}
            type="button"
            className="text-theme-text-secondary bg-transparent hover:border-theme-text-primary rounded-lg text-sm p-1.5 ml-auto inline-flex items-center bg-sidebar-button hover:bg-menu-item-selected-gradient hover:border-slate-100 hover:border-opacity-50 border-transparent border"
          >
            <X className="text-theme-text-secondary text-lg" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-6">
            {/* Name */}
            <div>
              <label className="block mb-2 text-sm font-medium text-theme-text-primary">
                Connection Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                className="bg-theme-settings-input-bg border border-theme-settings-input-border text-theme-text-primary text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder="e.g., Engineering Team LiteLLM"
                required
                disabled={isEditing} // Can't change name when editing
              />
              <p className="text-xs text-theme-text-secondary mt-1">
                A unique identifier for this connection
              </p>
            </div>

            {/* Provider Selection */}
            <div>
              <label className="block mb-2 text-sm font-medium text-theme-text-primary">
                Provider *
              </label>
              <select
                value={formData.provider}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    provider: e.target.value,
                    config: {},
                  }))
                }
                className="bg-theme-settings-input-bg border border-theme-settings-input-border text-theme-text-primary text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                disabled={isEditing} // Can't change provider when editing
              >
                {Object.entries(PROVIDER_CONFIGS).map(([value, config]) => (
                  <option key={value} value={value}>
                    {config.label}
                  </option>
                ))}
              </select>
              <p className="text-xs text-theme-text-secondary mt-1">
                {providerConfig?.description}
              </p>
            </div>

            {/* Dynamic Config Form */}
            <DynamicConfigForm
              provider={formData.provider}
              config={formData.config}
              onChange={handleConfigChange}
              providerConfig={providerConfig}
            />

            {/* Is Default */}
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={formData.isDefault}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    isDefault: e.target.checked,
                  }))
                }
                className="w-4 h-4 text-blue-600 bg-theme-settings-input-bg border-theme-settings-input-border rounded focus:ring-blue-500"
              />
              <label className="ml-2 text-sm font-medium text-theme-text-primary">
                Set as default connection for this provider
              </label>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-6 border-t rounded-b border-theme-modal-border">
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2 text-sm font-medium text-theme-text-secondary bg-transparent border border-theme-modal-border rounded-lg hover:bg-theme-bg-primary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-black bg-white rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading
                ? isEditing
                  ? "Updating..."
                  : "Creating..."
                : isEditing
                ? "Update Connection"
                : "Create Connection"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

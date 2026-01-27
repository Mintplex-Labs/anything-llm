import { useState } from "react";
import { X, PencilSimple } from "@phosphor-icons/react";
import WorkspaceTemplate from "@/models/workspaceTemplate";
import showToast from "@/utils/toast";
import ProviderSelect from "./ProviderSelect";
import ModelSelect from "./ModelSelect";

// Map internal field names to user friendly labels
const FIELD_LABELS = {
  openAiPrompt: "System Prompt",
  openAiTemp: "Temperature",
  openAiHistory: "Chat History Length",
  similarityThreshold: "Similarity Threshold",
  chatProvider: "Chat Provider",
  chatModel: "Chat Model",
  topN: "Top Results (N)",
  chatMode: "Chat Mode",
  agentProvider: "Agent Provider",
  agentModel: "Agent Model",
  queryRefusalResponse: "Query Refusal Response",
  vectorSearchMode: "Vector Search Mode",
};

// Options for simple select fields
const FIELD_OPTIONS = {
  chatMode: [
    { value: "", label: "System default" },
    { value: "chat", label: "Chat" },
    { value: "query", label: "Query" },
  ],
  vectorSearchMode: [
    { value: "", label: "System default" },
    { value: "default", label: "Default" },
    { value: "rerank", label: "Rerank" },
  ],
};

// Group fields by category - provider/model fields are handled specially
const FIELD_GROUPS = {
  "Chat Settings": [
    "chatProvider",
    "chatModel",
    "chatMode",
    "openAiTemp",
    "openAiHistory",
  ],
  "RAG Settings": [
    "topN",
    "similarityThreshold",
    "vectorSearchMode",
    "queryRefusalResponse",
  ],
  "Agent Settings": ["agentProvider", "agentModel"],
  "System Prompt": ["openAiPrompt"],
};

// Fields that use special components
const PROVIDER_FIELDS = ["chatProvider", "agentProvider"];
const MODEL_FIELDS = ["chatModel", "agentModel"];
const SELECT_FIELDS = ["chatMode", "vectorSearchMode"];
const TEXTAREA_FIELDS = ["queryRefusalResponse", "openAiPrompt"];
const NUMBER_FIELDS = [
  "openAiTemp",
  "openAiHistory",
  "topN",
  "similarityThreshold",
];

function formatValue(key, value) {
  if (value === null || value === undefined || value === "") {
    return null;
  }
  if (key === "chatMode" && value) {
    return value.charAt(0).toUpperCase() + value.slice(1);
  }
  return String(value);
}

function parseConfig(template) {
  try {
    return typeof template.config === "string"
      ? JSON.parse(template.config)
      : template.config || {};
  } catch {
    return {};
  }
}

export default function TemplatePreviewModal({ template, onClose, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editConfig, setEditConfig] = useState(() => parseConfig(template));

  const handleSave = async () => {
    setSaving(true);
    const { template: updatedTemplate, message } =
      await WorkspaceTemplate.update(template.id, { config: editConfig });

    if (updatedTemplate) {
      showToast("Settings updated successfully", "success", { clear: true });
      if (onUpdate) onUpdate(updatedTemplate);
      setIsEditing(false);
    } else {
      showToast(`Error: ${message}`, "error", { clear: true });
    }
    setSaving(false);
  };

  const updateConfigField = (key, value) => {
    setEditConfig((prev) => ({
      ...prev,
      [key]: value === "" ? null : value,
    }));
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setEditConfig(parseConfig(template));
  };

  const config = parseConfig(template);

  const renderField = (key) => {
    const value = formatValue(key, config[key]);

    // Provider fields
    if (PROVIDER_FIELDS.includes(key)) {
      const type = key === "agentProvider" ? "agent" : "chat";
      if (isEditing) {
        return (
          <div className="w-1/2">
            <ProviderSelect
              value={editConfig[key]}
              onChange={(val) => updateConfigField(key, val)}
              type={type}
            />
          </div>
        );
      }
      return value ? (
        <span className="text-sm text-theme-text-primary font-medium">
          {value}
        </span>
      ) : (
        <span className="text-sm text-theme-text-secondary italic">
          System default
        </span>
      );
    }

    // Model fields
    if (MODEL_FIELDS.includes(key)) {
      const providerKey =
        key === "agentModel" ? "agentProvider" : "chatProvider";
      const provider = isEditing
        ? editConfig[providerKey]
        : config[providerKey];
      const type = key === "agentModel" ? "agent" : "chat";

      if (isEditing) {
        return (
          <div className="w-1/2">
            <ModelSelect
              provider={provider}
              value={editConfig[key]}
              onChange={(val) => updateConfigField(key, val)}
              type={type}
            />
          </div>
        );
      }
      return value ? (
        <span className="text-sm text-theme-text-primary font-medium">
          {value}
        </span>
      ) : (
        <span className="text-sm text-theme-text-secondary italic">
          System default
        </span>
      );
    }

    // Select fields
    if (SELECT_FIELDS.includes(key)) {
      if (isEditing) {
        return (
          <div className="w-1/2">
            <select
              value={editConfig[key] || ""}
              onChange={(e) => updateConfigField(key, e.target.value)}
              className="w-full bg-theme-settings-input-bg text-theme-text-primary text-sm rounded px-2 py-1 outline-none focus:ring-1 focus:ring-primary-button border border-theme-modal-border h-8"
            >
              {FIELD_OPTIONS[key]?.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        );
      }
      return value ? (
        <span className="text-sm text-theme-text-primary font-medium">
          {value}
        </span>
      ) : (
        <span className="text-sm text-theme-text-secondary italic">
          System default
        </span>
      );
    }

    // Textarea fields (in row context - queryRefusalResponse)
    if (TEXTAREA_FIELDS.includes(key) && key !== "openAiPrompt") {
      if (isEditing) {
        return (
          <div className="w-1/2">
            <textarea
              value={editConfig[key] || ""}
              onChange={(e) => updateConfigField(key, e.target.value)}
              className="w-full bg-theme-settings-input-bg text-theme-text-primary text-sm rounded px-2 py-1 outline-none focus:ring-1 focus:ring-primary-button resize-none border border-theme-modal-border"
              placeholder="System default"
              rows={2}
            />
          </div>
        );
      }
      return value ? (
        <span className="text-sm text-theme-text-primary font-medium">
          {value}
        </span>
      ) : (
        <span className="text-sm text-theme-text-secondary italic">
          System default
        </span>
      );
    }

    // Number fields
    if (NUMBER_FIELDS.includes(key)) {
      if (isEditing) {
        return (
          <div className="w-1/2">
            <input
              type="number"
              value={editConfig[key] ?? ""}
              onChange={(e) => updateConfigField(key, e.target.value)}
              className="w-full bg-theme-settings-input-bg text-theme-text-primary text-sm rounded px-2 py-1 outline-none focus:ring-1 focus:ring-primary-button text-right border border-theme-modal-border h-8"
              placeholder="System default"
              step="any"
            />
          </div>
        );
      }
      return value !== null ? (
        <span className="text-sm text-theme-text-primary font-medium">
          {value}
        </span>
      ) : (
        <span className="text-sm text-theme-text-secondary italic">
          System default
        </span>
      );
    }

    // Fallback text
    if (isEditing) {
      return (
        <div className="w-1/2">
          <input
            type="text"
            value={editConfig[key] ?? ""}
            onChange={(e) => updateConfigField(key, e.target.value)}
            className="w-full bg-theme-settings-input-bg text-theme-text-primary text-sm rounded px-2 py-1 outline-none focus:ring-1 focus:ring-primary-button text-right border border-theme-modal-border h-8"
            placeholder="System default"
          />
        </div>
      );
    }
    return value ? (
      <span className="text-sm text-theme-text-primary font-medium">
        {value}
      </span>
    ) : (
      <span className="text-sm text-theme-text-secondary italic">
        System default
      </span>
    );
  };

  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center">
      <div className="relative w-full max-w-2xl bg-theme-bg-secondary rounded-lg shadow border-2 border-theme-modal-border">
        {/* Header */}
        <div className="relative p-6 border-b rounded-t border-theme-modal-border">
          <div className="w-full flex gap-x-2 items-center">
            <h3 className="text-xl font-semibold text-theme-text-primary overflow-hidden overflow-ellipsis whitespace-nowrap">
              {template.name}
            </h3>
          </div>
          {template.description && (
            <p className="text-theme-text-secondary text-xs md:text-sm mt-2">
              {template.description}
            </p>
          )}
          <button
            onClick={onClose}
            type="button"
            className="absolute top-4 right-4 transition-all duration-300 bg-transparent rounded-lg text-sm p-1 inline-flex items-center hover:bg-theme-modal-border hover:border-theme-modal-border hover:border-opacity-50 border-transparent border"
          >
            <X size={24} weight="bold" className="text-theme-text-primary" />
          </button>
        </div>

        {/* Content */}
        <div className="px-7 py-6">
          <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2 show-scrollbar">
            {Object.entries(FIELD_GROUPS).map(([groupName, fields]) => {
              const isSystemPromptGroup = groupName === "System Prompt";

              return (
                <div key={groupName}>
                  <h4 className="text-sm font-semibold text-theme-text-secondary uppercase tracking-wide mb-3">
                    {groupName}
                  </h4>
                  {isSystemPromptGroup ? (
                    isEditing ? (
                      <textarea
                        value={editConfig.openAiPrompt || ""}
                        onChange={(e) =>
                          updateConfigField("openAiPrompt", e.target.value)
                        }
                        className="w-full bg-theme-settings-input-bg text-theme-text-primary rounded-lg p-4 outline-none focus:ring-1 focus:ring-primary-button resize-none text-sm border border-theme-modal-border"
                        placeholder="Enter system prompt or leave blank for system default"
                        rows={6}
                      />
                    ) : (
                      <div className="bg-theme-settings-input-bg rounded-lg p-4">
                        {config.openAiPrompt ? (
                          <p className="text-sm text-theme-text-primary whitespace-pre-wrap break-words">
                            {config.openAiPrompt}
                          </p>
                        ) : (
                          <p className="text-sm text-theme-text-secondary italic">
                            Uses system default
                          </p>
                        )}
                      </div>
                    )
                  ) : (
                    <div className="bg-theme-settings-input-bg rounded-lg divide-y divide-theme-modal-border">
                      {fields.map((key) => (
                        <div
                          key={key}
                          className="flex items-center justify-between px-4 py-2 min-h-[48px]"
                        >
                          <span className="text-sm text-theme-text-secondary">
                            {FIELD_LABELS[key]}
                          </span>
                          {renderField(key)}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div className="flex justify-between items-center mt-6 pt-6 border-t border-theme-modal-border">
            {isEditing ? (
              <>
                <button
                  onClick={cancelEdit}
                  type="button"
                  className="transition-all duration-300 text-theme-text-primary hover:bg-theme-sidebar-item-hover px-4 py-2 rounded-lg text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  type="button"
                  className="transition-all duration-300 bg-white text-black hover:opacity-60 px-4 py-2 rounded-lg text-sm disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  type="button"
                  className="transition-all duration-300 text-theme-text-primary hover:bg-theme-sidebar-item-hover px-4 py-2 rounded-lg text-sm flex items-center gap-x-2"
                >
                  <PencilSimple size={16} weight="bold" />
                  Edit Settings
                </button>
                <button
                  onClick={onClose}
                  type="button"
                  className="transition-all duration-300 text-theme-text-primary hover:bg-theme-sidebar-item-hover px-4 py-2 rounded-lg text-sm"
                >
                  Close
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

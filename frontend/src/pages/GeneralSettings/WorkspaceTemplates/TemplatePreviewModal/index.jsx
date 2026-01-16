import { X } from "@phosphor-icons/react";

// Map internal field names to user friendly labels
// Should match templateFields in server/models/workspaceTemplate.js
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

// Group fields by category
const FIELD_GROUPS = {
  "Chat Settings": ["chatProvider", "chatModel", "chatMode", "openAiTemp", "openAiHistory"],
  "RAG Settings": ["topN", "similarityThreshold", "vectorSearchMode", "queryRefusalResponse"],
  "Agent Settings": ["agentProvider", "agentModel"],
  "System Prompt": ["openAiPrompt"],
};

function formatValue(key, value) {
  if (value === null || value === undefined || value === "") {
    return null;
  }
  if (key === "chatMode" && value) {
    return value.charAt(0).toUpperCase() + value.slice(1);
  }
  return String(value);
}

export default function TemplatePreviewModal({ template, onClose }) {
  // Parse the template config
  let config = {};
  try {
    config = typeof template.config === "string"
      ? JSON.parse(template.config)
      : template.config || {};
  } catch {
    config = {};
  }

  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center">
      <div className="relative w-full max-w-2xl bg-theme-bg-secondary rounded-lg shadow border-2 border-theme-modal-border">
        {/* Header */}
        <div className="relative p-6 border-b rounded-t border-theme-modal-border">
          <div className="w-full flex gap-x-2 items-center">
            <h3 className="text-xl font-semibold text-white overflow-hidden overflow-ellipsis whitespace-nowrap">
              {template.name}
            </h3>
          </div>
          {template.description && (
            <p className="text-white text-opacity-60 text-xs md:text-sm mt-2">
              {template.description}
            </p>
          )}
          <button
            onClick={onClose}
            type="button"
            className="absolute top-4 right-4 transition-all duration-300 bg-transparent rounded-lg text-sm p-1 inline-flex items-center hover:bg-theme-modal-border hover:border-theme-modal-border hover:border-opacity-50 border-transparent border"
          >
            <X size={24} weight="bold" className="text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="px-7 py-6">
          <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2 show-scrollbar">
            {Object.entries(FIELD_GROUPS).map(([groupName, fields]) => {
              const isSystemPromptGroup = groupName === "System Prompt";

              return (
                <div key={groupName}>
                  <h4 className="text-sm font-semibold text-white text-opacity-60 uppercase tracking-wide mb-3">
                    {groupName}
                  </h4>
                  {isSystemPromptGroup ? (
                    <div className="bg-theme-settings-input-bg rounded-lg p-4">
                      {config.openAiPrompt ? (
                        <p className="text-sm text-white whitespace-pre-wrap break-words">
                          {config.openAiPrompt}
                        </p>
                      ) : (
                        <p className="text-sm text-white text-opacity-60 italic">
                          Uses system default
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="bg-theme-settings-input-bg rounded-lg divide-y divide-theme-modal-border">
                      {fields.map((key) => {
                        const value = formatValue(key, config[key]);
                        return (
                          <div
                            key={key}
                            className="flex items-center justify-between px-4 py-3"
                          >
                            <span className="text-sm text-white text-opacity-60">
                              {FIELD_LABELS[key]}
                            </span>
                            {value !== null ? (
                              <span className="text-sm text-white font-medium">
                                {value}
                              </span>
                            ) : (
                              <span className="text-sm text-white text-opacity-60 italic">
                                System default
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div className="flex justify-end items-center mt-6 pt-6 border-t border-theme-modal-border">
            <button
              onClick={onClose}
              type="button"
              className="transition-all duration-300 text-white hover:bg-zinc-700 px-4 py-2 rounded-lg text-sm"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

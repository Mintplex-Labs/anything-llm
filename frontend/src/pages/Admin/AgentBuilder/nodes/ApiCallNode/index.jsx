import React, { useRef, useState } from "react";
import { Plus, X, CaretDown } from "@phosphor-icons/react";

export default function ApiCallNode({
  config,
  onConfigChange,
  renderVariableSelect,
}) {
  const urlInputRef = useRef(null);
  const [showVarMenu, setShowVarMenu] = useState(false);
  const varButtonRef = useRef(null);

  const handleHeaderChange = (index, field, value) => {
    const newHeaders = [...(config.headers || [])];
    newHeaders[index] = { ...newHeaders[index], [field]: value };
    onConfigChange({ headers: newHeaders });
  };

  const addHeader = () => {
    const newHeaders = [...(config.headers || []), { key: "", value: "" }];
    onConfigChange({ headers: newHeaders });
  };

  const removeHeader = (index) => {
    const newHeaders = [...(config.headers || [])].filter(
      (_, i) => i !== index
    );
    onConfigChange({ headers: newHeaders });
  };

  const insertVariableAtCursor = (variableName) => {
    if (!urlInputRef.current) return;

    const input = urlInputRef.current;
    const start = input.selectionStart;
    const end = input.selectionEnd;
    const currentValue = config.url;

    const newValue =
      currentValue.substring(0, start) +
      "${" +
      variableName +
      "}" +
      currentValue.substring(end);

    onConfigChange({ url: newValue });
    setShowVarMenu(false);

    // Set cursor position after the inserted variable
    setTimeout(() => {
      const newPosition = start + variableName.length + 3; // +3 for ${}
      input.setSelectionRange(newPosition, newPosition);
      input.focus();
    }, 0);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-white mb-2">URL</label>
        <div className="flex gap-2">
          <input
            ref={urlInputRef}
            type="text"
            placeholder="https://api.example.com/endpoint"
            value={config.url}
            onChange={(e) => onConfigChange({ url: e.target.value })}
            className="flex-1 p-2.5 text-sm rounded-lg bg-theme-bg-primary border border-white/5 text-white placeholder:text-white/20 focus:border-primary-button focus:ring-1 focus:ring-primary-button outline-none"
            autoComplete="off"
            spellCheck={false}
          />
          <div className="relative">
            <button
              ref={varButtonRef}
              onClick={() => setShowVarMenu(!showVarMenu)}
              className="h-full px-3 rounded-lg bg-theme-bg-primary border border-white/5 text-white hover:bg-theme-action-menu-item-hover transition-colors duration-300 flex items-center gap-1"
              title="Insert variable"
            >
              <Plus className="w-4 h-4" />
              <CaretDown className="w-3 h-3" />
            </button>
            {showVarMenu && (
              <div className="absolute right-0 top-[calc(100%+4px)] w-48 bg-theme-bg-primary border border-white/5 rounded-lg shadow-lg z-10">
                {renderVariableSelect(
                  "",
                  insertVariableAtCursor,
                  "Select variable to insert",
                  true
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-white mb-2">
          Method
        </label>
        <select
          value={config.method}
          onChange={(e) => onConfigChange({ method: e.target.value })}
          className="w-full p-2.5 text-sm rounded-lg bg-theme-bg-primary border border-white/5 text-white focus:border-primary-button focus:ring-1 focus:ring-primary-button outline-none"
        >
          {["GET", "POST", "DELETE"].map((method) => (
            <option key={method} value={method} className="bg-theme-bg-primary">
              {method}
            </option>
          ))}
        </select>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-white">Headers</label>
          <button
            onClick={addHeader}
            className="p-1.5 rounded-lg bg-theme-bg-primary border border-white/5 text-white hover:bg-theme-action-menu-item-hover transition-colors duration-300"
            title="Add header"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="space-y-2">
          {(config.headers || []).map((header, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                placeholder="Header name"
                value={header.key}
                onChange={(e) =>
                  handleHeaderChange(index, "key", e.target.value)
                }
                className="flex-1 p-2.5 text-sm rounded-lg bg-theme-bg-primary border border-white/5 text-white placeholder:text-white/20 focus:border-primary-button focus:ring-1 focus:ring-primary-button outline-none"
                autoComplete="off"
                spellCheck={false}
              />
              <input
                type="text"
                placeholder="Value"
                value={header.value}
                onChange={(e) =>
                  handleHeaderChange(index, "value", e.target.value)
                }
                className="flex-1 p-2.5 text-sm rounded-lg bg-theme-bg-primary border border-white/5 text-white placeholder:text-white/20 focus:border-primary-button focus:ring-1 focus:ring-primary-button outline-none"
                autoComplete="off"
                spellCheck={false}
              />
              <button
                onClick={() => removeHeader(index)}
                className="p-2.5 rounded-lg bg-theme-bg-primary border border-white/5 text-white hover:text-red-500 hover:border-red-500/20 hover:bg-red-500/10 transition-colors duration-300"
                title="Remove header"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {["POST", "PUT", "PATCH"].includes(config.method) && (
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Request Body
          </label>
          <div className="space-y-2">
            <select
              value={config.bodyType || "json"}
              onChange={(e) => onConfigChange({ bodyType: e.target.value })}
              className="w-full p-2.5 text-sm rounded-lg bg-theme-bg-primary border border-white/5 text-white focus:border-primary-button focus:ring-1 focus:ring-primary-button outline-none"
            >
              <option value="json" className="bg-theme-bg-primary">
                JSON
              </option>
              <option value="text" className="bg-theme-bg-primary">
                Raw Text
              </option>
              <option value="form" className="bg-theme-bg-primary">
                Form Data
              </option>
            </select>
            {config.bodyType === "json" ? (
              <textarea
                placeholder='{"key": "value"}'
                value={config.body}
                onChange={(e) => onConfigChange({ body: e.target.value })}
                className="w-full p-2.5 text-sm rounded-lg bg-theme-bg-primary border border-white/5 text-white placeholder:text-white/20 focus:border-primary-button focus:ring-1 focus:ring-primary-button outline-none font-mono"
                rows={4}
                autoComplete="off"
                spellCheck={false}
              />
            ) : config.bodyType === "form" ? (
              <div className="space-y-2">
                {(config.formData || []).map((item, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Key"
                      value={item.key}
                      onChange={(e) => {
                        const newFormData = [...(config.formData || [])];
                        newFormData[index] = { ...item, key: e.target.value };
                        onConfigChange({ formData: newFormData });
                      }}
                      className="flex-1 p-2.5 text-sm rounded-lg bg-theme-bg-primary border border-white/5 text-white placeholder:text-white/20 focus:border-primary-button focus:ring-1 focus:ring-primary-button outline-none"
                      autoComplete="off"
                      spellCheck={false}
                    />
                    <input
                      type="text"
                      placeholder="Value"
                      value={item.value}
                      onChange={(e) => {
                        const newFormData = [...(config.formData || [])];
                        newFormData[index] = { ...item, value: e.target.value };
                        onConfigChange({ formData: newFormData });
                      }}
                      className="flex-1 p-2.5 text-sm rounded-lg bg-theme-bg-primary border border-white/5 text-white placeholder:text-white/20 focus:border-primary-button focus:ring-1 focus:ring-primary-button outline-none"
                      autoComplete="off"
                      spellCheck={false}
                    />
                    <button
                      onClick={() => {
                        const newFormData = [...(config.formData || [])].filter(
                          (_, i) => i !== index
                        );
                        onConfigChange({ formData: newFormData });
                      }}
                      className="p-2.5 rounded-lg bg-theme-bg-primary border border-white/5 text-white hover:text-red-500 hover:border-red-500/20 hover:bg-red-500/10 transition-colors duration-300"
                      title="Remove field"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => {
                    const newFormData = [
                      ...(config.formData || []),
                      { key: "", value: "" },
                    ];
                    onConfigChange({ formData: newFormData });
                  }}
                  className="w-full p-2.5 rounded-lg bg-theme-bg-primary border border-white/5 text-white hover:bg-theme-action-menu-item-hover transition-colors duration-300 text-sm"
                >
                  Add Form Field
                </button>
              </div>
            ) : (
              <textarea
                placeholder="Raw request body..."
                value={config.body}
                onChange={(e) => onConfigChange({ body: e.target.value })}
                className="w-full p-2.5 text-sm rounded-lg bg-theme-bg-primary border border-white/5 text-white placeholder:text-white/20 focus:border-primary-button focus:ring-1 focus:ring-primary-button outline-none"
                rows={4}
                autoComplete="off"
                spellCheck={false}
              />
            )}
          </div>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-white mb-2">
          Store Response In
        </label>
        {renderVariableSelect(
          config.responseVariable,
          (value) => onConfigChange({ responseVariable: value }),
          "Select or create variable"
        )}
      </div>
    </div>
  );
}

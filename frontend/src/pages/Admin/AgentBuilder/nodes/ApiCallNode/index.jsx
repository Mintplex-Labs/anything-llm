import React from "react";

export default function ApiCallNode({
  config,
  onConfigChange,
  renderVariableSelect,
}) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-white mb-2">URL</label>
        <input
          type="text"
          placeholder="https://api.example.com/endpoint"
          value={config.url}
          onChange={(e) => onConfigChange({ url: e.target.value })}
          className="w-full p-2.5 text-sm rounded-lg bg-theme-bg-primary border border-white/5 text-white placeholder:text-white/20 focus:border-primary-button focus:ring-1 focus:ring-primary-button outline-none"
          autoComplete="off"
          spellCheck={false}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-white mb-2">Method</label>
        <select
          value={config.method}
          onChange={(e) => onConfigChange({ method: e.target.value })}
          className="w-full p-2.5 text-sm rounded-lg bg-theme-bg-primary border border-white/5 text-white focus:border-primary-button focus:ring-1 focus:ring-primary-button outline-none"
        >
          {["GET", "POST", "PUT", "DELETE"].map((method) => (
            <option key={method} value={method} className="bg-theme-bg-primary">
              {method}
            </option>
          ))}
        </select>
      </div>
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

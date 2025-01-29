import React from "react";

export default function CodeNode({
  config,
  onConfigChange,
  renderVariableSelect,
}) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-white mb-2">
          Language
        </label>
        <select
          value={config.language}
          onChange={(e) => onConfigChange({ language: e.target.value })}
          className="w-full p-2.5 text-sm rounded-lg bg-theme-bg-primary border border-white/5 text-white focus:border-primary-button focus:ring-1 focus:ring-primary-button outline-none"
        >
          <option value="javascript" className="bg-theme-bg-primary">
            JavaScript
          </option>
          <option value="python" className="bg-theme-bg-primary">
            Python
          </option>
          <option value="shell" className="bg-theme-bg-primary">
            Shell
          </option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-white mb-2">
          Code
        </label>
        <textarea
          placeholder="Enter code..."
          value={config.code}
          onChange={(e) => onConfigChange({ code: e.target.value })}
          className="w-full p-2.5 text-sm rounded-lg bg-theme-bg-primary border border-white/5 text-white placeholder:text-white/20 focus:border-primary-button focus:ring-1 focus:ring-primary-button outline-none font-mono"
          rows={5}
          autoComplete="off"
          spellCheck={false}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-white mb-2">
          Store Result In
        </label>
        {renderVariableSelect(
          config.resultVariable,
          (value) => onConfigChange({ resultVariable: value }),
          "Select or create variable"
        )}
      </div>
    </div>
  );
}

import React from 'react';

export default function CodeNode({ config, onConfigChange, renderVariableSelect }) {
  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm text-theme-text-secondary">Language</label>
        <select
          value={config.language}
          onChange={(e) => onConfigChange({ language: e.target.value })}
          className="w-full p-2 rounded bg-theme-bg-primary border border-theme-sidebar-border text-theme-text-primary"
        >
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
          <option value="shell">Shell</option>
        </select>
      </div>
      <div>
        <label className="text-sm text-theme-text-secondary">Code</label>
        <textarea
          placeholder="Enter code..."
          value={config.code}
          onChange={(e) => onConfigChange({ code: e.target.value })}
          className="w-full p-2 rounded bg-theme-bg-primary border border-theme-sidebar-border text-theme-text-primary font-mono"
          rows={5}
        />
      </div>
      <div>
        <label className="text-sm text-theme-text-secondary">Store Result In</label>
        {renderVariableSelect(
          config.resultVariable,
          (value) => onConfigChange({ resultVariable: value }),
          "Select or create variable"
        )}
      </div>
    </div>
  );
}
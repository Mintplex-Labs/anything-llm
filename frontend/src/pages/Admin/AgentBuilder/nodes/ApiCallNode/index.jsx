import React from 'react';

export default function ApiCallNode({ config, onConfigChange, renderVariableSelect }) {
  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm text-theme-text-secondary">URL</label>
        <input
          type="text"
          placeholder="https://api.example.com/endpoint"
          value={config.url}
          onChange={(e) => onConfigChange({ url: e.target.value })}
          className="w-full p-2 rounded bg-theme-bg-primary border border-theme-sidebar-border text-theme-text-primary"
        />
      </div>
      <div>
        <label className="text-sm text-theme-text-secondary">Method</label>
        <select
          value={config.method}
          onChange={(e) => onConfigChange({ method: e.target.value })}
          className="w-full p-2 rounded bg-theme-bg-primary border border-theme-sidebar-border text-theme-text-primary"
        >
          {['GET', 'POST', 'PUT', 'DELETE'].map(method => (
            <option key={method} value={method}>{method}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="text-sm text-theme-text-secondary">Store Response In</label>
        {renderVariableSelect(
          config.responseVariable,
          (value) => onConfigChange({ responseVariable: value }),
          "Select or create variable"
        )}
      </div>
    </div>
  );
}
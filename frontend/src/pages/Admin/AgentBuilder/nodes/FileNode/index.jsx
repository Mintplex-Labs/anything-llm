import React from 'react';

export default function FileNode({ config, onConfigChange, renderVariableSelect }) {
  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm text-theme-text-secondary">Operation</label>
        <select
          value={config.operation}
          onChange={(e) => onConfigChange({ operation: e.target.value })}
          className="w-full p-2 rounded bg-theme-bg-primary border border-theme-sidebar-border text-theme-text-primary"
        >
          <option value="read">Read File</option>
          <option value="write">Write File</option>
          <option value="append">Append to File</option>
        </select>
      </div>
      <div>
        <label className="text-sm text-theme-text-secondary">File Path</label>
        <input
          type="text"
          placeholder="/path/to/file"
          value={config.path}
          onChange={(e) => onConfigChange({ path: e.target.value })}
          className="w-full p-2 rounded bg-theme-bg-primary border border-theme-sidebar-border text-theme-text-primary"
        />
      </div>
      {config.operation !== 'read' && (
        <div>
          <label className="text-sm text-theme-text-secondary">Content</label>
          <textarea
            placeholder="File content..."
            value={config.content}
            onChange={(e) => onConfigChange({ content: e.target.value })}
            className="w-full p-2 rounded bg-theme-bg-primary border border-theme-sidebar-border text-theme-text-primary"
            rows={3}
          />
        </div>
      )}
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
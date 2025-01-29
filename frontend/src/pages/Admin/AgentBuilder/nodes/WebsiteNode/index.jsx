import React from "react";

export default function WebsiteNode({
  config,
  onConfigChange,
  renderVariableSelect,
}) {
  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm text-theme-text-secondary">URL</label>
        <input
          type="text"
          placeholder="https://example.com"
          value={config.url}
          onChange={(e) => onConfigChange({ url: e.target.value })}
          className="w-full p-2 rounded bg-theme-bg-primary border border-theme-sidebar-border text-theme-text-primary"
        />
      </div>
      <div>
        <label className="text-sm text-theme-text-secondary">Action</label>
        <select
          value={config.action}
          onChange={(e) => onConfigChange({ action: e.target.value })}
          className="w-full p-2 rounded bg-theme-bg-primary border border-theme-sidebar-border text-theme-text-primary"
        >
          <option value="read">Read Content</option>
          <option value="click">Click Element</option>
          <option value="type">Type Text</option>
        </select>
      </div>
      <div>
        <label className="text-sm text-theme-text-secondary">
          CSS Selector
        </label>
        <input
          type="text"
          placeholder="#element-id or .class-name"
          value={config.selector}
          onChange={(e) => onConfigChange({ selector: e.target.value })}
          className="w-full p-2 rounded bg-theme-bg-primary border border-theme-sidebar-border text-theme-text-primary"
        />
      </div>
      <div>
        <label className="text-sm text-theme-text-secondary">
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

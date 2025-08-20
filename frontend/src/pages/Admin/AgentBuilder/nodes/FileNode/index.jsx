import React from "react";

export default function FileNode({
  config,
  onConfigChange,
  renderVariableSelect,
}) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Operation
        </label>
        <select
          value={config.operation}
          onChange={(e) => onConfigChange({ operation: e.target.value })}
          className="w-full p-2.5 text-sm rounded-lg bg-theme-bg-primary border border-border/5 text-foreground focus:border-primary-button focus:ring-1 focus:ring-primary-button outline-none"
        >
          <option value="read" className="bg-theme-bg-primary">
            Read File
          </option>
          <option value="write" className="bg-theme-bg-primary">
            Write File
          </option>
          <option value="append" className="bg-theme-bg-primary">
            Append to File
          </option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          File Path
        </label>
        <input
          type="text"
          placeholder="/path/to/file"
          value={config.path}
          onChange={(e) => onConfigChange({ path: e.target.value })}
          className="w-full p-2.5 text-sm rounded-lg bg-theme-bg-primary border border-border/5 text-foreground placeholder:text-foreground/20 focus:border-primary-button focus:ring-1 focus:ring-primary-button outline-none"
          autoComplete="off"
          spellCheck={false}
        />
      </div>
      {config.operation !== "read" && (
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Content
          </label>
          <textarea
            placeholder="File content..."
            value={config.content}
            onChange={(e) => onConfigChange({ content: e.target.value })}
            className="w-full p-2.5 text-sm rounded-lg bg-theme-bg-primary border border-border/5 text-foreground placeholder:text-foreground/20 focus:border-primary-button focus:ring-1 focus:ring-primary-button outline-none"
            rows={3}
            autoComplete="off"
            spellCheck={false}
          />
        </div>
      )}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
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

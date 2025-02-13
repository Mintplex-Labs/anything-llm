import React from "react";

export default function WebScrapingNode({
  config,
  onConfigChange,
  renderVariableSelect,
}) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-theme-text-primary mb-2">
          URL to Scrape
        </label>
        <input
          type="url"
          value={config?.url || ""}
          onChange={(e) =>
            onConfigChange({
              ...config,
              url: e.target.value,
            })
          }
          className="w-full border-none bg-theme-settings-input-bg text-theme-text-primary placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none p-2.5"
          placeholder="https://example.com"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-theme-text-primary mb-2">
          Result Variable
        </label>
        {renderVariableSelect(
          config.resultVariable,
          (value) => onConfigChange({ ...config, resultVariable: value }),
          "Select or create variable",
          true
        )}
      </div>
    </div>
  );
}

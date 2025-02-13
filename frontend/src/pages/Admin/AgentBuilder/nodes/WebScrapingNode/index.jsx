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
          Capture Page Content As
        </label>
        <select
          value={config.captureAs}
          onChange={(e) => onConfigChange({ captureAs: e.target.value })}
          className="w-full border-none bg-theme-settings-input-bg text-theme-text-primary text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none p-2.5"
        >
          {[
            { label: "Text content only", value: "text" },
            { label: "Raw HTML", value: "html" },
            { label: "CSS Query Selector", value: "querySelector" },
          ].map((captureAs) => (
            <option
              key={captureAs.value}
              value={captureAs.value}
              className="bg-theme-settings-input-bg"
            >
              {captureAs.label}
            </option>
          ))}
        </select>
      </div>

      {config.captureAs === "querySelector" && (
        <div>
          <label className="block text-sm font-medium text-theme-text-primary mb-2">
            Query Selector
          </label>
          <p className="text-xs text-theme-text-secondary mb-2">
            Enter a valid CSS selector to scrape the content of the page.
          </p>
          <input
            value={config.querySelector}
            onChange={(e) => onConfigChange({ querySelector: e.target.value })}
            placeholder=".article-content, #content, .main-content, etc."
            className="w-full border-none bg-theme-settings-input-bg text-theme-text-primary text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none p-2.5"
          />
        </div>
      )}

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

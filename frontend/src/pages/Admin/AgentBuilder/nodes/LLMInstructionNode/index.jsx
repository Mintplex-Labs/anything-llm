import React from "react";

export default function LLMInstructionNode({
  config,
  onConfigChange,
  renderVariableSelect,
}) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-white mb-2">
          Input Variable
        </label>
        {renderVariableSelect(
          config.inputVariable,
          (value) => onConfigChange({ ...config, inputVariable: value }),
          "Select input variable"
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-white mb-2">
          Instruction
        </label>
        <textarea
          value={config?.instruction || ""}
          onChange={(e) =>
            onConfigChange({
              ...config,
              instruction: e.target.value,
            })
          }
          className="w-full p-2.5 text-sm rounded-lg bg-theme-bg-primary border border-white/5 text-white placeholder:text-white/20 focus:border-primary-button focus:ring-1 focus:ring-primary-button outline-none"
          rows={3}
          placeholder="Enter instructions for the LLM..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-white mb-2">
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
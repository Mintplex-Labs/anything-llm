import React from "react";
import VariableInput from "../../VariableInput";

export default function LLMInstructionNode({
  config,
  onConfigChange,
  renderVariableSelect,
}) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-theme-text-primary mb-2">
          Instruction
        </label>
        <VariableInput
          multiline
          rows={3}
          value={config?.instruction || ""}
          onChange={(e) =>
            onConfigChange({
              ...config,
              instruction: e.target.value,
            })
          }
          placeholder="Enter instructions for the LLM..."
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

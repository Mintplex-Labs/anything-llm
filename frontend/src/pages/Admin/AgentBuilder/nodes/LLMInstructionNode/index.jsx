import React from "react";
import { useTranslation } from "react-i18next";
import VariableInput from "../../VariableInput";

export default function LLMInstructionNode({
  config,
  onConfigChange,
  renderVariableSelect,
}) {
  const { t } = useTranslation();

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-theme-text-primary mb-2">
          {t("agentBuilder.llmInstruction.instruction")}
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
          placeholder={t("agentBuilder.llmInstruction.instructionPlaceholder")}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-theme-text-primary mb-2">
          {t("agentBuilder.llmInstruction.resultVariable")}
        </label>
        {renderVariableSelect(
          config.resultVariable,
          (value) => onConfigChange({ ...config, resultVariable: value }),
          t("agentBuilder.selectOrCreateVariable"),
          true
        )}
      </div>
    </div>
  );
}

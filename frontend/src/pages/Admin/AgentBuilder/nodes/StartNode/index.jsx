import React, { Fragment } from "react";
import { Plus, X } from "@phosphor-icons/react";
import { VARIABLE_HIGHLIGHT_CLASS } from "../../VariableInput";

const INPUT_CLASS =
  "border-none bg-theme-settings-input-bg text-theme-text-primary placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none p-2.5";

/**
 * Variable categories controlling LLM exposure. Variables saved before
 * categories existed have no `type` and are treated as "optional".
 */
const VARIABLE_TYPES = [
  {
    value: "required",
    label: "Required",
    hint: "The LLM must provide a value when it runs this flow.",
  },
  {
    value: "optional",
    label: "Optional",
    hint: "Has an initial value the LLM can override.",
  },
  {
    value: "static",
    label: "Static",
    hint: "Fixed value, hidden from the LLM entirely.",
  },
];

export default function StartNode({
  config,
  onConfigChange,
  onDeleteVariable,
}) {
  const handleDeleteVariable = (index, variableName) => {
    // First clean up references, then delete the variable
    onDeleteVariable(variableName);
    const newVars = config.variables.filter((_, i) => i !== index);
    onConfigChange({ variables: newVars });
  };

  const updateVariable = (index, updates) => {
    const newVars = [...config.variables];
    newVars[index] = { ...newVars[index], ...updates };
    onConfigChange({ variables: newVars });
  };

  const definedVariables = config.variables.filter((v) => v.name);
  const exampleVariables = definedVariables.slice(0, 3);

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-theme-text-primary">
            Variables
          </h3>
          <button
            onClick={() => {
              const newVars = [
                ...config.variables,
                { name: "", value: "", type: "optional", description: "" },
              ];
              onConfigChange({ variables: newVars });
            }}
            className="p-1.5 rounded-lg border-none bg-theme-settings-input-bg text-theme-text-primary hover:bg-theme-action-menu-item-hover transition-colors duration-300"
            title="Add variable"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
        <p className="text-xs text-theme-text-secondary">
          Define values here, then reference them in any block below by wrapping
          the name in{" "}
          <span
            className={`${VARIABLE_HIGHLIGHT_CLASS} px-1 py-0.5 text-theme-text-primary`}
          >
            {"${variableName}"}
          </span>
          . References are highlighted as you type.
        </p>
        <p className="text-xs text-theme-text-secondary">
          Required and Optional variables can be set by the LLM when it runs
          this flow. Static variables are fixed and never shown to the LLM.
        </p>
        {exampleVariables.length > 0 && (
          <p className="text-xs text-theme-text-secondary">
            For example:{" "}
            {exampleVariables.map((variable, index) => (
              <Fragment key={variable.name}>
                <span
                  className={`${VARIABLE_HIGHLIGHT_CLASS} px-1 py-0.5 text-theme-text-primary`}
                >
                  {`\${${variable.name}}`}
                </span>
                {index < exampleVariables.length - 1 && ", "}
              </Fragment>
            ))}
          </p>
        )}
      </div>
      {config.variables.map((variable, index) => {
        const type = variable.type || "optional";
        return (
          <div
            key={index}
            className="space-y-2 p-3 rounded-lg border border-theme-sidebar-border"
          >
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Variable name"
                value={variable.name}
                onChange={(e) =>
                  updateVariable(index, { name: e.target.value })
                }
                className={`flex-1 min-w-0 ${INPUT_CLASS}`}
                autoComplete="off"
                spellCheck={false}
              />
              <select
                value={type}
                onChange={(e) =>
                  updateVariable(index, { type: e.target.value })
                }
                title={VARIABLE_TYPES.find((t) => t.value === type)?.hint}
                className={INPUT_CLASS}
              >
                {VARIABLE_TYPES.map((t) => (
                  <option
                    key={t.value}
                    value={t.value}
                    className="bg-theme-bg-primary"
                  >
                    {t.label}
                  </option>
                ))}
              </select>
              {config.variables.length > 1 && (
                <button
                  onClick={() => handleDeleteVariable(index, variable.name)}
                  className="p-2.5 rounded-lg border-none bg-theme-settings-input-bg text-theme-text-primary hover:text-red-500 hover:border-red-500/20 hover:bg-red-500/10 transition-colors duration-300"
                  title="Delete variable"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            {type !== "required" && (
              <input
                type="text"
                placeholder={type === "static" ? "Value" : "Initial value"}
                value={variable.value}
                onChange={(e) =>
                  updateVariable(index, { value: e.target.value })
                }
                className={`w-full ${INPUT_CLASS}`}
                autoComplete="off"
                spellCheck={false}
              />
            )}
            {type !== "static" && (
              <input
                type="text"
                placeholder="Description for the LLM (what this value is for)"
                value={variable.description || ""}
                onChange={(e) =>
                  updateVariable(index, { description: e.target.value })
                }
                className={`w-full ${INPUT_CLASS}`}
                autoComplete="off"
                spellCheck={false}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

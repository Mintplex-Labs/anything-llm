import React, { Fragment } from "react";
import { Plus, X } from "@phosphor-icons/react";
import { VARIABLE_HIGHLIGHT_CLASS } from "../../VariableInput";

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

  const definedVariables = config.variables.filter((v) => v.name);
  const exampleVariables = definedVariables.slice(0, 3);

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <h3 className="text-sm font-medium text-theme-text-primary">
          Variables
        </h3>
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
      {config.variables.map((variable, index) => (
        <div key={index} className="flex gap-2">
          <input
            type="text"
            placeholder="Variable name"
            value={variable.name}
            onChange={(e) => {
              const newVars = [...config.variables];
              newVars[index].name = e.target.value;
              onConfigChange({ variables: newVars });
            }}
            className="flex-1 border-none bg-theme-settings-input-bg text-theme-text-primary placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none p-2.5"
            autoComplete="off"
            spellCheck={false}
          />
          <input
            type="text"
            placeholder="Initial value"
            value={variable.value}
            onChange={(e) => {
              const newVars = [...config.variables];
              newVars[index].value = e.target.value;
              onConfigChange({ variables: newVars });
            }}
            className="flex-1 border-none bg-theme-settings-input-bg text-theme-text-primary placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none p-2.5"
            autoComplete="off"
            spellCheck={false}
          />
          {config.variables.length > 1 && (
            <button
              onClick={() => handleDeleteVariable(index, variable.name)}
              className="p-2.5 rounded-lg border-none bg-theme-settings-input-bg text-theme-text-primary hover:text-red-500 hover:border-red-500/20 hover:bg-red-500/10 transition-colors duration-300"
              title="Delete variable"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          {index === config.variables.length - 1 && (
            <button
              onClick={() => {
                const newVars = [...config.variables, { name: "", value: "" }];
                onConfigChange({ variables: newVars });
              }}
              className="p-2.5 rounded-lg border-none bg-theme-settings-input-bg text-theme-text-primary hover:bg-theme-action-menu-item-hover transition-colors duration-300"
              title="Add variable"
            >
              <Plus className="w-4 h-4" />
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

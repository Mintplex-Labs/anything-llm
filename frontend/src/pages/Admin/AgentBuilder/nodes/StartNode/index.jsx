import React from "react";
import { Plus, X } from "@phosphor-icons/react";

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

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-white">Variables</h3>
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
            className="flex-1 p-2.5 text-sm rounded-lg bg-theme-bg-primary border border-white/5 text-white placeholder:text-white/20 focus:border-primary-button focus:ring-1 focus:ring-primary-button outline-none"
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
            className="flex-1 p-2.5 text-sm rounded-lg bg-theme-bg-primary border border-white/5 text-white placeholder:text-white/20 focus:border-primary-button focus:ring-1 focus:ring-primary-button outline-none"
            autoComplete="off"
            spellCheck={false}
          />
          {config.variables.length > 1 && (
            <button
              onClick={() => handleDeleteVariable(index, variable.name)}
              className="p-2.5 rounded-lg bg-theme-bg-primary border border-white/5 text-white hover:text-red-500 hover:border-red-500/20 hover:bg-red-500/10 transition-colors duration-300"
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
              className="p-2.5 rounded-lg bg-theme-bg-primary border border-white/5 text-white hover:bg-theme-action-menu-item-hover transition-colors duration-300"
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

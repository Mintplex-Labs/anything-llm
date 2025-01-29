import React from "react";
import { Plus } from "@phosphor-icons/react";

export default function StartNode({ config, onConfigChange }) {
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
          {index === config.variables.length - 1 && (
            <button
              onClick={() => {
                const newVars = [...config.variables, { name: "", value: "" }];
                onConfigChange({ variables: newVars });
              }}
              className="p-2.5 rounded-lg bg-theme-bg-primary border border-white/5 text-white hover:bg-theme-action-menu-item-hover transition-colors duration-300"
            >
              <Plus className="w-4 h-4" />
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

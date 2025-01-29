import React from "react";
import { Plus } from "@phosphor-icons/react";

export default function StartNode({ config, onConfigChange }) {
  return (
    <div className="space-y-4">
      <h3 className="text-theme-text-primary font-medium">Variables</h3>
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
            className="flex-1 p-2 rounded bg-theme-bg-primary border border-theme-sidebar-border text-theme-text-primary"
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
            className="flex-1 p-2 rounded bg-theme-bg-primary border border-theme-sidebar-border text-theme-text-primary"
          />
          {index === config.variables.length - 1 && (
            <button
              onClick={() => {
                const newVars = [...config.variables, { name: "", value: "" }];
                onConfigChange({ variables: newVars });
              }}
              className="p-2 rounded bg-theme-bg-primary border border-theme-sidebar-border text-theme-text-primary hover:bg-theme-bg-hover"
            >
              <Plus className="w-5 h-5" />
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

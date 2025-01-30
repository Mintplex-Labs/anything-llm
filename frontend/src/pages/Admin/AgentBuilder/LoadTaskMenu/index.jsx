import React from "react";
import { Info, Play, FolderOpen } from "@phosphor-icons/react";

export default function LoadTaskMenu({
  showLoadMenu,
  setShowLoadMenu,
  availableTasks,
  taskDetails,
  selectedTaskForDetails,
  setSelectedTaskForDetails,
  onLoadTask,
  onRunTask,
}) {
  if (!showLoadMenu) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-theme-action-menu-bg rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">Load Task</h2>
          <button
            onClick={() => {
              setShowLoadMenu(false);
              setSelectedTaskForDetails(null);
            }}
            className="text-white/60 hover:text-white"
          >
            ✕
          </button>
        </div>
        <div className="grid gap-2">
          {availableTasks.length === 0 ? (
            <div className="text-white/60">No tasks available</div>
          ) : (
            availableTasks.map((taskName) => (
              <div
                key={taskName}
                className="bg-theme-bg-primary border border-white/5 rounded-lg overflow-hidden"
              >
                <div className="p-3 flex items-center justify-between">
                  <span className="text-white">{taskName}</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        setSelectedTaskForDetails(
                          selectedTaskForDetails === taskName ? null : taskName
                        )
                      }
                      className="p-1.5 rounded-lg bg-theme-action-menu-bg border border-white/5 text-white hover:bg-theme-action-menu-item-hover transition-colors duration-300"
                      title="Toggle details"
                    >
                      <Info className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onRunTask(taskName)}
                      className="p-1.5 rounded-lg bg-theme-action-menu-bg border border-white/5 text-white hover:bg-theme-action-menu-item-hover transition-colors duration-300"
                      title="Run task"
                    >
                      <Play className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onLoadTask(taskName)}
                      className="p-1.5 rounded-lg bg-theme-action-menu-bg border border-white/5 text-white hover:bg-theme-action-menu-item-hover transition-colors duration-300"
                      title="Load task for editing"
                    >
                      <FolderOpen className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                {selectedTaskForDetails === taskName &&
                  taskDetails[taskName] && (
                    <div className="p-3 border-t border-white/5 bg-theme-action-menu-bg">
                      <p className="text-white/80 text-sm mb-2">
                        {taskDetails[taskName].description || "No description"}
                      </p>
                      <div className="text-sm text-white/60">
                        <div className="font-medium mb-1">Steps:</div>
                        <ul className="list-disc list-inside">
                          {taskDetails[taskName].steps.map((step, index) => (
                            <li key={index}>
                              {step.type}
                              {step.config.responseVariable &&
                                ` → ${step.config.responseVariable}`}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

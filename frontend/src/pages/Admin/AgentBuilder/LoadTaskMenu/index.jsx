import React, { useState } from "react";
import { Info, Play, FolderOpen } from "@phosphor-icons/react";
import AgentTasks from "@/models/agent-tasks";

export default function LoadTaskMenu({
  showLoadMenu,
  setShowLoadMenu,
  availableTasks,
  onLoadTask,
  onRunTask,
}) {
  const [selectedTaskDetails, setSelectedTaskDetails] = useState(null);

  if (!showLoadMenu) return null;

  const loadTaskDetails = async (task) => {
    if (selectedTaskDetails?.uuid === task.uuid) {
      setSelectedTaskDetails(null);
      return;
    }

    try {
      const {
        success,
        error,
        task: taskDetails,
      } = await AgentTasks.getTask(task.uuid);
      if (!success) throw new Error(error);
      setSelectedTaskDetails(taskDetails);
    } catch (error) {
      console.error("Failed to load task details:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-theme-action-menu-bg rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">Load Task</h2>
          <button
            onClick={() => {
              setShowLoadMenu(false);
              setSelectedTaskDetails(null);
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
            availableTasks.map((task) => (
              <div
                key={task.uuid}
                className="bg-theme-bg-primary border border-white/5 rounded-lg overflow-hidden"
              >
                <div className="p-3 flex items-center justify-between">
                  <span className="text-white">{task.name}</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => loadTaskDetails(task)}
                      className="p-1.5 rounded-lg bg-theme-action-menu-bg border border-white/5 text-white hover:bg-theme-action-menu-item-hover transition-colors duration-300"
                      title="Toggle details"
                    >
                      <Info className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onRunTask(task.uuid)}
                      className="p-1.5 rounded-lg bg-theme-action-menu-bg border border-white/5 text-white hover:bg-theme-action-menu-item-hover transition-colors duration-300"
                      title="Run task"
                    >
                      <Play className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onLoadTask(task.uuid)}
                      className="p-1.5 rounded-lg bg-theme-action-menu-bg border border-white/5 text-white hover:bg-theme-action-menu-item-hover transition-colors duration-300"
                      title="Load task for editing"
                    >
                      <FolderOpen className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                {selectedTaskDetails?.uuid === task.uuid && (
                  <div className="p-3 border-t border-white/5 bg-theme-action-menu-bg">
                    <p className="text-white/80 text-sm mb-2">
                      {selectedTaskDetails.config.description ||
                        "No description"}
                    </p>
                    <div className="text-sm text-white/60">
                      <div className="font-medium mb-1">Steps:</div>
                      <ul className="list-disc list-inside">
                        {selectedTaskDetails.config.steps.map((step, index) => (
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

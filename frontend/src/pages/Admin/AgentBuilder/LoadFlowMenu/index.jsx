import React, { useState } from "react";
import { Info, FolderOpen, Trash } from "@phosphor-icons/react";
import AgentFlows from "@/models/agentFlows";
import showToast from "@/utils/toast";

export default function LoadFlowMenu({
  showLoadMenu,
  setShowLoadMenu,
  availableFlows,
  onLoadFlow,
  onRunFlow,
  onFlowDeleted,
}) {
  const [selectedFlowDetails, setSelectedFlowDetails] = useState(null);

  const loadFlowDetails = async (flow) => {
    if (selectedFlowDetails?.uuid === flow.uuid) {
      setSelectedFlowDetails(null);
      return;
    }

    try {
      const {
        success,
        error,
        flow: flowDetails,
      } = await AgentFlows.getFlow(flow.uuid);
      if (!success) throw new Error(error);
      setSelectedFlowDetails(flowDetails);
    } catch (error) {
      console.error("Failed to load flow details:", error);
      showToast("Failed to load flow details", "error", { clear: true });
    }
  };

  const handleDeleteFlow = async (flow) => {
    if (!confirm(`Are you sure you want to delete the flow "${flow.name}"?`))
      return;

    try {
      const { success, error } = await AgentFlows.deleteFlow(flow.uuid);
      if (!success) throw new Error(error);
      showToast("Flow deleted successfully!", "success", { clear: true });
      onFlowDeleted?.();
    } catch (error) {
      console.error("Failed to delete flow:", error);
      showToast("Failed to delete flow", "error", { clear: true });
    }
  };

  if (!showLoadMenu) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-theme-action-menu-bg rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">Load Flow</h2>
          <button
            onClick={() => {
              setShowLoadMenu(false);
              setSelectedFlowDetails(null);
            }}
            className="text-white/60 hover:text-white"
          >
            ✕
          </button>
        </div>
        <div className="grid gap-2">
          {availableFlows.length === 0 ? (
            <div className="text-white/60">No flows available</div>
          ) : (
            availableFlows.map((flow) => (
              <div
                key={flow.uuid}
                className="bg-theme-bg-primary border border-white/5 rounded-lg overflow-hidden"
              >
                <div className="p-3 flex items-center justify-between">
                  <span className="text-white">{flow.name}</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => loadFlowDetails(flow)}
                      className="p-1.5 rounded-lg bg-theme-action-menu-bg border border-white/5 text-white hover:bg-theme-action-menu-item-hover transition-colors duration-300"
                      title="Toggle details"
                    >
                      <Info className="w-4 h-4" />
                    </button>
                    {/* TODO: Add flow execution */}
                    {/* <button
                      onClick={() => onRunFlow(flow.uuid)}
                      className="p-1.5 rounded-lg bg-theme-action-menu-bg border border-white/5 text-white hover:bg-theme-action-menu-item-hover transition-colors duration-300"
                      title="Run flow"
                    >
                      <Play className="w-4 h-4" />
                    </button> */}
                    <button
                      onClick={() => onLoadFlow(flow.uuid)}
                      className="p-1.5 rounded-lg bg-theme-action-menu-bg border border-white/5 text-white hover:bg-theme-action-menu-item-hover transition-colors duration-300"
                      title="Load flow for editing"
                    >
                      <FolderOpen className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteFlow(flow)}
                      className="p-1.5 rounded-lg bg-theme-action-menu-bg border border-white/5 text-red-400 hover:bg-theme-action-menu-item-hover transition-colors duration-300"
                      title="Delete flow"
                    >
                      <Trash className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                {selectedFlowDetails?.uuid === flow.uuid && (
                  <div className="p-3 border-t border-white/5 bg-theme-action-menu-bg">
                    <p className="text-white/80 text-sm mb-2">
                      {selectedFlowDetails.config.description ||
                        "No description"}
                    </p>
                    <div className="text-sm text-white/60">
                      <div className="font-medium mb-1">Status:</div>
                      <p className="mb-2">
                        {selectedFlowDetails.config.active !== false ? (
                          <span className="text-green-400">Enabled</span>
                        ) : (
                          <span className="text-red-400">Disabled</span>
                        )}
                      </p>
                      <div className="font-medium mb-1">Steps:</div>
                      <ul className="list-disc list-inside">
                        {selectedFlowDetails.config.steps.map((step, index) => (
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

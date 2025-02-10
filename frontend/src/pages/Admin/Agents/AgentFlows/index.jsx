import React, { useState, useEffect } from "react";
import { CaretRight } from "@phosphor-icons/react";
import AgentFlows from "@/models/agentFlows";
import showToast from "@/utils/toast";

export default function AgentFlowsList({
  selectedFlow,
  handleClick,
  activeFlowIds = [],
}) {
  const [flows, setFlows] = useState([]);

  useEffect(() => {
    loadFlows();
  }, [activeFlowIds]);

  const loadFlows = async () => {
    try {
      const { success, error, flows } = await AgentFlows.listFlows();
      if (!success) throw new Error(error);
      setFlows(flows);
    } catch (error) {
      console.error("Failed to load flows:", error);
      showToast("Failed to load agent flows", "error", { clear: true });
    }
  };

  if (flows.length === 0) return null;

  return (
    <div className="bg-theme-bg-secondary text-white rounded-xl min-w-[360px] w-fit">
      {flows.map((flow, index) => (
        <div
          key={flow.uuid}
          className={`py-3 px-4 flex items-center justify-between ${
            index === 0 ? "rounded-t-xl" : ""
          } ${
            index === flows.length - 1
              ? "rounded-b-xl"
              : "border-b border-white/10"
          } cursor-pointer transition-all duration-300 hover:bg-theme-bg-primary ${
            selectedFlow?.uuid === flow.uuid
              ? "bg-white/10 light:bg-theme-bg-sidebar"
              : ""
          }`}
          onClick={() => handleClick?.(flow)}
        >
          <div className="text-sm font-light">{flow.name}</div>
          <div className="flex items-center gap-x-2">
            <div className="text-sm text-theme-text-secondary font-medium">
              {flow.active ? "On" : "Off"}
            </div>
            <CaretRight
              size={14}
              weight="bold"
              className="text-theme-text-secondary"
            />
          </div>
        </div>
      ))}
    </div>
  );
}

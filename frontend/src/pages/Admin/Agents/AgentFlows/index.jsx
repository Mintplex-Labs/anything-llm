import React from "react";
import { CaretRight } from "@phosphor-icons/react";

export default function AgentFlowsList({
  flows = [],
  selectedFlow,
  handleClick,
}) {
  if (flows.length === 0) {
    return (
      <div className="text-theme-text-secondary text-center text-xs flex flex-col gap-y-2">
        <p>No agent flows found</p>
        <a
          href="https://docs.anythingllm.com/agent-flows/getting-started"
          target="_blank"
          className="text-theme-text-secondary underline hover:text-cta-button"
        >
          Learn more about Agent Flows.
        </a>
      </div>
    );
  }

  return (
    <div className="bg-theme-bg-secondary text-white rounded-xl w-full md:min-w-[360px]">
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

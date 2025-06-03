import React from "react";
import { CaretRight } from "@phosphor-icons/react";

export default function AgentFlowsList({
  flows = [],
  selectedFlow = null,
  handleClick = null,
  activeFlowIds = [],
  toggleFlow = () => {},
}) {
  if (flows.length === 0) {
    return (
      <div className="text-theme-text-secondary text-center text-xs flex flex-col gap-y-2">
        <p>No agent flows found</p>
        <a
          href="https://docs.anythingllm.com/agent-flows/getting-started"
          target="_blank"
          rel="noreferrer"
          className="text-theme-text-secondary underline hover:text-cta-button"
        >
          Learn more about Agent Flows.
        </a>
      </div>
    );
  }

  return (
    <div className="bg-theme-bg-secondary text-white rounded-xl w-full md:min-w-[360px]">
      {flows.map((flow) => (
        <div
          key={flow.uuid}
          onClick={() => handleClick?.(flow)}
          className={`
            relative
            cursor-pointer
            transition-all duration-300
            after:content-['']
            after:absolute
            after:bottom-0
            after:left-4
            after:right-4
            after:h-[1px]
            after:bg-theme-action-menu-bg
            last:after:hidden
            first:rounded-t-xl
            last:rounded-b-xl
            ${selectedFlow?.uuid === flow.uuid ? "bg-white/10 light:bg-theme-bg-sidebar" : "hover:bg-theme-bg-primary"}
          `}
        >
          <div className="flex items-center justify-between h-[36px] px-4">
            <div className="text-sm font-medium">{flow.name}</div>
            <div className="flex items-center gap-x-2">
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFlow(flow.uuid);
                }}
                className="relative inline-flex h-4 w-7 items-center rounded-full transition-colors duration-300"
                style={{
                  backgroundColor: activeFlowIds.includes(flow.uuid)
                    ? "#32D583"
                    : "#CFCFD0",
                }}
              >
                <span
                  className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform duration-300 ${
                    activeFlowIds.includes(flow.uuid)
                      ? "translate-x-[14px]"
                      : "translate-x-[2px]"
                  }`}
                />
              </div>
              <CaretRight
                size={14}
                weight="bold"
                className="text-theme-text-secondary"
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

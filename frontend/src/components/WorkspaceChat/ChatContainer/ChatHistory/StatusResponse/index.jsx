import React, { useState } from "react";
import { CaretDown } from "@phosphor-icons/react";

import AgentAnimation from "@/media/animations/agent-animation.webm";
import AgentStatic from "@/media/animations/agent-static.png";

export default function StatusResponse({ messages = [], isThinking = false }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const currentThought = messages[messages.length - 1];
  const previousThoughts = messages.slice(0, -1);

  function handleExpandClick() {
    if (!previousThoughts.length > 0) return;
    setIsExpanded(!isExpanded);
  }

  return (
    <div className="flex justify-center w-full pr-4">
      <div className="w-full flex flex-col">
        <div className="w-full">
          <div
            onClick={handleExpandClick}
            style={{
              transition: "all 0.1s ease-in-out",
              borderRadius: "16px",
            }}
            className={`${!previousThoughts?.length ? "" : `${previousThoughts?.length ? "hover:bg-theme-sidebar-item-hover" : ""}`} relative bg-theme-bg-chat-input p-4`}
          >
            <div className="absolute top-4 left-4 w-[18px] h-[18px]">
              {isThinking ? (
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-[18px] h-[18px] scale-[165%] transition-opacity duration-200 light:invert light:opacity-50"
                  data-tooltip-id="agent-thinking"
                  data-tooltip-content="Agent is thinking..."
                  aria-label="Agent is thinking..."
                >
                  <source src={AgentAnimation} type="video/webm" />
                </video>
              ) : (
                <img
                  src={AgentStatic}
                  alt="Agent complete"
                  className="w-[18px] h-[18px] transition-opacity duration-200 light:invert light:opacity-50"
                  data-tooltip-id="agent-thinking"
                  data-tooltip-content="Agent has finished thinking"
                  aria-label="Agent has finished thinking"
                />
              )}
            </div>
            {previousThoughts?.length > 0 && (
              <button
                onClick={handleExpandClick}
                className="absolute top-4 right-4 border-none text-theme-text-secondary hover:text-theme-text-primary transition-colors"
                data-tooltip-id="expand-cot"
                data-tooltip-content={
                  isExpanded ? "Hide thought chain" : "Show thought chain"
                }
                aria-label={
                  isExpanded ? "Hide thought chain" : "Show thought chain"
                }
              >
                <CaretDown
                  className={`w-4 h-4 transform transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
                />
              </button>
            )}
            <div
              className={`ml-[28px] mr-[26px] transition-[max-height] duration-300 ease-in-out origin-top ${isExpanded ? "" : "overflow-hidden max-h-[18px]"}`}
            >
              <div className="text-theme-text-secondary font-mono text-sm leading-[18px]">
                {!isExpanded ? (
                  <span className="block w-full truncate">
                    {currentThought.content}
                  </span>
                ) : (
                  <>
                    {previousThoughts.map((thought, index) => (
                      <div
                        key={`cot-${thought.uuid || index}`}
                        className="mb-2"
                      >
                        {thought.content}
                      </div>
                    ))}
                    <div>{currentThought.content}</div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

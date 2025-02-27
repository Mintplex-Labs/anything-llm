import React, { useState } from "react";
import { CaretDown } from "@phosphor-icons/react";

import AgentAnimation from "@/media/animations/agent-animation.webm";
import AgentStatic from "@/media/animations/agent-static.png";

export default function StatusResponse({
  messages = [],
  isThinking = false,
  showCheckmark = false,
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const currentThought = messages[messages.length - 1];
  const previousThoughts = messages.slice(0, -1);

  function handleExpandClick() {
    if (!previousThoughts.length > 0) return;
    setIsExpanded(!isExpanded);
  }

  return (
    <div className="flex justify-center w-full">
      <div className="w-full max-w-[80%] flex flex-col">
        <div className=" w-full max-w-[800px]">
          <div
            onClick={handleExpandClick}
            style={{ borderRadius: "6px" }}
            className={`${!previousThoughts?.length ? "" : `${previousThoughts?.length ? "hover:bg-theme-sidebar-item-hover" : ""}`} items-start bg-theme-bg-chat-input py-2 px-4 flex gap-x-2`}
          >
            <div className="w-7 h-7 flex justify-center flex-shrink-0 items-center">
              {isThinking ? (
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-8 h-8 scale-150 transition-opacity duration-200 light:invert light:opacity-50"
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
                  className="w-6 h-6 transition-opacity duration-200 light:invert light:opacity-50"
                  data-tooltip-id="agent-thinking"
                  data-tooltip-content="Agent has finished thinking"
                  aria-label="Agent has finished thinking"
                />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? "max-h-[500px]" : "max-h-6"}`}
              >
                <div className="text-theme-text-secondary font-mono leading-6">
                  {!isExpanded ? (
                    <span className="block w-full truncate mt-[2px]">
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
            <div className="flex items-center gap-x-2">
              {previousThoughts?.length > 0 && (
                <button
                  onClick={handleExpandClick}
                  data-tooltip-id="expand-cot"
                  data-tooltip-content={
                    isExpanded ? "Hide thought chain" : "Show thought chain"
                  }
                  className="border-none text-theme-text-secondary hover:text-theme-text-primary transition-colors p-1 rounded-full hover:bg-theme-sidebar-item-hover"
                  aria-label={
                    isExpanded ? "Hide thought chain" : "Show thought chain"
                  }
                >
                  <CaretDown
                    className={`w-4 h-4 transform transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
                  />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

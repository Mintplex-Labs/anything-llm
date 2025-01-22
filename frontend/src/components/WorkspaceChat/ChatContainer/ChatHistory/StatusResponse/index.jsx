import React, { useState } from "react";
import {
  CaretDown,
  CircleNotch,
  Check,
  CheckCircle,
} from "@phosphor-icons/react";

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
    <div className="flex justify-center items-end w-full">
      <div className="py-2 px-4 w-full flex gap-x-5 md:max-w-[80%] flex-col relative">
        <div
          onClick={handleExpandClick}
          className={`${!previousThoughts?.length ? "cursor-text" : "cursor-pointer hover:bg-theme-sidebar-item-hover transition-all duration-200"} bg-theme-bg-chat-input rounded-full py-2 px-4 flex items-center gap-x-2 border border-theme-sidebar-border`}
        >
          {isThinking ? (
            <CircleNotch
              className="w-4 h-4 text-theme-text-secondary animate-spin"
              aria-label="Agent is thinking..."
            />
          ) : showCheckmark ? (
            <CheckCircle
              className="w-4 h-4 text-green-400 transition-all duration-300"
              aria-label="Thought complete"
            />
          ) : null}
          <div className="flex-1 overflow-hidden">
            <span
              key={currentThought.content}
              className="text-xs text-theme-text-secondary font-mono inline-block w-full animate-thoughtTransition"
            >
              {currentThought.content}
            </span>
          </div>
          <div className="flex items-center gap-x-2">
            {previousThoughts?.length > 0 && (
              <div
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
              </div>
            )}
          </div>
        </div>

        {/* Previous thoughts dropdown */}
        {previousThoughts?.length > 0 && (
          <div
            key={`cot-list-${currentThought.uuid}`}
            className={`mt-2 bg-theme-bg-chat-input backdrop-blur-sm rounded-lg overflow-hidden transition-all duration-300 border border-theme-sidebar-border ${
              isExpanded ? "max-h-[300px] opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <div className="p-2">
              {previousThoughts.map((thought, index) => (
                <div
                  key={`cot-${thought.uuid || index}`}
                  className="flex gap-x-2"
                >
                  <p className="text-xs text-theme-text-secondary font-mono">
                    {index + 1}/{previousThoughts.length}
                  </p>
                  <div
                    className="flex items-center gap-x-3 p-2 animate-fadeUpIn"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <span className="text-xs text-theme-text-secondary font-mono">
                      {thought.content}
                    </span>
                  </div>
                </div>
              ))}
              {/* Append current thought to the end */}
              <div key={`cot-${currentThought.uuid}`} className="flex gap-x-2">
                <p className="text-xs text-theme-text-secondary font-mono">
                  {previousThoughts.length + 1}/{previousThoughts.length + 1}
                </p>
                <div className="flex items-center gap-x-3 p-2 animate-fadeUpIn">
                  <span className="text-xs text-theme-text-secondary font-mono">
                    {currentThought.content}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

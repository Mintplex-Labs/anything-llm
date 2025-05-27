import React, { useState } from "react";
import { CaretDown } from "@phosphor-icons/react";

import AgentAnimation from "@/media/animations/agent-animation.webm";
import AgentStatic from "@/media/animations/agent-static.png";

export default function StatusResponse({ messages = [], isThinking = false }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [expandedPayloadMessages, setExpandedPayloadMessages] = useState(
    new Set()
  );

  const previousThoughts = messages.slice(0, -1);

  const groupedMessages = messages.reduce((acc, message) => {
    const content =
      typeof message.content === "object"
        ? message.content
        : { text: message.content };

    if (content.messageType === "mcp_request") {
      acc.push({
        type: "mcp",
        toolName: content.toolName || "unknown tool",
        messages: [message],
        uuid: message.uuid,
      });
    } else if (
      acc.length > 0 &&
      acc[acc.length - 1].type === "mcp" &&
      content.messageType === "mcp_response"
    ) {
      acc[acc.length - 1].messages.push(message);
    } else {
      acc.push({
        type: "regular",
        messages: [message],
        uuid: message.uuid,
      });
    }
    return acc;
  }, []);

  const currentGroup = groupedMessages[groupedMessages.length - 1];
  const previousGroups = groupedMessages.slice(0, -1);

  function handleExpandClick() {
    if (!previousThoughts.length > 0) return;
    setIsExpanded(!isExpanded);
  }

  const togglePayload = (messageId, event) => {
    event.stopPropagation();
    setExpandedPayloadMessages((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(messageId)) {
        newSet.delete(messageId);
      } else {
        newSet.add(messageId);
      }
      return newSet;
    });
  };

  const renderMessage = (message, index) => {
    const content =
      typeof message.content === "object"
        ? message.content
        : { text: message.content };
    const hasJson = content.json !== undefined;
    const messageId = message.uuid || index;

    const messageContent = (
      <div className="whitespace-pre-wrap break-words">{content.text}</div>
    );

    if (!hasJson) {
      return messageContent;
    }

    const isPayloadExpanded = expandedPayloadMessages.has(messageId);

    return (
      <>
        <div className="flex items-center gap-x-1">
          {isExpanded && (
            <button
              onClick={(e) => togglePayload(messageId, e)}
              data-tooltip-id="show-details"
              data-tooltip-content={
                isPayloadExpanded ? "Collapse details" : "Show details"
              }
              className="border-none text-theme-text-secondary hover:text-theme-text-primary transition-colors p-1 rounded-full hover:bg-theme-sidebar-item-hover"
            >
              <CaretDown
                className={`w-3 h-3 transform transition-transform duration-200 ${isPayloadExpanded ? "rotate-180" : ""}`}
              />
            </button>
          )}
          {messageContent}
        </div>
        {isExpanded && isPayloadExpanded && (
          <div className="mt-1 ml-4">
            <div
              className="p-2 bg-theme-bg-secondary rounded whitespace-pre-wrap break-words max-w-full font-mono"
              onClick={(e) => e.stopPropagation()}
            >
              {JSON.stringify(content.json, null, 2)}
            </div>
          </div>
        )}
      </>
    );
  };

  const renderGroup = (group, index) => {
    if (group.type === "regular") {
      return (
        <div className="mt-1" key={`group-${group.uuid || index}`}>
          {renderMessage(group.messages[0], index)}
        </div>
      );
    }

    const isGroupExpanded = expandedPayloadMessages.has(`mcp-${group.uuid}`);
    return (
      <div className="mt-1" key={`group-${group.uuid || index}`}>
        <div className="flex items-center text-theme-text-secondary">
          <div className="flex items-center">
            Called tool {group.toolName} via MCP
          </div>
          {isExpanded && (
            <button
              onClick={(e) => togglePayload(`mcp-${group.uuid}`, e)}
              data-tooltip-id="show-details"
              data-tooltip-content={
                isGroupExpanded ? "Collapse details" : "Expand details"
              }
              className="border-none text-theme-text-secondary hover:text-theme-text-primary transition-colors p-1 rounded-full hover:bg-theme-sidebar-item-hover"
            >
              <CaretDown
                className={`w-3 h-3 transform transition-transform duration-200 ${isGroupExpanded ? "rotate-180" : ""}`}
              />
            </button>
          )}
        </div>
        {isExpanded && isGroupExpanded && (
          <div className="ml-4 mt-1 border-l-2 border-theme-border pl-2">
            {group.messages.map((msg, msgIndex) => (
              <div key={`mcp-msg-${msg.uuid || msgIndex}`} className="mt-1">
                {renderMessage(msg, msgIndex)}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex justify-center w-full">
      <div className="w-full max-w-[80%] flex flex-col">
        <div className="w-full max-w-[800px]">
          <div
            onClick={handleExpandClick}
            style={{ borderRadius: "6px" }}
            className={`${previousThoughts?.length ? "hover:bg-theme-sidebar-item-hover" : ""} items-start bg-theme-bg-chat-input py-2 px-4 flex gap-x-2 relative`}
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
            <div className="flex-1 min-w-0 overflow-hidden pr-8">
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? "" : "max-h-6"}`}
              >
                <div className="text-theme-text-secondary font-mono text-sm leading-normal">
                  {!isExpanded ? (
                    renderGroup(currentGroup, groupedMessages.length - 1)
                  ) : (
                    <>
                      {previousGroups.map((group, index) =>
                        renderGroup(group, index)
                      )}
                      {renderGroup(currentGroup, groupedMessages.length - 1)}
                    </>
                  )}
                </div>
              </div>
            </div>
            {previousThoughts?.length > 0 && (
              <button
                onClick={handleExpandClick}
                data-tooltip-id="expand-cot"
                data-tooltip-content={
                  isExpanded ? "Hide thought chain" : "Show thought chain"
                }
                className="border-none text-theme-text-secondary hover:text-theme-text-primary transition-colors p-1 rounded-full hover:bg-theme-sidebar-item-hover absolute right-3 top-2"
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
  );
}

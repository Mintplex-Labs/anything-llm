import { useState } from "react";
import { CaretDown } from "@phosphor-icons/react";
import AgentAnimation from "@/media/animations/agent-animation.webm";
import AgentStatic from "@/media/animations/agent-static.png";

export default function ThoughtTimeline({ events = [], isRunning = false }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const visibleEvents = events.filter((event) => event.content);
  if (visibleEvents.length === 0 && !isRunning) return null;

  const currentThought = visibleEvents[visibleEvents.length - 1];
  const previousThoughts = visibleEvents.slice(0, -1);
  const canExpand = previousThoughts.length > 0;

  function handleExpandClick() {
    if (!canExpand) return;
    setIsExpanded(!isExpanded);
  }

  return (
    <div className="flex justify-center w-full pr-4 my-1">
      <div className="w-full flex flex-col">
        <div
          onClick={handleExpandClick}
          className="relative bg-zinc-800 light:bg-slate-100 p-4 rounded-2xl"
        >
          <div className="absolute top-4 left-4 w-[18px] h-[18px]">
            {isRunning ? (
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
          {canExpand && (
            <button
              type="button"
              onClick={handleExpandClick}
              className="absolute top-4 right-4 border-none text-zinc-200 light:text-slate-800 transition-colors"
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
            <div className="text-zinc-200 light:text-slate-800 font-mono text-sm leading-[18px]">
              {!isExpanded ? (
                <span className="block w-full truncate">
                  {currentThought?.content ||
                    (isRunning ? "Working..." : "Finished.")}
                </span>
              ) : (
                <>
                  {previousThoughts.map((thought) => (
                    <div key={thought.id} className="mb-2">
                      {thought.content}
                    </div>
                  ))}
                  {currentThought && <div>{currentThought.content}</div>}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

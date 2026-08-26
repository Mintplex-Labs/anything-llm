import { useEffect, useRef, useState } from "react";
import AgentAnimation from "@/media/animations/agent-animation.webm";
import AgentStatic from "@/media/animations/agent-static.png";
import { thoughtLabel } from "../ThoughtContainer";
import {
  ChainOfThought,
  ChainOfThoughtContent,
  ChainOfThoughtHeader,
  ChainOfThoughtStep,
} from "../ChainOfThought";

export default function StatusResponse({ messages = [], isThinking = false }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const duration = useAgentDuration(messages.length);
  const currentThought = messages[messages.length - 1];

  return (
    <ChainOfThought open={isExpanded} onOpenChange={setIsExpanded}>
      <ChainOfThoughtHeader
        icon={<AgentIcon isThinking={isThinking} />}
        pending={isThinking}
      >
        {isThinking ? currentThought?.content : thoughtLabel(false, duration)}
      </ChainOfThoughtHeader>
      <ChainOfThoughtContent>
        {messages.map((thought, index) => (
          <ChainOfThoughtStep
            key={`cot-${thought.uuid || index}`}
            label={thought.content}
            status={
              isThinking && index === messages.length - 1
                ? "active"
                : "complete"
            }
          />
        ))}
      </ChainOfThoughtContent>
    </ChainOfThought>
  );
}

/**
 * Measures the span the stacked thoughts cover: the first status update to the
 * last. Status updates carry no timestamps, so they are timed on arrival; they
 * are also never persisted, so this component stays mounted for the whole run
 * and a reload drops the run entirely. Ending at the last update rather than at
 * the end of the run leaves out the final answer, which the agent generates
 * after it stops reporting steps.
 * @param {number} messageCount
 * @returns {number|null} seconds spanned, or null before a second update lands
 */
function useAgentDuration(messageCount) {
  const firstSeenAt = useRef(null);
  const [duration, setDuration] = useState(null);

  useEffect(() => {
    if (!messageCount) return;
    if (firstSeenAt.current === null) {
      firstSeenAt.current = Date.now();
      return;
    }
    setDuration((Date.now() - firstSeenAt.current) / 1000);
  }, [messageCount]);

  return duration;
}

function AgentIcon({ isThinking }) {
  if (isThinking)
    return (
      <video
        autoPlay
        loop
        muted
        playsInline
        className="w-4 h-4 flex-shrink-0 scale-[165%] light:invert light:opacity-50"
        aria-label="Agent is thinking..."
      >
        <source src={AgentAnimation} type="video/webm" />
      </video>
    );

  return (
    <img
      src={AgentStatic}
      alt="Agent complete"
      className="w-4 h-4 flex-shrink-0 light:invert light:opacity-50"
    />
  );
}

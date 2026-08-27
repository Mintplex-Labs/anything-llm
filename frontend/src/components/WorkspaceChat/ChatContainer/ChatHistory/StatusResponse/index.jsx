import { memo, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import DOMPurify from "dompurify";
import { Brain } from "@phosphor-icons/react";
import AgentAnimation from "@/media/animations/agent-animation.webm";
import AgentStatic from "@/media/animations/agent-static.png";
import { renderThoughtMarkdown } from "@/utils/chat/markdown";
import { formatDuration } from "@/utils/numbers";
import {
  THOUGHT_REGEX_CLOSE,
  THOUGHT_REGEX_OPEN,
  stripThoughtTags,
  thoughtLabel,
  useThoughtExpansion,
} from "../ThoughtContainer";
import {
  ChainOfThought,
  ChainOfThoughtContent,
  ChainOfThoughtHeader,
  ChainOfThoughtStep,
} from "../ChainOfThought";

/**
 * One rolled-up activity chain. Every agent status update and model thought
 * that happens between visible chat messages collapses into a single
 * expandable block instead of stacking one bubble per activity. Nodes are
 * either raw statusResponse history items or
 * `{ type: "thoughtChain", uuid, content }` entries split out of assistant
 * messages by buildMessages.
 *
 * @param {Object} props
 * @param {Array} props.messages - activity nodes, in arrival order
 * @param {boolean} props.isThinking - the agent run is live and this chain is last
 * @param {boolean} props.isLastGroup - this chain is the last compiled item
 */
export default function StatusResponse({
  messages = [],
  isThinking = false,
  isLastGroup = false,
}) {
  const { t } = useTranslation();
  const chainId = messages[0]?.uuid;
  const { expanded: persistedExpanded, setExpanded: setPersistedExpanded } =
    useThoughtExpansion(chainId);
  const [localExpanded, setLocalExpanded] = useState(false);
  const isExpanded = chainId ? persistedExpanded : localExpanded;
  const setIsExpanded = chainId ? setPersistedExpanded : setLocalExpanded;

  const lastNode = messages[messages.length - 1];
  const lastIsThought = lastNode?.type === "thoughtChain";
  // Mid-thought is detected purely from the think tags - the server never
  // reports it. isLastGroup gates the animation so an aborted run loaded
  // from history cannot shimmer forever.
  const thoughtStreaming =
    lastIsThought &&
    !!lastNode.content?.match(THOUGHT_REGEX_OPEN) &&
    !lastNode.content?.match(THOUGHT_REGEX_CLOSE);
  const thinkingActive = isLastGroup && thoughtStreaming;
  // The run can be live without a streaming thought - e.g. a thought closed
  // and the agent is executing a tool with no new status yet. Stay animated
  // on the most recent status so the chain never looks finished mid-run.
  const workingActive = isThinking && !thinkingActive;
  const active = thinkingActive || workingActive;

  const { arrivals, finalizedAt } = useActivityTimestamps(messages, active);
  const firstArrival = chainId ? arrivals[chainId] : null;
  const totalDuration =
    finalizedAt && firstArrival ? (finalizedAt - firstArrival) / 1000 : null;

  const lastStatusNode = workingActive
    ? messages.findLast((m) => m.type !== "thoughtChain")
    : null;
  const headerLabel = thinkingActive
    ? t("chat_window.thought_in_progress")
    : workingActive
      ? (lastStatusNode?.content ?? t("chat_window.thought_in_progress"))
      : totalDuration
        ? thoughtLabel(false, totalDuration)
        : t("chat_window.thoughts");
  const hasStatusNodes = messages.some((m) => m.type !== "thoughtChain");

  return (
    <ChainOfThought open={isExpanded} onOpenChange={setIsExpanded}>
      <ChainOfThoughtHeader
        icon={
          <ActivityIcon
            active={active}
            thinking={thinkingActive || !hasStatusNodes}
            hasStatusNodes={hasStatusNodes}
          />
        }
        pending={active}
      >
        {headerLabel}
      </ChainOfThoughtHeader>
      <ChainOfThoughtContent>
        {messages.map((node, index) => {
          const start = node.uuid ? arrivals[node.uuid] : null;
          const end = arrivals[messages[index + 1]?.uuid] ?? finalizedAt;
          const seconds =
            start && end && end > start ? (end - start) / 1000 : null;
          return (
            <ChainOfThoughtStep
              key={node.uuid || `activity-${index}`}
              icon={node.type === "thoughtChain" ? Brain : undefined}
              status={
                active && index === messages.length - 1 ? "active" : "complete"
              }
              label={
                node.type === "thoughtChain" ? (
                  <ThoughtNode content={node.content} />
                ) : (
                  node.content
                )
              }
              description={seconds ? formatDuration(seconds) : undefined}
            />
          );
        })}
      </ChainOfThoughtContent>
    </ChainOfThought>
  );
}

/**
 * Times activity client-side. Status updates and thoughts carry no server
 * timestamps and are never persisted, so each node is stamped when it first
 * appears and the chain is stamped once more when it settles. A node's
 * duration runs to the next node's arrival (or the settle time for the last
 * one); a chain loaded from history was never active and shows no durations.
 * @param {Array} messages - activity nodes
 * @param {boolean} active - the chain is still doing work
 * @returns {{arrivals: Object<string, number>, finalizedAt: number|null}}
 */
function useActivityTimestamps(messages, active) {
  const [arrivals, setArrivals] = useState({});
  const [finalizedAt, setFinalizedAt] = useState(null);
  const [everActive, setEverActive] = useState(false);

  useEffect(() => {
    if (!messages.some((m) => m.uuid && arrivals[m.uuid] == null)) return;
    setArrivals((prev) => {
      const next = { ...prev };
      for (const m of messages) {
        if (m.uuid && next[m.uuid] == null) next[m.uuid] = Date.now();
      }
      return next;
    });
  }, [messages, arrivals]);

  useEffect(() => {
    if (active) {
      setEverActive(true);
      // A new node re-activated a settled chain - the settle time is stale.
      if (finalizedAt !== null) setFinalizedAt(null);
      return;
    }
    if (everActive && finalizedAt === null) setFinalizedAt(Date.now());
  }, [active, everActive, finalizedAt]);

  return { arrivals, finalizedAt };
}

const ThoughtNode = memo(function ThoughtNode({ content }) {
  const html = useMemo(
    () => DOMPurify.sanitize(renderThoughtMarkdown(stripThoughtTags(content))),
    [content]
  );
  return (
    <div className="break-words" dangerouslySetInnerHTML={{ __html: html }} />
  );
});

function ActivityIcon({ active, thinking, hasStatusNodes }) {
  // Thought states use the same brain glyph as the expanded thought nodes;
  // the shimmering header label already signals activity while thinking.
  if (active && thinking) return <Brain className="size-5 flex-shrink-0" />;

  if (active)
    return (
      <video
        autoPlay
        loop
        muted
        playsInline
        className="w-5 h-5 flex-shrink-0 scale-[165%] light:invert light:opacity-50"
        aria-label="Agent is thinking..."
      >
        <source src={AgentAnimation} type="video/webm" />
      </video>
    );

  if (hasStatusNodes)
    return (
      <img
        src={AgentStatic}
        alt="Agent complete"
        className="w-5 h-5 flex-shrink-0 light:invert light:opacity-50"
      />
    );

  return <Brain className="size-5 flex-shrink-0" />;
}

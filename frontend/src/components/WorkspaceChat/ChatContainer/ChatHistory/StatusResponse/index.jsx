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

  const clock = clockChain(messages, active);
  const settledAt = clock?.settledAt ?? null;
  const totalDuration =
    settledAt && clock ? (settledAt - clock.start) / 1000 : null;

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
        trailing={
          active && clock ? (
            <>
              · <ElapsedTime since={clock.start} />
            </>
          ) : null
        }
      >
        {headerLabel}
      </ChainOfThoughtHeader>
      <ChainOfThoughtContent>
        {messages.map((node, index) => {
          const isActiveStep = active && index === messages.length - 1;
          const start = arrivalOf(node);
          const end = arrivalOf(messages[index + 1]) ?? settledAt;
          const seconds =
            start && end && end > start ? (end - start) / 1000 : null;
          return (
            <ChainOfThoughtStep
              key={node.uuid || `activity-${index}`}
              icon={node.type === "thoughtChain" ? Brain : undefined}
              status={isActiveStep ? "active" : "complete"}
              label={
                node.type === "thoughtChain" ? (
                  <ThoughtNode content={node.content} />
                ) : (
                  node.content
                )
              }
              description={
                isActiveStep && start ? (
                  <ElapsedTime since={start} />
                ) : seconds ? (
                  formatDuration(seconds)
                ) : undefined
              }
            />
          );
        })}
      </ChainOfThoughtContent>
    </ChainOfThought>
  );
}

/*
 * Client-side activity clock. Status updates and thoughts carry no server
 * timestamps and are never persisted, so each node is stamped when it first
 * appears in a live chain, and the chain is stamped again when it settles. A
 * reloaded chat shows no durations, same as it shows no tool execution times.
 *
 * Stamps live outside React state, keyed by node uuid, so a chain keeps its
 * clock when it remounts - the chain is keyed by its first node, which can be
 * dropped mid-run (removeStatusResponse, a status that turns into the reply).
 * Nodes of one chain share a single `{ start, settledAt }` record. Insertion
 * order doubles as eviction order, which bounds memory over a long session.
 */
const MAX_CLOCKED_NODES = 500;
const nodeClock = new Map();

function arrivalOf(node) {
  return node?.uuid ? (nodeClock.get(node.uuid)?.arrival ?? null) : null;
}

/**
 * Stamps any unseen nodes of a chain and returns the chain's shared clock.
 * Safe to call during render: it only fills missing stamps, so repeated calls
 * for the same input are no-ops.
 * @param {Array} messages - activity nodes
 * @param {boolean} active - the chain is still doing work
 * @returns {{start: number, settledAt: number|null}|null} null for a chain
 *   that was never seen live (loaded from history)
 */
function clockChain(messages, active) {
  let chain = null;
  for (const m of messages) {
    const clocked = m.uuid ? nodeClock.get(m.uuid) : null;
    if (clocked && (!chain || clocked.chain.start < chain.start))
      chain = clocked.chain;
  }
  if (!chain && !active) return null;

  const now = Date.now();
  chain ??= { start: now, settledAt: null };
  let stamped = false;
  for (const m of messages) {
    if (!m.uuid) continue;
    const clocked = nodeClock.get(m.uuid);
    if (clocked) {
      // Two chains merged (the message between them was swept) - the
      // earlier start wins.
      clocked.chain = chain;
      continue;
    }
    nodeClock.set(m.uuid, { arrival: now, chain });
    stamped = true;
    if (nodeClock.size > MAX_CLOCKED_NODES)
      nodeClock.delete(nodeClock.keys().next().value);
  }

  // Re-activation (a new node after settling) makes the old settle stale.
  if (active) chain.settledAt = null;
  else if (chain.settledAt === null || stamped) chain.settledAt = now;
  return chain;
}

/**
 * Live whole-second counter. Owns its interval so only this text re-renders
 * each tick, and derives from Date.now() so throttled background tabs catch
 * up instead of drifting. Mounted only while its chain is active.
 * @param {{since: number}} props - epoch ms the count starts from
 */
function ElapsedTime({ since }) {
  const [now, setNow] = useState(Date.now);
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const seconds = Math.max(0, Math.floor((now - since) / 1000));
  return seconds < 60 ? `${seconds}s` : formatDuration(seconds);
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

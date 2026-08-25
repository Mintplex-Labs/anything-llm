import {
  useState,
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
  createContext,
  useContext,
  useCallback,
} from "react";
import renderMarkdown from "@/utils/chat/markdown";
import { formatDuration } from "@/utils/numbers";
import DOMPurify from "dompurify";
import ThinkingAnimation from "@/media/animations/thinking-animation.webm";
import ThinkingStatic from "@/media/animations/thinking-static.png";
import {
  ChainOfThought,
  ChainOfThoughtContent,
  ChainOfThoughtHeader,
  ChainOfThoughtStep,
} from "../ChainOfThought";

/**
 * Context to persist thought expansion state across component transitions
 * (e.g., from PromptReply to HistoricalMessage)
 */
const ThoughtExpansionContext = createContext(null);

export function ThoughtExpansionProvider({ children }) {
  const [expansionStates, setExpansionStates] = useState({});
  const [durations, setDurations] = useState({});

  const getExpanded = useCallback(
    (messageId) => {
      if (!messageId) return false;
      return expansionStates[messageId] ?? false;
    },
    [expansionStates]
  );

  const setExpanded = useCallback((messageId, expanded) => {
    if (!messageId) return;
    setExpansionStates((prev) => ({
      ...prev,
      [messageId]: expanded,
    }));
  }, []);

  const getDuration = useCallback(
    (messageId) => (messageId ? (durations[messageId] ?? null) : null),
    [durations]
  );

  // First write wins. The reply is measured once while it streams; re-renders
  // after that must not restart or overwrite the recorded time.
  const setDuration = useCallback((messageId, seconds) => {
    if (!messageId) return;
    setDurations((prev) =>
      prev[messageId] != null ? prev : { ...prev, [messageId]: seconds }
    );
  }, []);

  return (
    <ThoughtExpansionContext.Provider
      value={{ getExpanded, setExpanded, getDuration, setDuration }}
    >
      {children}
    </ThoughtExpansionContext.Provider>
  );
}

export function useThoughtExpansion(messageId) {
  const context = useContext(ThoughtExpansionContext);
  if (!context) {
    // Fallback when used outside provider - use local state only
    return { expanded: false, setExpanded: () => {} };
  }
  return {
    expanded: context.getExpanded(messageId),
    setExpanded: (value) => context.setExpanded(messageId, value),
  };
}

/**
 * Times how long a reply spent thinking and keeps the result on the provider,
 * which outlives the swap from PromptReply to HistoricalMessage. Nothing about
 * the duration is persisted server-side, so a reload leaves this null.
 * @param {string} messageId
 * @param {boolean} isThinking
 * @returns {number|null} seconds spent thinking, or null if it was not observed
 */
function useThoughtDuration(messageId, isThinking) {
  const context = useContext(ThoughtExpansionContext);
  const startedAt = useRef(null);
  const recorded = context?.getDuration(messageId) ?? null;
  const setDuration = context?.setDuration;

  useEffect(() => {
    if (isThinking) {
      if (startedAt.current === null) startedAt.current = Date.now();
      return;
    }
    if (startedAt.current === null) return;
    setDuration?.(messageId, (Date.now() - startedAt.current) / 1000);
    startedAt.current = null;
  }, [isThinking, messageId, setDuration]);

  return recorded;
}

/**
 * @param {boolean} isThinking
 * @param {number|null} duration - seconds spent thinking, when it was observed
 * @returns {string}
 */
export function thoughtLabel(isThinking, duration) {
  if (isThinking) return "Thinking...";
  if (duration) return `Thought for ${formatDuration(duration)}`;
  return "Thoughts";
}

const THOUGHT_KEYWORDS = ["thought", "thinking", "think", "thought_chain"];
const CLOSING_TAGS = [...THOUGHT_KEYWORDS, "response", "answer"];
export const THOUGHT_REGEX_OPEN = new RegExp(
  THOUGHT_KEYWORDS.map((keyword) => `<${keyword}\\s*(?:[^>]*?)?\\s*>`).join("|")
);
export const THOUGHT_REGEX_CLOSE = new RegExp(
  CLOSING_TAGS.map((keyword) => `</${keyword}\\s*(?:[^>]*?)?>`).join("|")
);
export const THOUGHT_REGEX_COMPLETE = new RegExp(
  THOUGHT_KEYWORDS.map(
    (keyword) =>
      `<${keyword}\\s*(?:[^>]*?)?\\s*>[\\s\\S]*?<\\/${keyword}\\s*(?:[^>]*?)?>`
  ).join("|")
);

/**
 * Checks if the content has readable content.
 * @param {string} content - The content to check.
 * @returns {boolean} - Whether the content has readable content.
 */
function contentIsNotEmpty(content = "") {
  return (
    content
      ?.trim()
      ?.replace(THOUGHT_REGEX_OPEN, "")
      ?.replace(THOUGHT_REGEX_CLOSE, "")
      ?.replace(/[\n\s]/g, "")?.length > 0
  );
}

/**
 * Component to render a thought chain.
 * @param {string} content - The content of the thought chain.
 * @param {string} messageId - The unique ID for this message (used to persist expansion state).
 * @returns {JSX.Element}
 */
export const ThoughtChainComponent = forwardRef(
  ({ content: initialContent, messageId, allowAnimation = false }, ref) => {
    const [content, setContent] = useState(initialContent);
    const [hasReadableContent, setHasReadableContent] = useState(
      contentIsNotEmpty(initialContent)
    );
    const { expanded: persistedExpanded, setExpanded: setPersistedExpanded } =
      useThoughtExpansion(messageId);
    const [localExpanded, setLocalExpanded] = useState(false);

    // Use persisted state if messageId is provided, otherwise use local state
    const isExpanded = messageId ? persistedExpanded : localExpanded;
    const setIsExpanded = messageId ? setPersistedExpanded : setLocalExpanded;

    // Sync content state with prop changes (for streaming through HistoricalMessage)
    useEffect(() => {
      if (initialContent !== content) {
        setContent(initialContent);
        setHasReadableContent(contentIsNotEmpty(initialContent));
      }
    }, [initialContent]);

    useImperativeHandle(ref, () => ({
      updateContent: (newContent) => {
        setContent(newContent);
        setHasReadableContent(contentIsNotEmpty(newContent));
      },
    }));

    const isThinking =
      allowAnimation &&
      content.match(THOUGHT_REGEX_OPEN) &&
      !content.match(THOUGHT_REGEX_CLOSE);
    const duration = useThoughtDuration(messageId, !!isThinking);
    const tagStrippedContent = content
      .replace(THOUGHT_REGEX_OPEN, "")
      .replace(THOUGHT_REGEX_CLOSE, "");
    if (!content || !content.length || !hasReadableContent) return null;

    return (
      <ChainOfThought open={isExpanded} onOpenChange={setIsExpanded}>
        <ChainOfThoughtHeader
          icon={<ThinkingIcon isThinking={isThinking} />}
          pending={!!isThinking}
          data-tooltip-id="expand-cot"
          data-tooltip-content={
            isExpanded ? "Hide thought chain" : "Show thought chain"
          }
        >
          {thoughtLabel(isThinking, duration)}
        </ChainOfThoughtHeader>
        <ChainOfThoughtContent>
          <ChainOfThoughtStep
            status={isThinking ? "active" : "complete"}
            label={
              <div
                className="font-mono [&_p]:m-0"
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(
                    renderMarkdown(tagStrippedContent)
                  ),
                }}
              />
            }
          />
        </ChainOfThoughtContent>
      </ChainOfThought>
    );
  }
);
ThoughtChainComponent.displayName = "ThoughtChainComponent";

function ThinkingIcon({ isThinking }) {
  if (isThinking)
    return (
      <video
        autoPlay
        loop
        muted
        playsInline
        className="w-4 h-4 flex-shrink-0 scale-[115%] light:invert light:opacity-50"
        aria-label="Model is thinking..."
      >
        <source src={ThinkingAnimation} type="video/webm" />
      </video>
    );

  return (
    <img
      src={ThinkingStatic}
      alt=""
      className="w-4 h-4 flex-shrink-0 light:invert light:opacity-50"
    />
  );
}

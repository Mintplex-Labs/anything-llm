import {
  useState,
  useEffect,
  useMemo,
  forwardRef,
  useImperativeHandle,
  createContext,
  useContext,
  useCallback,
} from "react";
import { useTranslation } from "react-i18next";
import { renderThoughtMarkdown } from "@/utils/chat/markdown";
import { formatDuration } from "@/utils/numbers";
import DOMPurify from "dompurify";
import ThinkingAnimation from "@/media/animations/thinking-animation.webm";
import ThinkingStatic from "@/media/animations/thinking-static.png";
import {
  ChainOfThought,
  ChainOfThoughtContent,
  ChainOfThoughtHeader,
} from "../ChainOfThought";

/**
 * Context to persist thought expansion state across component transitions
 * (e.g., from PromptReply to HistoricalMessage)
 */
const ThoughtExpansionContext = createContext(null);

export function ThoughtExpansionProvider({ children }) {
  const [expansionStates, setExpansionStates] = useState({});

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

  return (
    <ThoughtExpansionContext.Provider value={{ getExpanded, setExpanded }}>
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
 * @param {boolean} isThinking
 * @param {number|null} duration - seconds spent working, when it was observed
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
    const { t } = useTranslation();
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

    // Whether the model is mid-thought is detected purely from the think
    // tags: an open tag with no closing tag means thinking is in progress.
    // The server never reports this state. allowAnimation only gates the
    // shimmer/video so stale history can't animate forever.
    const isThinking =
      !!content.match(THOUGHT_REGEX_OPEN) &&
      !content.match(THOUGHT_REGEX_CLOSE);
    const animate = allowAnimation && isThinking;
    const tagStrippedContent = content
      .replace(THOUGHT_REGEX_OPEN, "")
      .replace(THOUGHT_REGEX_CLOSE, "");

    const thoughtHtml = useMemo(
      () => DOMPurify.sanitize(renderThoughtMarkdown(tagStrippedContent)),
      [tagStrippedContent]
    );

    if (!content || !content.length || !hasReadableContent) return null;

    return (
      <ChainOfThought open={isExpanded} onOpenChange={setIsExpanded}>
        <ChainOfThoughtHeader
          icon={<ThinkingIcon isThinking={animate} />}
          pending={animate}
        >
          {isThinking
            ? t("chat_window.thought_in_progress")
            : t("chat_window.thoughts")}
        </ChainOfThoughtHeader>
        <ChainOfThoughtContent>
          {/*
            A thought is one cohesive block of prose, not discrete steps, so it
            renders as a single markdown body rather than ChainOfThoughtStep
            bullets. List/paragraph styling comes from the chat container's
            global `.markdown` styles.
          */}
          <div
            className="break-words text-sm text-zinc-400 light:text-zinc-500"
            dangerouslySetInnerHTML={{ __html: thoughtHtml }}
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
      alt="Thinking complete"
      className="w-4 h-4 flex-shrink-0 light:invert light:opacity-50"
    />
  );
}

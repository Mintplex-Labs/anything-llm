import { useState, createContext, useContext, useCallback } from "react";
import { formatDuration } from "@/utils/numbers";

// The thought-tag regexes and split/strip helpers live in
// `@/utils/chat/thoughts` (single source of truth - shared with the chat
// markdown renderer) and are re-exported here so the components that
// imported them from ThoughtContainer historically keep working.
export {
  THOUGHT_REGEX_OPEN,
  THOUGHT_REGEX_CLOSE,
  THOUGHT_REGEX_COMPLETE,
  splitThoughtContent,
  stripThoughtSegments,
  stripThoughtTags,
} from "@/utils/chat/thoughts";

/**
 * Context to persist activity-chain expansion state across component
 * transitions (e.g., from PromptReply to HistoricalMessage)
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
  const contextSetExpanded = context?.setExpanded;
  // Stable across renders so consumers can safely memoize on it.
  const setExpanded = useCallback(
    (value) => contextSetExpanded?.(messageId, value),
    [contextSetExpanded, messageId]
  );
  // No provider - fall back to never-expanded local behavior.
  if (!context) return { expanded: false, setExpanded };
  return {
    expanded: context.getExpanded(messageId),
    setExpanded,
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

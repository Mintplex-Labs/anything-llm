import { useState, createContext, useContext, useCallback } from "react";
import { formatDuration } from "@/utils/numbers";

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
 * Removes the wrapping think tags from a thought segment.
 * @param {string} content
 * @returns {string}
 */
export function stripThoughtTags(content = "") {
  return content
    .replace(THOUGHT_REGEX_OPEN, "")
    .replace(THOUGHT_REGEX_CLOSE, "");
}

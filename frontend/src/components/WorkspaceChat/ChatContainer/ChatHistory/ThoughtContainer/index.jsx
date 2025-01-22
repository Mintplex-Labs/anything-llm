import renderMarkdown from "@/utils/chat/markdown";
import {
  Brain,
  CaretDown,
  CheckCircle,
  CircleNotch,
} from "@phosphor-icons/react";
import DOMPurify from "dompurify";
import { useState } from "react";
import truncate from "truncate";

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
const THOUGHT_PREVIEW_LENGTH = 50;

/**
 * Component to render a thought chain.
 * @param {string} content - The content of the thought chain.
 * @param {boolean} expanded - Whether the thought chain is expanded.
 * @returns {JSX.Element}
 */
export function ThoughtChainComponent({ content, expanded = false }) {
  const [isExpanded, setIsExpanded] = useState(expanded);
  if (!content || !content.length) return null;

  const isThinking =
    content.match(THOUGHT_REGEX_OPEN) && !content.match(THOUGHT_REGEX_CLOSE);
  const isComplete =
    content.match(THOUGHT_REGEX_COMPLETE) || content.match(THOUGHT_REGEX_CLOSE);

  const tagStrippedContent = content
    .replace(THOUGHT_REGEX_OPEN, "")
    .replace(THOUGHT_REGEX_CLOSE, "");
  if (
    !tagStrippedContent ||
    // If the content is just whitespace, don't render it
    tagStrippedContent.replace(/\s/g, "").length === 0
  )
    return null;

  const autoExpand =
    isThinking && tagStrippedContent.length > THOUGHT_PREVIEW_LENGTH;
  const canExpand = tagStrippedContent.length > THOUGHT_PREVIEW_LENGTH;

  function handleExpandClick() {
    if (!canExpand) return;
    setIsExpanded(!isExpanded);
  }

  return (
    <div className="flex justify-start items-end max-w-[800px]">
      <div className="py-2 px-4 w-full flex gap-x-5 flex-col relative ">
        <div
          className={`${isExpanded || autoExpand ? "" : `${canExpand ? "hover:bg-theme-sidebar-item-hover transition-all duration-200" : ""}`} items-start bg-theme-bg-chat-input rounded-md py-2 px-4 flex gap-x-2 border border-theme-sidebar-border`}
        >
          {isThinking ? (
            <Brain
              className="w-4 h-4 mt-1 text-blue-500 transition-all duration-300 animate-pulse"
              aria-label="Model is thinking..."
            />
          ) : isComplete ? (
            <Brain
              className="w-4 h-4 mt-1 text-green-400 transition-all duration-300"
              aria-label="Done thinking"
            />
          ) : null}
          <div className="flex-1 overflow-hidden">
            {!isExpanded && !autoExpand ? (
              <span
                className="text-xs text-theme-text-secondary font-mono inline-block w-full"
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(
                    truncate(tagStrippedContent, THOUGHT_PREVIEW_LENGTH)
                  ),
                }}
              />
            ) : (
              <span
                className="text-xs text-theme-text-secondary font-mono inline-block w-full"
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(
                    renderMarkdown(tagStrippedContent)
                  ),
                }}
              />
            )}
          </div>
          <div className="flex items-center gap-x-2">
            {!autoExpand && canExpand ? (
              <button
                onClick={handleExpandClick}
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
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

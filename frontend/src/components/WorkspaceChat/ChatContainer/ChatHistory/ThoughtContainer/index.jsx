import { useState, forwardRef, useImperativeHandle } from "react";
import renderMarkdown from "@/utils/chat/markdown";
import { Brain, CaretDown } from "@phosphor-icons/react";
import DOMPurify from "dompurify";
import truncate from "truncate";
import { isMobile } from "react-device-detect";

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
const THOUGHT_PREVIEW_LENGTH = isMobile ? 25 : 50;

/**
 * Component to render a thought chain.
 * @param {string} content - The content of the thought chain.
 * @param {boolean} expanded - Whether the thought chain is expanded.
 * @returns {JSX.Element}
 */
export const ThoughtChainComponent = forwardRef(
  ({ content: initialContent, expanded }, ref) => {
    const [content, setContent] = useState(initialContent);
    const [isExpanded, setIsExpanded] = useState(expanded);
    useImperativeHandle(ref, () => ({
      updateContent: (newContent) => {
        setContent(newContent);
      },
    }));

    const isThinking =
      content.match(THOUGHT_REGEX_OPEN) && !content.match(THOUGHT_REGEX_CLOSE);
    const isComplete =
      content.match(THOUGHT_REGEX_COMPLETE) ||
      content.match(THOUGHT_REGEX_CLOSE);
    const tagStrippedContent = content
      .replace(THOUGHT_REGEX_OPEN, "")
      .replace(THOUGHT_REGEX_CLOSE, "");
    const autoExpand =
      isThinking && tagStrippedContent.length > THOUGHT_PREVIEW_LENGTH;
    const canExpand = tagStrippedContent.length > THOUGHT_PREVIEW_LENGTH;
    if (!content || !content.length) return null;

    function handleExpandClick() {
      if (!canExpand) return;
      setIsExpanded(!isExpanded);
    }

    return (
      <div className="flex justify-start items-end transition-all duration-200 w-full md:max-w-[800px]">
        <div className="pb-2 w-full flex gap-x-5 flex-col relative">
          <div
            style={{
              transition: "all 0.1s ease-in-out",
              borderRadius: isExpanded || autoExpand ? "6px" : "24px",
            }}
            className={`${isExpanded || autoExpand ? "" : `${canExpand ? "hover:bg-theme-sidebar-item-hover" : ""}`} items-start bg-theme-bg-chat-input py-2 px-4 flex gap-x-2 border border-theme-sidebar-border`}
          >
            {isThinking || isComplete ? (
              <Brain
                data-tooltip-id="cot-thinking"
                data-tooltip-content={
                  isThinking
                    ? "Model is thinking..."
                    : "Model has finished thinking"
                }
                className={`w-4 h-4 mt-1 ${isThinking ? "text-blue-500 animate-pulse" : "text-green-400"}`}
                aria-label={
                  isThinking
                    ? "Model is thinking..."
                    : "Model has finished thinking"
                }
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
);

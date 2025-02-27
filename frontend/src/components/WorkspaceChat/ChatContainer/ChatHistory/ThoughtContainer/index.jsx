import { useState, forwardRef, useImperativeHandle } from "react";
import renderMarkdown from "@/utils/chat/markdown";
import { CaretDown } from "@phosphor-icons/react";
import DOMPurify from "dompurify";
import { isMobile } from "react-device-detect";
import ThinkingAnimation from "@/media/animations/thinking-animation.webm";
import ThinkingStatic from "@/media/animations/thinking-static.png";

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
              borderRadius: "6px",
            }}
            className={`${isExpanded || autoExpand ? "" : `${canExpand ? "hover:bg-theme-sidebar-item-hover" : ""}`} items-start bg-theme-bg-chat-input py-2 px-4 flex gap-x-2`}
          >
            <div
              className={`w-7 h-7 flex justify-center flex-shrink-0 ${!isExpanded && !autoExpand ? "items-center" : "items-start pt-[2px]"}`}
            >
              {isThinking || isComplete ? (
                <>
                  <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className={`w-7 h-7 transition-opacity duration-200 light:invert light:opacity-50 ${isThinking ? "opacity-100" : "opacity-0 hidden"}`}
                    data-tooltip-id="cot-thinking"
                    data-tooltip-content="Model is thinking..."
                    aria-label="Model is thinking..."
                  >
                    <source src={ThinkingAnimation} type="video/webm" />
                  </video>
                  <img
                    src={ThinkingStatic}
                    alt="Thinking complete"
                    className={`w-6 h-6 transition-opacity duration-200 light:invert light:opacity-50 ${!isThinking && isComplete ? "opacity-100" : "opacity-0 hidden"}`}
                    data-tooltip-id="cot-thinking"
                    data-tooltip-content="Model has finished thinking"
                    aria-label="Model has finished thinking"
                  />
                </>
              ) : null}
            </div>
            <div className="flex-1 min-w-0">
              <div
                className={`overflow-hidden transition-all transform duration-300 ease-in-out origin-top ${isExpanded || autoExpand ? "max-h-[500px]" : "max-h-6"}`}
              >
                <div
                  className={`text-theme-text-secondary font-mono leading-6 ${isExpanded || autoExpand ? "-ml-[5.5px] -mt-[4px]" : "mt-[2px]"}`}
                >
                  <span
                    className={`block w-full ${!isExpanded && !autoExpand ? "truncate" : ""}`}
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(
                        isExpanded || autoExpand
                          ? renderMarkdown(tagStrippedContent)
                          : tagStrippedContent
                      ),
                    }}
                  />
                </div>
              </div>
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
ThoughtChainComponent.displayName = "ThoughtChainComponent";

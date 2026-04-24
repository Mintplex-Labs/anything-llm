import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Wrench } from "@phosphor-icons/react";
import hljs from "highlight.js";
import { safeJsonParse } from "@/utils/request";
import { useTheme } from "@/hooks/useTheme";
import DOMPurify from "@/utils/chat/purify";
import truncate from "truncate";
import moment from "moment";

const MAX_RESULT_LENGTH = 5000;

/**
 * Get the appropriate highlight.js theme based on the theme.
 * @param {boolean} isLight - Whether the theme is light.
 * @returns {string} The highlight.js theme.
 */
function getHljsTheme(isLight) {
  return isLight ? "github" : "github-dark";
}

/**
 * Try to render `value` as syntax-highlighted JSON. Returns a `dangerouslySetInnerHTML`
 * payload, or null if the value isn't an object (caller should fall back to plain text).
 * @param {string} value - The value to format and highlight.
 * @returns {Object} The formatted and highlighted value.
 */
function formatAndHighlight(value) {
  const parsed =
    typeof value === "string" ? safeJsonParse(value, value) : value;
  if (typeof parsed !== "object" || parsed === null) return null;

  const formatted = JSON.stringify(parsed, null, 2);
  const truncatedFormatted = truncate(formatted, MAX_RESULT_LENGTH);
  const highlighted = hljs.highlight(truncatedFormatted, {
    language: "json",
  }).value;
  return { __html: DOMPurify.sanitize(highlighted) };
}

/**
 * Single tool call inside the run trace. Shows the tool name, arguments, and
 * (on demand) the tool's result. JSON arguments and results are pretty-printed
 * and syntax-highlighted; non-JSON values fall back to plain text.
 * @param {Object} toolCall - The tool call object.
 * @returns {React.ReactNode} The rendered tool call card.
 */
export default function ToolCallCard({ toolCall }) {
  const [showResult, setShowResult] = useState(false);
  return (
    <div className="border border-white/5 rounded-lg p-3 bg-theme-bg-primary/30">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Wrench className="h-3.5 w-3.5 text-blue-400" />
          <span className="text-sm font-medium text-theme-text-primary">
            {toolCall.toolName}
          </span>
        </div>
        <ToolCallTimestamp toolCall={toolCall} />
      </div>
      <ToolCallArguments toolCall={toolCall} />
      <ToolCallResult
        toolCall={toolCall}
        showResult={showResult}
        setShowResult={setShowResult}
      />
    </div>
  );
}

function ToolCallTimestamp({ toolCall }) {
  if (!toolCall.timestamp) return null;
  return (
    <span className="text-xs text-theme-text-secondary">
      {moment(toolCall.timestamp).format("LTS")}
    </span>
  );
}

function ToolCallArguments({ toolCall }) {
  const { t } = useTranslation();
  const { isLight } = useTheme();
  if (!toolCall.arguments) return null;

  const highlightedArgs = formatAndHighlight(toolCall.arguments);
  return (
    <div className="mb-2">
      <span className="text-xs text-theme-text-secondary">
        {t("scheduledJobs.toolCall.arguments")}
      </span>
      {highlightedArgs ? (
        <pre
          className={`text-xs rounded-lg p-2 mt-1 overflow-x-auto white-scrollbar tool-call-scrollbar hljs ${getHljsTheme(isLight)}`}
          dangerouslySetInnerHTML={highlightedArgs}
        />
      ) : (
        <pre className="text-xs text-theme-text-primary bg-theme-bg-primary/50 rounded p-2 mt-1 overflow-x-auto white-scrollbar tool-call-scrollbar">
          {typeof toolCall.arguments === "string"
            ? toolCall.arguments
            : JSON.stringify(toolCall.arguments, null, 2)}
        </pre>
      )}
    </div>
  );
}

function ToolCallResult({ toolCall, showResult, setShowResult }) {
  const { t } = useTranslation();
  const { isLight } = useTheme();
  if (!toolCall.result) return null;

  const resultText =
    typeof toolCall.result === "string"
      ? toolCall.result
      : JSON.stringify(toolCall.result, null, 2);
  const truncatedResult = truncate(resultText, MAX_RESULT_LENGTH);
  const highlightedResult = formatAndHighlight(resultText);

  if (!resultText) return null;
  return (
    <div>
      <button
        type="button"
        onClick={() => setShowResult(!showResult)}
        className="border-none text-xs text-blue-400 hover:text-blue-300 transition-colors"
      >
        {showResult
          ? t("scheduledJobs.toolCall.hideResult")
          : t("scheduledJobs.toolCall.showResult")}
      </button>
      {showResult &&
        (highlightedResult ? (
          <pre
            className={`text-xs rounded-lg p-2 mt-1 overflow-x-auto max-h-64 overflow-y-auto whitespace-pre-wrap white-scrollbar tool-call-scrollbar hljs ${getHljsTheme(isLight)}`}
            dangerouslySetInnerHTML={highlightedResult}
          />
        ) : (
          <pre className="text-xs text-theme-text-primary bg-theme-bg-primary/50 rounded p-2 mt-1 overflow-x-auto max-h-64 overflow-y-auto whitespace-pre-wrap white-scrollbar tool-call-scrollbar">
            {truncatedResult}
          </pre>
        ))}
    </div>
  );
}

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Wrench } from "@phosphor-icons/react";
import hljs from "highlight.js";
import { safeJsonParse } from "@/utils/request";
import { useTheme } from "@/hooks/useTheme";

// Helpers below are colocated because they're only used here. Lifted out
// of RunDetailPage as part of the components refactor.

function getHljsTheme(isLight) {
  return isLight ? "github" : "github-dark";
}

function truncateText(text) {
  return text.length > 5000 ? text.slice(0, 5000) + "..." : text;
}

// Try to render `value` as syntax-highlighted JSON. Returns a `dangerouslySetInnerHTML`
// payload, or null if the value isn't an object (caller should fall back to plain text).
function formatAndHighlight(value) {
  const parsed =
    typeof value === "string" ? safeJsonParse(value, value) : value;

  if (typeof parsed === "object" && parsed !== null) {
    const formatted = JSON.stringify(parsed, null, 2);
    const truncatedFormatted = truncateText(formatted);
    const highlighted = hljs.highlight(truncatedFormatted, {
      language: "json",
    }).value;
    return { __html: highlighted };
  }
  return null;
}

// Single tool call inside the run trace. Shows the tool name, arguments, and
// (on demand) the tool's result. JSON arguments and results are pretty-printed
// and syntax-highlighted; non-JSON values fall back to plain text.
export default function ToolCallCard({ toolCall }) {
  const { t } = useTranslation();
  const [showResult, setShowResult] = useState(false);
  const { isLight } = useTheme();

  const resultText =
    typeof toolCall.result === "string"
      ? toolCall.result
      : JSON.stringify(toolCall.result, null, 2);

  const truncatedResult = truncateText(resultText);
  const highlightedResult = formatAndHighlight(toolCall.result);
  const highlightedArgs = formatAndHighlight(toolCall.arguments);

  return (
    <div className="border border-white/5 rounded-lg p-3 bg-theme-bg-primary/30">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Wrench className="h-3.5 w-3.5 text-blue-400" />
          <span className="text-sm font-medium text-theme-text-primary">
            {toolCall.toolName}
          </span>
        </div>
        {toolCall.timestamp && (
          <span className="text-xs text-theme-text-secondary">
            {new Date(toolCall.timestamp).toLocaleTimeString()}
          </span>
        )}
      </div>

      {toolCall.arguments && (
        <div className="mb-2">
          <span className="text-xs text-theme-text-secondary">
            {t("scheduledJobs.toolCall.arguments")}
          </span>
          {highlightedArgs ? (
            <pre
              className={`text-xs rounded-lg p-2 mt-1 overflow-x-auto white-scrollbar hljs ${getHljsTheme(isLight)}`}
              dangerouslySetInnerHTML={highlightedArgs}
            />
          ) : (
            <pre className="text-xs text-theme-text-primary bg-theme-bg-primary/50 rounded p-2 mt-1 overflow-x-auto white-scrollbar">
              {typeof toolCall.arguments === "string"
                ? toolCall.arguments
                : JSON.stringify(toolCall.arguments, null, 2)}
            </pre>
          )}
        </div>
      )}

      {resultText && (
        <div>
          <button
            onClick={() => setShowResult(!showResult)}
            className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
          >
            {showResult
              ? t("scheduledJobs.toolCall.hideResult")
              : t("scheduledJobs.toolCall.showResult")}
          </button>
          {showResult &&
            (highlightedResult ? (
              <pre
                className={`text-xs rounded-lg p-2 mt-1 overflow-x-auto max-h-64 overflow-y-auto whitespace-pre-wrap white-scrollbar hljs ${getHljsTheme(isLight)}`}
                dangerouslySetInnerHTML={highlightedResult}
              />
            ) : (
              <pre className="text-xs text-theme-text-primary bg-theme-bg-primary/50 rounded p-2 mt-1 overflow-x-auto max-h-64 overflow-y-auto whitespace-pre-wrap white-scrollbar">
                {truncatedResult}
              </pre>
            ))}
        </div>
      )}
    </div>
  );
}

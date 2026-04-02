import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ChatText,
  Brain,
  Wrench,
  CaretDown,
  CaretRight,
} from "@phosphor-icons/react";
import hljs from "highlight.js";
import ScheduledJobs from "@/models/scheduledJobs";
import showToast from "@/utils/toast";
import paths from "@/utils/paths";
import renderMarkdown from "@/utils/chat/markdown";
import { safeJsonParse } from "@/utils/request";

function CollapsibleSection({
  title,
  icon: Icon,
  children,
  defaultOpen = false,
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-white/10 rounded-lg overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-2 px-4 py-3 bg-theme-bg-primary/50 hover:bg-theme-bg-primary/70 transition-colors text-left"
      >
        {open ? (
          <CaretDown className="h-4 w-4 text-theme-text-secondary" />
        ) : (
          <CaretRight className="h-4 w-4 text-theme-text-secondary" />
        )}
        <Icon className="h-4 w-4 text-theme-text-secondary" />
        <span className="text-sm font-medium text-theme-text-primary">
          {title}
        </span>
      </button>
      {open && <div className="p-4 border-t border-white/10">{children}</div>}
    </div>
  );
}

function getHljsTheme() {
  return window.localStorage.getItem("theme") === "light"
    ? "github"
    : "github-dark";
}

function formatAndHighlight(value) {
  // Try to parse as JSON for syntax highlighting
  try {
    const parsed =
      typeof value === "string" ? safeJsonParse(value, value) : value;
    if (typeof parsed === "object" && parsed !== null) {
      const formatted = JSON.stringify(parsed, null, 2);
      const truncatedFormatted =
        formatted.length > 5000 ? formatted.slice(0, 5000) + "..." : formatted;
      const highlighted = hljs.highlight(truncatedFormatted, {
        language: "json",
      }).value;
      return { __html: highlighted };
    }
  } catch {
    // Not JSON — fall through to plain text
  }
  return null;
}

function ToolCallCard({ toolCall }) {
  const [showResult, setShowResult] = useState(false);
  const resultText =
    typeof toolCall.result === "string"
      ? toolCall.result
      : JSON.stringify(toolCall.result, null, 2);
  const truncatedResult =
    resultText?.length > 5000 ? resultText.slice(0, 5000) + "..." : resultText;
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
          <span className="text-xs text-theme-text-secondary">Arguments:</span>
          {highlightedArgs ? (
            <pre
              className={`text-xs rounded-lg p-2 mt-1 overflow-x-auto white-scrollbar hljs ${getHljsTheme()}`}
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
            {showResult ? "Hide result" : "Show result"}
          </button>
          {showResult &&
            (highlightedResult ? (
              <pre
                className={`text-xs rounded-lg p-2 mt-1 overflow-x-auto max-h-64 overflow-y-auto whitespace-pre-wrap white-scrollbar hljs ${getHljsTheme()}`}
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

export default function RunDetailViewer({ runId, onBack }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [run, setRun] = useState(null);
  const [job, setJob] = useState(null);
  const [continuing, setContinuing] = useState(false);

  useEffect(() => {
    fetchRun();
  }, [runId]);

  const fetchRun = async () => {
    const data = await ScheduledJobs.getRun(runId);
    setRun(data.run);
    setJob(data.job);
    setLoading(false);

    // Mark as read
    if (data.run && !data.run.readAt) {
      ScheduledJobs.markRunRead(runId);
    }
  };

  const handleContinueInThread = async () => {
    setContinuing(true);
    const { workspaceSlug, threadSlug, error } =
      await ScheduledJobs.continueInThread(runId);

    if (error || !workspaceSlug || !threadSlug) {
      showToast(error || "Failed to create thread", "error");
      setContinuing(false);
      return;
    }

    navigate(paths.workspace.thread(workspaceSlug, threadSlug));
  };

  if (loading) {
    return (
      <div className="flex flex-col w-full px-1 md:pl-6 md:pr-[50px] md:py-6 py-16">
        <p className="text-theme-text-secondary text-sm">
          Loading run details...
        </p>
      </div>
    );
  }

  if (!run) {
    return (
      <div className="flex flex-col w-full px-1 md:pl-6 md:pr-[50px] md:py-6 py-16">
        <p className="text-theme-text-secondary text-sm">Run not found.</p>
      </div>
    );
  }

  const result = run.result || {};
  const statusColors = {
    completed: "text-green-400",
    failed: "text-red-400",
    timed_out: "text-orange-400",
    running: "text-yellow-400",
  };

  return (
    <div className="flex flex-col w-full px-1 md:pl-6 md:pr-[50px] md:py-6 py-16">
      {/* Header */}
      <div className="w-full flex flex-col gap-y-1 pb-6 border-white/10 border-b-2">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-theme-text-secondary hover:text-theme-text-primary text-sm mb-2 transition-colors w-fit"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-lg leading-6 font-bold text-theme-text-primary">
              {job?.name || "Unknown Job"} — Run #{run.id}
            </p>
            <div className="flex items-center gap-4 mt-1">
              <span
                className={`text-sm font-medium ${statusColors[run.status] || "text-gray-400"}`}
              >
                {run.status?.replace("_", " ")}
              </span>
              <span className="text-xs text-theme-text-secondary">
                {new Date(run.startedAt).toLocaleString()}
              </span>
              {result.duration && (
                <span className="text-xs text-theme-text-secondary">
                  Duration: {(result.duration / 1000).toFixed(1)}s
                </span>
              )}
            </div>
          </div>
          {run.status === "completed" && (
            <button
              onClick={handleContinueInThread}
              disabled={continuing}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary-button hover:bg-secondary-btn rounded-lg transition-colors disabled:opacity-50"
            >
              <ChatText className="h-4 w-4" />
              {continuing ? "Creating..." : "Continue in Thread"}
            </button>
          )}
        </div>
      </div>

      {/* Run info */}
      <div className="mt-6 space-y-4">
        {/* Prompt */}
        <div className="border border-white/10 rounded-lg p-4">
          <p className="text-xs text-theme-text-secondary mb-2 uppercase font-medium">
            Prompt
          </p>
          <p className="text-sm text-theme-text-primary whitespace-pre-wrap">
            {job?.prompt || "—"}
          </p>
        </div>

        {/* Error */}
        {run.error && (
          <div className="border border-red-500/20 rounded-lg p-4 bg-red-500/5">
            <p className="text-xs text-red-400 mb-1 uppercase font-medium">
              Error
            </p>
            <p className="text-sm text-red-300">{run.error}</p>
          </div>
        )}

        {/* Thinking */}
        {result.thoughts?.length > 0 && (
          <CollapsibleSection
            title={`Thinking (${result.thoughts.length} steps)`}
            icon={Brain}
          >
            <div className="space-y-2">
              {result.thoughts.map((thought, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2 text-sm text-theme-text-secondary"
                >
                  <span className="text-xs text-theme-text-secondary/50 mt-0.5 min-w-[20px]">
                    {i + 1}.
                  </span>
                  <span>{thought}</span>
                </div>
              ))}
            </div>
          </CollapsibleSection>
        )}

        {/* Tool Calls */}
        {result.toolCalls?.length > 0 && (
          <CollapsibleSection
            title={`Tool Calls (${result.toolCalls.length})`}
            icon={Wrench}
          >
            <div className="space-y-3">
              {result.toolCalls.map((toolCall, i) => (
                <ToolCallCard key={i} toolCall={toolCall} />
              ))}
            </div>
          </CollapsibleSection>
        )}

        {/* Response */}
        {result.text && (
          <CollapsibleSection
            title="Response"
            icon={ChatText}
            defaultOpen={true}
          >
            <div
              className="text-sm text-theme-text-primary markdown"
              dangerouslySetInnerHTML={{
                __html: renderMarkdown(result.text),
              }}
            />
          </CollapsibleSection>
        )}

        {/* Metrics */}
        {result.metrics && Object.keys(result.metrics).length > 0 && (
          <div className="border border-white/10 rounded-lg p-4">
            <p className="text-xs text-theme-text-secondary mb-2 uppercase font-medium">
              Metrics
            </p>
            <div className="flex gap-6 text-xs text-theme-text-secondary">
              {result.metrics.prompt_tokens != null && (
                <span>
                  Prompt tokens:{" "}
                  <span className="text-theme-text-primary">
                    {result.metrics.prompt_tokens}
                  </span>
                </span>
              )}
              {result.metrics.completion_tokens != null && (
                <span>
                  Completion tokens:{" "}
                  <span className="text-theme-text-primary">
                    {result.metrics.completion_tokens}
                  </span>
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

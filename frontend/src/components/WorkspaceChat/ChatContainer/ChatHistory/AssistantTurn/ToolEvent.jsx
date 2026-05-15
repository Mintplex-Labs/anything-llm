import { useMemo, useState } from "react";
import { CaretDown, Hammer, Check, Warning } from "@phosphor-icons/react";
import ToolApprovalRequest from "../ToolApprovalRequest";

function formatPayload(data) {
  if (data === undefined || data === null) return "";
  if (typeof data === "string") return data;
  try {
    return JSON.stringify(data, null, 2);
  } catch {
    return String(data);
  }
}

export default function ToolEvent({
  event,
  approvalResult = null,
  approvalState = null,
  chatKey,
  onToolApprovalResponse,
}) {
  if (event.type === "approval_request") {
    return (
      <ToolApprovalRequest
        requestId={event.requestId}
        skillName={event.skillName}
        payload={event.payload}
        description={event.description}
        timeoutMs={event.timeoutMs}
        allowAlwaysAllow={event.allowAlwaysAllow !== false}
        approvalState={
          approvalState?.requestId === event.requestId
            ? approvalState
            : {
                ...event,
                approved:
                  approvalResult?.approved === true ||
                  approvalResult?.approved === false
                    ? approvalResult.approved
                    : null,
                responded: !!approvalResult,
              }
        }
        onResponse={(approved) =>
          onToolApprovalResponse?.(chatKey, event.requestId, approved)
        }
      />
    );
  }

  if (event.type === "approval_result") return null;
  if (event.type === "error") return <ErrorEvent event={event} />;
  if (!["tool_call", "tool_result"].includes(event.type)) return null;

  return <ToolCallOrResult event={event} />;
}

function ToolCallOrResult({ event }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const title =
    event.type === "tool_call"
      ? `Calling ${event.toolName || "tool"}`
      : `${event.toolName || "Tool"} returned`;
  const payload = useMemo(
    () => formatPayload(event.result ?? event.args ?? event.payload),
    [event]
  );
  const hasPayload = payload.length > 0;

  return (
    <div className="flex justify-center w-full my-1 pr-4">
      <div className="w-full bg-zinc-800 light:bg-slate-100 rounded-2xl p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            {event.type === "tool_call" ? (
              <Hammer size={16} />
            ) : (
              <Check
                size={16}
                className="text-green-400 light:text-green-600"
              />
            )}
            <span className="text-sm font-medium text-white/80 light:text-slate-900 truncate">
              {title}
            </span>
          </div>
          {hasPayload && (
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="border-none"
              aria-label={isExpanded ? "Hide details" : "Show details"}
            >
              <CaretDown
                className={`w-4 h-4 transform transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
              />
            </button>
          )}
        </div>
        {event.content && (
          <p className="!m-0 mt-2 text-white/60 light:text-slate-700 font-mono text-xs">
            {event.content}
          </p>
        )}
        {hasPayload && isExpanded && (
          <pre className="mt-3 p-3 bg-zinc-900/50 light:bg-slate-200/50 rounded-lg overflow-x-auto text-xs text-zinc-300 light:text-slate-700 font-mono whitespace-pre-wrap break-words">
            {payload}
          </pre>
        )}
      </div>
    </div>
  );
}

function ErrorEvent({ event }) {
  return (
    <div className="flex justify-start w-full my-1">
      <div className="p-2 rounded-lg bg-red-50 text-red-500">
        <span className="inline-flex items-center gap-1">
          <Warning className="h-4 w-4" /> {event.content || "Agent error"}
        </span>
      </div>
    </div>
  );
}

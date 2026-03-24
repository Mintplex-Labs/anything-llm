import React, { useState, useEffect, useRef } from "react";
import { CaretDown, Check, X, Hammer } from "@phosphor-icons/react";
import AgentSkillWhitelist from "@/models/agentSkillWhitelist";
import { useTranslation } from "react-i18next";

export default function ToolApprovalRequest({
  requestId,
  skillName,
  payload = {},
  description = null,
  timeoutMs = null,
  websocket,
  onResponse,
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [responded, setResponded] = useState(false);
  const [approved, setApproved] = useState(null);
  const [alwaysAllow, setAlwaysAllow] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(timeoutMs);
  const startTimeRef = useRef(null);
  const hasPayload = payload && Object.keys(payload).length > 0;

  useEffect(() => {
    if (!timeoutMs || responded) return;
    if (startTimeRef.current === null) {
      startTimeRef.current = Date.now();
    }

    const intervalId = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      const remaining = Math.max(0, timeoutMs - elapsed);
      setTimeRemaining(remaining);

      if (remaining <= 0) {
        clearInterval(intervalId);
        handleTimeout();
      }
    }, 50);

    return () => clearInterval(intervalId);
  }, [timeoutMs, responded]);

  function handleTimeout() {
    if (responded) return;
    setResponded(true);
    setApproved(false);
    onResponse?.(false);
  }

  async function handleResponse(isApproved) {
    if (responded) return;

    setResponded(true);
    setApproved(isApproved);

    // If user approved and checked "Always allow", add to whitelist
    if (isApproved && alwaysAllow) {
      await AgentSkillWhitelist.addToWhitelist(skillName);
    }

    if (websocket && websocket.readyState === WebSocket.OPEN) {
      websocket.send(
        JSON.stringify({
          type: "toolApprovalResponse",
          requestId,
          approved: isApproved,
        })
      );
    }

    onResponse?.(isApproved);
  }

  const progressPercent = timeoutMs ? (timeRemaining / timeoutMs) * 100 : 0;

  return (
    <div className="flex justify-center w-full my-1 pr-4">
      <div className="w-full flex flex-col">
        <div className="w-full">
          <div
            style={{
              transition: "all 0.1s ease-in-out",
              borderRadius: "16px",
            }}
            className="relative bg-zinc-800 light:bg-slate-100 p-4 pb-2 flex flex-col gap-y-1 overflow-hidden"
          >
            <ToolApprovalHeader
              skillName={skillName}
              hasPayload={hasPayload}
              isExpanded={isExpanded}
              setIsExpanded={setIsExpanded}
            />
            <div className="flex flex-col gap-y-1">
              {description && (
                <span className="text-white/60 light:text-slate-700 font-medium font-mono text-xs">
                  {description}
                </span>
              )}
              <ToolApprovalPayload payload={payload} isExpanded={isExpanded} />
              <ToolApprovalResponseOption
                approved={approved}
                skillName={skillName}
                alwaysAllow={alwaysAllow}
                setAlwaysAllow={setAlwaysAllow}
                onApprove={() => handleResponse(true)}
                onReject={() => handleResponse(false)}
              />
              <ToolApprovalResponseMessage approved={approved} />
            </div>
            {timeoutMs && !responded && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-zinc-700 light:bg-slate-300">
                <div
                  className="h-full bg-sky-500 light:bg-sky-600 transition-none"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ToolApprovalHeader({
  skillName,
  hasPayload,
  isExpanded,
  setIsExpanded,
}) {
  const { t } = useTranslation();
  return (
    <div className="flex w-full items-center justify-between">
      <div className="flex items-center gap-2">
        <Hammer size={16} />
        <div className="text-white/80 light:text-slate-900 font-medium text-sm flex gap-x-1">
          {t("chat_window.agent_invocation.model_wants_to_call")}
          <span className="font-semibold text-sky-400 light:text-sky-600">
            {skillName}
          </span>
        </div>
      </div>
      {hasPayload && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="absolute top-4 right-4 border-none"
          aria-label={isExpanded ? "Hide details" : "Show details"}
        >
          <CaretDown
            className={`w-4 h-4 transform transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
          />
        </button>
      )}
    </div>
  );
}

function ToolApprovalPayload({ payload, isExpanded }) {
  const hasPayload = payload && Object.keys(payload).length > 0;
  if (!hasPayload || !isExpanded) return null;

  function formatPayload(data) {
    if (typeof data === "string") return data;
    try {
      return JSON.stringify(data, null, 2);
    } catch {
      return String(data);
    }
  }

  return (
    <div className="p-3 bg-zinc-900/50 light:bg-slate-200/50 rounded-lg overflow-x-auto">
      <pre className="text-xs text-zinc-300 light:text-slate-700 font-mono whitespace-pre-wrap break-words">
        {formatPayload(payload)}
      </pre>
    </div>
  );
}

function ToolApprovalResponseOption({
  approved,
  skillName,
  alwaysAllow,
  setAlwaysAllow,
  onApprove,
  onReject,
}) {
  const { t } = useTranslation();
  if (approved !== null) return null;

  return (
    <div className="flex flex-col gap-2 mt-1 pb-2">
      <div className="flex gap-2">
        <button
          type="button"
          onClick={onApprove}
          className="border-none transition-all duration-300 bg-white text-black hover:opacity-60 px-4 py-2 rounded-lg text-sm"
        >
          {t("chat_window.agent_invocation.approve")}
        </button>
        <button
          type="button"
          onClick={onReject}
          className="border-none text-white light:text-slate-900 text-sm font-medium w-[70px] h-9 rounded-lg hover:bg-white/5 light:hover:bg-slate-300"
        >
          {t("chat_window.agent_invocation.reject")}
        </button>
      </div>
      <label className="flex items-center gap-2 cursor-pointer text-white/60 light:text-slate-600 text-xs hover:text-white/80 light:hover:text-slate-800 transition-colors">
        <input
          type="checkbox"
          checked={alwaysAllow}
          onChange={(e) => setAlwaysAllow(e.target.checked)}
          className="w-3.5 h-3.5 rounded border-white/20 bg-transparent cursor-pointer"
        />
        <span>
          {t("chat_window.agent_invocation.always_allow", { skillName })}
        </span>
      </label>
    </div>
  );
}

function ToolApprovalResponseMessage({ approved }) {
  const { t } = useTranslation();

  if (approved === null) return null;
  if (approved === false) {
    return (
      <div className="flex items-center gap-1 text-sm font-medium text-red-400 light:text-red-500">
        <X size={16} weight="bold" />
        <span>{t("chat_window.agent_invocation.tool_call_was_rejected")}</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1 text-sm font-medium text-green-400 light:text-green-500">
      <Check size={16} weight="bold" />
      <span>{t("chat_window.agent_invocation.tool_call_was_approved")}</span>
    </div>
  );
}

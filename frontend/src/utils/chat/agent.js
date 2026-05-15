import { API_BASE } from "../constants";
import { safeJsonParse } from "../request";
import { useEffect, useState } from "react";
import { THREAD_RENAME_EVENT } from "@/components/Sidebar/ActiveWorkspaces/ThreadContainer";
import {
  debugChatTurn,
  normalizedEventSummary,
  rawEventSummary,
} from "@/utils/chat/debug";

export const AGENT_SESSION_START = "agentSessionStart";
export const AGENT_SESSION_END = "agentSessionEnd";

export function websocketURI() {
  const wsProtocol = window.location.protocol === "https:" ? "wss:" : "ws:";
  if (API_BASE === "/api") return `${wsProtocol}//${window.location.host}`;
  return `${wsProtocol}//${new URL(import.meta.env.VITE_API_BASE).host}`;
}

function dispatchThreadRename(content = {}) {
  const { slug, name } = content || {};
  if (!slug || !name) return;
  window.dispatchEvent(
    new CustomEvent(THREAD_RENAME_EVENT, {
      detail: { threadSlug: slug, newName: name },
    })
  );
}

function reportStreamEvent(content = {}) {
  const { type, uuid } = content;

  if (type === "textResponseChunk") {
    if (content.close) {
      return {
        type: "assistant_final",
        uuid,
        content: content.content || "",
        sources: content.sources || [],
        metrics: content.metrics || {},
        chatId: content.chatId || null,
        closed: true,
      };
    }

    return {
      type: "assistant_delta",
      uuid,
      content: content.content || "",
      sources: content.sources || [],
      metrics: content.metrics || {},
      chatId: content.chatId || null,
      closed: false,
    };
  }

  if (type === "fullTextResponse") {
    return {
      type: "assistant_final",
      uuid,
      content: content.content || "",
      sources: content.sources || [],
      metrics: content.metrics || {},
      chatId: content.chatId || null,
      closed: !!content.close,
    };
  }

  if (type === "usageMetrics") {
    return {
      type: "assistant_patch",
      uuid,
      patch: { metrics: content.metrics || {} },
    };
  }

  if (type === "citations") {
    return {
      type: "assistant_patch",
      uuid,
      patch: { sources: content.citations || [] },
      appendSources: true,
    };
  }

  if (type === "chatId") {
    return {
      type: "assistant_final",
      uuid,
      content: "",
      chatId: content.chatId,
      sources: content.sources || [],
      metrics: content.metrics || {},
      closed: !!content.close,
    };
  }

  if (type === "toolCallInvocation") {
    return {
      type: "timeline_event",
      event: {
        type: "tool_call",
        uuid,
        content: content.content || "",
        toolName: content.toolName,
        args: content.arguments,
        payload: content,
      },
    };
  }

  if (type === "toolCallResult") {
    return {
      type: "timeline_event",
      event: {
        type: "tool_result",
        uuid,
        content: content.content || "",
        toolName: content.toolName,
        args: content.arguments,
        result: content.result,
        payload: content,
      },
    };
  }

  if (type === "statusResponse") {
    return {
      type: "timeline_event",
      event: {
        type: "thought",
        uuid,
        content: content.content || "",
        payload: content,
      },
    };
  }

  if (type === "removeStatusResponse") {
    return {
      type: "timeline_event",
      event: {
        type: "remove_agent_event",
        uuid,
        targetUuid: uuid,
      },
    };
  }

  return {
    type: "timeline_event",
    event: {
      type: "thought",
      uuid,
      content: content.content || "",
      payload: content,
    },
  };
}

export default function handleSocketResponse(_socket, event) {
  const data = safeJsonParse(event.data, null);
  if (data === null) {
    debugChatTurn("normalize:event", {
      source: "WebSocket",
      rawType: "unparseable",
      normalizedType: null,
      contentLength: typeof event.data === "string" ? event.data.length : 0,
    });
    return null;
  }

  let normalized = null;

  if (data.type === "rename_thread") {
    dispatchThreadRename(data.content);
    normalized = { type: "thread_rename", content: data.content };
    debugChatTurn("normalize:event", {
      ...rawEventSummary(data, "WebSocket"),
      ...normalizedEventSummary(normalized, "WebSocket"),
    });
    return normalized;
  }

  if (!data.hasOwnProperty("type")) {
    normalized = {
      type: "assistant_final",
      content: data.content || "",
    };
    debugChatTurn("normalize:event", {
      ...rawEventSummary(data, "WebSocket"),
      ...normalizedEventSummary(normalized, "WebSocket"),
    });
    return normalized;
  }

  if (data.type === "chatId") {
    const content =
      data.content && typeof data.content === "object" ? data.content : data;
    normalized = {
      type: "assistant_final",
      uuid: content.uuid,
      content: content.content || "",
      chatId: content.chatId,
      sources: content.sources || [],
      metrics: content.metrics || {},
      closed: !!content.close,
    };
    debugChatTurn("normalize:event", {
      ...rawEventSummary(data, "WebSocket"),
      ...normalizedEventSummary(normalized, "WebSocket"),
    });
    return normalized;
  }

  if (data.type === "statusResponse") {
    normalized = {
      type: "timeline_event",
      event: {
        type: "thought",
        content: data.content || "",
        animate: data.animate,
      },
    };
    debugChatTurn("normalize:event", {
      ...rawEventSummary(data, "WebSocket"),
      ...normalizedEventSummary(normalized, "WebSocket"),
    });
    return normalized;
  }

  if (data.type === "toolApprovalRequest") {
    if (!data.requestId || !data.skillName) return null;
    normalized = {
      type: "timeline_event",
      event: {
        type: "approval_request",
        requestId: data.requestId,
        skillName: data.skillName,
        payload: data.payload,
        description: data.description,
        timeoutMs: data.timeoutMs,
        requestedAt: Date.now(),
        content: `Approval requested for ${data.skillName}`,
      },
    };
    debugChatTurn("normalize:event", {
      ...rawEventSummary(data, "WebSocket"),
      ...normalizedEventSummary(normalized, "WebSocket"),
    });
    return normalized;
  }

  if (data.type === "wssFailure") {
    normalized = {
      type: "assistant_error",
      content: data.content || "Agent websocket connection failed.",
      error: data.content || "Agent websocket connection failed.",
    };
    debugChatTurn("normalize:event", {
      ...rawEventSummary(data, "WebSocket"),
      ...normalizedEventSummary(normalized, "WebSocket"),
    });
    return normalized;
  }

  if (data.type === "fileDownloadCard") {
    normalized = {
      type: "timeline_event",
      event: {
        type: "tool_result",
        content: "File generated.",
        payload: data.content,
        result: data.content,
      },
    };
    debugChatTurn("normalize:event", {
      ...rawEventSummary(data, "WebSocket"),
      ...normalizedEventSummary(normalized, "WebSocket"),
    });
    return normalized;
  }

  if (data.type === "rechartVisualize") {
    normalized = {
      type: "timeline_event",
      event: {
        type: "tool_result",
        content: "Chart generated.",
        payload: data.content,
        result: data.content,
      },
    };
    debugChatTurn("normalize:event", {
      ...rawEventSummary(data, "WebSocket"),
      ...normalizedEventSummary(normalized, "WebSocket"),
    });
    return normalized;
  }

  if (data.type === "reportStreamEvent") {
    normalized = reportStreamEvent(data.content || {});
    debugChatTurn("normalize:event", {
      ...rawEventSummary(data, "WebSocket"),
      ...normalizedEventSummary(normalized, "WebSocket"),
    });
    return normalized;
  }

  normalized = {
    type: "timeline_event",
    event: {
      type: "thought",
      content: data.content || "",
      payload: data,
    },
  };
  debugChatTurn("normalize:event", {
    ...rawEventSummary(data, "WebSocket"),
    ...normalizedEventSummary(normalized, "WebSocket"),
  });
  return normalized;
}

let _agentSessionActive = false;
export function setAgentSessionActive(value) {
  _agentSessionActive = value;
}
export function getAgentSessionActive() {
  return _agentSessionActive;
}

export function useIsAgentSessionActive() {
  const [activeSession, setActiveSession] = useState(
    () => !!getAgentSessionActive()
  );
  useEffect(() => {
    function onStart() {
      setActiveSession(true);
    }
    function onEnd() {
      setActiveSession(false);
    }
    window.addEventListener(AGENT_SESSION_START, onStart);
    window.addEventListener(AGENT_SESSION_END, onEnd);
    return () => {
      window.removeEventListener(AGENT_SESSION_START, onStart);
      window.removeEventListener(AGENT_SESSION_END, onEnd);
    };
  }, []);

  return activeSession;
}

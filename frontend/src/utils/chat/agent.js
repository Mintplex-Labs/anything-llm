import { v4 } from "uuid";
import { safeJsonParse } from "../request";
import { API_BASE } from "../constants";
import { useEffect, useState } from "react";
import { THREAD_RENAME_EVENT } from "@/components/Sidebar/ActiveWorkspaces/ThreadContainer";

export const AGENT_SESSION_START = "agentSessionStart";
export const AGENT_SESSION_END = "agentSessionEnd";
const handledEvents = [
  "statusResponse",
  "fileDownloadCard",
  "awaitingFeedback",
  "wssFailure",
  "rechartVisualize",
  "toolApprovalRequest",
  // Streaming events
  "reportStreamEvent",
];
const NON_FINAL_ASSISTANT_MESSAGE_TYPES = new Set([
  "statusResponse",
  "toolApprovalRequest",
  "toolCallInvocation",
  "toolCallResult",
]);
const AGENT_TIMELINE_STREAM_TYPES = new Set([
  "statusResponse",
  "toolCallInvocation",
  "toolCallResult",
  "removeStatusResponse",
]);

function canAdoptAssistantMessage(message = {}) {
  return (
    message?.role === "assistant" &&
    !NON_FINAL_ASSISTANT_MESSAGE_TYPES.has(message.type)
  );
}

export function websocketURI() {
  const wsProtocol = window.location.protocol === "https:" ? "wss:" : "ws:";
  if (API_BASE === "/api") return `${wsProtocol}//${window.location.host}`;
  return `${wsProtocol}//${new URL(import.meta.env.VITE_API_BASE).host}`;
}

function findAssistantMessageIndex(messages = [], uuid = null) {
  const exactIdx = uuid
    ? messages.findIndex(
        (message) => message.uuid === uuid && canAdoptAssistantMessage(message)
      )
    : -1;
  if (exactIdx !== -1) return exactIdx;

  for (let i = messages.length - 1; i >= 0; i--) {
    const message = messages[i];
    if (
      canAdoptAssistantMessage(message) &&
      !message.chatId &&
      (message.pending || message.animate || message.userMessage)
    ) {
      return i;
    }
  }
  return -1;
}

function appendDisplayMessage(messages = [], message) {
  return [
    ...messages.filter(
      (item) =>
        !!item.content ||
        item.role === "user" ||
        item.pending ||
        item.animate ||
        item.type === "toolApprovalRequest"
    ),
    message,
  ];
}

export default function handleSocketResponse(socket, event, setChatHistory) {
  const data = safeJsonParse(event.data, null);
  if (data === null) return;

  // Handle thread rename
  if (data.type === "rename_thread") {
    const { slug, name } = data.content || {};
    if (slug && name) {
      window.dispatchEvent(
        new CustomEvent(THREAD_RENAME_EVENT, {
          detail: { threadSlug: slug, newName: name },
        })
      );
    }
    return;
  }

  // No message type is defined then this is a generic message
  // that we need to print to the user as a system response
  if (!data.hasOwnProperty("type") && !socket.supportsAgentStreaming) {
    return setChatHistory((prev) => {
      return [
        ...prev.filter((msg) => !!msg.content),
        {
          uuid: v4(),
          content: data.content,
          role: "assistant",
          sources: [],
          closed: true,
          error: null,
          animate: false,
          pending: false,
          metrics: {},
        },
      ];
    });
  }

  // toolApprovalRequest doesn't have content field, so check separately
  if (data.type === "toolApprovalRequest") {
    if (!data.requestId || !data.skillName) return;
  } else if (!handledEvents.includes(data.type) || !data.content) {
    return;
  }

  if (data.type === "reportStreamEvent") {
    // Enable agent streaming for the next message so we can handle streaming or non-streaming responses
    // If we get this message we know the provider supports agentic streaming
    socket.supportsAgentStreaming = true;

    return setChatHistory((prev) => {
      if (AGENT_TIMELINE_STREAM_TYPES.has(data.content.type)) return prev;

      const knownMessageIdx = findAssistantMessageIndex(
        prev,
        data.content.uuid
      );
      const knownMessage = knownMessageIdx >= 0 ? prev[knownMessageIdx] : null;
      if (!knownMessage) {
        if (data.content.type === "fullTextResponse") {
          return appendDisplayMessage(prev, {
            uuid: data.content.uuid,
            type: "textResponse",
            content: data.content.content,
            role: "assistant",
            sources: [],
            closed: true,
            error: null,
            animate: false,
            pending: false,
            metrics: {},
          });
        }

        // Handle textResponseChunk initialization as textResponse instead of statusResponse.
        // Without this the first chunk creates a statusResponse (thought bubble) by falling through to the default case.
        // Providers like Gemini send large chunks and can complete in a single chunk before the update logic can convert it.
        // Other providers send many small chunks so the second chunk triggers the update logic to fix the type.
        if (data.content.type === "textResponseChunk") {
          // If this first chunk is just a non-text char (like \n, \t, etc.) then we need to ignore it.
          // Some providers like LMStudio will do this and it depends on the chat template as well.
          if (data.content.content.trim() === "") return prev;
          return appendDisplayMessage(prev, {
            uuid: data.content.uuid,
            type: "textResponse",
            content: data.content.content,
            role: "assistant",
            sources: [],
            closed: true,
            error: null,
            animate: false,
            pending: false,
            metrics: {},
          });
        }

        return prev;
      } else {
        const { type, content, uuid } = data.content;

        if (AGENT_TIMELINE_STREAM_TYPES.has(type)) return prev;

        if (type === "fullTextResponse") {
          return prev.map((msg, index) =>
            index === knownMessageIdx
              ? {
                  ...msg,
                  uuid: uuid || msg.uuid,
                  type: "textResponse",
                  content,
                  role: "assistant",
                  sources: [],
                  closed: true,
                  error: null,
                  animate: false,
                  pending: false,
                  metrics: msg.metrics || {},
                }
              : msg
          );
        }

        if (type === "textResponseChunk" && knownMessage.uuid !== uuid) {
          return prev.map((msg, index) =>
            index === knownMessageIdx
              ? {
                  ...msg,
                  uuid: uuid || msg.uuid,
                  type: "textResponse",
                  content: (msg.content || "") + content,
                  pending: false,
                }
              : msg
          );
        }

        if (type === "usageMetrics") {
          if (!data.content.metrics) return prev;
          return prev.map((msg, index) =>
            index === knownMessageIdx
              ? {
                  ...msg,
                  uuid: uuid || msg.uuid,
                  metrics: data.content.metrics,
                }
              : msg
          );
        }

        if (type === "citations") {
          if (!data.content.citations) return prev;
          return prev.map((msg, index) =>
            index === knownMessageIdx
              ? {
                  ...msg,
                  uuid: uuid || msg.uuid,
                  sources: [...(msg.sources || []), ...data.content.citations],
                }
              : msg
          );
        }

        if (type === "chatId") {
          if (!data.content.chatId) return prev;
          return prev.map((msg, index) =>
            index === knownMessageIdx
              ? { ...msg, uuid: uuid || msg.uuid, chatId: data.content.chatId }
              : msg
          );
        }

        if (type === "textResponseChunk") {
          if (content.trim() === "") return prev;
          return prev.map((msg, index) =>
            index === knownMessageIdx
              ? {
                  ...msg,
                  uuid: uuid || msg.uuid,
                  type: "textResponse",
                  content: (msg.content || "") + content,
                  pending: false,
                }
              : msg
          );
        }

        return prev;
      }
    });
  }

  if (data.type === "statusResponse") return;

  if (data.type === "fileDownloadCard") {
    return setChatHistory((prev) => {
      return [
        ...prev.filter((msg) => !!msg.content),
        {
          type: "fileDownloadCard",
          uuid: v4(),
          content: data.content,
          role: "assistant",
          sources: [],
          closed: true,
          error: null,
          animate: false,
          pending: false,
          metrics: data.metrics || {},
        },
      ];
    });
  }

  if (data.type === "rechartVisualize") {
    return setChatHistory((prev) => {
      return [
        ...prev.filter((msg) => !!msg.content),
        {
          type: "rechartVisualize",
          uuid: v4(),
          content: data.content,
          role: "assistant",
          sources: [],
          closed: true,
          error: null,
          animate: false,
          pending: false,
          metrics: data.metrics || {},
        },
      ];
    });
  }

  if (data.type === "wssFailure") {
    return setChatHistory((prev) => {
      return [
        ...prev.filter((msg) => !!msg.content),
        {
          uuid: v4(),
          content: data.content,
          role: "assistant",
          sources: [],
          closed: true,
          error: data.content,
          animate: false,
          pending: false,
          metrics: {},
        },
      ];
    });
  }

  if (data.type === "toolApprovalRequest") {
    return setChatHistory((prev) => {
      const approval = {
        uuid: `approval:${data.requestId}`,
        draftId: `approval:${data.requestId}`,
        type: "toolApprovalRequest",
        requestId: data.requestId,
        skillName: data.skillName,
        payload: data.payload,
        description: data.description,
        timeoutMs: data.timeoutMs,
        content: `Approval requested for ${data.skillName}`,
        role: "assistant",
        sources: [],
        closed: false,
        error: null,
        animate: false,
        pending: true,
        metrics: {},
      };
      const existingIdx = prev.findIndex(
        (msg) =>
          msg.type === "toolApprovalRequest" && msg.requestId === data.requestId
      );
      if (existingIdx >= 0) {
        return prev.map((msg, index) =>
          index === existingIdx ? { ...msg, ...approval } : msg
        );
      }
      return appendDisplayMessage(prev, approval);
    });
  }

  return setChatHistory((prev) => {
    return [
      ...prev.filter((msg) => !!msg.content),
      {
        uuid: v4(),
        type: data.type,
        content: data.content,
        role: "assistant",
        sources: [],
        closed: true,
        error: null,
        animate: data?.animate || false,
        pending: false,
        metrics: data.metrics || {},
      },
    ];
  });
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
    function listenForAgentSession() {
      if (!window) return;
      window.addEventListener(AGENT_SESSION_START, () =>
        setActiveSession(true)
      );
      window.addEventListener(AGENT_SESSION_END, () => setActiveSession(false));
    }
    listenForAgentSession();
  }, []);

  return activeSession;
}

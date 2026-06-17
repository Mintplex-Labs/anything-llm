import { v4 } from "uuid";
import { safeJsonParse } from "../request";
import { API_BASE } from "../constants";
import { useEffect, useState } from "react";
import { emitAssistantMessageCompleteEvent } from "@/components/contexts/TTSProvider";
import { THREAD_RENAME_EVENT } from "@/components/Sidebar/ActiveWorkspaces/ThreadContainer";

export const AGENT_SESSION_START = "agentSessionStart";
export const AGENT_SESSION_END = "agentSessionEnd";

// Citations arrive as a terminal websocket event that must match an existing message by
// uuid. On a thread's first message the empty->chat transition remounts the chat and
// replays the send, so the citations event can land before its message exists in history.
// Buffer by uuid (module scope survives the remount) and attach when the message appears.
const bufferedCitations = new Map();
function takeBufferedCitations(uuid) {
  if (!uuid || !bufferedCitations.has(uuid)) return [];
  const citations = bufferedCitations.get(uuid);
  bufferedCitations.delete(uuid);
  return citations;
}
const handledEvents = [
  "statusResponse",
  "fileDownloadCard",
  "awaitingFeedback",
  "wssFailure",
  "rechartVisualize",
  "toolApprovalRequest",
  "clarificationRequest",
  // Streaming events
  "reportStreamEvent",
];

export function websocketURI() {
  const wsProtocol = window.location.protocol === "https:" ? "wss:" : "ws:";
  if (API_BASE === "/api") return `${wsProtocol}//${window.location.host}`;
  return `${wsProtocol}//${new URL(import.meta.env.VITE_API_BASE).host}`;
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
  } else if (data.type === "clarificationRequest") {
    if (!data.requestId || !Array.isArray(data.questions)) return;
  } else if (!handledEvents.includes(data.type) || !data.content) {
    return;
  }

  if (data.type === "reportStreamEvent") {
    // Enable agent streaming for the next message so we can handle streaming or non-streaming responses
    // If we get this message we know the provider supports agentic streaming
    socket.supportsAgentStreaming = true;

    // trigger TTS auto-play
    if (data.content?.type === "chatId" && data.content?.chatId)
      emitAssistantMessageCompleteEvent(data.content.chatId);

    return setChatHistory((prev) => {
      if (data.content.type === "removeStatusResponse")
        return [...prev.filter((msg) => msg.uuid !== data.content.uuid)];

      if (data.content.type === "modelRouteNotification") {
        if (!data.content.routedTo) return prev;
        return [
          ...prev.filter(
            (msg) => !(msg.role === "assistant" && msg.pending && !msg.content)
          ),
          {
            uuid: data.content.uuid,
            type: "modelRouteNotification",
            content: "modelRouteNotification",
            routedTo: data.content.routedTo,
          },
        ];
      }

      // Handle citations independently of message creation order. If the target message
      // exists, attach now or buffer until it is created.
      if (data.content.type === "citations") {
        const { uuid, citations } = data.content;
        if (!citations) return prev;
        let attached = false;
        const next = prev.map((msg) => {
          if (msg.uuid !== uuid) return msg;
          attached = true;
          return { ...msg, sources: [...(msg.sources || []), ...citations] };
        });
        if (!attached) bufferedCitations.set(uuid, citations);
        return next;
      }

      const knownMessage = data.content.uuid
        ? prev.find((msg) => msg.uuid === data.content.uuid)
        : null;
      if (!knownMessage) {
        if (data.content.type === "fullTextResponse") {
          return [
            ...prev.filter((msg) => !!msg.content),
            {
              uuid: data.content.uuid,
              type: "textResponse",
              content: data.content.content,
              role: "assistant",
              sources: takeBufferedCitations(data.content.uuid),
              closed: true,
              error: null,
              animate: false,
              pending: false,
              metrics: {},
            },
          ];
        }

        // Handle textResponseChunk initialization as textResponse instead of statusResponse.
        // Without this the first chunk creates a statusResponse (thought bubble) by falling through to the default case.
        // Providers like Gemini send large chunks and can complete in a single chunk before the update logic can convert it.
        // Other providers send many small chunks so the second chunk triggers the update logic to fix the type.
        if (data.content.type === "textResponseChunk") {
          // If this first chunk is just a non-text char (like \n, \t, etc.) then we need to ignore it.
          // Some providers like LMStudio will do this and it depends on the chat template as well.
          if (data.content.content.trim() === "") return prev;
          return [
            ...prev.filter((msg) => !!msg.content),
            {
              uuid: data.content.uuid,
              type: "textResponse",
              content: data.content.content,
              role: "assistant",
              sources: takeBufferedCitations(data.content.uuid),
              closed: true,
              error: null,
              animate: false,
              pending: false,
              metrics: {},
            },
          ];
        }

        return [
          ...prev.filter((msg) => !!msg.content),
          {
            uuid: data.content.uuid,
            type: "statusResponse",
            content: data.content.content,
            role: "assistant",
            sources: [],
            closed: true,
            error: null,
            animate: false,
            pending: false,
            metrics: {},
          },
        ];
      } else {
        const { type, content, uuid } = data.content;
        // For tool call invocations, we need to update the existing message entirely since it is accumulated
        // and we dont know if the function will have arguments or not while streaming - so replace the existing message entirely
        if (type === "toolCallInvocation") {
          const knownMessage = prev.find((msg) => msg.uuid === uuid);
          if (!knownMessage)
            return [...prev, { uuid, type: "toolCallInvocation", content }]; // If the message is not known, add it to the end of the list
          return [
            ...prev.filter((msg) => msg.uuid !== uuid),
            { ...knownMessage, content },
          ]; // If the message is known, replace it with the new content
        }

        if (type === "usageMetrics") {
          if (!data.content.metrics) return prev;
          return prev.map((msg) =>
            msg.uuid === uuid ? { ...msg, metrics: data.content.metrics } : msg
          );
        }

        if (type === "chatId") {
          if (!data.content.chatId) return prev;
          const assistantIdx = prev.findIndex((msg) => msg.uuid === uuid);
          if (assistantIdx === -1) return prev;
          const userIdx = prev.findLastIndex(
            (msg, i) => i < assistantIdx && msg.role === "user"
          );
          return prev.map((msg, i) =>
            i === assistantIdx || i === userIdx
              ? { ...msg, chatId: data.content.chatId }
              : msg
          );
        }

        if (type === "textResponseChunk") {
          return prev
            .map((msg) =>
              msg.uuid === uuid
                ? {
                    ...msg,
                    type: "textResponse",
                    content: msg.content + content,
                  }
                : msg?.content
                  ? msg
                  : null
            )
            .filter((msg) => !!msg);
        }

        // Generic text response - will be put in the agent thought bubble
        return prev.map((msg) =>
          msg.uuid === data.content.uuid
            ? { ...msg, content: msg.content + data.content.content }
            : msg
        );
      }
    });
  }

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
      return [
        ...prev.filter((msg) => !!msg.content),
        {
          uuid: v4(),
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
        },
      ];
    });
  }

  if (data.type === "clarificationRequest") {
    return setChatHistory((prev) => {
      return [
        ...prev.filter((msg) => !!msg.content),
        {
          uuid: v4(),
          type: "clarifyingQuestion",
          requestId: data.requestId,
          questions: data.questions || [],
          allowSkip: data.allowSkip !== false,
          timeoutMs: data.timeoutMs,
          content: `Agent has ${data.questions?.length || 0} question${
            (data.questions?.length || 0) === 1 ? "" : "s"
          }`,
          role: "assistant",
          sources: [],
          closed: false,
          error: null,
          animate: false,
          pending: true,
          metrics: {},
        },
      ];
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

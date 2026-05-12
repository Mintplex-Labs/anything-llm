import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { v4 } from "uuid";
import Workspace from "@/models/workspace";
import handleChat, { ABORT_STREAM_EVENT } from "@/utils/chat";
import handleSocketResponse, {
  AGENT_SESSION_END,
  AGENT_SESSION_START,
  setAgentSessionActive,
  websocketURI,
} from "@/utils/chat/agent";
import { safeJsonParse } from "@/utils/request";

const ChatThreadDraftContext = createContext(null);
const STORAGE_PREFIX = "chat-thread-draft";

export function getChatThreadKey(workspaceSlug, threadSlug = null) {
  if (!workspaceSlug) return null;
  return `${workspaceSlug}:${threadSlug || "default"}`;
}

function getStorageKey(workspaceSlug, threadSlug = null) {
  return `${STORAGE_PREFIX}:${workspaceSlug}:${threadSlug || "default"}`;
}

function draftFromStorageValue(value) {
  if (!value || !value.workspaceSlug) return null;
  return {
    workspaceSlug: value.workspaceSlug,
    threadSlug: value.threadSlug ?? null,
    messages: Array.isArray(value.messages) ? value.messages : [],
    agentEvents: Array.isArray(value.agentEvents) ? value.agentEvents : [],
    pendingApproval: value.pendingApproval ?? null,
    activeToolCall: value.activeToolCall ?? null,
    isStreaming: !!value.isStreaming,
    isAgentRunning: !!value.isAgentRunning,
    updatedAt: value.updatedAt || Date.now(),
    persistError: value.persistError || null,
  };
}

function createDraft({ workspaceSlug, threadSlug = null, messages = [] }) {
  return {
    workspaceSlug,
    threadSlug,
    messages,
    agentEvents: [],
    pendingApproval: null,
    activeToolCall: null,
    isStreaming: false,
    isAgentRunning: false,
    updatedAt: Date.now(),
    persistError: null,
  };
}

function serializableDraft(draft) {
  return {
    messages: draft.messages,
    agentEvents: draft.agentEvents,
    pendingApproval: draft.pendingApproval,
    activeToolCall: draft.activeToolCall,
    isStreaming: draft.isStreaming,
    isAgentRunning: draft.isAgentRunning,
    updatedAt: draft.updatedAt,
    workspaceSlug: draft.workspaceSlug,
    threadSlug: draft.threadSlug,
    persistError: draft.persistError || null,
  };
}

function persistDraft(draft) {
  if (typeof window === "undefined" || !draft?.workspaceSlug) return;
  const key = getStorageKey(draft.workspaceSlug, draft.threadSlug);
  const hasDraft =
    draft.agentEvents.length > 0 ||
    draft.pendingApproval ||
    draft.activeToolCall ||
    draft.isStreaming ||
    draft.isAgentRunning ||
    draft.persistError ||
    draft.messages.some((msg) => msg.pending || msg.animate || msg.userMessage);

  if (!hasDraft) {
    sessionStorage.removeItem(key);
    return;
  }

  sessionStorage.setItem(key, JSON.stringify(serializableDraft(draft)));
}

function removeStoredDraft(workspaceSlug, threadSlug = null) {
  if (typeof window === "undefined" || !workspaceSlug) return;
  sessionStorage.removeItem(getStorageKey(workspaceSlug, threadSlug));
}

function restoreStoredDrafts() {
  if (typeof window === "undefined") return {};
  const drafts = {};
  for (let i = 0; i < sessionStorage.length; i++) {
    const key = sessionStorage.key(i);
    if (!key?.startsWith(`${STORAGE_PREFIX}:`)) continue;
    const draft = draftFromStorageValue(
      safeJsonParse(sessionStorage.getItem(key))
    );
    if (!draft) continue;
    const chatKey = getChatThreadKey(draft.workspaceSlug, draft.threadSlug);
    drafts[chatKey] = draft;
  }
  return drafts;
}

function normalizeEvent(event) {
  return {
    id: event.id || v4(),
    createdAt: event.createdAt || Date.now(),
    ...event,
  };
}

function mergeMessages(serverHistory = [], localMessages = []) {
  if (!localMessages.length) return serverHistory;
  if (!serverHistory.length) return localMessages;

  const serverIds = new Set(
    serverHistory
      .map((msg) => msg.chatId || msg.uuid)
      .filter((id) => id !== null && id !== undefined)
  );
  const extras = localMessages.filter((msg) => {
    const id = msg.chatId || msg.uuid;
    if (!id) return true;
    return !serverIds.has(id);
  });

  return [...serverHistory, ...extras];
}

function hasUnfinishedDraft(draft) {
  return !!(
    draft?.isStreaming ||
    draft?.isAgentRunning ||
    draft?.pendingApproval ||
    draft?.activeToolCall ||
    draft?.agentEvents?.length ||
    draft?.messages?.some((msg) => msg.pending || msg.animate)
  );
}

function agentEventFromChatResult(chatResult = {}) {
  const { type, uuid, textResponse, error, chatId, metrics, sources, close } =
    chatResult;

  if (type === "textResponseChunk") {
    return {
      type: "assistant_delta",
      uuid,
      content: textResponse || "",
      sources: sources || [],
      closed: !!close,
    };
  }
  if (type === "finalizeResponseStream" || type === "textResponse") {
    return {
      type: "final_message",
      uuid,
      chatId,
      content: textResponse || "",
      sources: sources || [],
      metrics: metrics || {},
    };
  }
  if (type === "statusResponse") {
    return {
      type: "agent_thought",
      uuid,
      content: textResponse || "",
    };
  }
  if (type === "abort") {
    return {
      type: "error",
      uuid,
      content: error || textResponse || "Stream aborted.",
    };
  }
  if (type === "stopGeneration") {
    return {
      type: "error",
      uuid,
      content: "Generation stopped by user.",
    };
  }
  return null;
}

function agentEventFromSocketData(data = {}) {
  if (data.type === "statusResponse") {
    return {
      type: "agent_thought",
      content: data.content,
      animate: data.animate,
    };
  }
  if (data.type === "toolApprovalRequest") {
    return {
      type: "approval_request",
      requestId: data.requestId,
      skillName: data.skillName,
      payload: data.payload,
      description: data.description,
      timeoutMs: data.timeoutMs,
      requestedAt: Date.now(),
    };
  }
  if (data.type === "wssFailure") {
    return {
      type: "error",
      content: data.content,
    };
  }
  if (data.type === "fileDownloadCard") {
    return {
      type: "tool_result",
      content: data.content,
      payload: data.content,
    };
  }
  if (data.type === "rechartVisualize") {
    return {
      type: "tool_result",
      content: data.content,
      payload: data.content,
    };
  }
  if (data.type !== "reportStreamEvent" || !data.content) return null;

  const content = data.content;
  if (content.type === "textResponseChunk") {
    return {
      type: "assistant_delta",
      uuid: content.uuid,
      content: content.content || "",
    };
  }
  if (content.type === "fullTextResponse") {
    return {
      type: "final_message",
      uuid: content.uuid,
      content: content.content || "",
    };
  }
  if (content.type === "toolCallInvocation") {
    return {
      type: "tool_call",
      uuid: content.uuid,
      content: content.content || "",
      toolName: content.toolName,
      arguments: content.arguments,
    };
  }
  if (content.type === "toolCallResult") {
    return {
      type: "tool_result",
      uuid: content.uuid,
      content: content.content || "",
      toolName: content.toolName,
      arguments: content.arguments,
      result: content.result,
    };
  }
  if (content.type === "usageMetrics" || content.type === "citations") {
    return null;
  }
  if (content.type === "chatId") {
    return {
      type: "final_message",
      uuid: content.uuid,
      chatId: content.chatId,
      content: "",
    };
  }
  if (content.type === "removeStatusResponse") return null;

  return {
    type: "agent_thought",
    uuid: content.uuid,
    content: content.content || "",
    sourceType: content.type,
  };
}

export function ChatThreadDraftProvider({ children }) {
  const [drafts, setDrafts] = useState(() => restoreStoredDrafts());
  const draftsRef = useRef(drafts);
  const websocketRefs = useRef({});
  const approvalTimeoutRefs = useRef({});
  const pendingResetRefs = useRef({});

  useEffect(() => {
    draftsRef.current = drafts;
  }, [drafts]);

  const updateDraft = useCallback((chatKey, updater) => {
    setDrafts((prev) => {
      let current = prev[chatKey];
      if (!current) {
        const [workspaceSlug, threadPart] = chatKey.split(":");
        current = createDraft({
          workspaceSlug,
          threadSlug: threadPart === "default" ? null : threadPart,
        });
      }
      const next = {
        ...updater(current),
        updatedAt: Date.now(),
      };
      persistDraft(next);
      return { ...prev, [chatKey]: next };
    });
  }, []);

  const ensureDraft = useCallback(
    ({ workspaceSlug, threadSlug = null, messages = [] }) => {
      const chatKey = getChatThreadKey(workspaceSlug, threadSlug);
      setDrafts((prev) => {
        const existing = prev[chatKey];
        if (existing) {
          const next = {
            ...existing,
            messages: mergeMessages(messages, existing.messages),
            updatedAt: Date.now(),
          };
          persistDraft(next);
          return { ...prev, [chatKey]: next };
        }

        const restored = draftFromStorageValue(
          safeJsonParse(
            sessionStorage.getItem(getStorageKey(workspaceSlug, threadSlug))
          )
        );
        const next =
          restored ||
          createDraft({
            workspaceSlug,
            threadSlug,
            messages,
          });
        persistDraft(next);
        return { ...prev, [chatKey]: next };
      });
      return chatKey;
    },
    []
  );

  const appendAgentEvent = useCallback(
    (chatKey, rawEvent) => {
      if (!rawEvent) return;
      const event = normalizeEvent(rawEvent);
      updateDraft(chatKey, (draft) => {
        let agentEvents = draft.agentEvents || [];
        let pendingApproval = draft.pendingApproval || null;
        let activeToolCall = draft.activeToolCall || null;

        if (event.type === "tool_call" && event.uuid) {
          const idx = agentEvents.findIndex(
            (item) => item.type === "tool_call" && item.uuid === event.uuid
          );
          if (idx >= 0) {
            agentEvents = agentEvents.map((item, itemIdx) =>
              itemIdx === idx ? { ...item, ...event } : item
            );
          } else {
            agentEvents = [...agentEvents, event];
          }
          activeToolCall = event;
        } else {
          agentEvents = [...agentEvents, event];
        }

        if (event.type === "tool_result") activeToolCall = null;
        if (event.type === "approval_request") pendingApproval = event;
        if (event.type === "approval_result") pendingApproval = null;

        return {
          ...draft,
          agentEvents,
          pendingApproval,
          activeToolCall,
        };
      });
    },
    [updateDraft]
  );

  const setMessages = useCallback(
    (chatKey, messagesOrUpdater) => {
      updateDraft(chatKey, (draft) => {
        const messages =
          typeof messagesOrUpdater === "function"
            ? messagesOrUpdater(draft.messages || [])
            : messagesOrUpdater;
        return { ...draft, messages: messages || [] };
      });
    },
    [updateDraft]
  );

  const setStreaming = useCallback(
    (chatKey, value) => {
      updateDraft(chatKey, (draft) => ({ ...draft, isStreaming: !!value }));
    },
    [updateDraft]
  );

  const clearDraftAfterPersisted = useCallback(
    (chatKey, persistedHistory = []) => {
      const draft = draftsRef.current[chatKey];
      if (!draft) return;
      removeStoredDraft(draft.workspaceSlug, draft.threadSlug);
      setDrafts((prev) => {
        if (!prev[chatKey]) return prev;
        return {
          ...prev,
          [chatKey]: {
            ...prev[chatKey],
            messages:
              persistedHistory.length > 0
                ? persistedHistory
                : prev[chatKey].messages,
            agentEvents: [],
            pendingApproval: null,
            activeToolCall: null,
            isStreaming: false,
            isAgentRunning: false,
            persistError: null,
            updatedAt: Date.now(),
          },
        };
      });
    },
    []
  );

  const confirmPersisted = useCallback(
    async (chatKey) => {
      const draft = draftsRef.current[chatKey];
      if (!draft || !draft.messages.length) return;
      const assistant = [...draft.messages]
        .reverse()
        .find((msg) => msg.role === "assistant" && msg.chatId);
      if (!assistant?.chatId) return;

      try {
        const history = draft.threadSlug
          ? await Workspace.threads.chatHistory(
              draft.workspaceSlug,
              draft.threadSlug
            )
          : await Workspace.chatHistory(draft.workspaceSlug);
        const persisted = history.find(
          (msg) => msg.role === "assistant" && msg.chatId === assistant.chatId
        );
        const requiresEvents = (draft.agentEvents || []).some(
          (event) =>
            !["user_message", "assistant_delta", "final_message"].includes(
              event.type
            )
        );
        if (
          persisted &&
          (!requiresEvents || persisted.agentEvents?.length > 0)
        ) {
          clearDraftAfterPersisted(chatKey, history);
          return;
        }

        updateDraft(chatKey, (current) => ({
          ...current,
          persistError:
            "Message completed, but the agent timeline has not been confirmed in server history yet.",
        }));
      } catch (error) {
        updateDraft(chatKey, (current) => ({
          ...current,
          persistError: error.message,
        }));
      }
    },
    [clearDraftAfterPersisted, updateDraft]
  );

  const scheduleApprovalTimeout = useCallback(
    (chatKey, approval) => {
      if (!approval?.requestId || !approval.timeoutMs) return;
      const timeoutKey = `${chatKey}:${approval.requestId}`;
      clearTimeout(approvalTimeoutRefs.current[timeoutKey]);
      const elapsed = Date.now() - (approval.requestedAt || Date.now());
      const remaining = Math.max(0, approval.timeoutMs - elapsed);
      approvalTimeoutRefs.current[timeoutKey] = setTimeout(() => {
        const draft = draftsRef.current[chatKey];
        if (draft?.pendingApproval?.requestId !== approval.requestId) return;
        appendAgentEvent(chatKey, {
          type: "approval_result",
          requestId: approval.requestId,
          skillName: approval.skillName,
          approved: false,
          reason: "timeout",
        });
        setMessages(chatKey, (messages) =>
          messages.map((msg) =>
            msg.type === "toolApprovalRequest" &&
            msg.requestId === approval.requestId
              ? { ...msg, pending: false, approved: false, responded: true }
              : msg
          )
        );
      }, remaining);
    },
    [appendAgentEvent, setMessages]
  );

  useEffect(() => {
    Object.entries(drafts).forEach(([chatKey, draft]) => {
      if (draft.pendingApproval)
        scheduleApprovalTimeout(chatKey, draft.pendingApproval);
    });
  }, [drafts, scheduleApprovalTimeout]);

  const respondToApproval = useCallback(
    async (chatKey, requestId, approved) => {
      const draft = draftsRef.current[chatKey];
      const approval = draft?.pendingApproval;
      if (!approval || approval.requestId !== requestId) return;

      appendAgentEvent(chatKey, {
        type: "approval_result",
        requestId,
        skillName: approval.skillName,
        approved: !!approved,
      });
      setMessages(chatKey, (messages) =>
        messages.map((msg) =>
          msg.type === "toolApprovalRequest" && msg.requestId === requestId
            ? { ...msg, pending: false, approved: !!approved, responded: true }
            : msg
        )
      );

      const socket = websocketRefs.current[chatKey];
      if (socket?.readyState === WebSocket.OPEN) {
        socket.send(
          JSON.stringify({
            type: "toolApprovalResponse",
            requestId,
            approved: !!approved,
          })
        );
      }
    },
    [appendAgentEvent, setMessages]
  );

  const openAgentSocket = useCallback(
    (chatKey, websocketUUID) => {
      if (!websocketUUID || websocketRefs.current[chatKey]) return;
      const socket = new WebSocket(
        `${websocketURI()}/api/agent-invocation/${websocketUUID}`
      );
      socket.supportsAgentStreaming = false;
      websocketRefs.current[chatKey] = socket;

      setAgentSessionActive(true);
      window.dispatchEvent(new CustomEvent(AGENT_SESSION_START));
      updateDraft(chatKey, (draft) => ({
        ...draft,
        isAgentRunning: true,
        isStreaming: false,
      }));

      socket.addEventListener("message", (event) => {
        const data = safeJsonParse(event.data, null);
        const agentEvent = agentEventFromSocketData(data);
        if (agentEvent) appendAgentEvent(chatKey, agentEvent);
        if (agentEvent?.type === "approval_request")
          scheduleApprovalTimeout(chatKey, agentEvent);

        try {
          handleSocketResponse(socket, event, (messagesOrUpdater) =>
            setMessages(chatKey, messagesOrUpdater)
          );
        } catch {
          appendAgentEvent(chatKey, {
            type: "error",
            content: "Failed to parse agent websocket data.",
          });
          socket.close();
        }
      });

      socket.addEventListener("close", () => {
        delete websocketRefs.current[chatKey];
        setAgentSessionActive(false);
        window.dispatchEvent(new CustomEvent(AGENT_SESSION_END));
        if (!pendingResetRefs.current[chatKey]) {
          setMessages(chatKey, (prev) => [
            ...prev.filter((msg) => !!msg.content),
            {
              uuid: v4(),
              type: "statusResponse",
              content: "Agent session complete.",
              role: "assistant",
              sources: [],
              closed: true,
              error: null,
              animate: false,
              pending: false,
            },
          ]);
        }
        pendingResetRefs.current[chatKey] = false;
        updateDraft(chatKey, (draft) => ({
          ...draft,
          isAgentRunning: false,
          isStreaming: false,
          activeToolCall: null,
        }));
        setTimeout(() => confirmPersisted(chatKey), 500);
      });

      socket.addEventListener("error", () => {
        appendAgentEvent(chatKey, {
          type: "error",
          content: "Agent websocket connection failed.",
        });
      });
    },
    [
      appendAgentEvent,
      confirmPersisted,
      scheduleApprovalTimeout,
      setMessages,
      updateDraft,
    ]
  );

  const startStream = useCallback(
    async ({
      workspaceSlug,
      threadSlug = null,
      prompt,
      attachments = [],
      history = [],
      parseAttachments = () => [],
      sendToExistingAgent = false,
    }) => {
      const chatKey = ensureDraft({
        workspaceSlug,
        threadSlug,
        messages: history,
      });
      const draft = draftsRef.current[chatKey];
      const existingMessages =
        history.length > 0 ? history : draft?.messages || [];
      const socket = websocketRefs.current[chatKey];

      if (sendToExistingAgent && socket?.readyState === WebSocket.OPEN) {
        setMessages(chatKey, [
          ...existingMessages,
          {
            content: prompt,
            role: "user",
            attachments,
          },
        ]);
        appendAgentEvent(chatKey, {
          type: "user_message",
          content: prompt,
          attachments,
        });
        socket.send(
          JSON.stringify({
            type: "awaitingFeedback",
            feedback: prompt,
            attachments,
          })
        );
        if (prompt.trim() === "/reset")
          pendingResetRefs.current[chatKey] = true;
        return;
      }

      const historyAlreadyHasPrompt =
        history.length > 0 &&
        history[history.length - 1]?.role === "user" &&
        history[history.length - 1]?.content === prompt;
      const prevChatHistory = historyAlreadyHasPrompt
        ? [
            ...history,
            {
              content: "",
              role: "assistant",
              pending: true,
              userMessage: prompt,
              attachments,
              animate: true,
            },
          ]
        : [
            ...existingMessages,
            {
              content: prompt,
              role: "user",
              attachments,
            },
            {
              content: "",
              role: "assistant",
              pending: true,
              userMessage: prompt,
              attachments,
              animate: true,
            },
          ];
      const remHistory = prevChatHistory.slice(0, -1);
      const workingHistory = [...remHistory];

      setMessages(chatKey, prevChatHistory);
      appendAgentEvent(chatKey, {
        type: "user_message",
        content: prompt,
        attachments,
      });
      setStreaming(chatKey, true);

      await Workspace.multiplexStream({
        workspaceSlug,
        threadSlug,
        prompt,
        chatHandler: (chatResult) => {
          const event = agentEventFromChatResult(chatResult);
          if (event) appendAgentEvent(chatKey, event);
          handleChat(
            chatResult,
            (value) => setStreaming(chatKey, value),
            (messagesOrUpdater) => setMessages(chatKey, messagesOrUpdater),
            remHistory,
            workingHistory,
            (websocketUUID) => openAgentSocket(chatKey, websocketUUID)
          );
        },
        attachments: attachments || parseAttachments(),
      });
      setTimeout(() => confirmPersisted(chatKey), 500);
    },
    [
      appendAgentEvent,
      confirmPersisted,
      ensureDraft,
      openAgentSocket,
      setMessages,
      setStreaming,
    ]
  );

  const stopStream = useCallback(
    (chatKey = null) => {
      const keys = chatKey ? [chatKey] : Object.keys(draftsRef.current);
      keys.forEach((key) => {
        websocketRefs.current[key]?.close();
        appendAgentEvent(key, {
          type: "error",
          content: "Generation stopped by user.",
        });
        updateDraft(key, (draft) => ({
          ...draft,
          isStreaming: false,
          isAgentRunning: false,
          pendingApproval: null,
          activeToolCall: null,
        }));
      });
    },
    [appendAgentEvent, updateDraft]
  );

  useEffect(() => {
    const stopAll = () => stopStream();
    window.addEventListener(ABORT_STREAM_EVENT, stopAll);
    return () => window.removeEventListener(ABORT_STREAM_EVENT, stopAll);
  }, [stopStream]);

  useEffect(() => {
    return () => {
      Object.values(websocketRefs.current).forEach((socket) => socket?.close());
      Object.values(approvalTimeoutRefs.current).forEach((timeout) =>
        clearTimeout(timeout)
      );
    };
  }, []);

  const mergeServerHistory = useCallback(
    ({ workspaceSlug, threadSlug = null, history = [] }) => {
      const chatKey = ensureDraft({
        workspaceSlug,
        threadSlug,
        messages: history,
      });
      updateDraft(chatKey, (draft) => ({
        ...draft,
        messages: mergeMessages(history, draft.messages),
      }));
      return chatKey;
    },
    [ensureDraft, updateDraft]
  );

  const getDraft = useCallback(
    (workspaceSlug, threadSlug = null) =>
      draftsRef.current[getChatThreadKey(workspaceSlug, threadSlug)] || null,
    []
  );

  const hasWorkspaceActivity = useCallback(
    (workspaceSlug) =>
      Object.values(draftsRef.current).some(
        (draft) =>
          draft.workspaceSlug === workspaceSlug && hasUnfinishedDraft(draft)
      ),
    []
  );

  const value = useMemo(
    () => ({
      drafts,
      getDraft,
      ensureDraft,
      mergeServerHistory,
      setMessages,
      startStream,
      respondToApproval,
      stopStream,
      hasWorkspaceActivity,
      getChatKey: getChatThreadKey,
    }),
    [
      drafts,
      ensureDraft,
      getDraft,
      hasWorkspaceActivity,
      mergeServerHistory,
      respondToApproval,
      setMessages,
      startStream,
      stopStream,
    ]
  );

  return (
    <ChatThreadDraftContext.Provider value={value}>
      {children}
    </ChatThreadDraftContext.Provider>
  );
}

export function useChatThreadDrafts() {
  const context = useContext(ChatThreadDraftContext);
  if (!context)
    throw new Error(
      "useChatThreadDrafts must be used within ChatThreadDraftProvider"
    );
  return context;
}

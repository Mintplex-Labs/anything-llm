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
const ACTIVE_RUNNING_STORAGE_KEY = "chat-thread-active-running";
const RUNNING_STATUS = "running";
const COMPLETED_STATUS = "completed";

export function getChatThreadKey(workspaceSlug, threadSlug = null) {
  if (!workspaceSlug) return null;
  return `${workspaceSlug}:${threadSlug || "default"}`;
}

function getStorageKey(workspaceSlug, threadSlug = null) {
  return `${STORAGE_PREFIX}:${workspaceSlug}:${threadSlug || "default"}`;
}

function parseChatKey(chatKey) {
  if (!chatKey) return { workspaceSlug: null, threadSlug: null };
  const [workspaceSlug, ...threadParts] = chatKey.split(":");
  const threadPart = threadParts.join(":") || "default";
  return {
    workspaceSlug,
    threadSlug: threadPart === "default" ? null : threadPart,
  };
}

function getThreadPath(workspaceSlug, threadSlug = null) {
  if (!workspaceSlug) return "/";
  return threadSlug
    ? `/workspace/${workspaceSlug}/t/${threadSlug}`
    : `/workspace/${workspaceSlug}`;
}

function draftMessageId(message = {}) {
  if (message.type === "toolApprovalRequest" && message.requestId) {
    return `approval:${message.requestId}`;
  }
  if (message.chatId) return `chat:${message.chatId}:${message.role || ""}`;
  if (message.uuid) return `uuid:${message.uuid}`;
  if (message.draftId) return `draft:${message.draftId}`;
  return null;
}

function normalizeDraftMessage(message = {}) {
  const now = Date.now();
  const isApproval =
    message.type === "toolApprovalRequest" && message.requestId;
  const stableId = isApproval
    ? `approval:${message.requestId}`
    : message.uuid || message.draftId || v4();
  const next = {
    ...message,
    uuid: stableId,
    draftId: message.draftId || stableId,
    createdAt: message.createdAt || now,
  };
  if (!next.role) next.role = "assistant";
  if (isApproval && !next.content)
    next.content = `Approval requested for ${message.skillName}`;
  return next;
}

function restoreMissingPromptMessages(messages = []) {
  const existingUserPrompts = new Set(
    messages
      .filter((message) => message?.role === "user" && message.content)
      .map((message) => message.content)
  );
  const restored = [];
  messages.forEach((message) => {
    if (
      message.role === "assistant" &&
      message.userMessage &&
      !existingUserPrompts.has(message.userMessage)
    ) {
      existingUserPrompts.add(message.userMessage);
      restored.push(
        normalizeDraftMessage({
          role: "user",
          content: message.userMessage,
          attachments: message.attachments || [],
          chatId: message.chatId,
          uuid: `recovered-user:${message.uuid || message.draftId || message.userMessage}`,
          draftId: `recovered-user:${message.uuid || message.draftId || message.userMessage}`,
          draftRecovered: true,
        })
      );
    }
    restored.push(message);
  });
  return restored;
}

function normalizeDraftMessages(messages = []) {
  return dedupeMessagesById(
    messages.filter(Boolean).map(normalizeDraftMessage)
  );
}

function normalizeStoredDraftMessages(messages = []) {
  return normalizeDraftMessages(restoreMissingPromptMessages(messages));
}

function isLiveDraftMessage(message = {}) {
  return !!(
    message.pending ||
    message.animate ||
    message.userMessage ||
    message.draftRecovered ||
    message.type === "toolApprovalRequest" ||
    (!message.chatId && message.draftId)
  );
}

function mergeDuplicateMessage(existing, incoming) {
  if (isLiveDraftMessage(incoming)) return { ...existing, ...incoming };
  if (isLiveDraftMessage(existing)) return { ...incoming, ...existing };
  return {
    ...incoming,
    ...existing,
    agentEvents: existing.agentEvents || incoming.agentEvents,
  };
}

function dedupeMessagesById(messages = []) {
  const merged = [];
  const seen = new Map();

  messages.forEach((message) => {
    const key = draftMessageId(message);
    if (!key) {
      merged.push(message);
      return;
    }

    const idx = seen.get(key);
    if (idx !== undefined) {
      merged[idx] = mergeDuplicateMessage(merged[idx], message);
      return;
    }

    seen.set(key, merged.length);
    merged.push(message);
  });

  return merged;
}

function mergeMessagesById(serverHistory = [], localMessages = []) {
  const merged = [];
  const seen = new Map();

  [
    ...normalizeDraftMessages(serverHistory),
    ...normalizeDraftMessages(localMessages),
  ].forEach((message) => {
    const key = draftMessageId(message);
    if (key && seen.has(key)) {
      const idx = seen.get(key);
      merged[idx] = mergeDuplicateMessage(merged[idx], message);
      return;
    }
    if (key) seen.set(key, merged.length);
    merged.push(message);
  });

  return merged;
}

function draftFromStorageValue(value) {
  if (!value || !value.workspaceSlug) return null;
  return {
    workspaceSlug: value.workspaceSlug,
    threadSlug: value.threadSlug ?? null,
    messages: normalizeStoredDraftMessages(
      Array.isArray(value.messages) ? value.messages : []
    ),
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
    messages: normalizeDraftMessages(messages),
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

function restoreActiveRunningState() {
  if (typeof window === "undefined") {
    return { activeRunningThread: null, threadActivityByKey: {} };
  }
  const stored = safeJsonParse(
    sessionStorage.getItem(ACTIVE_RUNNING_STORAGE_KEY),
    {}
  );
  return {
    activeRunningThread: stored?.activeRunningThread || null,
    threadActivityByKey: stored?.threadActivityByKey || {},
  };
}

function persistActiveRunningState(activeRunningThread, threadActivityByKey) {
  if (typeof window === "undefined") return;
  const hasActivity =
    activeRunningThread || Object.keys(threadActivityByKey || {}).length > 0;
  if (!hasActivity) {
    sessionStorage.removeItem(ACTIVE_RUNNING_STORAGE_KEY);
    return;
  }
  sessionStorage.setItem(
    ACTIVE_RUNNING_STORAGE_KEY,
    JSON.stringify({ activeRunningThread, threadActivityByKey })
  );
}

function agentEventKey(event = {}) {
  if (!event?.type) return null;
  if (event.type === "approval_request" || event.type === "approval_result") {
    return event.requestId ? `${event.type}:${event.requestId}` : null;
  }
  if (event.type === "tool_call" || event.type === "tool_result") {
    const toolId = event.toolCallId || event.uuid || event.id;
    return toolId ? `${event.type}:${toolId}` : null;
  }
  if (event.uuid) return `${event.type}:${event.uuid}`;
  if (event.chatId) return `${event.type}:${event.chatId}`;
  if (event.id) return `id:${event.id}`;
  if (event.content) return `${event.type}:${event.content}`;
  const timestamp = event.timestamp || event.createdAt;
  return timestamp ? `${event.type}:${timestamp}` : null;
}

function mergeAgentEventsByKey(events = [], event) {
  const key = agentEventKey(event);
  if (!key) return [...events, event];
  const idx = events.findIndex((existing) => agentEventKey(existing) === key);
  if (idx < 0) return [...events, event];
  return events.map((existing, index) =>
    index === idx ? { ...existing, ...event } : existing
  );
}

function normalizeEvent(event) {
  const createdAt = event.createdAt || event.timestamp || Date.now();
  const normalized = {
    ...event,
    createdAt,
  };
  const key = agentEventKey(normalized);
  return {
    ...normalized,
    id: normalized.id || key || v4(),
  };
}

function hasUnfinishedDraft(draft) {
  return !!(
    draft?.isStreaming ||
    draft?.isAgentRunning ||
    draft?.pendingApproval ||
    draft?.activeToolCall ||
    draft?.messages?.some((msg) => msg.pending || msg.animate)
  );
}

function isFinalDraftAssistantMessage(message = {}) {
  return (
    message.role === "assistant" &&
    ![
      "statusResponse",
      "toolApprovalRequest",
      "toolCallInvocation",
      "toolCallResult",
    ].includes(message.type)
  );
}

function isFinalAgentSocketEvent(data = {}) {
  if (data.type !== "reportStreamEvent" || !data.content) return false;
  if (data.content.type === "fullTextResponse") return true;
  return data.content.type === "chatId" && !!data.content.chatId;
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
  if (content.type === "removeStatusResponse") {
    return {
      type: "remove_agent_event",
      uuid: content.uuid,
      targetUuid: content.uuid,
    };
  }

  return {
    type: "agent_thought",
    uuid: content.uuid,
    content: content.content || "",
    sourceType: content.type,
  };
}

export function ChatThreadDraftProvider({ children }) {
  const [drafts, setDrafts] = useState(() => restoreStoredDrafts());
  const [runningState, setRunningState] = useState(() =>
    restoreActiveRunningState()
  );
  const draftsRef = useRef(drafts);
  const runningStateRef = useRef(runningState);
  const websocketRefs = useRef({});
  const approvalTimeoutRefs = useRef({});
  const pendingResetRefs = useRef({});
  const stoppedThreadRefs = useRef({});
  const erroredThreadRefs = useRef({});
  const confirmPersistedRef = useRef(null);

  useEffect(() => {
    draftsRef.current = drafts;
  }, [drafts]);

  useEffect(() => {
    runningStateRef.current = runningState;
  }, [runningState]);

  const updateRunningState = useCallback((updater) => {
    setRunningState((prev) => {
      const next = updater(prev);
      persistActiveRunningState(
        next.activeRunningThread,
        next.threadActivityByKey
      );
      runningStateRef.current = next;
      return next;
    });
  }, []);

  const markThreadRunning = useCallback(
    (chatKey) => {
      const { workspaceSlug, threadSlug } = parseChatKey(chatKey);
      if (!workspaceSlug) return;
      const now = Date.now();
      updateRunningState((prev) => {
        const existing = prev.threadActivityByKey?.[chatKey];
        const activity = {
          workspaceSlug,
          threadSlug,
          chatKey,
          status: RUNNING_STATUS,
          startedAt: existing?.startedAt || now,
          updatedAt: now,
        };
        return {
          activeRunningThread: activity,
          threadActivityByKey: {
            ...(prev.threadActivityByKey || {}),
            [chatKey]: activity,
          },
        };
      });
    },
    [updateRunningState]
  );

  const markThreadCompleted = useCallback(
    (chatKey) => {
      const { workspaceSlug, threadSlug } = parseChatKey(chatKey);
      if (!workspaceSlug) return;
      const now = Date.now();
      updateRunningState((prev) => {
        const existing = prev.threadActivityByKey?.[chatKey];
        const activity = {
          workspaceSlug,
          threadSlug,
          chatKey,
          status: COMPLETED_STATUS,
          startedAt: existing?.startedAt || now,
          updatedAt: now,
        };
        return {
          activeRunningThread:
            prev.activeRunningThread?.chatKey === chatKey
              ? activity
              : prev.activeRunningThread,
          threadActivityByKey: {
            ...(prev.threadActivityByKey || {}),
            [chatKey]: activity,
          },
        };
      });
    },
    [updateRunningState]
  );

  const clearThreadRunning = useCallback(
    (chatKey) => {
      updateRunningState((prev) => {
        const nextActivity = { ...(prev.threadActivityByKey || {}) };
        const existing = nextActivity[chatKey];
        if (existing?.status === RUNNING_STATUS) delete nextActivity[chatKey];
        return {
          activeRunningThread:
            prev.activeRunningThread?.chatKey === chatKey
              ? null
              : prev.activeRunningThread,
          threadActivityByKey: nextActivity,
        };
      });
    },
    [updateRunningState]
  );

  const clearThreadActivity = useCallback(
    (workspaceSlug, threadSlug = null) => {
      const chatKey = getChatThreadKey(workspaceSlug, threadSlug);
      updateRunningState((prev) => {
        const nextActivity = { ...(prev.threadActivityByKey || {}) };
        delete nextActivity[chatKey];
        return {
          activeRunningThread:
            prev.activeRunningThread?.chatKey === chatKey
              ? null
              : prev.activeRunningThread,
          threadActivityByKey: nextActivity,
        };
      });
    },
    [updateRunningState]
  );

  const updateDraft = useCallback((chatKey, updater) => {
    setDrafts((prev) => {
      let current = prev[chatKey];
      if (!current) {
        const { workspaceSlug, threadSlug } = parseChatKey(chatKey);
        current = createDraft({
          workspaceSlug,
          threadSlug,
        });
      }
      const next = {
        ...updater({
          ...current,
          messages: normalizeDraftMessages(current.messages || []),
        }),
        updatedAt: Date.now(),
      };
      next.messages = normalizeDraftMessages(next.messages || []);
      persistDraft(next);
      const nextDrafts = { ...prev, [chatKey]: next };
      draftsRef.current = nextDrafts;
      return nextDrafts;
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
            messages: mergeMessagesById(messages, existing.messages),
            updatedAt: Date.now(),
          };
          persistDraft(next);
          const nextDrafts = { ...prev, [chatKey]: next };
          draftsRef.current = nextDrafts;
          return nextDrafts;
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
        const nextDrafts = { ...prev, [chatKey]: next };
        draftsRef.current = nextDrafts;
        return nextDrafts;
      });
      return chatKey;
    },
    []
  );

  const appendAgentEvent = useCallback(
    (chatKey, rawEvent) => {
      if (!rawEvent) return;
      if (rawEvent.type === "remove_agent_event") {
        const targetId = rawEvent.targetUuid || rawEvent.uuid || rawEvent.id;
        if (!targetId) return;
        updateDraft(chatKey, (draft) => ({
          ...draft,
          agentEvents: (draft.agentEvents || []).filter(
            (event) => event.uuid !== targetId && event.id !== targetId
          ),
        }));
        return;
      }

      const event = normalizeEvent(rawEvent);
      updateDraft(chatKey, (draft) => {
        let agentEvents = draft.agentEvents || [];
        let pendingApproval = draft.pendingApproval || null;
        let activeToolCall = draft.activeToolCall || null;

        agentEvents = mergeAgentEventsByKey(agentEvents, event);

        if (event.type === "tool_call") {
          activeToolCall = event;
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
        return { ...draft, messages: normalizeDraftMessages(messages || []) };
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

  const completeDraftLocally = useCallback(
    (chatKey) => {
      markThreadCompleted(chatKey);
      updateDraft(chatKey, (draft) => {
        const finalAssistantIndex = [...(draft.messages || [])]
          .reverse()
          .findIndex(isFinalDraftAssistantMessage);
        const targetIndex =
          finalAssistantIndex >= 0
            ? (draft.messages || []).length - 1 - finalAssistantIndex
            : -1;
        return {
          ...draft,
          messages: (draft.messages || []).map((message, index) =>
            index === targetIndex
              ? {
                  ...message,
                  closed: true,
                  animate: false,
                  pending: false,
                }
              : message
          ),
          pendingApproval: null,
          activeToolCall: null,
          isStreaming: false,
          isAgentRunning: false,
          persistError: null,
        };
      });
    },
    [markThreadCompleted, updateDraft]
  );

  const clearDraftAfterPersisted = useCallback(
    (chatKey, persistedHistory = []) => {
      const draft = draftsRef.current[chatKey];
      if (!draft) return;
      removeStoredDraft(draft.workspaceSlug, draft.threadSlug);
      setDrafts((prev) => {
        if (!prev[chatKey]) return prev;
        const nextDrafts = {
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
        draftsRef.current = nextDrafts;
        return nextDrafts;
      });
    },
    []
  );

  const confirmPersisted = useCallback(
    async (chatKey, attempt = 0) => {
      const draft = draftsRef.current[chatKey];
      if (!draft || !draft.messages.length) return;
      const assistant = [...draft.messages]
        .reverse()
        .find((msg) => msg.role === "assistant" && msg.chatId);
      if (!assistant?.chatId) {
        completeDraftLocally(chatKey);
        return;
      }

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
        if (persisted) {
          markThreadCompleted(chatKey);
          clearDraftAfterPersisted(chatKey, history);
          return;
        }

        completeDraftLocally(chatKey);
        if (attempt < 3) {
          setTimeout(
            () => confirmPersistedRef.current?.(chatKey, attempt + 1),
            750 * (attempt + 1)
          );
          return;
        }

        updateDraft(chatKey, (current) => ({
          ...current,
          persistError:
            "Message completed locally, but server history has not returned the final assistant message yet.",
        }));
      } catch (error) {
        completeDraftLocally(chatKey);
        updateDraft(chatKey, (current) => ({
          ...current,
          persistError: error.message,
        }));
      }
    },
    [
      clearDraftAfterPersisted,
      completeDraftLocally,
      markThreadCompleted,
      updateDraft,
    ]
  );

  useEffect(() => {
    confirmPersistedRef.current = confirmPersisted;
  }, [confirmPersisted]);

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
      markThreadRunning(chatKey);

      socket.addEventListener("message", (event) => {
        const data = safeJsonParse(event.data, null);
        const agentEvent = agentEventFromSocketData(data);
        if (agentEvent) appendAgentEvent(chatKey, agentEvent);
        if (agentEvent?.type === "approval_request")
          scheduleApprovalTimeout(chatKey, agentEvent);
        const isFinalMessage = isFinalAgentSocketEvent(data);

        try {
          handleSocketResponse(socket, event, (messagesOrUpdater) =>
            setMessages(chatKey, messagesOrUpdater)
          );
          if (isFinalMessage) {
            completeDraftLocally(chatKey);
            setTimeout(() => confirmPersisted(chatKey), 500);
          }
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
        pendingResetRefs.current[chatKey] = false;
        updateDraft(chatKey, (draft) => ({
          ...draft,
          isAgentRunning: false,
          isStreaming: false,
          activeToolCall: null,
        }));
        if (
          stoppedThreadRefs.current[chatKey] ||
          erroredThreadRefs.current[chatKey]
        ) {
          clearThreadRunning(chatKey);
        } else {
          markThreadCompleted(chatKey);
        }
        stoppedThreadRefs.current[chatKey] = false;
        erroredThreadRefs.current[chatKey] = false;
        setTimeout(() => confirmPersisted(chatKey), 500);
      });

      socket.addEventListener("error", () => {
        erroredThreadRefs.current[chatKey] = true;
        appendAgentEvent(chatKey, {
          type: "error",
          content: "Agent websocket connection failed.",
        });
      });
    },
    [
      appendAgentEvent,
      clearThreadRunning,
      completeDraftLocally,
      confirmPersisted,
      markThreadCompleted,
      markThreadRunning,
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
      const now = Date.now();

      if (sendToExistingAgent && socket?.readyState === WebSocket.OPEN) {
        const feedbackMessageId = v4();
        markThreadRunning(chatKey);
        setMessages(chatKey, [
          ...existingMessages,
          {
            uuid: feedbackMessageId,
            draftId: feedbackMessageId,
            createdAt: now,
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
      const userMessage = normalizeDraftMessage({
        content: prompt,
        role: "user",
        attachments,
        createdAt: now,
      });
      const assistantPlaceholder = normalizeDraftMessage({
        content: "",
        role: "assistant",
        pending: true,
        userMessage: prompt,
        attachments,
        animate: true,
        createdAt: now + 1,
      });
      const prevChatHistory = historyAlreadyHasPrompt
        ? [...normalizeDraftMessages(history), assistantPlaceholder]
        : [
            ...normalizeDraftMessages(existingMessages),
            userMessage,
            assistantPlaceholder,
          ];
      const remHistory = prevChatHistory.slice(0, -1);
      const workingHistory = [...prevChatHistory];

      setMessages(chatKey, prevChatHistory);
      appendAgentEvent(chatKey, {
        type: "user_message",
        content: prompt,
        attachments,
      });
      markThreadRunning(chatKey);
      setStreaming(chatKey, true);

      try {
        await Workspace.multiplexStream({
          workspaceSlug,
          threadSlug,
          prompt,
          chatHandler: (chatResult) => {
            const event = agentEventFromChatResult(chatResult);
            if (event) appendAgentEvent(chatKey, event);
            if (
              chatResult.type === "finalizeResponseStream" ||
              chatResult.type === "textResponse"
            ) {
              markThreadCompleted(chatKey);
            }
            if (chatResult.type === "abort") clearThreadRunning(chatKey);
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
      } catch (error) {
        appendAgentEvent(chatKey, {
          type: "error",
          content: error.message || "Chat stream failed.",
        });
        setStreaming(chatKey, false);
        clearThreadRunning(chatKey);
      }
    },
    [
      appendAgentEvent,
      clearThreadRunning,
      confirmPersisted,
      ensureDraft,
      markThreadCompleted,
      markThreadRunning,
      openAgentSocket,
      setMessages,
      setStreaming,
    ]
  );

  const stopStream = useCallback(
    (chatKey = null) => {
      const keys = chatKey ? [chatKey] : Object.keys(draftsRef.current);
      keys.forEach((key) => {
        stoppedThreadRefs.current[key] = true;
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
        clearThreadRunning(key);
      });
    },
    [appendAgentEvent, clearThreadRunning, updateDraft]
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
        messages: mergeMessagesById(history, draft.messages),
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
      ) ||
      Object.values(runningStateRef.current.threadActivityByKey || {}).some(
        (activity) =>
          activity.workspaceSlug === workspaceSlug &&
          activity.status === RUNNING_STATUS
      ),
    []
  );

  const getThreadActivity = useCallback((workspaceSlug, threadSlug = null) => {
    const chatKey = getChatThreadKey(workspaceSlug, threadSlug);
    return runningStateRef.current.threadActivityByKey?.[chatKey] || null;
  }, []);

  const hasThreadActivity = useCallback(
    (workspaceSlug, threadSlug = null) =>
      getThreadActivity(workspaceSlug, threadSlug),
    [getThreadActivity]
  );

  const getRunningThreads = useCallback(
    () =>
      Object.values(runningStateRef.current.threadActivityByKey || {}).filter(
        (activity) => activity.status === RUNNING_STATUS
      ),
    []
  );

  const getRunningThread = useCallback((workspaceSlug) => {
    const runningThreads = Object.values(
      runningStateRef.current.threadActivityByKey || {}
    ).filter(
      (activity) =>
        activity.workspaceSlug === workspaceSlug &&
        activity.status === RUNNING_STATUS
    );
    return runningThreads.sort((a, b) => b.updatedAt - a.updatedAt)[0] || null;
  }, []);

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
      hasThreadActivity,
      getThreadActivity,
      getRunningThreads,
      getRunningThread,
      clearThreadActivity,
      activeRunningThread: runningState.activeRunningThread,
      threadActivityByKey: runningState.threadActivityByKey,
      getThreadPath,
      getChatKey: getChatThreadKey,
    }),
    [
      drafts,
      runningState,
      ensureDraft,
      getDraft,
      clearThreadActivity,
      getRunningThread,
      getRunningThreads,
      getThreadActivity,
      hasThreadActivity,
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

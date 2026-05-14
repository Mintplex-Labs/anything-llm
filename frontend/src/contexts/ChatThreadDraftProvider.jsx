import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Workspace from "@/models/workspace";
import handleChat, { ABORT_STREAM_EVENT } from "@/utils/chat";
import handleSocketResponse, {
  AGENT_SESSION_END,
  AGENT_SESSION_START,
  setAgentSessionActive,
  websocketURI,
} from "@/utils/chat/agent";
import { emitAssistantMessageCompleteEvent } from "@/components/contexts/TTSProvider";
import { safeJsonParse } from "@/utils/request";
import {
  TURN_STATUSES,
  appendTimelineEventToItems,
  createTurn,
  findAssistantTurn,
  isAssistantTurn,
  mergeServerHistoryIntoTurns as mergeServerHistoryIntoTurnItems,
  normalizeTimelineEvent,
  normalizeTurnItems,
  updateAssistantTurnInItems,
} from "@/utils/chat/turns";

const ChatThreadDraftContext = createContext(null);
const STORAGE_PREFIX = "chat-thread-draft";
const ACTIVE_RUNNING_STORAGE_KEY = "chat-thread-active-running";
const RUNNING_STALE_TIMEOUT_MS = 6 * 60 * 1000;

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

function createDraft({ workspaceSlug, threadSlug = null, items = [] }) {
  return {
    workspaceSlug,
    threadSlug,
    items: normalizeTurnItems(items),
    activeTurnId: null,
    pendingApproval: null,
    activeToolCall: null,
    isStreaming: false,
    isAgentRunning: false,
    updatedAt: Date.now(),
    persistError: null,
  };
}

function draftFromStorageValue(value) {
  if (!value || !value.workspaceSlug) return null;
  const updatedAt = value.updatedAt || Date.now();
  const staleRuntime =
    (value.isStreaming || value.isAgentRunning) &&
    Date.now() - updatedAt > RUNNING_STALE_TIMEOUT_MS;
  const draft = {
    workspaceSlug: value.workspaceSlug,
    threadSlug: value.threadSlug ?? null,
    items: normalizeTurnItems(Array.isArray(value.items) ? value.items : []),
    activeTurnId: staleRuntime ? null : value.activeTurnId || null,
    pendingApproval: staleRuntime ? null : value.pendingApproval || null,
    activeToolCall: staleRuntime ? null : value.activeToolCall || null,
    isStreaming: staleRuntime ? false : !!value.isStreaming,
    isAgentRunning: staleRuntime ? false : !!value.isAgentRunning,
    updatedAt,
    persistError: staleRuntime
      ? "This agent session timed out locally because no response was received."
      : value.persistError || null,
  };

  if (staleRuntime && value.activeTurnId) {
    draft.items = failTurnItems(
      draft.items,
      value.activeTurnId,
      draft.persistError
    );
  }
  return draft;
}

function serializableDraft(draft) {
  return {
    items: draft.items,
    activeTurnId: draft.activeTurnId,
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

function hasUnfinishedDraft(draft = {}) {
  return !!(
    draft.isStreaming ||
    draft.isAgentRunning ||
    draft.pendingApproval ||
    draft.activeToolCall ||
    draft.items?.some(
      (item) => isAssistantTurn(item) && item.status === TURN_STATUSES.running
    )
  );
}

function hasLocalDraftItems(draft = {}) {
  return draft.items?.some(
    (item) =>
      item?.turnId?.startsWith?.("turn:") ||
      (isAssistantTurn(item) && item.status !== TURN_STATUSES.completed)
  );
}

function persistDraft(draft) {
  if (typeof window === "undefined" || !draft?.workspaceSlug) return;
  const key = getStorageKey(draft.workspaceSlug, draft.threadSlug);
  const hasDraft =
    hasUnfinishedDraft(draft) ||
    hasLocalDraftItems(draft) ||
    draft.persistError ||
    draft.items.length > 0;

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

function isRunningActivityStale(activity = {}, now = Date.now()) {
  if (activity.status !== TURN_STATUSES.running) return false;
  const lastSeen = activity.updatedAt || activity.startedAt || now;
  return now - lastSeen > RUNNING_STALE_TIMEOUT_MS;
}

function staleFailureActivity(activity = {}, now = Date.now()) {
  return {
    ...activity,
    status: TURN_STATUSES.failed,
    reason:
      activity.reason ||
      "This agent session timed out because no final response was received.",
    updatedAt: now,
  };
}

function normalizeRunningState(stored = {}) {
  const now = Date.now();
  const threadActivityByKey = {};
  Object.entries(stored?.threadActivityByKey || {}).forEach(
    ([chatKey, activity]) => {
      if (!activity?.chatKey) return;
      threadActivityByKey[chatKey] = isRunningActivityStale(activity, now)
        ? staleFailureActivity(activity, now)
        : activity;
    }
  );

  const activeRunningThread = stored?.activeRunningThread;
  const normalizedActive =
    activeRunningThread && !isRunningActivityStale(activeRunningThread, now)
      ? activeRunningThread
      : null;

  return {
    activeRunningThread:
      normalizedActive?.status === TURN_STATUSES.running
        ? normalizedActive
        : null,
    threadActivityByKey,
  };
}

function restoreActiveRunningState() {
  if (typeof window === "undefined") {
    return { activeRunningThread: null, threadActivityByKey: {} };
  }
  const stored = safeJsonParse(
    sessionStorage.getItem(ACTIVE_RUNNING_STORAGE_KEY),
    {}
  );
  return normalizeRunningState(stored);
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

function failTurnItems(items = [], turnId, reason) {
  return updateAssistantTurnInItems(
    appendTimelineEventToItems(items, turnId, {
      type: "error",
      content: reason,
    }),
    turnId,
    {
      status: TURN_STATUSES.failed,
      error: reason,
    }
  );
}

function completeTurnPatch(turn, patch = {}) {
  const nextFinalContent =
    patch.finalContent !== undefined
      ? patch.finalContent
      : patch.content !== undefined && patch.content !== ""
        ? patch.content
        : turn.finalContent || "";

  return {
    ...patch,
    finalContent: nextFinalContent,
    sources: patch.sources || turn.sources || [],
    metrics: patch.metrics || turn.metrics || {},
    status: TURN_STATUSES.completed,
    error: null,
  };
}

function assistantTurnByChatId(items = [], chatId = null) {
  if (!chatId) return null;
  return items.find((item) => isAssistantTurn(item) && item.chatId === chatId);
}

function canApplyTurnEvent(draft, turnId) {
  if (!draft || !turnId) return null;
  const turn = findAssistantTurn(draft.items || [], turnId);
  return turn?.turnId === turnId ? turn : null;
}

function chatTurnDebugEnabled() {
  try {
    return window?.localStorage?.getItem("chatTurnDebug") === "true";
  } catch {
    return false;
  }
}

function debugChatTurn(label, payload = {}) {
  if (!chatTurnDebugEnabled()) return;
  console.debug("[chat-turn]", label, payload);
}

function turnRuntimeSnapshot(draft = {}, turnId = null) {
  const turn = findAssistantTurn(draft?.items || [], turnId);
  return {
    activeTurnId: draft?.activeTurnId || null,
    isStreaming: !!draft?.isStreaming,
    isAgentRunning: !!draft?.isAgentRunning,
    status: turn?.status || null,
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
      const next = normalizeRunningState(updater(normalizeRunningState(prev)));
      persistActiveRunningState(
        next.activeRunningThread,
        next.threadActivityByKey
      );
      runningStateRef.current = next;
      return next;
    });
  }, []);

  const updateDraft = useCallback((chatKey, updater) => {
    setDrafts((prev) => {
      let current = prev[chatKey];
      if (!current) {
        const { workspaceSlug, threadSlug } = parseChatKey(chatKey);
        current = createDraft({ workspaceSlug, threadSlug });
      }

      const next = {
        ...updater({
          ...current,
          items: normalizeTurnItems(current.items || []),
        }),
        updatedAt: Date.now(),
      };
      next.items = normalizeTurnItems(next.items || []);
      persistDraft(next);
      const nextDrafts = { ...prev, [chatKey]: next };
      draftsRef.current = nextDrafts;
      return nextDrafts;
    });
  }, []);

  const markThreadRunning = useCallback(
    (chatKey, turnId) => {
      const { workspaceSlug, threadSlug } = parseChatKey(chatKey);
      if (!workspaceSlug || !turnId) return;
      const now = Date.now();
      updateRunningState((prev) => {
        const existing = prev.threadActivityByKey?.[chatKey];
        const activity = {
          workspaceSlug,
          threadSlug,
          chatKey,
          turnId,
          status: TURN_STATUSES.running,
          startedAt: existing?.turnId === turnId ? existing.startedAt : now,
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
    (chatKey, turnId) => {
      const { workspaceSlug, threadSlug } = parseChatKey(chatKey);
      if (!workspaceSlug || !turnId) return;
      const now = Date.now();
      updateRunningState((prev) => {
        const existing = prev.threadActivityByKey?.[chatKey];
        const activity = {
          workspaceSlug,
          threadSlug,
          chatKey,
          turnId,
          status: TURN_STATUSES.completed,
          startedAt: existing?.startedAt || now,
          updatedAt: now,
        };
        return {
          activeRunningThread:
            prev.activeRunningThread?.chatKey === chatKey &&
            prev.activeRunningThread?.turnId === turnId
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

  const markThreadFailed = useCallback(
    (chatKey, turnId, reason = null) => {
      const { workspaceSlug, threadSlug } = parseChatKey(chatKey);
      if (!workspaceSlug || !turnId) return;
      const now = Date.now();
      const failureReason =
        reason ||
        "The agent session ended before a final response was received.";
      updateRunningState((prev) => {
        const existing = prev.threadActivityByKey?.[chatKey];
        const activity = {
          workspaceSlug,
          threadSlug,
          chatKey,
          turnId,
          status: TURN_STATUSES.failed,
          reason: failureReason,
          startedAt: existing?.startedAt || now,
          updatedAt: now,
        };
        return {
          activeRunningThread:
            prev.activeRunningThread?.chatKey === chatKey &&
            prev.activeRunningThread?.turnId === turnId
              ? null
              : prev.activeRunningThread,
          threadActivityByKey: {
            ...(prev.threadActivityByKey || {}),
            [chatKey]: activity,
          },
        };
      });
      updateDraft(chatKey, (draft) => {
        const next = {
          ...draft,
          items: failTurnItems(draft.items, turnId, failureReason),
          activeTurnId:
            draft.activeTurnId === turnId ? null : draft.activeTurnId,
          pendingApproval: null,
          activeToolCall: null,
          isStreaming: false,
          isAgentRunning: false,
          persistError: failureReason,
        };
        debugChatTurn("assistant_error:after", {
          chatKey,
          turnId,
          reason: failureReason,
          ...turnRuntimeSnapshot(next, turnId),
        });
        return next;
      });
    },
    [updateDraft, updateRunningState]
  );

  const clearThreadRunning = useCallback(
    (chatKey, turnId = null) => {
      updateRunningState((prev) => {
        const nextActivity = { ...(prev.threadActivityByKey || {}) };
        const existing = nextActivity[chatKey];
        if (
          existing?.status === TURN_STATUSES.running &&
          (!turnId || existing.turnId === turnId)
        ) {
          delete nextActivity[chatKey];
        }
        return {
          activeRunningThread:
            prev.activeRunningThread?.chatKey === chatKey &&
            (!turnId || prev.activeRunningThread?.turnId === turnId)
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

  useEffect(() => {
    const interval = setInterval(() => {
      updateRunningState((state) => state);
    }, 30 * 1000);
    return () => clearInterval(interval);
  }, [updateRunningState]);

  useEffect(() => {
    Object.entries(runningState.threadActivityByKey || {}).forEach(
      ([chatKey, activity]) => {
        if (activity.status !== TURN_STATUSES.failed || !activity.turnId)
          return;
        const draft = draftsRef.current[chatKey];
        const turn = findAssistantTurn(draft?.items || [], activity.turnId);
        if (!turn || turn.status === TURN_STATUSES.failed) return;
        updateDraft(chatKey, (current) => ({
          ...current,
          items: failTurnItems(
            current.items,
            activity.turnId,
            activity.reason ||
              "The agent session ended before a final response was received."
          ),
          activeTurnId:
            current.activeTurnId === activity.turnId
              ? null
              : current.activeTurnId,
          pendingApproval: null,
          activeToolCall: null,
          isStreaming: false,
          isAgentRunning: false,
          persistError: activity.reason,
        }));
      }
    );
  }, [runningState.threadActivityByKey, updateDraft]);

  const ensureDraft = useCallback(
    ({ workspaceSlug, threadSlug = null, items = [], history = [] }) => {
      const chatKey = getChatThreadKey(workspaceSlug, threadSlug);
      setDrafts((prev) => {
        const restored = draftFromStorageValue(
          safeJsonParse(
            sessionStorage.getItem(getStorageKey(workspaceSlug, threadSlug))
          )
        );
        const existing = prev[chatKey] || restored;
        const seedItems =
          history.length > 0
            ? mergeServerHistoryIntoTurnItems(history, existing?.items || [], {
                chatKey,
              })
            : normalizeTurnItems(items);
        const next = existing
          ? {
              ...existing,
              items:
                seedItems.length > 0
                  ? mergeServerHistoryIntoTurnItems([], seedItems)
                  : existing.items,
              updatedAt: Date.now(),
            }
          : createDraft({ workspaceSlug, threadSlug, items: seedItems });
        persistDraft(next);
        const nextDrafts = { ...prev, [chatKey]: next };
        draftsRef.current = nextDrafts;
        return nextDrafts;
      });
      return chatKey;
    },
    []
  );

  const updateAssistantTurn = useCallback(
    (chatKey, turnId, patch = {}) => {
      updateDraft(chatKey, (draft) => ({
        ...draft,
        items: updateAssistantTurnInItems(draft.items, turnId, patch),
      }));
    },
    [updateDraft]
  );

  const appendTimelineEvent = useCallback(
    (chatKey, turnId, rawEvent) => {
      if (!rawEvent) return;
      const event =
        rawEvent.type === "remove_agent_event"
          ? rawEvent
          : normalizeTimelineEvent(rawEvent);

      updateDraft(chatKey, (draft) => {
        const next = {
          ...draft,
          items: appendTimelineEventToItems(draft.items, turnId, event),
        };

        if (event.type === "tool_call") next.activeToolCall = event;
        if (event.type === "tool_result") next.activeToolCall = null;
        if (event.type === "approval_request") next.pendingApproval = event;
        if (event.type === "approval_result") next.pendingApproval = null;
        return next;
      });
    },
    [updateDraft]
  );

  const completeAssistantTurn = useCallback(
    (chatKey, turnId, patch = {}) => {
      const draft = draftsRef.current[chatKey];
      const turn = findAssistantTurn(draft?.items || [], turnId);
      if (!turn) return;
      debugChatTurn("assistant_final:before", {
        chatKey,
        turnId,
        eventChatId: patch.chatId || null,
        ...turnRuntimeSnapshot(draft, turnId),
      });
      updateDraft(chatKey, (current) => {
        const nextItems = updateAssistantTurnInItems(
          current.items,
          turnId,
          completeTurnPatch(turn, patch)
        );
        const next = {
          ...current,
          items: nextItems,
          activeTurnId:
            current.activeTurnId === turnId ? null : current.activeTurnId,
          pendingApproval: null,
          activeToolCall: null,
          isStreaming: false,
          isAgentRunning: false,
          persistError: null,
        };
        debugChatTurn("assistant_final:after", {
          chatKey,
          turnId,
          ...turnRuntimeSnapshot(next, turnId),
        });
        return next;
      });
      markThreadCompleted(chatKey, turnId);
      if (patch.chatId) emitAssistantMessageCompleteEvent(patch.chatId);
    },
    [markThreadCompleted, updateDraft]
  );

  const failAssistantTurn = useCallback(
    (chatKey, turnId, reason) => {
      markThreadFailed(chatKey, turnId, reason);
    },
    [markThreadFailed]
  );

  const applyTurnEvent = useCallback(
    (chatKey, turnId, event) => {
      if (!event || !turnId) return;
      if (event.type === "agent_socket_start") return event;

      if (event.type === "timeline_event") {
        const turn = canApplyTurnEvent(draftsRef.current[chatKey], turnId);
        if (!turn) return null;
        appendTimelineEvent(chatKey, turnId, event.event);
        return event;
      }

      if (event.type === "assistant_delta") {
        const currentTurn = canApplyTurnEvent(
          draftsRef.current[chatKey],
          turnId
        );
        if (!currentTurn || currentTurn.status !== TURN_STATUSES.running)
          return null;
        updateDraft(chatKey, (draft) => {
          const turn = canApplyTurnEvent(draft, turnId);
          if (!turn) return draft;
          if (turn.status !== TURN_STATUSES.running) return draft;
          return {
            ...draft,
            items: updateAssistantTurnInItems(draft.items, turnId, {
              finalContent: `${turn.finalContent || ""}${event.content || ""}`,
              sources:
                event.sources?.length > 0 ? event.sources : turn.sources || [],
              metrics: event.metrics || turn.metrics || {},
              chatId: event.chatId || turn.chatId,
              status: TURN_STATUSES.running,
            }),
            isStreaming: true,
            activeTurnId: turnId,
          };
        });
        markThreadRunning(chatKey, turnId);
        return event;
      }

      if (event.type === "assistant_patch") {
        const currentTurn = canApplyTurnEvent(
          draftsRef.current[chatKey],
          turnId
        );
        if (!currentTurn) return null;
        updateDraft(chatKey, (draft) => {
          const turn = canApplyTurnEvent(draft, turnId);
          if (!turn) return draft;
          const patch = event.patch || {};
          return {
            ...draft,
            items: updateAssistantTurnInItems(draft.items, turnId, {
              ...patch,
              sources: event.appendSources
                ? [...(turn.sources || []), ...(patch.sources || [])]
                : patch.sources || turn.sources || [],
              metrics: patch.metrics || turn.metrics || {},
            }),
          };
        });
        return event;
      }

      if (event.type === "assistant_final") {
        const draft = draftsRef.current[chatKey];
        const turn = canApplyTurnEvent(draft, turnId);
        if (!turn) return null;
        if (turn.status === TURN_STATUSES.failed) return null;
        debugChatTurn("assistant_final:event", {
          chatKey,
          turnId,
          eventChatId: event.chatId || null,
          eventContentLength: event.content?.length || 0,
          ...turnRuntimeSnapshot(draft, turnId),
        });
        const finalContent =
          event.content && event.content.length > 0
            ? event.content
            : turn?.finalContent || "";
        completeAssistantTurn(chatKey, turnId, {
          finalContent,
          chatId: event.chatId || turn?.chatId,
          sources:
            event.sources?.length > 0 ? event.sources : turn?.sources || [],
          metrics: event.metrics || turn?.metrics || {},
        });
        return event;
      }

      if (event.type === "assistant_error") {
        const turn = canApplyTurnEvent(draftsRef.current[chatKey], turnId);
        if (!turn) return null;
        const reason =
          event.error ||
          event.content ||
          "Chat stream failed before completion.";
        debugChatTurn("assistant_error:event", {
          chatKey,
          turnId,
          reason,
          ...turnRuntimeSnapshot(draftsRef.current[chatKey], turnId),
        });
        appendTimelineEvent(chatKey, turnId, {
          type: "error",
          content: reason,
        });
        failAssistantTurn(chatKey, turnId, reason);
        return event;
      }

      if (event.type === "stop_generation") {
        const turn = canApplyTurnEvent(draftsRef.current[chatKey], turnId);
        if (!turn) return null;
        const reason = event.content || "Generation stopped by user.";
        appendTimelineEvent(chatKey, turnId, {
          type: "error",
          content: reason,
        });
        failAssistantTurn(chatKey, turnId, reason);
        return event;
      }

      return event;
    },
    [
      appendTimelineEvent,
      completeAssistantTurn,
      failAssistantTurn,
      markThreadRunning,
      updateDraft,
    ]
  );

  const confirmPersisted = useCallback(
    async (chatKey, turnId, expectedChatId = null, attempt = 0) => {
      const draft = draftsRef.current[chatKey];
      if (!draft || !turnId) return;
      const turn = findAssistantTurn(draft.items, turnId);
      const chatId = expectedChatId || turn?.chatId;
      if (!chatId) return;

      try {
        const history = draft.threadSlug
          ? await Workspace.threads.chatHistory(
              draft.workspaceSlug,
              draft.threadSlug
            )
          : await Workspace.chatHistory(draft.workspaceSlug);
        const persisted = history.find(
          (msg) => msg.role === "assistant" && msg.chatId === chatId
        );
        if (persisted) {
          updateDraft(chatKey, (current) => {
            const items = mergeServerHistoryIntoTurnItems(
              history,
              current.items,
              { chatKey }
            );
            const shouldKeepDraft = hasUnfinishedDraft({ ...current, items });
            if (!shouldKeepDraft) {
              removeStoredDraft(current.workspaceSlug, current.threadSlug);
            }
            return {
              ...current,
              items,
              persistError: null,
            };
          });
          return;
        }

        if (attempt < 3) {
          setTimeout(
            () =>
              confirmPersistedRef.current?.(
                chatKey,
                turnId,
                chatId,
                attempt + 1
              ),
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
        updateDraft(chatKey, (current) => ({
          ...current,
          persistError: error.message,
        }));
      }
    },
    [updateDraft]
  );

  useEffect(() => {
    confirmPersistedRef.current = confirmPersisted;
  }, [confirmPersisted]);

  const scheduleApprovalTimeout = useCallback(
    (chatKey, turnId, approval) => {
      if (!approval?.requestId || !approval.timeoutMs) return;
      const timeoutKey = `${chatKey}:${turnId}:${approval.requestId}`;
      clearTimeout(approvalTimeoutRefs.current[timeoutKey]);
      const elapsed =
        Date.now() - (approval.requestedAt || approval.createdAt || Date.now());
      const remaining = Math.max(0, approval.timeoutMs - elapsed);
      approvalTimeoutRefs.current[timeoutKey] = setTimeout(() => {
        const draft = draftsRef.current[chatKey];
        if (
          draft?.pendingApproval?.requestId !== approval.requestId ||
          draft?.activeTurnId !== turnId
        ) {
          return;
        }
        appendTimelineEvent(chatKey, turnId, {
          type: "approval_result",
          requestId: approval.requestId,
          skillName: approval.skillName,
          approved: false,
          reason: "timeout",
        });
      }, remaining);
    },
    [appendTimelineEvent]
  );

  useEffect(() => {
    Object.entries(drafts).forEach(([chatKey, draft]) => {
      if (draft.pendingApproval && draft.activeTurnId) {
        scheduleApprovalTimeout(
          chatKey,
          draft.activeTurnId,
          draft.pendingApproval
        );
      }
    });
  }, [drafts, scheduleApprovalTimeout]);

  const respondToApproval = useCallback(
    async (chatKey, requestId, approved) => {
      const draft = draftsRef.current[chatKey];
      const approval = draft?.pendingApproval;
      const turnId = draft?.activeTurnId;
      if (!approval || approval.requestId !== requestId || !turnId) return;

      appendTimelineEvent(chatKey, turnId, {
        type: "approval_result",
        requestId,
        skillName: approval.skillName,
        approved: !!approved,
      });

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
    [appendTimelineEvent]
  );

  const openAgentSocket = useCallback(
    (chatKey, turnId, websocketUUID) => {
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
        activeTurnId: turnId,
        isAgentRunning: true,
        isStreaming: false,
      }));
      markThreadRunning(chatKey, turnId);

      socket.addEventListener("message", (event) => {
        const normalizedEvent = handleSocketResponse(socket, event);
        debugChatTurn("websocket:event", {
          chatKey,
          turnId,
          eventType: normalizedEvent?.type || null,
        });
        const applied = applyTurnEvent(chatKey, turnId, normalizedEvent);
        if (applied?.type === "timeline_event") {
          const timelineEvent = normalizeTimelineEvent(applied.event || {});
          if (timelineEvent.type === "approval_request") {
            scheduleApprovalTimeout(chatKey, turnId, timelineEvent);
          }
        }
        if (applied?.type === "assistant_final" && applied.chatId) {
          socket.lastFinalChatId = applied.chatId;
        }
        if (applied?.type === "assistant_final") socket.sawFinalMessage = true;
        if (applied?.type === "assistant_error") {
          erroredThreadRefs.current[chatKey] = true;
          socket.close();
        }
      });

      socket.addEventListener("close", () => {
        delete websocketRefs.current[chatKey];
        setAgentSessionActive(false);
        window.dispatchEvent(new CustomEvent(AGENT_SESSION_END));
        debugChatTurn("websocket:close", {
          chatKey,
          turnId,
          sawFinalMessage: !!socket.sawFinalMessage,
          lastFinalChatId: socket.lastFinalChatId || null,
          stopped: !!stoppedThreadRefs.current[chatKey],
          errored: !!erroredThreadRefs.current[chatKey],
          ...turnRuntimeSnapshot(draftsRef.current[chatKey], turnId),
        });
        const socketFailureReason =
          "Agent websocket connection failed before a final response.";
        if (stoppedThreadRefs.current[chatKey]) {
          clearThreadRunning(chatKey, turnId);
        } else if (erroredThreadRefs.current[chatKey]) {
          applyTurnEvent(chatKey, turnId, {
            type: "assistant_error",
            content: socketFailureReason,
            error: socketFailureReason,
          });
        } else if (socket.sawFinalMessage || socket.lastFinalChatId) {
          markThreadCompleted(chatKey, turnId);
        } else {
          applyTurnEvent(chatKey, turnId, {
            type: "assistant_error",
            content: "Agent websocket closed before a final response.",
            error: "Agent websocket closed before a final response.",
          });
        }
        stoppedThreadRefs.current[chatKey] = false;
        erroredThreadRefs.current[chatKey] = false;
        setTimeout(
          () =>
            confirmPersisted(chatKey, turnId, socket.lastFinalChatId || null),
          500
        );
      });

      socket.addEventListener("error", () => {
        erroredThreadRefs.current[chatKey] = true;
        applyTurnEvent(chatKey, turnId, {
          type: "assistant_error",
          content: "Agent websocket connection failed.",
          error: "Agent websocket connection failed.",
        });
      });
    },
    [
      applyTurnEvent,
      clearThreadRunning,
      confirmPersisted,
      markThreadCompleted,
      markThreadRunning,
      scheduleApprovalTimeout,
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
        history,
      });
      const socket = websocketRefs.current[chatKey];
      const preparedAttachments = attachments || parseAttachments();
      const { turnId, items: turnItems } = createTurn({
        prompt,
        attachments: preparedAttachments,
        chatKey,
      });

      updateDraft(chatKey, (draft) => ({
        ...draft,
        items: [...(draft.items || []), ...turnItems],
        activeTurnId: turnId,
        pendingApproval: null,
        activeToolCall: null,
        isStreaming: !sendToExistingAgent,
        isAgentRunning: !!sendToExistingAgent,
        persistError: null,
      }));
      markThreadRunning(chatKey, turnId);

      if (sendToExistingAgent && socket?.readyState === WebSocket.OPEN) {
        socket.send(
          JSON.stringify({
            type: "awaitingFeedback",
            feedback: prompt,
            attachments: preparedAttachments,
          })
        );
        appendTimelineEvent(chatKey, turnId, {
          type: "thought",
          content: "Sent follow-up input to the active agent session.",
        });
        return;
      }

      try {
        let completedChatId = null;
        await Workspace.multiplexStream({
          workspaceSlug,
          threadSlug,
          prompt,
          chatHandler: (chatResult) => {
            const event = handleChat(chatResult);
            debugChatTurn("sse:event", {
              chatKey,
              turnId,
              rawType: chatResult?.type || null,
              eventType: event?.type || null,
              close: !!chatResult?.close,
            });
            const applied = applyTurnEvent(chatKey, turnId, event);
            if (applied?.type === "agent_socket_start") {
              openAgentSocket(chatKey, turnId, applied.websocketUUID);
            }
            if (applied?.type === "assistant_final") {
              completedChatId = applied.chatId || completedChatId;
            }
          },
          attachments: preparedAttachments,
        });
        setTimeout(
          () => confirmPersisted(chatKey, turnId, completedChatId),
          500
        );
      } catch (error) {
        applyTurnEvent(chatKey, turnId, {
          type: "assistant_error",
          content: error.message || "Chat stream failed.",
          error: error.message || "Chat stream failed.",
        });
      }
    },
    [
      appendTimelineEvent,
      applyTurnEvent,
      confirmPersisted,
      ensureDraft,
      markThreadRunning,
      openAgentSocket,
      updateDraft,
    ]
  );

  const stopStream = useCallback(
    (chatKey = null) => {
      const keys = chatKey ? [chatKey] : Object.keys(draftsRef.current);
      keys.forEach((key) => {
        const draft = draftsRef.current[key];
        const turnId = draft?.activeTurnId;
        if (!turnId) return;
        stoppedThreadRefs.current[key] = true;
        websocketRefs.current[key]?.close();
        applyTurnEvent(key, turnId, {
          type: "stop_generation",
          content: "Generation stopped by user.",
        });
      });
    },
    [applyTurnEvent]
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
      const chatKey = ensureDraft({ workspaceSlug, threadSlug });
      updateDraft(chatKey, (draft) => ({
        ...draft,
        items: mergeServerHistoryIntoTurnItems(history, draft.items, {
          chatKey,
        }),
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
          activity.status === TURN_STATUSES.running
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
        (activity) => activity.status === TURN_STATUSES.running
      ),
    []
  );

  const getRunningThread = useCallback((workspaceSlug) => {
    const runningThreads = Object.values(
      runningStateRef.current.threadActivityByKey || {}
    ).filter(
      (activity) =>
        activity.workspaceSlug === workspaceSlug &&
        activity.status === TURN_STATUSES.running
    );
    return runningThreads.sort((a, b) => b.updatedAt - a.updatedAt)[0] || null;
  }, []);

  const getAssistantTurnByChatId = useCallback((chatKey, chatId) => {
    return assistantTurnByChatId(
      draftsRef.current[chatKey]?.items || [],
      chatId
    );
  }, []);

  const updateUserItem = useCallback(
    (chatKey, chatId, patch = {}) => {
      updateDraft(chatKey, (draft) => ({
        ...draft,
        items: draft.items.map((item) =>
          item.type === "user" && item.chatId === chatId
            ? { ...item, ...patch, updatedAt: Date.now() }
            : item
        ),
      }));
    },
    [updateDraft]
  );

  const value = useMemo(
    () => ({
      drafts,
      getDraft,
      ensureDraft,
      mergeServerHistory,
      createTurn,
      appendTimelineEvent,
      updateAssistantTurn,
      completeAssistantTurn,
      failAssistantTurn,
      startStream,
      respondToApproval,
      stopStream,
      hasWorkspaceActivity,
      hasThreadActivity,
      getThreadActivity,
      getRunningThreads,
      getRunningThread,
      getAssistantTurnByChatId,
      updateUserItem,
      clearThreadActivity,
      activeRunningThread: runningState.activeRunningThread,
      threadActivityByKey: runningState.threadActivityByKey,
      getThreadPath,
      getChatKey: getChatThreadKey,
    }),
    [
      appendTimelineEvent,
      clearThreadActivity,
      completeAssistantTurn,
      drafts,
      ensureDraft,
      failAssistantTurn,
      getAssistantTurnByChatId,
      getDraft,
      getRunningThread,
      getRunningThreads,
      getThreadActivity,
      hasThreadActivity,
      hasWorkspaceActivity,
      mergeServerHistory,
      respondToApproval,
      runningState,
      startStream,
      stopStream,
      updateAssistantTurn,
      updateUserItem,
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

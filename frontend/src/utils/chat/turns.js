import { v4 } from "uuid";

export const TURN_STATUSES = {
  running: "running",
  completed: "completed",
  failed: "failed",
};

const TIMELINE_TYPES = new Set([
  "thought",
  "tool_call",
  "tool_result",
  "approval_request",
  "approval_result",
  "markdown_delta",
  "error",
]);

function nowMs() {
  return Date.now();
}

function stableJson(value) {
  try {
    return JSON.stringify(value ?? null);
  } catch {
    return String(value);
  }
}

export function createTurnId() {
  return `turn:${v4()}`;
}

export function userItemId(turnId) {
  return `${turnId}:user`;
}

export function assistantItemId(turnId) {
  return `${turnId}:assistant`;
}

export function createTurn({
  prompt,
  attachments = [],
  chatKey = null,
  chatId = null,
  turnId = createTurnId(),
  createdAt = nowMs(),
} = {}) {
  const userMessage = {
    id: userItemId(turnId),
    type: "user",
    role: "user",
    turnId,
    content: prompt,
    attachments,
    chatId,
    createdAt,
  };
  const assistantTurn = {
    id: assistantItemId(turnId),
    type: "assistant_turn",
    role: "assistant",
    turnId,
    userMessageId: userMessage.id,
    status: TURN_STATUSES.running,
    finalContent: "",
    sources: [],
    metrics: {},
    chatId,
    chatKey,
    error: null,
    createdAt: createdAt + 1,
    updatedAt: createdAt + 1,
    timeline: [],
  };

  return {
    turnId,
    items: [userMessage, assistantTurn],
    userMessage,
    assistantTurn,
  };
}

export function isUserItem(item = {}) {
  return item?.type === "user" && item?.role === "user";
}

export function isAssistantTurn(item = {}) {
  return item?.type === "assistant_turn" && item?.role === "assistant";
}

export function normalizeTimelineType(type) {
  if (TIMELINE_TYPES.has(type)) return type;
  if (type === "agent_thought" || type === "statusResponse") return "thought";
  if (type === "final_message" || type === "assistant_delta")
    return "markdown_delta";
  if (type === "toolCallInvocation") return "tool_call";
  if (type === "toolCallResult") return "tool_result";
  if (type === "toolApprovalRequest") return "approval_request";
  return type || "thought";
}

export function timelineEventStableId(event = {}) {
  const type = normalizeTimelineType(event.type);
  if (type === "approval_request") {
    return event.requestId ? `approval:${event.requestId}` : event.id;
  }
  if (type === "approval_result") {
    return event.requestId ? `approval-result:${event.requestId}` : event.id;
  }
  if (type === "tool_call") {
    const id = event.toolCallId || event.uuid || event.id;
    if (id) return `tool-call:${id}`;
    return `tool-call:${event.toolName || "unknown"}:${stableJson(event.args || event.arguments)}`;
  }
  if (type === "tool_result") {
    const id = event.toolCallId || event.uuid || event.id;
    if (id) return `tool-result:${id}`;
    return `tool-result:${event.toolName || "unknown"}:${stableJson(event.result || event.content)}`;
  }
  if (event.uuid) return `${type}:${event.uuid}`;
  if (event.id) return String(event.id);
  if (event.requestId) return `${type}:${event.requestId}`;
  if (event.content) return `${type}:${event.content}`;
  return null;
}

export function normalizeTimelineEvent(
  event = {},
  fallbackCreatedAt = nowMs()
) {
  const type = normalizeTimelineType(event.type);
  const createdAt = event.createdAt || event.timestamp || fallbackCreatedAt;
  const normalized = {
    ...event,
    type,
    args: event.args ?? event.arguments,
    createdAt,
    updatedAt: event.updatedAt || createdAt,
  };
  delete normalized.arguments;

  const stableId = timelineEventStableId(normalized);
  return {
    ...normalized,
    id: stableId || `${type}:${createdAt}:${v4()}`,
  };
}

export function mergeTimelineEvent(timeline = [], rawEvent = {}) {
  if (!rawEvent) return timeline;
  const event = normalizeTimelineEvent(rawEvent);
  const idx = timeline.findIndex((item) => item.id === event.id);
  if (idx === -1) return [...timeline, event];

  return timeline.map((item, index) =>
    index === idx
      ? {
          ...item,
          ...event,
          createdAt: item.createdAt || event.createdAt,
          updatedAt: event.updatedAt || nowMs(),
        }
      : item
  );
}

export function removeTimelineEvent(timeline = [], rawEvent = {}) {
  const targetId =
    rawEvent.targetId || rawEvent.targetUuid || rawEvent.uuid || rawEvent.id;
  if (!targetId) return timeline;
  return timeline.filter(
    (event) =>
      event.id !== targetId &&
      event.uuid !== targetId &&
      !event.id?.endsWith?.(`:${targetId}`)
  );
}

function normalizeStoredTimeline(timeline = []) {
  return Array.isArray(timeline)
    ? timeline.filter(Boolean).reduce(mergeTimelineEvent, [])
    : [];
}

export function normalizeTurnItem(item = {}) {
  const createdAt = item.createdAt || item.sentAt || nowMs();
  if (isUserItem(item)) {
    const turnId = item.turnId || createTurnId();
    return {
      ...item,
      id: item.id || userItemId(turnId),
      type: "user",
      role: "user",
      turnId,
      attachments: Array.isArray(item.attachments) ? item.attachments : [],
      createdAt,
    };
  }

  if (isAssistantTurn(item)) {
    const turnId = item.turnId || createTurnId();
    const timeline = normalizeStoredTimeline(item.timeline);
    return {
      ...item,
      id: item.id || assistantItemId(turnId),
      type: "assistant_turn",
      role: "assistant",
      turnId,
      userMessageId: item.userMessageId || userItemId(turnId),
      status: item.status || TURN_STATUSES.completed,
      finalContent: item.finalContent ?? item.content ?? "",
      sources: Array.isArray(item.sources) ? item.sources : [],
      metrics: item.metrics || {},
      error: item.error || null,
      createdAt,
      updatedAt: item.updatedAt || createdAt,
      timeline,
    };
  }

  return null;
}

export function normalizeTurnItems(items = []) {
  const normalized = [];
  const positions = new Map();

  for (const item of items) {
    const next = normalizeTurnItem(item);
    if (!next?.id) continue;

    const idx = positions.get(next.id);
    if (idx === undefined) {
      positions.set(next.id, normalized.length);
      normalized.push(next);
      continue;
    }

    const existing = normalized[idx];
    normalized[idx] = isAssistantTurn(existing)
      ? {
          ...existing,
          ...next,
          timeline: normalizeStoredTimeline([
            ...(existing.timeline || []),
            ...(next.timeline || []),
          ]),
        }
      : { ...existing, ...next };
  }

  return normalized;
}

function normalizeOldAgentEvent(event = {}) {
  const type = normalizeTimelineType(event.type);
  if (type === "markdown_delta") return null;
  return normalizeTimelineEvent({ ...event, type });
}

function serverTurnId(chatId) {
  return `server:${chatId}`;
}

function groupedServerHistory(history = []) {
  const groups = [];
  const byChatId = new Map();

  for (const message of history.filter(Boolean)) {
    const chatId = message.chatId;
    if (!chatId) continue;
    if (!byChatId.has(chatId)) {
      byChatId.set(chatId, { chatId, user: null, assistant: null });
      groups.push(byChatId.get(chatId));
    }

    const group = byChatId.get(chatId);
    if (message.role === "user" && !group.user) group.user = message;
    if (message.role === "assistant") group.assistant = message;
  }

  return groups.filter((group) => group.user || group.assistant);
}

function serverGroupToItems(group, chatKey = null) {
  const turnId = serverTurnId(group.chatId);
  const createdAt =
    (group.user?.sentAt || group.assistant?.sentAt || nowMs()) * 1000;
  const userMessage = {
    id: userItemId(turnId),
    type: "user",
    role: "user",
    turnId,
    content: group.user?.content || "",
    attachments: group.user?.attachments || [],
    chatId: group.chatId,
    createdAt,
  };

  const assistant = group.assistant || {};
  const timeline = (assistant.agentEvents || [])
    .map(normalizeOldAgentEvent)
    .filter(Boolean)
    .reduce(mergeTimelineEvent, []);

  const assistantTurn = {
    id: assistantItemId(turnId),
    type: "assistant_turn",
    role: "assistant",
    turnId,
    userMessageId: userMessage.id,
    status: TURN_STATUSES.completed,
    finalContent: assistant.content || "",
    sources: assistant.sources || [],
    metrics: assistant.metrics || {},
    chatId: group.chatId,
    chatKey,
    error: assistant.error || null,
    createdAt: createdAt + 1,
    updatedAt: createdAt + 1,
    timeline,
    feedbackScore: assistant.feedbackScore,
    outputs: assistant.outputs || [],
    responseType: assistant.type,
  };

  return [userMessage, assistantTurn];
}

function userFingerprint(item = {}) {
  if (!isUserItem(item)) return null;
  return `${String(item.content || "").trim()}:${stableJson(item.attachments || [])}`;
}

function patchLocalTurnWithServer(localItems, serverUser, serverAssistant) {
  const localAssistantIdx = localItems.findIndex(
    (item) =>
      isAssistantTurn(item) &&
      ((serverAssistant.chatId && item.chatId === serverAssistant.chatId) ||
        (!item.chatId &&
          item.status === TURN_STATUSES.running &&
          userFingerprint(
            localItems.find((candidate) => candidate.id === item.userMessageId)
          ) === userFingerprint(serverUser)))
  );

  if (localAssistantIdx === -1) return null;

  const localAssistant = localItems[localAssistantIdx];
  const localUserIdx = localItems.findIndex(
    (item) => item.id === localAssistant.userMessageId
  );
  const nextItems = [...localItems];

  if (localUserIdx >= 0) {
    nextItems[localUserIdx] = {
      ...nextItems[localUserIdx],
      chatId: nextItems[localUserIdx].chatId || serverUser.chatId,
    };
  }

  nextItems[localAssistantIdx] = {
    ...localAssistant,
    chatId: serverAssistant.chatId || localAssistant.chatId,
    finalContent: serverAssistant.finalContent || localAssistant.finalContent,
    sources: serverAssistant.sources || localAssistant.sources,
    metrics: serverAssistant.metrics || localAssistant.metrics,
    feedbackScore: serverAssistant.feedbackScore,
    outputs: serverAssistant.outputs || localAssistant.outputs || [],
    responseType: serverAssistant.responseType || localAssistant.responseType,
    status:
      localAssistant.status === TURN_STATUSES.failed
        ? TURN_STATUSES.failed
        : TURN_STATUSES.completed,
    timeline: normalizeStoredTimeline([
      ...(localAssistant.timeline || []),
      ...(serverAssistant.timeline || []),
    ]),
    updatedAt: nowMs(),
  };

  return nextItems;
}

export function mergeServerHistoryIntoTurns(
  history = [],
  localItems = [],
  options = {}
) {
  let merged = normalizeTurnItems(localItems);
  const seenIds = new Set(merged.map((item) => item.id));

  for (const group of groupedServerHistory(history)) {
    const [serverUser, serverAssistant] = serverGroupToItems(
      group,
      options.chatKey || null
    );

    const patched = patchLocalTurnWithServer(
      merged,
      serverUser,
      serverAssistant
    );
    if (patched) {
      merged = patched;
      continue;
    }

    for (const item of [serverUser, serverAssistant]) {
      if (seenIds.has(item.id)) {
        merged = normalizeTurnItems([...merged, item]);
      } else {
        seenIds.add(item.id);
        merged.push(item);
      }
    }
  }

  return normalizeTurnItems(merged);
}

export function findAssistantTurn(items = [], turnId = null) {
  if (!turnId) return null;
  return items.find((item) => isAssistantTurn(item) && item.turnId === turnId);
}

export function updateAssistantTurnInItems(items = [], turnId, patch = {}) {
  return normalizeTurnItems(items).map((item) => {
    if (!isAssistantTurn(item) || item.turnId !== turnId) return item;
    return {
      ...item,
      ...patch,
      timeline:
        patch.timeline !== undefined
          ? normalizeStoredTimeline(patch.timeline)
          : item.timeline || [],
      updatedAt: patch.updatedAt || nowMs(),
    };
  });
}

export function appendTimelineEventToItems(items = [], turnId, event = {}) {
  if (!event) return items;
  if (event.type === "remove_agent_event") {
    return normalizeTurnItems(items).map((item) =>
      isAssistantTurn(item) && item.turnId === turnId
        ? {
            ...item,
            timeline: removeTimelineEvent(item.timeline || [], event),
            updatedAt: nowMs(),
          }
        : item
    );
  }

  return normalizeTurnItems(items).map((item) =>
    isAssistantTurn(item) && item.turnId === turnId
      ? {
          ...item,
          timeline: mergeTimelineEvent(item.timeline || [], event),
          updatedAt: nowMs(),
        }
      : item
  );
}

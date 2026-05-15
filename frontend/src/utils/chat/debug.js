export function chatTurnDebugEnabled() {
  try {
    return window?.localStorage?.getItem("chatTurnDebug") === "true";
  } catch {
    return false;
  }
}

export function debugChatTurn(label, payload = {}) {
  if (!chatTurnDebugEnabled()) return;
  console.debug("[chat-turn-debug]", label, payload);
}

function contentLength(value) {
  if (typeof value === "string") return value.length;
  if (value?.content && typeof value.content === "string") {
    return value.content.length;
  }
  if (value?.textResponse && typeof value.textResponse === "string") {
    return value.textResponse.length;
  }
  return 0;
}

export function rawEventSummary(raw = {}, source = "unknown") {
  const content =
    raw?.content && typeof raw.content === "object" ? raw.content : {};
  return {
    source,
    rawType: raw?.type || null,
    close: raw?.close ?? content.close ?? null,
    uuid: raw?.uuid || content.uuid || null,
    chatId: raw?.chatId ?? content.chatId ?? null,
    contentLength: contentLength(raw) || contentLength(content),
  };
}

export function normalizedEventSummary(event = {}, source = "unknown") {
  const timelineEvent = event?.event || {};
  return {
    source,
    normalizedType: event?.type || null,
    closed: event?.closed ?? timelineEvent.closed ?? null,
    uuid: event?.uuid || timelineEvent.uuid || null,
    chatId:
      event?.chatId ?? event?.patch?.chatId ?? timelineEvent.chatId ?? null,
    contentLength:
      contentLength(event) ||
      contentLength(event?.patch || {}) ||
      contentLength(timelineEvent),
    timelineType: timelineEvent?.type || null,
  };
}

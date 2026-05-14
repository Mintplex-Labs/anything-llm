import { THREAD_RENAME_EVENT } from "@/components/Sidebar/ActiveWorkspaces/ThreadContainer";

export const ABORT_STREAM_EVENT = "abort-chat-stream";

export function dispatchThreadRename(thread) {
  if (!thread?.slug || !thread?.name) return;
  window.dispatchEvent(
    new CustomEvent(THREAD_RENAME_EVENT, {
      detail: {
        threadSlug: thread.slug,
        newName: thread.name,
      },
    })
  );
}

export default function handleChat(chatResult = {}) {
  const {
    uuid,
    textResponse,
    type,
    sources = [],
    error,
    close,
    animate = false,
    chatId = null,
    action = null,
    metrics = {},
    websocketUUID = null,
    thread = null,
  } = chatResult;

  if (action === "rename_thread") dispatchThreadRename(thread);

  if (type === "agentInitWebsocketConnection") {
    return {
      type: "agent_socket_start",
      websocketUUID,
    };
  }

  if (type === "statusResponse") {
    return {
      type: "timeline_event",
      event: {
        type: "thought",
        uuid,
        content: textResponse || "",
        animate,
      },
    };
  }

  if (type === "textResponseChunk") {
    if (close) {
      return {
        type: "assistant_final",
        uuid,
        content: textResponse || "",
        sources,
        chatId,
        metrics,
        closed: true,
      };
    }

    return {
      type: "assistant_delta",
      uuid,
      content: textResponse || "",
      sources,
      closed: !!close,
      chatId,
      metrics,
    };
  }

  if (type === "textResponse" || type === "finalizeResponseStream") {
    return {
      type: "assistant_final",
      uuid,
      content: textResponse || "",
      sources,
      chatId,
      metrics,
      closed: !!close,
    };
  }

  if (type === "abort") {
    return {
      type: "assistant_error",
      uuid,
      content: error || textResponse || "Stream aborted.",
      error: error || textResponse || "Stream aborted.",
    };
  }

  if (type === "stopGeneration") {
    return {
      type: "stop_generation",
      uuid,
      content: "Generation stopped by user.",
    };
  }

  if (type === "wssFailure") {
    return {
      type: "assistant_error",
      uuid,
      content: error || textResponse || "Websocket connection failed.",
      error: error || textResponse || "Websocket connection failed.",
    };
  }

  if (action === "reset_chat") {
    return { type: "reset_chat" };
  }

  return null;
}

export function getWorkspaceSystemPrompt(workspace) {
  return (
    workspace?.openAiPrompt ??
    "Given the following conversation, relevant context, and a follow up question, reply with an answer to the current question the user is asking. Return only your response to the question given the above information following the users instructions as needed."
  );
}

export function chatQueryRefusalResponse(workspace) {
  return (
    workspace?.queryRefusalResponse ??
    "There is no relevant information in this workspace to answer your query."
  );
}

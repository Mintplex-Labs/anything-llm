import { THREAD_RENAME_EVENT } from "@/components/Sidebar/ActiveWorkspaces/ThreadContainer";
import { emitAssistantMessageCompleteEvent } from "@/components/contexts/TTSProvider";
export const ABORT_STREAM_EVENT = "abort-chat-stream";

const NON_FINAL_ASSISTANT_MESSAGE_TYPES = new Set([
  "statusResponse",
  "toolApprovalRequest",
  "toolCallInvocation",
  "toolCallResult",
]);

function canAdoptAssistantMessage(message = {}) {
  return (
    message?.role === "assistant" &&
    !NON_FINAL_ASSISTANT_MESSAGE_TYPES.has(message.type)
  );
}

function findAssistantMessageIndex(history, uuid = null) {
  const exactIdx = uuid
    ? history.findIndex(
        (chat) => chat.uuid === uuid && canAdoptAssistantMessage(chat)
      )
    : -1;
  if (exactIdx !== -1) return exactIdx;

  for (let i = history.length - 1; i >= 0; i--) {
    const message = history[i];
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

function syncPreviousUserChatId(history, assistantIdx, chatId) {
  if (!chatId) return;
  const userIdx = assistantIdx - 1;
  if (history[userIdx]?.role === "user") {
    history[userIdx] = { ...history[userIdx], chatId };
  }
}

// For handling of chat responses in the frontend by their various types.
export default function handleChat(
  chatResult,
  setLoadingResponse,
  setChatHistory,
  remHistory,
  _chatHistory,
  setWebsocket
) {
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
  } = chatResult;

  if (type === "statusResponse") {
    return;
  }

  if (type === "abort") {
    setLoadingResponse(false);
    setChatHistory([
      ...remHistory,
      {
        type,
        uuid,
        content: textResponse,
        role: "assistant",
        sources,
        closed: true,
        error,
        animate,
        pending: false,
        metrics,
      },
    ]);
    _chatHistory.push({
      type,
      uuid,
      content: textResponse,
      role: "assistant",
      sources,
      closed: true,
      error,
      animate,
      pending: false,
      metrics,
    });
  } else if (type === "textResponse") {
    setLoadingResponse(false);
    const chatIdx = findAssistantMessageIndex(_chatHistory, uuid);
    if (chatIdx !== -1) {
      _chatHistory[chatIdx] = {
        ..._chatHistory[chatIdx],
        uuid: uuid || _chatHistory[chatIdx].uuid,
        content: textResponse,
        role: "assistant",
        sources,
        closed: close,
        error,
        animate: !close,
        pending: false,
        chatId,
        metrics,
      };
      syncPreviousUserChatId(_chatHistory, chatIdx, chatId);
    } else {
      _chatHistory.push({
        uuid,
        content: textResponse,
        role: "assistant",
        sources,
        closed: close,
        error,
        animate: !close,
        pending: false,
        chatId,
        metrics,
      });
    }
    setChatHistory([..._chatHistory]);
    emitAssistantMessageCompleteEvent(chatId);
  } else if (
    type === "textResponseChunk" ||
    type === "finalizeResponseStream"
  ) {
    const chatIdx = findAssistantMessageIndex(_chatHistory, uuid);
    if (chatIdx !== -1) {
      const existingHistory = { ..._chatHistory[chatIdx] };
      let updatedHistory;

      // If the response is finalized, we can set the loading state to false.
      // and append the metrics to the history.
      if (type === "finalizeResponseStream") {
        updatedHistory = {
          ...existingHistory,
          uuid: uuid || existingHistory.uuid,
          closed: close,
          animate: !close,
          pending: false,
          chatId,
          metrics,
        };

        syncPreviousUserChatId(_chatHistory, chatIdx, chatId);

        emitAssistantMessageCompleteEvent(chatId);
        setLoadingResponse(false);
      } else {
        updatedHistory = {
          ...existingHistory,
          uuid: uuid || existingHistory.uuid,
          type: "textResponse",
          content: (existingHistory.content || "") + textResponse,
          ...(sources && sources.length > 0 ? { sources } : {}),
          error,
          closed: close,
          animate: !close,
          pending: false,
          chatId,
          metrics,
        };
      }
      _chatHistory[chatIdx] = updatedHistory;
    } else {
      _chatHistory.push({
        uuid,
        sources,
        error,
        content: textResponse,
        role: "assistant",
        closed: close,
        animate: !close,
        pending: false,
        chatId,
        metrics,
      });
    }
    setChatHistory([..._chatHistory]);
  } else if (type === "agentInitWebsocketConnection") {
    setWebsocket(chatResult.websocketUUID);
  } else if (type === "stopGeneration") {
    const chatIdx = findAssistantMessageIndex(_chatHistory);
    if (chatIdx === -1) {
      setLoadingResponse(false);
      return;
    }
    const existingHistory = { ..._chatHistory[chatIdx] };
    const updatedHistory = {
      ...existingHistory,
      sources: [],
      closed: true,
      error: null,
      animate: false,
      pending: false,
      metrics,
    };
    _chatHistory[chatIdx] = updatedHistory;

    setChatHistory([..._chatHistory]);
    setLoadingResponse(false);
  }

  // Action Handling via special 'action' attribute on response.
  if (action === "reset_chat") setChatHistory([]);

  // If thread was updated automatically based on chat prompt
  // then we can handle the updating of the thread here.
  if (action === "rename_thread") {
    if (!!chatResult?.thread?.slug && chatResult.thread.name) {
      window.dispatchEvent(
        new CustomEvent(THREAD_RENAME_EVENT, {
          detail: {
            threadSlug: chatResult.thread.slug,
            newName: chatResult.thread.name,
          },
        })
      );
    }
  }
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

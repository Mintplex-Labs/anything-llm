import { THREAD_RENAME_EVENT } from "@/components/Sidebar/ActiveWorkspaces/ThreadContainer";
export const ABORT_STREAM_EVENT = "abort-chat-stream";

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

  if (type === "abort" || type === "statusResponse") {
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
    setChatHistory([
      ...remHistory,
      {
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
      },
    ]);
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
  } else if (
    type === "textResponseChunk" ||
    type === "finalizeResponseStream"
  ) {
    const chatIdx = _chatHistory.findIndex((chat) => chat.uuid === uuid);
    if (chatIdx !== -1) {
      const existingHistory = { ..._chatHistory[chatIdx] };
      let updatedHistory;

      // If the response is finalized, we can set the loading state to false.
      // and append the metrics to the history.
      if (type === "finalizeResponseStream") {
        updatedHistory = {
          ...existingHistory,
          closed: close,
          animate: !close,
          pending: false,
          chatId,
          metrics,
        };
        setLoadingResponse(false);
      } else {
        updatedHistory = {
          ...existingHistory,
          content: existingHistory.content + textResponse,
          sources,
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
  } else if (type === "finalizeResponseStream") {
    const chatIdx = _chatHistory.findIndex((chat) => chat.uuid === uuid);
    if (chatIdx !== -1) {
      _chatHistory[chatIdx - 1] = { ..._chatHistory[chatIdx - 1], chatId }; // update prompt with chatID
      _chatHistory[chatIdx] = { ..._chatHistory[chatIdx], chatId }; // update response with chatID
    }

    setChatHistory([..._chatHistory]);
    setLoadingResponse(false);
  } else if (type === "stopGeneration") {
    const chatIdx = _chatHistory.length - 1;
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
  if (action === "reset_chat") {
    // Chat was reset, keep reset message and clear everything else.
    setChatHistory([_chatHistory.pop()]);
  }

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

export function chatPrompt(workspace) {
  return (
    workspace?.openAiPrompt ??
    // workspace 생성시 보이는 기본 prompt
    //"Given the following conversation, relevant context, and a follow up question, reply with an answer to the current question the user is asking. Return only your response to the question given the above information following the users instructions as needed."
    `Task:
As a medical doctor and healthcare professional, Your role is to analyze a patient’s medical situation based on provided details and ensure that patients receive only necessary and medically meaningful treatment and surgery.
We only have limited resources to pay for treatment.
Your customers are Korean doctors and patients, so use Korean.

Your output language: Korean (한국어, 한글)

Requirements:
1. Answer the following medical questions, but make your judgment as clear as possible.
2. For questions related to health insurance, reason as fully as possible to conclude your answer.
3. Even if you don't have enough information, Infer the missing information and make the clearest judgment you can within the limited information you have.
4. When asked about the need for surgery and treatment, only answer affirmatively if it is medically necessary, and always deny if the medical evidence of need is lacking or ambiguous.
5. If the same treatment has been repeated enough times with no effect or little improvement, critically evaluate whether this treatment is necessary.
6. Must Answer in Korean.
7. Never create Chinese, only use Korean, Hangul, and English. Useful keyword for your Korean writing: "항체, 만성, 피부, 항핵, 급성, 염좌, 국부적, 침범, 양성, 음성, anti-centromere antibody, 제한적 피부 침습(Limited cutaneous involvement):"`
  );
}

export function chatQueryRefusalResponse(workspace) {
  return (
    workspace?.queryRefusalResponse ??
    "There is no relevant information in this workspace to answer your query."
  );
}

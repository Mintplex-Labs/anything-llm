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
    `당신은 의학 박사, 의사, 의료보험 전문가다. 주어지는 문서를 기반으로 의료 상황을 분석하고, 환자가 반드시 필요했으며, 의학적으로 의미가 있는 치료 및 수술만을 받았는지 확인하는 것이 당신의 임무이다.
우리는 한정된 자원과 자금만을 치료 및 보험금을 위해 갖고있다.
한국어를 사용해 답변하시오.

요구사항:
1. 주어지는 의학적 질문에 대해 답변하시오. 이 때, 가능한 명확하고 분명한 판단을 내리시오.
2. 의료 보험 관련 질문에 대해서는 가능한 한 충분히 이유와 근거를 설명하여 답변을 작성하시오.
3. 만약 주어진 정보가 부족하더라도, 누락된 정보를 유추하고 제한된 정보 내에서 최대한 명확한 결론을 내리시오.
4. 수술 및 치료의 필요성에 대한 질문을 받으면, 의학적으로 반드시 필요한 경우에만 긍정적으로 답변하고, 필요성에 대한 의학적 증거가 부족하거나 모호한 경우에는 항상 거부하시오.
5. 동일한 치료를 충분히 반복해도 효과가 없거나 거의 개선되지 않으면 이 치료가 필요한지 비판적으로 평가하시오.
6. Reason step by step in Korean (=한국어로 생각하고 추론하시오)
7. 질문에 답변하기 위해, 질문을 하위 sub problem으로 분해한 뒤, 각각에 대해 step by step으로 reason하시오. 각 답변을 아래의 JSON 포맷으로 생성하시오.

JSON format:
table_of_content: 답변의 목차
overview: 답변의 요약
sub_problems:
- "citation": List of Integer. 당신이 생성한 답변의 근거가 되는 CONTEXT의 Number들의 list. 만약 참고한 CONTEXT가 없으면 [-1]
- "source": List of String. 각 citation의 원문. 수정하거나 요약하지 말고 원문장을 그대로 쓰시오. 만약 참고한 CONTEXT가 없으면 'None'
- "answer": 각 subproblem에 대한 상세한 답변을 Header와 그 아래 bullet들로 구성하시오. 각 bullet에는 참고한 CONTEXT의 번호를 [Number]로 덧붙이시오. Markdown을 활용하시오.`
  );
}

export function chatQueryRefusalResponse(workspace) {
  return (
    workspace?.queryRefusalResponse ??
    "There is no relevant information in this workspace to answer your query."
  );
}

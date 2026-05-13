import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useMemo,
  useCallback,
  forwardRef,
} from "react";
import HistoricalMessage from "./HistoricalMessage";
import PromptReply from "./PromptReply";
import StatusResponse from "./StatusResponse";
import ToolApprovalRequest from "./ToolApprovalRequest";
import FileDownloadCard from "./FileDownloadCard";
import { useManageWorkspaceModal } from "../../../Modals/ManageWorkspace";
import ManageWorkspace from "../../../Modals/ManageWorkspace";
import { ArrowDown } from "@phosphor-icons/react";
import debounce from "lodash.debounce";
import Chartable from "./Chartable";
import Workspace from "@/models/workspace";
import { useParams } from "react-router-dom";
import paths from "@/utils/paths";
import Appearance from "@/models/appearance";
import useTextSize from "@/hooks/useTextSize";
import useChatHistoryScrollHandle from "@/hooks/useChatHistoryScrollHandle";
import { ThoughtExpansionProvider } from "./ThoughtContainer";
import { MessageActionsProvider } from "./MessageActionsContext";

export default forwardRef(function (
  {
    history = [],
    agentEvents = [],
    workspace,
    sendCommand,
    updateHistory,
    regenerateAssistantMessage,
    websocket = null,
    chatKey = null,
    approvalState = null,
    onToolApprovalResponse,
  },
  ref
) {
  const lastScrollTopRef = useRef(0);
  const scrollPositionsRef = useRef({});
  const suppressAutoScrollRef = useRef(false);
  const chatHistoryRef = useRef(null);
  const { threadSlug = null } = useParams();
  const { showing, hideModal } = useManageWorkspaceModal();
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [isUserScrolling, setIsUserScrolling] = useState(false);
  const isStreaming = history[history.length - 1]?.animate;
  const { showScrollbar } = Appearance.getSettings();
  const { textSizeClass } = useTextSize();

  useEffect(() => {
    if (suppressAutoScrollRef.current) {
      suppressAutoScrollRef.current = false;
      return;
    }
    if (!isUserScrolling && (isAtBottom || isStreaming)) {
      scrollToBottom(false); // Use instant scroll for auto-scrolling
    }
  }, [history, isAtBottom, isStreaming, isUserScrolling]);

  useLayoutEffect(() => {
    const element = chatHistoryRef.current;
    if (!element || !chatKey) return;

    suppressAutoScrollRef.current = true;
    window.requestAnimationFrame(() => {
      const current = chatHistoryRef.current;
      if (!current) return;

      const savedScrollTop = scrollPositionsRef.current[chatKey];
      const nextScrollTop =
        typeof savedScrollTop === "number"
          ? savedScrollTop
          : current.scrollHeight;
      current.scrollTo({ top: nextScrollTop });
      const isBottom =
        current.scrollHeight - current.scrollTop - current.clientHeight < 2;
      setIsAtBottom(isBottom);
      setIsUserScrolling(!isBottom);
      lastScrollTopRef.current = current.scrollTop;
    });
  }, [chatKey]);

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    const isBottom = scrollHeight - scrollTop - clientHeight < 2;
    if (chatKey) scrollPositionsRef.current[chatKey] = scrollTop;

    // Detect if this is a user-initiated scroll
    if (Math.abs(scrollTop - lastScrollTopRef.current) > 10) {
      setIsUserScrolling(!isBottom);
    }

    setIsAtBottom(isBottom);
    lastScrollTopRef.current = scrollTop;
  };

  const debouncedScroll = debounce(handleScroll, 100);

  useEffect(() => {
    const chatHistoryElement = chatHistoryRef.current;
    if (chatHistoryElement) {
      chatHistoryElement.addEventListener("scroll", debouncedScroll);
      return () =>
        chatHistoryElement.removeEventListener("scroll", debouncedScroll);
    }
  }, []);

  const scrollToBottom = (smooth = false) => {
    if (chatHistoryRef.current) {
      chatHistoryRef.current.scrollTo({
        top: chatHistoryRef.current.scrollHeight,

        // Smooth is on when user clicks the button but disabled during auto scroll
        // We must disable this during auto scroll because it causes issues with
        // detecting when we are at the bottom of the chat.
        ...(smooth ? { behavior: "smooth" } : {}),
      });
    }
  };

  useChatHistoryScrollHandle(ref, chatHistoryRef, {
    setIsUserScrolling,
    isStreaming,
    scrollToBottom,
  });

  const saveEditedMessage = async ({
    editedMessage,
    chatId,
    role,
    attachments = [],
    saveOnly = false,
  }) => {
    if (!editedMessage) return; // Don't save empty edits.

    // "Save" on a user message: update the prompt text without regenerating
    if (role === "user" && saveOnly) {
      const updatedHistory = [...history];
      const targetIdx = history.findIndex((msg) => msg.chatId === chatId);
      if (targetIdx < 0) return;
      updatedHistory[targetIdx].content = editedMessage;
      updateHistory(updatedHistory);
      await Workspace.updateChat(
        workspace.slug,
        threadSlug,
        chatId,
        editedMessage,
        "user"
      );
      return;
    }

    // "Submit" on a user message: auto-regenerate the response and delete all
    // messages post modified message
    if (role === "user") {
      // remove all messages after the edited message
      // technically there are two chatIds per-message pair, this will split the first.
      const updatedHistory = history.slice(
        0,
        history.findIndex((msg) => msg.chatId === chatId) + 1
      );

      // update last message in history to edited message
      updatedHistory[updatedHistory.length - 1].content = editedMessage;
      // remove all edited messages after the edited message in backend
      await Workspace.deleteEditedChats(workspace.slug, threadSlug, chatId);
      sendCommand({
        text: editedMessage,
        autoSubmit: true,
        history: updatedHistory,
        attachments,
      });
      return;
    }

    // If role is an assistant we simply want to update the comment and save on the backend as an edit.
    if (role === "assistant") {
      const updatedHistory = [...history];
      const targetIdx = history.findIndex(
        (msg) => msg.chatId === chatId && msg.role === role
      );
      if (targetIdx < 0) return;
      updatedHistory[targetIdx].content = editedMessage;
      updateHistory(updatedHistory);
      await Workspace.updateChat(
        workspace.slug,
        threadSlug,
        chatId,
        editedMessage
      );
      return;
    }
  };

  const forkThread = async (chatId) => {
    const newThreadSlug = await Workspace.forkThread(
      workspace.slug,
      threadSlug,
      chatId
    );
    window.location.href = paths.workspace.thread(
      workspace.slug,
      newThreadSlug
    );
  };

  const compiledHistory = useMemo(
    () =>
      buildMessages({
        workspace,
        history,
        regenerateAssistantMessage,
        saveEditedMessage,
        forkThread,
        websocket,
        chatKey,
        agentEvents,
        approvalState,
        onToolApprovalResponse,
      }),
    [
      workspace,
      history,
      regenerateAssistantMessage,
      saveEditedMessage,
      forkThread,
      websocket,
      chatKey,
      agentEvents,
      approvalState,
      onToolApprovalResponse,
    ]
  );
  const lastMessageInfo = useMemo(() => getLastMessageInfo(history), [history]);
  const renderStatusResponse = useCallback(
    (item, index) => {
      const hasSubsequentMessages = index < compiledHistory.length - 1;
      return (
        <StatusResponse
          key={`status-group-${index}`}
          messages={item}
          isThinking={!hasSubsequentMessages && lastMessageInfo.isAnimating}
        />
      );
    },
    [compiledHistory.length, lastMessageInfo]
  );

  return (
    <MessageActionsProvider>
      <ThoughtExpansionProvider>
        <div
          className={`markdown text-white/80 light:text-theme-text-primary font-light ${textSizeClass} h-full md:h-[83%] pb-[100px] pt-6 md:pt-0 md:pb-20 md:mx-0 overflow-y-scroll flex flex-col items-center justify-start ${showScrollbar ? "show-scrollbar" : "no-scroll"}`}
          id="chat-history"
          ref={chatHistoryRef}
          onScroll={handleScroll}
        >
          <div className="w-full max-w-[750px]">
            {compiledHistory.map((item, index) =>
              Array.isArray(item) ? renderStatusResponse(item, index) : item
            )}
          </div>
          {showing && (
            <ManageWorkspace
              hideModal={hideModal}
              providedSlug={workspace.slug}
            />
          )}
        </div>
        {!isAtBottom && (
          <div className="absolute bottom-40 right-10 z-50 cursor-pointer animate-pulse">
            <div className="flex flex-col items-center">
              <div
                className="p-1 rounded-full border border-white/10 bg-white/10 hover:bg-white/20 hover:text-white"
                onClick={() => {
                  scrollToBottom(isStreaming ? false : true);
                  setIsUserScrolling(false);
                }}
              >
                <ArrowDown weight="bold" className="text-white/60 w-5 h-5" />
              </div>
            </div>
          </div>
        )}
      </ThoughtExpansionProvider>
    </MessageActionsProvider>
  );
});

const getLastMessageInfo = (history) => {
  const lastMessage = history?.[history.length - 1] || {};
  return {
    isAnimating: lastMessage?.animate,
    isStatusResponse: lastMessage?.type === "statusResponse",
  };
};

/**
 * Builds the history of messages for the chat.
 * This is mostly useful for rendering the history in a way that is easy to understand.
 * as well as compensating for agent thinking and other messages that are not part of the history, but
 * are still part of the chat.
 *
 * @param {Object} param0 - The parameters for building the messages.
 * @param {Array} param0.history - The history of messages.
 * @param {Object} param0.workspace - The workspace object.
 * @param {Function} param0.regenerateAssistantMessage - The function to regenerate the assistant message.
 * @param {Function} param0.saveEditedMessage - The function to save the edited message.
 * @param {Function} param0.forkThread - The function to fork the thread.
 * @param {WebSocket} param0.websocket - The active websocket connection for agent communication.
 * @param {Array} param0.agentEvents - Live agent timeline events for the active draft.
 * @returns {Array} The compiled history of messages.
 */
function buildMessages({
  history,
  workspace,
  regenerateAssistantMessage,
  saveEditedMessage,
  forkThread,
  websocket,
  chatKey,
  agentEvents,
  approvalState,
  onToolApprovalResponse,
}) {
  const liveApprovalRequestIds = new Set(
    history
      .filter((message) => message.type === "toolApprovalRequest")
      .map((message) => message.requestId)
      .filter(Boolean)
  );
  const renderedApprovalRequestIds = new Set();
  const hasPersistedAgentEvents = history.some(
    (message) => message.role === "assistant" && message.agentEvents?.length > 0
  );
  const liveTimelineMessages = hasPersistedAgentEvents
    ? []
    : agentEventsToTimelineMessages(agentEvents);

  return history.reduce((acc, props, index) => {
    const isLastBotReply =
      index === history.length - 1 && props.role === "assistant";

    if (isLastBotReply && liveTimelineMessages.length > 0) {
      for (const timelineMessage of liveTimelineMessages) {
        if (timelineMessage.type === "toolApprovalRequest") {
          if (
            liveApprovalRequestIds.has(timelineMessage.requestId) ||
            renderedApprovalRequestIds.has(timelineMessage.requestId)
          ) {
            continue;
          }
          renderedApprovalRequestIds.add(timelineMessage.requestId);
          acc.push(
            <ToolApprovalRequest
              key={`live-tool-approval-${timelineMessage.requestId}`}
              requestId={timelineMessage.requestId}
              skillName={timelineMessage.skillName}
              payload={timelineMessage.payload}
              description={timelineMessage.description}
              timeoutMs={timelineMessage.timeoutMs}
              websocket={websocket}
              approvalState={
                approvalState?.requestId === timelineMessage.requestId
                  ? approvalState
                  : timelineMessage
              }
              onResponse={(approved) =>
                onToolApprovalResponse?.(
                  chatKey,
                  timelineMessage.requestId,
                  approved
                )
              }
            />
          );
          continue;
        }

        if (acc.length > 0 && Array.isArray(acc[acc.length - 1])) {
          acc[acc.length - 1].push(timelineMessage);
        } else {
          acc.push([timelineMessage]);
        }
      }
    }

    if (props.role === "assistant" && props.agentEvents?.length > 0) {
      for (const timelineMessage of agentEventsToTimelineMessages(
        props.agentEvents
      )) {
        if (timelineMessage.type === "toolApprovalRequest") {
          if (
            liveApprovalRequestIds.has(timelineMessage.requestId) ||
            renderedApprovalRequestIds.has(timelineMessage.requestId)
          ) {
            continue;
          }
          renderedApprovalRequestIds.add(timelineMessage.requestId);
          acc.push(
            <ToolApprovalRequest
              key={`persisted-tool-approval-${timelineMessage.requestId}`}
              requestId={timelineMessage.requestId}
              skillName={timelineMessage.skillName}
              payload={timelineMessage.payload}
              description={timelineMessage.description}
              timeoutMs={timelineMessage.timeoutMs}
              approvalState={timelineMessage}
            />
          );
          continue;
        }

        if (acc.length > 0 && Array.isArray(acc[acc.length - 1])) {
          acc[acc.length - 1].push(timelineMessage);
        } else {
          acc.push([timelineMessage]);
        }
      }
    }

    if (props?.type === "statusResponse" && !!props.content) {
      if (acc.length > 0 && Array.isArray(acc[acc.length - 1])) {
        acc[acc.length - 1].push(props);
      } else {
        acc.push([props]);
      }
      return acc;
    }

    if (props.type === "toolApprovalRequest") {
      if (renderedApprovalRequestIds.has(props.requestId)) return acc;
      renderedApprovalRequestIds.add(props.requestId);
      acc.push(
        <ToolApprovalRequest
          key={`tool-approval-${props.requestId}`}
          requestId={props.requestId}
          skillName={props.skillName}
          payload={props.payload}
          description={props.description}
          timeoutMs={props.timeoutMs}
          websocket={websocket}
          approvalState={
            approvalState?.requestId === props.requestId ? approvalState : props
          }
          onResponse={(approved) =>
            onToolApprovalResponse?.(chatKey, props.requestId, approved)
          }
        />
      );
      return acc;
    }

    if (props.type === "rechartVisualize" && !!props.content) {
      acc.push(<Chartable key={props.uuid} props={props} />);
    } else if (props.type === "fileDownloadCard" && !!props.content) {
      acc.push(<FileDownloadCard key={props.uuid} props={props} />);
    } else if (isLastBotReply && props.animate) {
      acc.push(
        <PromptReply
          key={`prompt-reply-${props.uuid || index}`}
          uuid={props.uuid}
          reply={props.content}
          pending={props.pending}
          sources={props.sources}
          error={props.error}
          closed={props.closed}
        />
      );
    } else {
      acc.push(
        <HistoricalMessage
          key={getMessageRenderKey(props, index)}
          uuid={props.uuid}
          message={props.content}
          role={props.role}
          workspace={workspace}
          sources={props.sources}
          feedbackScore={props.feedbackScore}
          chatId={props.chatId}
          error={props.error}
          attachments={props.attachments}
          regenerateMessage={regenerateAssistantMessage}
          isLastMessage={isLastBotReply}
          saveEditedMessage={saveEditedMessage}
          forkThread={forkThread}
          metrics={props.metrics}
          outputs={props.outputs}
        />
      );
    }
    return acc;
  }, []);
}

function getMessageRenderKey(message = {}, index) {
  if (message.type === "toolApprovalRequest" && message.requestId) {
    return `approval:${message.requestId}`;
  }
  return message.chatId || message.uuid || message.draftId || index;
}

function timelineEventKey(event = {}) {
  if (event.type === "approval_request" || event.type === "approval_result") {
    return event.requestId ? `${event.type}:${event.requestId}` : null;
  }
  if (event.type === "tool_call" || event.type === "tool_result") {
    const toolId = event.toolCallId || event.uuid || event.id;
    return toolId ? `${event.type}:${toolId}` : null;
  }
  if (event.uuid) return `${event.type}:${event.uuid}`;
  if (event.id) return `id:${event.id}`;
  if (event.content) return `${event.type}:${event.content}`;
  return null;
}

function dedupeTimelineEvents(agentEvents = []) {
  const deduped = [];
  const positions = new Map();

  agentEvents.forEach((event) => {
    const key = timelineEventKey(event);
    if (!key) {
      deduped.push(event);
      return;
    }

    const existingIdx = positions.get(key);
    if (existingIdx !== undefined) {
      deduped[existingIdx] = { ...deduped[existingIdx], ...event };
      return;
    }

    positions.set(key, deduped.length);
    deduped.push(event);
  });

  return deduped;
}

function agentEventsToTimelineMessages(agentEvents = []) {
  const dedupedEvents = dedupeTimelineEvents(agentEvents);
  const approvalResults = new Map(
    dedupedEvents
      .filter((event) => event.type === "approval_result")
      .map((event) => [event.requestId, event])
  );

  return dedupedEvents
    .map((event, index) => {
      if (event.type === "agent_thought") {
        return {
          uuid: event.id || `agent-thought-${index}`,
          type: "statusResponse",
          content: event.content,
          role: "assistant",
          sources: [],
          closed: true,
          error: null,
          animate: false,
          pending: false,
          metrics: {},
        };
      }

      if (event.type === "tool_call") {
        return {
          uuid: event.uuid || event.id || `tool-call-${index}`,
          type: "statusResponse",
          content: event.content || `Tool call: ${event.toolName || "unknown"}`,
          role: "assistant",
          sources: [],
          closed: true,
          error: null,
          animate: false,
          pending: false,
          metrics: {},
        };
      }

      if (event.type === "tool_result") {
        return {
          uuid: event.uuid || event.id || `tool-result-${index}`,
          type: "statusResponse",
          content: event.content || `Tool returned a result.`,
          role: "assistant",
          sources: [],
          closed: true,
          error: null,
          animate: false,
          pending: false,
          metrics: {},
        };
      }

      if (event.type === "approval_request") {
        const result = approvalResults.get(event.requestId);
        return {
          ...event,
          type: "toolApprovalRequest",
          approved:
            result?.approved === true || result?.approved === false
              ? result.approved
              : null,
          responded: !!result,
        };
      }

      if (event.type === "error") {
        return {
          uuid: event.id || `agent-error-${index}`,
          type: "statusResponse",
          content: event.content,
          role: "assistant",
          sources: [],
          closed: true,
          error: event.content,
          animate: false,
          pending: false,
          metrics: {},
        };
      }

      return null;
    })
    .filter(Boolean);
}

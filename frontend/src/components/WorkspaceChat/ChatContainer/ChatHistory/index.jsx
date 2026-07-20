import {
  useEffect,
  useRef,
  useState,
  useMemo,
  useCallback,
  forwardRef,
} from "react";
import debounce from "lodash.debounce";
import HistoricalMessage from "./HistoricalMessage";
import PromptReply from "./PromptReply";
import StatusResponse from "./StatusResponse";
import ToolApprovalRequest from "./ToolApprovalRequest";
import ClarifyingQuestionCard from "./ClarifyingQuestion";
import FileDownloadCard from "./FileDownloadCard";
import ScheduledJobCreatedCard from "./ScheduledJobCreatedCard";
import { useManageWorkspaceModal } from "../../../Modals/ManageWorkspace";
import ManageWorkspace from "../../../Modals/ManageWorkspace";
import { ArrowDown } from "@phosphor-icons/react";
import Chartable from "./Chartable";
import ModelRouteNotification from "./ModelRouteNotification";
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
    workspace,
    sendCommand,
    updateHistory,
    regenerateAssistantMessage,
    websocket = null,
  },
  ref
) {
  const lastScrollTopRef = useRef(0);
  const chatHistoryRef = useRef(null);
  const { threadSlug = null } = useParams();
  const { showing, hideModal } = useManageWorkspaceModal();
  const [isAtBottom, setIsAtBottom] = useState(true);
  const isStreaming = history[history.length - 1]?.animate;
  const { showScrollbar } = Appearance.getSettings();
  const { textSizeClass } = useTextSize();

  // Explicit follow lock: while true, the view stays pinned to the bottom.
  // Not derived from measured scroll position - during streaming that
  // measurement races against content growth and is never reliable.
  const autoFollowRef = useRef(true);
  const chatContentRef = useRef(null);
  const lastScrollHeightRef = useRef(0);
  const lastTouchYRef = useRef(null);

  // While locked, re-pin whenever the message list changes height: on mount,
  // new messages, every streamed token, and late layout shifts (message
  // re-renders, images/markdown settling). ResizeObserver fires after layout
  // for every height change, so the pin holds through all of them.
  useEffect(() => {
    if (!chatContentRef.current) return;
    const observer = new ResizeObserver(() => {
      if (autoFollowRef.current) scrollToBottom(false);
    });
    observer.observe(chatContentRef.current);
    return () => observer.disconnect();
  }, []);

  const handleScroll = useCallback((e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    const isBottom = scrollHeight - scrollTop - clientHeight < 2;

    // Programmatic scrolls only ever move down, so upward movement is the
    // user scrolling away - unlock follow (covers scrollbar drags, which
    // fire no wheel/touch events). Reaching the bottom re-locks it. When
    // content shrinks, the browser clamps scrollTop down too - that drop is
    // not a user scroll, so it must not unlock.
    const contentShrank = scrollHeight < lastScrollHeightRef.current;
    if (scrollTop < lastScrollTopRef.current - 10 && !contentShrank) {
      autoFollowRef.current = false;
    } else if (isBottom) {
      autoFollowRef.current = true;
    }

    setIsAtBottom(isBottom);
    lastScrollTopRef.current = scrollTop;
    lastScrollHeightRef.current = scrollHeight;
  }, []);

  const debouncedScroll = useMemo(
    () => debounce(handleScroll, 50),
    [handleScroll]
  );

  // Wheel/touch-up immediately unlocks follow - unlike scroll events, these
  // never fire from programmatic scrolls and are not debounced, so the opt-out
  // cannot be swallowed by the streaming snap race
  const handleWheel = useCallback((e) => {
    if (e.deltaY < 0) autoFollowRef.current = false;
  }, []);

  const handleTouchStart = useCallback((e) => {
    lastTouchYRef.current = e.touches[0].clientY;
  }, []);

  const handleTouchMove = useCallback((e) => {
    const y = e.touches[0].clientY;
    if (lastTouchYRef.current !== null && y > lastTouchYRef.current)
      autoFollowRef.current = false;
    lastTouchYRef.current = y;
  }, []);

  useEffect(() => {
    return () => debouncedScroll.cancel();
  }, [debouncedScroll]);

  const scrollToBottom = (smooth = false) => {
    if (chatHistoryRef.current) {
      chatHistoryRef.current.scrollTo({
        top: chatHistoryRef.current.scrollHeight,
        ...(smooth ? { behavior: "smooth" } : {}),
      });
    }
  };

  useChatHistoryScrollHandle(ref, chatHistoryRef, {
    setAutoFollow: (value) => (autoFollowRef.current = value),
    isStreaming,
    scrollToBottom,
  });

  const historyRef = useRef(history);
  historyRef.current = history;
  const sendCommandRef = useRef(sendCommand);
  sendCommandRef.current = sendCommand;

  const saveEditedMessage = useCallback(
    async ({
      editedMessage,
      chatId,
      role,
      attachments = [],
      saveOnly = false,
    }) => {
      if (!editedMessage) return;
      const currentHistory = historyRef.current;

      if (role === "user" && saveOnly) {
        const updatedHistory = [...currentHistory];
        const targetIdx = currentHistory.findIndex(
          (msg) => msg.chatId === chatId
        );
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

      if (role === "user") {
        const updatedHistory = currentHistory.slice(
          0,
          currentHistory.findIndex((msg) => msg.chatId === chatId) + 1
        );
        updatedHistory[updatedHistory.length - 1].content = editedMessage;
        await Workspace.deleteEditedChats(workspace.slug, threadSlug, chatId);
        sendCommandRef.current({
          text: editedMessage,
          autoSubmit: true,
          history: updatedHistory,
          attachments,
        });
        return;
      }

      if (role === "assistant") {
        const updatedHistory = [...currentHistory];
        const targetIdx = currentHistory.findIndex(
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
    },
    [workspace.slug, threadSlug, updateHistory]
  );

  const forkThread = useCallback(
    async (chatId) => {
      const newThreadSlug = await Workspace.forkThread(
        workspace.slug,
        threadSlug,
        chatId
      );
      window.location.href = paths.workspace.thread(
        workspace.slug,
        newThreadSlug
      );
    },
    [workspace.slug, threadSlug]
  );

  const compiledHistory = useMemo(
    () =>
      buildMessages({
        workspace,
        history,
        regenerateAssistantMessage,
        saveEditedMessage,
        forkThread,
        websocket,
      }),
    [
      workspace,
      history,
      regenerateAssistantMessage,
      saveEditedMessage,
      forkThread,
      websocket,
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
          onScroll={debouncedScroll}
          onWheel={handleWheel}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
        >
          <div className="w-full max-w-[750px]" ref={chatContentRef}>
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
                  autoFollowRef.current = true;
                  scrollToBottom(isStreaming ? false : true);
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
 * @returns {Array} The compiled history of messages.
 */
function buildMessages({
  history,
  workspace,
  regenerateAssistantMessage,
  saveEditedMessage,
  forkThread,
  websocket,
}) {
  return history.reduce((acc, props, index) => {
    const isLastBotReply =
      index === history.length - 1 && props.role === "assistant";

    if (props?.type === "statusResponse" && !!props.content) {
      if (acc.length > 0 && Array.isArray(acc[acc.length - 1])) {
        acc[acc.length - 1].push(props);
      } else {
        acc.push([props]);
      }
      return acc;
    }

    if (props.type === "modelRouteNotification") {
      const lastMsg = history[history.length - 1];
      const isLast =
        index === history.length - 1 ||
        (index === history.length - 2 &&
          (lastMsg?.animate || lastMsg?.pending));
      const isStreaming =
        isLast &&
        (index === history.length - 1 || lastMsg?.animate || lastMsg?.pending);
      acc.push(
        <ModelRouteNotification
          key={`route-${props.uuid}`}
          routedTo={props.routedTo}
          isStreaming={isStreaming}
        />
      );
      return acc;
    }

    if (props.type === "toolApprovalRequest") {
      acc.push(
        <ToolApprovalRequest
          key={`tool-approval-${props.requestId}`}
          requestId={props.requestId}
          skillName={props.skillName}
          payload={props.payload}
          description={props.description}
          timeoutMs={props.timeoutMs}
          websocket={websocket}
        />
      );
      return acc;
    }

    if (props.type === "clarifyingQuestion") {
      acc.push(
        <ClarifyingQuestionCard
          key={`clarify-${props.requestId}`}
          requestId={props.requestId}
          questions={props.questions}
          allowSkip={props.allowSkip}
          timeoutMs={props.timeoutMs}
          websocket={websocket}
        />
      );
      return acc;
    }

    if (props.type === "rechartVisualize" && !!props.content) {
      acc.push(<Chartable key={props.uuid} props={props} />);
    } else if (props.type === "fileDownloadCard" && !!props.content) {
      acc.push(<FileDownloadCard key={props.uuid} props={props} />);
    } else if (props.type === "scheduledJobCreated" && !!props.content) {
      acc.push(<ScheduledJobCreatedCard key={props.uuid} props={props} />);
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
          key={index}
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
          clarifyingQuestions={props.clarifyingQuestions}
        />
      );
    }
    return acc;
  }, []);
}

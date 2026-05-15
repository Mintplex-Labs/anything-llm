import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useMemo,
  forwardRef,
} from "react";
import HistoricalMessage from "./HistoricalMessage";
import AssistantTurn from "./AssistantTurn";
import { useManageWorkspaceModal } from "../../../Modals/ManageWorkspace";
import ManageWorkspace from "../../../Modals/ManageWorkspace";
import { ArrowDown } from "@phosphor-icons/react";
import debounce from "lodash.debounce";
import Workspace from "@/models/workspace";
import { useParams } from "react-router-dom";
import paths from "@/utils/paths";
import Appearance from "@/models/appearance";
import useTextSize from "@/hooks/useTextSize";
import useChatHistoryScrollHandle from "@/hooks/useChatHistoryScrollHandle";
import { ThoughtExpansionProvider } from "./ThoughtContainer";
import { MessageActionsProvider } from "./MessageActionsContext";
import { useChatThreadDrafts } from "@/contexts/ChatThreadDraftProvider";
import { debugChatTurn } from "@/utils/chat/debug";

export default forwardRef(function (
  {
    items = [],
    workspace,
    sendCommand,
    regenerateAssistantMessage,
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
  const isStreaming = items.some(
    (item) => item.type === "assistant_turn" && item.status === "running"
  );
  const { showScrollbar } = Appearance.getSettings();
  const { textSizeClass } = useTextSize();
  const { updateAssistantTurn, updateUserItem } = useChatThreadDrafts();

  useEffect(() => {
    const assistantTurns = items
      .filter((item) => item.type === "assistant_turn")
      .map((item) => ({
        turnId: item.turnId,
        status: item.status,
        finalContentLength: item.finalContent?.length || 0,
        timelineEventCount: item.timeline?.length || 0,
      }));
    debugChatTurn("ChatHistory:renderState", {
      chatKey,
      isStreaming,
      itemCount: items.length,
      runningTurnIds: assistantTurns
        .filter((item) => item.status === "running")
        .map((item) => item.turnId),
      lastAssistantTurn: assistantTurns[assistantTurns.length - 1] || null,
    });
  }, [chatKey, isStreaming, items]);

  useEffect(() => {
    if (suppressAutoScrollRef.current) {
      suppressAutoScrollRef.current = false;
      return;
    }
    if (!isUserScrolling && (isAtBottom || isStreaming)) {
      scrollToBottom(false);
    }
  }, [items, isAtBottom, isStreaming, isUserScrolling]);

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

    if (Math.abs(scrollTop - lastScrollTopRef.current) > 10) {
      setIsUserScrolling(!isBottom);
    }

    setIsAtBottom(isBottom);
    lastScrollTopRef.current = scrollTop;
  };

  const debouncedScroll = useMemo(() => debounce(handleScroll, 100), [chatKey]);

  useEffect(() => {
    const chatHistoryElement = chatHistoryRef.current;
    if (chatHistoryElement) {
      chatHistoryElement.addEventListener("scroll", debouncedScroll);
      return () =>
        chatHistoryElement.removeEventListener("scroll", debouncedScroll);
    }
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
    if (!editedMessage || !chatKey) return;

    if (role === "user" && saveOnly) {
      updateUserItem(chatKey, chatId, { content: editedMessage });
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
      updateUserItem(chatKey, chatId, { content: editedMessage });
      await Workspace.deleteEditedChats(workspace.slug, threadSlug, chatId);
      sendCommand({
        text: editedMessage,
        autoSubmit: true,
        history: [],
        attachments,
      });
      return;
    }

    if (role === "assistant") {
      const target = items.find(
        (item) => item.type === "assistant_turn" && item.chatId === chatId
      );
      if (!target) return;
      updateAssistantTurn(chatKey, target.turnId, {
        finalContent: editedMessage,
      });
      await Workspace.updateChat(
        workspace.slug,
        threadSlug,
        chatId,
        editedMessage
      );
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

  const itemById = useMemo(
    () => new Map(items.map((item) => [item.id, item])),
    [items]
  );
  const lastAssistantTurnId = [...items]
    .reverse()
    .find((item) => item.type === "assistant_turn")?.id;

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
            {items.map((item) => {
              if (item.type === "user") {
                return (
                  <HistoricalMessage
                    key={item.id}
                    uuid={item.id}
                    message={item.content}
                    role="user"
                    workspace={workspace}
                    chatId={item.chatId}
                    attachments={item.attachments}
                    saveEditedMessage={saveEditedMessage}
                    forkThread={forkThread}
                  />
                );
              }

              if (item.type === "assistant_turn") {
                return (
                  <AssistantTurn
                    key={item.id}
                    turn={item}
                    userItem={itemById.get(item.userMessageId)}
                    workspace={workspace}
                    chatKey={chatKey}
                    approvalState={approvalState}
                    onToolApprovalResponse={onToolApprovalResponse}
                    regenerateMessage={regenerateAssistantMessage}
                    saveEditedMessage={saveEditedMessage}
                    forkThread={forkThread}
                    isLastMessage={item.id === lastAssistantTurnId}
                  />
                );
              }

              return null;
            })}
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

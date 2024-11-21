import React, { useEffect, useRef, useState } from "react";
import HistoricalMessage from "./HistoricalMessage";
import PromptReply from "./PromptReply";
import { useManageWorkspaceModal } from "../../../Modals/ManageWorkspace";
import ManageWorkspace from "../../../Modals/ManageWorkspace";
import { ArrowDown } from "@phosphor-icons/react";
import debounce from "lodash.debounce";
import useUser from "@/hooks/useUser";
import Chartable from "./Chartable";
import Workspace from "@/models/workspace";
import { useParams } from "react-router-dom";
import paths from "@/utils/paths";
import Appearance from "@/models/appearance";
import useTextSize from "@/hooks/useTextSize";

export default function ChatHistory({
  history = [],
  workspace,
  sendCommand,
  updateHistory,
  regenerateAssistantMessage,
  hasAttachments = false,
}) {
  const lastScrollTopRef = useRef(0);
  const { user } = useUser();
  const { threadSlug = null } = useParams();
  const { showing, showModal, hideModal } = useManageWorkspaceModal();
  const [isAtBottom, setIsAtBottom] = useState(true);
  const chatHistoryRef = useRef(null);
  const [isUserScrolling, setIsUserScrolling] = useState(false);
  const isStreaming = history[history.length - 1]?.animate;
  const { showScrollbar } = Appearance.getSettings();
  const { textSizeClass } = useTextSize();

  useEffect(() => {
    if (!isUserScrolling && (isAtBottom || isStreaming)) {
      scrollToBottom(false); // Use instant scroll for auto-scrolling
    }
  }, [history, isAtBottom, isStreaming, isUserScrolling]);

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    const isBottom = scrollHeight - scrollTop === clientHeight;

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

  const handleSendSuggestedMessage = (heading, message) => {
    sendCommand(`${heading} ${message}`, true);
  };

  const saveEditedMessage = async ({
    editedMessage,
    chatId,
    role,
    attachments = [],
  }) => {
    if (!editedMessage) return; // Don't save empty edits.

    // if the edit was a user message, we will auto-regenerate the response and delete all
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
      sendCommand(editedMessage, true, updatedHistory, attachments);
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
      await Workspace.updateChatResponse(
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

  if (history.length === 0 && !hasAttachments) {
    return (
      <div className="flex flex-col h-full md:mt-0 pb-44 md:pb-40 w-full justify-end items-center">
        <div className="flex flex-col items-center md:items-start md:max-w-[600px] w-full px-4">
          <p className="text-white/60 text-lg font-base py-4">
            Welcome to your new workspace.
          </p>
          {!user || user.role !== "default" ? (
            <p className="w-full items-center text-white/60 text-lg font-base flex flex-col md:flex-row gap-x-1">
              To get started either{" "}
              <span
                className="underline font-medium cursor-pointer"
                onClick={showModal}
              >
                upload a document
              </span>
              or <b className="font-medium italic">send a chat.</b>
            </p>
          ) : (
            <p className="w-full items-center text-white/60 text-lg font-base flex flex-col md:flex-row gap-x-1">
              To get started <b className="font-medium italic">send a chat.</b>
            </p>
          )}
          <WorkspaceChatSuggestions
            suggestions={workspace?.suggestedMessages ?? []}
            sendSuggestion={handleSendSuggestedMessage}
          />
        </div>
        {showing && (
          <ManageWorkspace
            hideModal={hideModal}
            providedSlug={workspace.slug}
          />
        )}
      </div>
    );
  }

  return (
    <div
      className={`markdown text-white/80 light:text-theme-text-primary font-light ${textSizeClass} h-full md:h-[83%] pb-[100px] pt-6 md:pt-0 md:pb-20 md:mx-0 overflow-y-scroll flex flex-col justify-start ${
        showScrollbar ? "show-scrollbar" : "no-scroll"
      }`}
      id="chat-history"
      ref={chatHistoryRef}
      onScroll={handleScroll}
    >
      {history.map((props, index) => {
        const isLastBotReply =
          index === history.length - 1 && props.role === "assistant";

        if (props?.type === "statusResponse" && !!props.content) {
          return <StatusResponse key={props.uuid} props={props} />;
        }

        if (props.type === "rechartVisualize" && !!props.content) {
          return (
            <Chartable key={props.uuid} workspace={workspace} props={props} />
          );
        }

        if (isLastBotReply && props.animate) {
          return (
            <PromptReply
              key={props.uuid}
              uuid={props.uuid}
              reply={props.content}
              pending={props.pending}
              sources={props.sources}
              error={props.error}
              workspace={workspace}
              closed={props.closed}
            />
          );
        }

        return (
          <HistoricalMessage
            key={index}
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
          />
        );
      })}
      {showing && (
        <ManageWorkspace hideModal={hideModal} providedSlug={workspace.slug} />
      )}
      {!isAtBottom && (
        <div className="fixed bottom-40 right-10 md:right-20 z-50 cursor-pointer animate-pulse">
          <div className="flex flex-col items-center">
            <div
              className="p-1 rounded-full border border-white/10 bg-white/10 hover:bg-white/20 hover:text-white"
              onClick={() => {
                scrollToBottom(true);
                setIsUserScrolling(false);
              }}
            >
              <ArrowDown weight="bold" className="text-white/60 w-5 h-5" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatusResponse({ props }) {
  return (
    <div className="flex justify-center items-end w-full">
      <div className="py-2 px-4 w-full flex gap-x-5 md:max-w-[80%] flex-col">
        <div className="flex gap-x-5">
          <span
            className={`text-xs inline-block p-2 rounded-lg text-white/60 font-mono whitespace-pre-line`}
          >
            {props.content}
          </span>
        </div>
      </div>
    </div>
  );
}

function WorkspaceChatSuggestions({ suggestions = [], sendSuggestion }) {
  if (suggestions.length === 0) return null;
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-theme-text-primary text-xs mt-10 w-full justify-center">
      {suggestions.map((suggestion, index) => (
        <button
          key={index}
          className="text-left p-2.5 rounded-xl bg-theme-sidebar-footer-icon hover:bg-theme-sidebar-footer-icon-hover border border-theme-border"
          onClick={() => sendSuggestion(suggestion.heading, suggestion.message)}
        >
          <p className="font-semibold">{suggestion.heading}</p>
          <p>{suggestion.message}</p>
        </button>
      ))}
    </div>
  );
}

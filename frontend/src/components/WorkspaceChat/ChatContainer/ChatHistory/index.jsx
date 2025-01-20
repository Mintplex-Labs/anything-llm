import React, { useEffect, useRef, useState } from "react";
import HistoricalMessage from "./HistoricalMessage";
import PromptReply from "./PromptReply";
import { useManageWorkspaceModal } from "../../../Modals/ManageWorkspace";
import ManageWorkspace from "../../../Modals/ManageWorkspace";
import { ArrowDown, CircleNotch, CaretDown, Check } from "@phosphor-icons/react";
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
  const [statusResponses, setStatusResponses] = useState([]);
  const [isStatusActive, setIsStatusActive] = useState(false);

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

  // Update status responses when history changes
  useEffect(() => {
    const latestStatus = history.filter(msg => msg?.type === "statusResponse" && !!msg.content);
    if (latestStatus.length > 0) {
      setStatusResponses(prev => [...new Set([...prev, ...latestStatus.map(s => s.content)])]);
      setIsStatusActive(true);
    } else {
      setIsStatusActive(false);
    }
  }, [history]);

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

        // Create an array of elements to render for this iteration
        const elements = [];

        if (props.type === "rechartVisualize" && !!props.content) {
          elements.push(
            <Chartable key={props.uuid} workspace={workspace} props={props} />
          );
        } else if (isLastBotReply && props.animate) {
          elements.push(
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
        } else if (props?.type !== "statusResponse") {
          elements.push(
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
              metrics={props.metrics}
            />
          );
        }

        // If this message triggered the agent and it's active, add the StatusResponse
        if (props.role === "user" &&
            history[index + 1]?.type === "statusResponse" &&
            isStatusActive) {
          elements.push(
            <StatusResponse
              key={`status-${index}`}
              props={{
                content: statusResponses[statusResponses.length - 1],
                pending: history[history.length - 1]?.type === "statusResponse",
                isLastMessage: true,
                previousThoughts: statusResponses.slice(0, -1)
              }}
            />
          );
        }

        return elements;
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
  const [isThinking, setIsThinking] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showCheckmark, setShowCheckmark] = useState(false);

  useEffect(() => {
    setIsThinking(!!props.pending);

    if (!props.pending && props.isLastMessage) {
      setShowCheckmark(true);
      setTimeout(() => setShowCheckmark(false), 2000);
    }
  }, [props.content, props.pending, props.isLastMessage]);

  return (
    <div className="flex justify-center items-end w-full">
      <div className="py-2 px-4 w-full flex gap-x-5 md:max-w-[80%] flex-col relative">
        {/* Single thought bar that updates */}
        <div className="bg-theme-bg-chat-input hover:bg-theme-sidebar-item-hover rounded-full py-2 px-4 flex items-center gap-x-3 transition-all duration-200 border border-theme-sidebar-border">
          <span className="animate-bounce-subtle">💭</span>
          <div className="flex-1 overflow-hidden">
            <span
              key={props.content}
              className="text-xs text-theme-text-secondary font-mono inline-block w-full animate-thoughtTransition"
            >
              {props.content}
            </span>
          </div>
          <div className="flex items-center gap-x-2">
            {isThinking ? (
              <CircleNotch
                className="w-4 h-4 text-theme-text-secondary animate-spin"
                aria-label="Agent is thinking..."
              />
            ) : showCheckmark ? (
              <Check
                className="w-4 h-4 text-green-400 transition-all duration-300"
                aria-label="Thought complete"
              />
            ) : null}
            {props.previousThoughts?.length > 0 && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-theme-text-secondary hover:text-theme-text-primary transition-colors p-1 rounded-full hover:bg-theme-sidebar-item-hover"
                aria-label={isExpanded ? "Hide previous thoughts" : "Show previous thoughts"}
              >
                <CaretDown
                  className={`w-4 h-4 transform transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                />
              </button>
            )}
          </div>
        </div>

        {/* Previous thoughts dropdown */}
        {props.previousThoughts?.length > 0 && (
          <div
            className={`mt-2 bg-theme-bg-chat-input backdrop-blur-sm rounded-lg overflow-hidden transition-all duration-300 border border-theme-sidebar-border ${
              isExpanded ? 'max-h-[300px] opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            <div className="p-2 space-y-2">
              {props.previousThoughts.map((thought, index) => (
                <div
                  key={index}
                  className="flex items-center gap-x-3 p-2 rounded-lg bg-theme-sidebar-item-default animate-fadeUpIn"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <span>💭</span>
                  <span className="text-xs text-theme-text-secondary font-mono">
                    {thought}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
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

import { useMemo, useCallback, forwardRef } from "react";
import HistoricalMessage from "./HistoricalMessage";
import PromptReply from "./PromptReply";
import StatusResponse from "./StatusResponse";
import ToolApprovalRequest from "./ToolApprovalRequest";
import ClarifyingQuestionCard from "./ClarifyingQuestion";
import FileDownloadCard from "./FileDownloadCard";
import ImageGenerationPending from "./ImageGenerationPending";
import ScheduledJobCreatedCard from "./ScheduledJobCreatedCard";
import { useManageWorkspaceModal } from "../../../Modals/ManageWorkspace";
import ManageWorkspace from "../../../Modals/ManageWorkspace";
import { ArrowDown } from "@phosphor-icons/react";
import Chartable from "./Chartable";
import ModelRouteNotification from "./ModelRouteNotification";
import Workspace from "@/models/workspace";
import { useNavigate, useParams } from "react-router-dom";
import paths from "@/utils/paths";
import { THREAD_FORK_EVENT } from "@/components/Sidebar/ActiveWorkspaces/ThreadContainer";
import Appearance from "@/models/appearance";
import useTextSize from "@/hooks/useTextSize";
import useAutoScroll from "@/hooks/useAutoScroll";
import {
  ThoughtExpansionProvider,
  THOUGHT_REGEX_OPEN,
  THOUGHT_REGEX_CLOSE,
  THOUGHT_REGEX_COMPLETE,
} from "./ThoughtContainer";
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
  const { chatHistoryRef, isAtBottom, scrollToBottom, scrollHandlers } =
    useAutoScroll(history, ref);
  const navigate = useNavigate();
  const { threadSlug = null } = useParams();
  const { showing, hideModal } = useManageWorkspaceModal();
  const { showScrollbar } = Appearance.getSettings();
  const { textSizeClass } = useTextSize();

  const saveEditedMessage = useCallback(
    async ({
      editedMessage,
      chatId,
      role,
      attachments = [],
      saveOnly = false,
    }) => {
      if (!editedMessage) return;

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

      if (role === "user") {
        const updatedHistory = history.slice(
          0,
          history.findIndex((msg) => msg.chatId === chatId) + 1
        );
        updatedHistory[updatedHistory.length - 1].content = editedMessage;
        await Workspace.deleteEditedChats(workspace.slug, threadSlug, chatId);
        sendCommand({
          text: editedMessage,
          autoSubmit: true,
          history: updatedHistory,
          attachments,
        });
        return;
      }

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
    },
    [workspace.slug, threadSlug, updateHistory, history, sendCommand]
  );

  const forkThread = useCallback(
    async (chatId) => {
      const newThreadSlug = await Workspace.forkThread(
        workspace.slug,
        threadSlug,
        chatId
      );
      // Surface the fork in the sidebar first - if the navigation below gets
      // blocked (ActiveGenerationGuard) and cancelled, the new thread still
      // exists and stays reachable. Router navigation so the guard can
      // intercept while a response is generating.
      window.dispatchEvent(
        new CustomEvent(THREAD_FORK_EVENT, {
          detail: { threadSlug: newThreadSlug },
        })
      );
      navigate(paths.workspace.thread(workspace.slug, newThreadSlug));
    },
    [workspace.slug, threadSlug, navigate]
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
  // A chain stays animated while the run feeding it is still live: an open
  // agent websocket session, or an HTTP reply still streaming (animate flag).
  // Gating on liveness keeps a chain that ends up last (aborted/errored run,
  // stopped agent, reloaded history) from showing a working state forever,
  // while covering the gaps between activities (thought closed, tool still
  // running, next status not yet arrived).
  const isLastMessageAnimating = !!history?.[history.length - 1]?.animate;
  const runIsLive = !!websocket || isLastMessageAnimating;
  const renderStatusResponse = useCallback(
    (item, index) => {
      const hasSubsequentMessages = index < compiledHistory.length - 1;
      return (
        <StatusResponse
          // Keyed by the first node so a chain keeps its own client-side
          // timing state when items above it are removed (regenerate, the
          // content-less message sweeps) and compiled indexes shift.
          key={item[0]?.uuid ?? `status-group-${index}`}
          messages={item}
          isLastGroup={!hasSubsequentMessages}
          isThinking={!hasSubsequentMessages && runIsLive}
        />
      );
    },
    [compiledHistory.length, runIsLive]
  );

  return (
    <MessageActionsProvider>
      <ThoughtExpansionProvider>
        <div
          className={`markdown text-white/80 light:text-theme-text-primary font-light ${textSizeClass} h-full md:h-[83%] pb-[100px] pt-6 md:pt-0 md:pb-20 md:mx-0 overflow-y-scroll flex flex-col items-center justify-start ${showScrollbar ? "show-scrollbar" : "no-scroll"}`}
          id="chat-history"
          ref={chatHistoryRef}
          {...scrollHandlers}
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
                onClick={() => scrollToBottom(true)}
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
      pushActivity(acc, props);
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
    } else if (props.type === "imageGenerationPending") {
      acc.push(
        <ImageGenerationPending
          key={`img-pending-${props.uuid || index}`}
          aborted={props.closed}
        />
      );
    } else {
      // Assistant replies can carry a <think> segment. Split it into the
      // activity chain so it rolls up with any surrounding agent statuses;
      // only the visible remainder renders as an actual message, which is
      // what breaks the chain.
      if (props.role === "assistant" && typeof props.content === "string") {
        const { thought, hasVisible } = splitAssistantThought(props);
        if (thought) {
          pushActivity(acc, {
            type: "thoughtChain",
            uuid: props.uuid ? `thought-${props.uuid}` : undefined,
            content: thought,
          });
        }
        if (!hasVisible) return acc;
      }

      if (isLastBotReply && props.animate) {
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
    }
    return acc;
  }, []);
}

/**
 * Appends an activity node (agent status or thought segment) to the current
 * activity chain, or starts a new chain when the previous compiled item is a
 * visible message/card - visible content is what breaks a chain.
 * @param {Array} acc - the compiled history being built
 * @param {Object} node - statusResponse history item or thoughtChain node
 */
function pushActivity(acc, node) {
  if (acc.length > 0 && Array.isArray(acc[acc.length - 1])) {
    acc[acc.length - 1].push(node);
  } else {
    acc.push([node]);
  }
}

/**
 * Splits an assistant message into its thought segment (if any) and reports
 * whether anything visible remains to render as a message. A message with an
 * open think tag and no close is mid-thought: the whole content is thought.
 * `hasVisible` stays true for messages that carry other renderable payloads
 * (citations, attachments, outputs, errors, the pending placeholder) even
 * when the text itself is empty.
 * @param {Object} props - the history item
 * @returns {{thought: string|null, hasVisible: boolean}}
 */
function splitAssistantThought(props) {
  const content = props.content;
  let thought = null;
  const complete = content.match(THOUGHT_REGEX_COMPLETE);
  if (complete) thought = complete[0];
  else if (
    content.match(THOUGHT_REGEX_OPEN) &&
    !content.match(THOUGHT_REGEX_CLOSE)
  )
    thought = content;

  const visibleText =
    thought === null
      ? content
      : thought === content
        ? ""
        : content.replace(THOUGHT_REGEX_COMPLETE, "");
  const hasVisible =
    visibleText.trim().length > 0 ||
    !!props.pending ||
    !!props.error ||
    (props.sources?.length ?? 0) > 0 ||
    (props.attachments?.length ?? 0) > 0 ||
    (props.outputs?.length ?? 0) > 0 ||
    (props.clarifyingQuestions?.length ?? 0) > 0;
  return { thought, hasVisible };
}

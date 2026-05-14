import { memo, useMemo } from "react";
import { Warning } from "@phosphor-icons/react";
import Citations from "../Citation";
import Actions from "../HistoricalMessage/Actions";
import TTSMessage from "../HistoricalMessage/Actions/TTSButton";
import HistoricalOutputs from "../HistoricalMessage/HistoricalOutputs";
import {
  EditMessageForm,
  useEditMessage,
} from "../HistoricalMessage/Actions/EditMessage";
import { useWatchDeleteMessage } from "../HistoricalMessage/Actions/DeleteMessage";
import { chatQueryRefusalResponse } from "@/utils/chat";
import paths from "@/utils/paths";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import MarkdownOutput from "./MarkdownOutput";
import ThoughtTimeline from "./ThoughtTimeline";
import ToolEvent from "./ToolEvent";

function AssistantTurn({
  turn,
  workspace,
  chatKey,
  approvalState = null,
  onToolApprovalResponse,
  regenerateMessage,
  saveEditedMessage,
  forkThread,
  isLastMessage = false,
}) {
  const { t } = useTranslation();
  const { isEditing } = useEditMessage({
    chatId: turn.chatId,
    role: "assistant",
  });
  const { isDeleted, completeDelete, onEndAnimation } = useWatchDeleteMessage({
    chatId: turn.chatId,
    role: "assistant",
  });
  const thoughts = useMemo(
    () =>
      (turn.timeline || []).filter((event) =>
        ["thought", "markdown_delta"].includes(event.type)
      ),
    [turn.timeline]
  );
  const approvalResults = useMemo(
    () =>
      new Map(
        (turn.timeline || [])
          .filter((event) => event.type === "approval_result")
          .map((event) => [event.requestId, event])
      ),
    [turn.timeline]
  );
  const toolEvents = useMemo(
    () =>
      (turn.timeline || []).filter((event) =>
        [
          "tool_call",
          "tool_result",
          "approval_request",
          "approval_result",
          "error",
        ].includes(event.type)
      ),
    [turn.timeline]
  );
  const isRunning = turn.status === "running";
  const isFailed = turn.status === "failed";
  const isRefusalMessage =
    turn.finalContent === chatQueryRefusalResponse(workspace);

  if (completeDelete) return null;

  function adjustTextArea(event) {
    const element = event.target;
    element.style.height = "auto";
    element.style.height = element.scrollHeight + "px";
  }

  return (
    <div
      onAnimationEnd={onEndAnimation}
      className={`${isDeleted ? "animate-remove" : ""} flex justify-start w-full group`}
    >
      <div className="py-4 px-4 md:pl-0 flex flex-col w-full">
        <ThoughtTimeline events={thoughts} isRunning={isRunning} />
        {toolEvents.map((event) => (
          <ToolEvent
            key={event.id}
            event={event}
            approvalResult={approvalResults.get(event.requestId)}
            approvalState={approvalState}
            chatKey={chatKey}
            onToolApprovalResponse={onToolApprovalResponse}
          />
        ))}
        {isEditing ? (
          <EditMessageForm
            role="assistant"
            chatId={turn.chatId}
            message={turn.finalContent}
            adjustTextArea={adjustTextArea}
            saveChanges={saveEditedMessage}
          />
        ) : (
          <div className="break-words">
            {turn.finalContent ? (
              <MarkdownOutput content={turn.finalContent} messageId={turn.id} />
            ) : isRunning ? (
              <div className="mt-3 ml-1 dot-falling light:invert" />
            ) : null}
            {isRefusalMessage && (
              <Link
                data-tooltip-id="query-refusal-info"
                data-tooltip-content={`${t("chat.refusal.tooltip-description")}`}
                className="!no-underline group !flex w-fit"
                to={paths.chatModes()}
                target="_blank"
              >
                <div className="flex flex-row items-center gap-x-1 group-hover:opacity-100 opacity-60 w-fit">
                  <p className="!m-0 !p-0 text-theme-text-secondary !no-underline text-xs cursor-pointer">
                    {t("chat.refusal.tooltip-title")}
                  </p>
                </div>
              </Link>
            )}
            <HistoricalOutputs outputs={turn.outputs || []} />
          </div>
        )}
        {isFailed && (
          <div className="mt-2 p-2 rounded-lg bg-red-50 text-red-500 w-fit">
            <span className="inline-flex items-center gap-1">
              <Warning className="h-4 w-4" /> Could not respond to message.
            </span>
            {turn.error && (
              <p className="text-xs font-mono mt-2 border-l-2 border-red-300 pl-2 bg-red-200 p-2 rounded-sm">
                {turn.error}
              </p>
            )}
          </div>
        )}
        <div className="flex items-start md:items-center gap-x-1">
          <TTSMessage
            slug={workspace?.slug}
            chatId={turn.chatId}
            message={turn.finalContent}
          />
          <Actions
            message={turn.finalContent}
            feedbackScore={turn.feedbackScore}
            chatId={turn.chatId}
            slug={workspace?.slug}
            isLastMessage={isLastMessage}
            regenerateMessage={regenerateMessage}
            isEditing={isEditing}
            role="assistant"
            forkThread={forkThread}
            metrics={turn.metrics}
          />
        </div>
        <Citations sources={turn.sources} />
      </div>
    </div>
  );
}

export default memo(AssistantTurn);

import React, { memo, useState } from "react";
import useCopyText from "@/hooks/useCopyText";
import {
  Check,
  ThumbsUp,
  ThumbsDown,
  ArrowsClockwise,
  Copy,
  GitMerge,
} from "@phosphor-icons/react";
import { Tooltip } from "react-tooltip";
import Workspace from "@/models/workspace";
import TTSMessage from "./TTSButton";
import { EditMessageAction } from "./EditMessage";

const Actions = ({
  message,
  feedbackScore,
  chatId,
  slug,
  isLastMessage,
  regenerateMessage,
  forkThread,
  isEditing,
  role,
}) => {
  const [selectedFeedback, setSelectedFeedback] = useState(feedbackScore);
  const handleFeedback = async (newFeedback) => {
    const updatedFeedback =
      selectedFeedback === newFeedback ? null : newFeedback;
    await Workspace.updateChatFeedback(chatId, slug, updatedFeedback);
    setSelectedFeedback(updatedFeedback);
  };

  return (
    <div className="flex w-full justify-between items-center">
      <div className="flex justify-start items-center gap-x-4 group">
        <CopyMessage message={message} />
        <ForkThread
          chatId={chatId}
          forkThread={forkThread}
          isEditing={isEditing}
          role={role}
        />
        <EditMessageAction chatId={chatId} role={role} isEditing={isEditing} />
        {isLastMessage && !isEditing && (
          <RegenerateMessage
            regenerateMessage={regenerateMessage}
            slug={slug}
            chatId={chatId}
          />
        )}
        {chatId && role !== "user" && !isEditing && (
          <FeedbackButton
            isSelected={selectedFeedback === true}
            handleFeedback={() => handleFeedback(true)}
            tooltipId={`${chatId}-thumbs-up`}
            tooltipContent="Good response"
            IconComponent={ThumbsUp}
          />
        )}
      </div>
      <TTSMessage slug={slug} chatId={chatId} message={message} />
    </div>
  );
};

function FeedbackButton({
  isSelected,
  handleFeedback,
  tooltipId,
  tooltipContent,
  IconComponent,
}) {
  return (
    <div className="mt-3 relative">
      <button
        onClick={handleFeedback}
        data-tooltip-id={tooltipId}
        data-tooltip-content={tooltipContent}
        className="text-zinc-300"
        aria-label={tooltipContent}
      >
        <IconComponent
          size={18}
          className="mb-1"
          weight={isSelected ? "fill" : "regular"}
        />
      </button>
      <Tooltip
        id={tooltipId}
        place="bottom"
        delayShow={300}
        className="tooltip !text-xs"
      />
    </div>
  );
}

function CopyMessage({ message }) {
  const { copied, copyText } = useCopyText();

  return (
    <>
      <div className="mt-3 relative">
        <button
          onClick={() => copyText(message)}
          data-tooltip-id="copy-assistant-text"
          data-tooltip-content="Copy"
          className="text-zinc-300"
          aria-label="Copy"
        >
          {copied ? (
            <Check size={18} className="mb-1" />
          ) : (
            <Copy size={18} className="mb-1" />
          )}
        </button>
        <Tooltip
          id="copy-assistant-text"
          place="bottom"
          delayShow={300}
          className="tooltip !text-xs"
        />
      </div>
    </>
  );
}

function RegenerateMessage({ regenerateMessage, chatId }) {
  if (!chatId) return null;
  return (
    <div className="mt-3 relative">
      <button
        onClick={() => regenerateMessage(chatId)}
        data-tooltip-id="regenerate-assistant-text"
        data-tooltip-content="Regenerate response"
        className="border-none text-zinc-300"
        aria-label="Regenerate"
      >
        <ArrowsClockwise size={18} className="mb-1" weight="fill" />
      </button>
      <Tooltip
        id="regenerate-assistant-text"
        place="bottom"
        delayShow={300}
        className="tooltip !text-xs"
      />
    </div>
  );
}
function ForkThread({ chatId, forkThread, isEditing, role }) {
  if (!chatId || isEditing || role === "user") return null;
  return (
    <div className="mt-3 relative">
      <button
        onClick={() => forkThread(chatId)}
        data-tooltip-id="fork-thread"
        data-tooltip-content="Fork chat to new thread"
        className="border-none text-zinc-300"
        aria-label="Fork"
      >
        <GitMerge size={18} className="mb-1" weight="fill" />
      </button>
      <Tooltip
        id="fork-thread"
        place="bottom"
        delayShow={300}
        className="tooltip !text-xs"
      />
    </div>
  );
}

export default memo(Actions);

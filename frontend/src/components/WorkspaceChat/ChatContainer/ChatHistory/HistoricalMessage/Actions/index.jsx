import React, { memo, useState } from "react";
import useCopyText from "@/hooks/useCopyText";
import {
  Check,
  ClipboardText,
  ThumbsUp,
  ThumbsDown,
} from "@phosphor-icons/react";
import { Tooltip } from "react-tooltip";
import Workspace from "@/models/workspace";

const Actions = ({ message, feedbackScore, chatId, slug }) => {
  const [selectedFeedback, setSelectedFeedback] = useState(feedbackScore);

  const handleFeedback = async (newFeedback) => {
    const updatedFeedback =
      selectedFeedback === newFeedback ? null : newFeedback;
    await Workspace.updateChatFeedback(chatId, slug, updatedFeedback);
    setSelectedFeedback(updatedFeedback);
  };

  return (
    <div className="flex justify-start items-center gap-x-4">
      <CopyMessage message={message} />
      {chatId && (
        <>
          <FeedbackButton
            isSelected={selectedFeedback === true}
            handleFeedback={() => handleFeedback(true)}
            tooltipId={`${chatId}-thumbs-up`}
            tooltipContent="Good response"
            IconComponent={ThumbsUp}
          />
          <FeedbackButton
            isSelected={selectedFeedback === false}
            handleFeedback={() => handleFeedback(false)}
            tooltipId={`${chatId}-thumbs-down`}
            tooltipContent="Bad response"
            IconComponent={ThumbsDown}
          />
        </>
      )}
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
        >
          {copied ? (
            <Check size={18} className="mb-1" />
          ) : (
            <ClipboardText size={18} className="mb-1" />
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

export default memo(Actions);

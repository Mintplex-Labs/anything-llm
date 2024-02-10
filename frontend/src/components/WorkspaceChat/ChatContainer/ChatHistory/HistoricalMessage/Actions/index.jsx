import React, { memo, useState, useEffect } from "react";
import useCopyText from "@/hooks/useCopyText";
import {
  Check,
  ClipboardText,
  ThumbsUp,
  ThumbsDown,
} from "@phosphor-icons/react";
import { Tooltip } from "react-tooltip";
import Workspace from "@/models/workspace";

const Actions = ({ message, feedbackScore, chatId }) => {
  const [selectedFeedback, setSelectedFeedback] = useState(feedbackScore);
  const updateFeedback = async (newFeedback) => {
    if (selectedFeedback === newFeedback) {
      newFeedback = 0;
    }
    await Workspace.updateChatFeedback(chatId, newFeedback);
    setSelectedFeedback(newFeedback);
  };

  return (
    <div className="flex justify-start items-center gap-x-4">
      <FeedbackButton
        isSelected={selectedFeedback > 0}
        handleFeedback={() => updateFeedback(1)}
        tooltipId="thumbs-up"
        tooltipContent="Thumbs up"
        IconComponent={ThumbsUp}
      />
      <FeedbackButton
        isSelected={selectedFeedback < 0}
        handleFeedback={() => updateFeedback(-1)}
        tooltipId="thumbs-down"
        tooltipContent="Thumbs down"
        IconComponent={ThumbsDown}
      />
      <CopyMessage message={message} />
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

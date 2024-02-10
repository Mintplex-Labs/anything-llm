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
      <ThumbUp
        isSelected={selectedFeedback > 0}
        handleFeedback={() => updateFeedback(1)}
      />
      <ThumbDown
        isSelected={selectedFeedback < 0}
        handleFeedback={() => updateFeedback(-1)}
      />
      <CopyMessage message={message} />
    </div>
  );
};

function ThumbUp({ isSelected, handleFeedback }) {
  return (
    <div className="mt-3 relative">
      <button
        onClick={handleFeedback}
        data-tooltip-id="thumbs-up"
        data-tooltip-content="Thumbs up"
        className="text-zinc-300"
      >
        <ThumbsUp
          size={18}
          className="mb-1"
          weight={isSelected ? "fill" : "regular"}
        />
      </button>
      <Tooltip
        id="thumbs-up"
        place="bottom"
        delayShow={300}
        className="tooltip !text-xs"
      />
    </div>
  );
}

function ThumbDown({ isSelected, handleFeedback }) {
  return (
    <div className="mt-3 relative">
      <button
        onClick={handleFeedback}
        data-tooltip-id="thumbs-down"
        data-tooltip-content="Thumbs down"
        className="text-zinc-300"
      >
        <ThumbsDown
          size={18}
          className="mb-1"
          weight={isSelected ? "fill" : "regular"}
        />
      </button>
      <Tooltip
        id="thumbs-down"
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

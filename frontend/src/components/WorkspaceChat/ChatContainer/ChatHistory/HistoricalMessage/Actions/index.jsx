import React, { memo, useEffect, useState } from "react";
import useCopyText from "@/hooks/useCopyText";
import {
  Check,
  ClipboardText,
  ThumbsUp,
  ThumbsDown,
  ArrowsClockwise,
  SpeakerHigh,
  PauseCircle,
} from "@phosphor-icons/react";
import { Tooltip } from "react-tooltip";
import Workspace from "@/models/workspace";

const Actions = ({
  message,
  feedbackScore,
  chatId,
  slug,
  isLastMessage,
  regenerateMessage,
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
      <div className="flex justify-start items-center gap-x-4">
        <CopyMessage message={message} />
        {isLastMessage &&
          !message?.includes("Workspace chat memory was reset!") && (
            <RegenerateMessage
              regenerateMessage={regenerateMessage}
              slug={slug}
              chatId={chatId}
            />
          )}
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
      <TTSMessage message={message} />
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

function RegenerateMessage({ regenerateMessage, chatId }) {
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

function TTSMessage({ message }) {
  const [speaking, setSpeaking] = useState(false);
  const [supported, setSupported] = useState(false);
  useEffect(() => {
    setSupported("speechSynthesis" in window);
  }, []);

  function endSpeechUtterance() {
    window.speechSynthesis?.cancel();
    setSpeaking(false);
    return;
  }

  function speakMessage() {
    // if the user is pausing this particular message
    // while the synth if speaking we can end it.
    // If they are clicking another message's TTS
    // we need to ignore that until they pause the one that is playing.
    if (window.speechSynthesis.speaking && speaking) {
      endSpeechUtterance();
      return;
    }

    if (window.speechSynthesis.speaking && !speaking) return;
    const utterance = new SpeechSynthesisUtterance(message);
    utterance.addEventListener("end", endSpeechUtterance);
    window.speechSynthesis.speak(utterance);
    setSpeaking(true);
  }

  if (!supported) return null;
  return (
    <div className="mt-3 relative">
      <button
        onClick={speakMessage}
        data-tooltip-id="message-to-speech"
        data-tooltip-content={
          speaking ? "Pause TTS speech of message" : "TTS Speak message"
        }
        className="border-none text-zinc-300"
        aria-label={speaking ? "Pause speech" : "Speak message"}
      >
        {speaking ? (
          <PauseCircle size={18} className="mb-1" />
        ) : (
          <SpeakerHigh size={18} className="mb-1" />
        )}
      </button>
      <Tooltip
        id="message-to-speech"
        place="bottom"
        delayShow={300}
        className="tooltip !text-xs"
      />
    </div>
  );
}

export default memo(Actions);

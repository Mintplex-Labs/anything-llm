import React, { memo, useState } from "react";
import useCopyText from "@/hooks/useCopyText";
import { Check, ThumbsUp, ThumbsDown, ArrowsClockwise, Copy } from "@phosphor-icons/react";
import Workspace from "@/models/workspace";
import ChatFeedbackModal from "@/components/Modals/ChatFeedback";
import { EditMessageAction } from "./EditMessage";
import RenderMetrics from "./RenderMetrics";
import ActionMenu from "./ActionMenu";
import { useTranslation } from "react-i18next";

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
  metrics = {},
  alignmentCls = "",
}) => {
  const { t } = useTranslation();
  const [selectedFeedback, setSelectedFeedback] = useState(feedbackScore);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [submittingComment, setSubmittingComment] = useState(false);
  const handleFeedback = async (newFeedback) => {
    const updatedFeedback = selectedFeedback === newFeedback ? null : newFeedback;
    // persist feedback score first
    await Workspace.updateChatFeedback(chatId, slug, updatedFeedback);
    setSelectedFeedback(updatedFeedback);

    // If user just set negative feedback (not unsetting), show optional feedback modal
    if (updatedFeedback === false) {
      setShowFeedbackModal(true);
    }
  };

  return (
    <div className={`flex w-full justify-between items-center ${alignmentCls}`}>
      <div className="flex justify-start items-center gap-x-[8px]">
        <CopyMessage message={message} />
        <div className="md:group-hover:opacity-100 transition-all duration-300 md:opacity-0 flex justify-start items-center gap-x-[8px]">
          <EditMessageAction
            chatId={chatId}
            role={role}
            isEditing={isEditing}
          />
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
              tooltipId="feedback-button"
              tooltipContent={t("chat_window.good_response")}
              IconComponent={ThumbsUp}
            />
          )}
          {chatId && role !== "user" && !isEditing && (
            <FeedbackButton
              isSelected={selectedFeedback === false}
              handleFeedback={() => handleFeedback(false)}
              tooltipId="feedback-button"
              tooltipContent={t("chat_window.bad_response")}
              IconComponent={ThumbsDown}
            />
          )}
          <ActionMenu
            chatId={chatId}
            forkThread={forkThread}
            isEditing={isEditing}
            role={role}
          />
        </div>
      </div>
      <RenderMetrics metrics={metrics} />
      <ChatFeedbackModal
        isOpen={showFeedbackModal}
        hideModal={() => setShowFeedbackModal(false)}
        chatId={chatId}
        slug={slug}
        onSubmitted={async (comment) => {
          if (submittingComment) return;
          setSubmittingComment(true);
          try {
            await Workspace.submitChatFeedbackComment(chatId, slug, comment);
          } catch (e) {}
          setSubmittingComment(false);
        }}
      />
    </div>
  );
};

function FeedbackButton({
  isSelected,
  handleFeedback,
  tooltipContent,
  IconComponent,
}) {
  return (
    <div className="mt-3 relative">
      <button
        onClick={handleFeedback}
        data-tooltip-id="feedback-button"
        data-tooltip-content={tooltipContent}
        className="text-zinc-300"
        aria-label={tooltipContent}
      >
        <IconComponent
          color="var(--theme-sidebar-footer-icon-fill)"
          size={20}
          className="mb-1"
          weight={isSelected ? "fill" : "regular"}
        />
      </button>
    </div>
  );
}

function CopyMessage({ message }) {
  const { copied, copyText } = useCopyText();
  const { t } = useTranslation();

  return (
    <>
      <div className="mt-3 relative">
        <button
          onClick={() => copyText(message)}
          data-tooltip-id="copy-assistant-text"
          data-tooltip-content={t("chat_window.copy")}
          className="text-zinc-300"
          aria-label={t("chat_window.copy")}
        >
          {copied ? (
            <Check
              color="var(--theme-sidebar-footer-icon-fill)"
              size={20}
              className="mb-1"
            />
          ) : (
            <Copy
              color="var(--theme-sidebar-footer-icon-fill)"
              size={20}
              className="mb-1"
            />
          )}
        </button>
      </div>
    </>
  );
}

function RegenerateMessage({ regenerateMessage, chatId }) {
  if (!chatId) return null;
  const { t } = useTranslation();
  return (
    <div className="mt-3 relative">
      <button
        onClick={() => regenerateMessage(chatId)}
        data-tooltip-id="regenerate-assistant-text"
        data-tooltip-content={t("chat_window.regenerate_response")}
        className="border-none text-zinc-300"
        aria-label={t("chat_window.regenerate")}
      >
        <ArrowsClockwise
          color="var(--theme-sidebar-footer-icon-fill)"
          size={20}
          className="mb-1"
          weight="fill"
        />
      </button>
    </div>
  );
}

export default memo(Actions);


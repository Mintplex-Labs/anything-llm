import React, { useState } from "react";
import ModalWrapper from "@/components/ModalWrapper";
import { X } from "@phosphor-icons/react";
import Workspace from "@/models/workspace";
import { useTranslation } from "react-i18next";

export default function ChatFeedbackModal({
  isOpen,
  hideModal,
  chatId,
  slug,
  onSubmitted,
}) {
  const { t } = useTranslation();
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!chatId || !slug) {
      hideModal();
      return;
    }
    setSubmitting(true);
    try {
      // Only forward the comment to parent if there's content; feedback is optional
      if (comment && comment.trim() !== "") {
        onSubmitted && onSubmitted(comment.trim());
      }
    } catch (err) {
      // ignore errors for now
    }
    setSubmitting(false);
    hideModal();
  };

  return (
    <ModalWrapper isOpen={isOpen}>
      <div className="w-full max-w-lg bg-theme-bg-secondary rounded-lg shadow border-2 border-theme-modal-border overflow-hidden">
        <div className="relative p-6 border-b rounded-t border-theme-modal-border">
          <div className="w-full flex gap-x-2 items-center">
            <h3 className="text-xl font-semibold text-white overflow-hidden overflow-ellipsis whitespace-nowrap">
              {t("chat_window.provide_feedback")}
            </h3>
          </div>
          <button
            onClick={hideModal}
            type="button"
            className="absolute top-4 right-4 transition-all duration-300 bg-transparent rounded-lg text-sm p-1 inline-flex items-center hover:bg-theme-modal-border hover:border-theme-modal-border hover:border-opacity-50 border-transparent border"
          >
            <X size={24} weight="bold" className="text-white" />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="py-7 px-9 space-y-2">
            <p className="text-sm text-theme-settings-input-placeholder">
              {t("chat_window.bad_response_optional_feedback")}
            </p>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full min-h-[120px] p-3 rounded bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder outline-none"
              placeholder={t("chat_window.bad_response_placeholder")}
            />
          </div>
          <div className="flex w-full justify-end items-center p-6 space-x-2 border-t border-theme-modal-border rounded-b">
            <button
              type="button"
              onClick={hideModal}
              className="transition-all duration-300 bg-transparent border border-theme-modal-border text-white hover:opacity-60 px-4 py-2 rounded-lg text-sm"
            >
              {t("chat_window.cancel")}
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="transition-all duration-300 bg-white text-black hover:opacity-60 px-4 py-2 rounded-lg text-sm"
            >
              {submitting ? t("common.saving") : t("common.save")}
            </button>
          </div>
        </form>
      </div>
    </ModalWrapper>
  );
}

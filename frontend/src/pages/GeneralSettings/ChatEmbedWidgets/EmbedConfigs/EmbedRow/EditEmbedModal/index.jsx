import React, { useState } from "react";
import { X, Warning } from "@phosphor-icons/react";
import ConfirmDeleteModal from "@/components/ConfirmDeleteModal";
import {
  BooleanInput,
  ChatModeSelection,
  NumberInput,
  PermittedDomains,
  WorkspaceSelection,
  enforceSubmissionSchema,
} from "../../NewEmbedModal";
import Embed from "@/models/embed";
import showToast from "@/utils/toast";
import { safeJsonParse } from "@/utils/request";
import { useTranslation } from "react-i18next";

export default function EditEmbedModal({ embed, closeModal }) {
  const { t } = useTranslation();
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleUpdate = async (e) => {
    setError(null);
    e.preventDefault();
    const form = new FormData(e.target);
    const data = enforceSubmissionSchema(form);
    const { success, error } = await Embed.updateEmbed(embed.id, data);
    if (success) {
      showToast(t("embed-modal.update-success"), "success", { clear: true });
      setTimeout(() => {
        window.location.reload();
      }, 800);
    }
    setError(error);
  };

  const handleClearChats = async () => {
    setDeleting(true);
    const { success, deletedCount, error } = await Embed.clearEmbedChats(embed.id);
    setDeleting(false);
    setShowDeleteModal(false);
    if (!success) {
      showToast(error || t("embed-modal.clear-error"), "error", { clear: true });
      return;
    }

    showToast(
      t("embed-modal.chats-cleared", { count: deletedCount }),
      "success",
      { clear: true }
    );
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  const chatCount = embed._count?.embed_chats || 0;

  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center">
      <div className="relative w-full max-w-2xl bg-theme-bg-secondary rounded-lg shadow border-2 border-theme-modal-border">
        <div className="relative p-6 border-b rounded-t border-theme-modal-border">
          <div className="w-full flex gap-x-2 items-center">
            <h3 className="text-xl font-semibold text-white overflow-hidden overflow-ellipsis whitespace-nowrap">
              {t("embed-modal.update-title")} #{embed.id}
            </h3>
          </div>
          <button
            onClick={closeModal}
            type="button"
            className="absolute top-4 right-4 transition-all duration-300 bg-transparent rounded-lg text-sm p-1 inline-flex items-center hover:bg-theme-modal-border hover:border-theme-modal-border hover:border-opacity-50 border-transparent border"
          >
            <X size={24} weight="bold" className="text-white" />
          </button>
        </div>
        <div className="px-7 py-6">
          <form onSubmit={handleUpdate}>
            <div className="space-y-6 max-h-[60vh] overflow-y-auto px-2">
              <WorkspaceSelection defaultValue={embed.workspace.id} />
              <ChatModeSelection defaultValue={embed.chat_mode} />
              <PermittedDomains
                defaultValue={
                  safeJsonParse(embed.allowlist_domains, null) || []
                }
              />
              <NumberInput
                name="max_chats_per_day"
                title={t("embed-modal.max-chats-day.label")}
                hint={t("embed-modal.max-chats-day.hint")}
                defaultValue={embed.max_chats_per_day}
              />
              <NumberInput
                name="max_chats_per_session"
                title={t("embed-modal.max-chats-session.label")}
                hint={t("embed-modal.max-chats-session.hint")}
                defaultValue={embed.max_chats_per_session}
              />
              <NumberInput
                name="message_limit"
                title={t("embed-modal.message-limit.label")}
                hint={t("embed-modal.message-limit.hint")}
                defaultValue={embed.message_limit}
              />
              <div className="flex flex-col gap-y-1">
                <div className="flex flex-col mb-2">
                  <label className="text-white text-sm font-semibold">
                    {t("embed-modal.chat-retention.label")}
                  </label>
                  <p className="text-theme-text-secondary text-xs">
                    {t("embed-modal.chat-retention.hint")}
                  </p>
                </div>
                <select
                  name="chat_retention_days"
                  defaultValue={embed.chat_retention_days || ""}
                  className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-[15rem] p-2.5"
                >
                  <option value="">
                    {t("embed-modal.chat-retention.never")}
                  </option>
                  <option value="7">
                    7 {t("embed-modal.chat-retention.days")}
                  </option>
                  <option value="30">
                    30 {t("embed-modal.chat-retention.days")}
                  </option>
                  <option value="90">
                    90 {t("embed-modal.chat-retention.days")}
                  </option>
                  <option value="180">
                    180 {t("embed-modal.chat-retention.days")}
                  </option>
                  <option value="365">
                    365 {t("embed-modal.chat-retention.days")}
                  </option>
                </select>
              </div>
              {chatCount > 0 && (
                <div className="flex flex-col gap-y-1">
                  <p className="text-theme-text-secondary text-xs">
                    {t("embed-modal.clear-chats-hint")}
                  </p>
                  <button
                    type="button"
                    onClick={() => setShowDeleteModal(true)}
                    className="flex items-center justify-center gap-x-2 px-4 py-2 rounded-lg border border-red-400 text-red-400 hover:border-transparent hover:text-white text-xs font-semibold hover:bg-red-500 transition-all duration-200 w-[15rem]"
                  >
                    <Warning size={16} weight="bold" />
                    {t("embed-modal.clear-chats-button", {
                      count: chatCount,
                    })}
                  </button>
                </div>
              )}
              <BooleanInput
                name="allow_model_override"
                title={t("embed-modal.model-override.label")}
                hint={t("embed-modal.model-override.hint")}
                defaultValue={embed.allow_model_override}
              />
              <BooleanInput
                name="allow_temperature_override"
                title={t("embed-modal.temperature-override.label")}
                hint={t("embed-modal.temperature-override.hint")}
                defaultValue={embed.allow_temperature_override}
              />
              <BooleanInput
                name="allow_prompt_override"
                title={t("embed-modal.prompt-override.label")}
                hint={t("embed-modal.prompt-override.hint")}
                defaultValue={embed.allow_prompt_override}
              />

              {error && (
                <p className="text-red-400 text-sm">
                  {t("common.error")}: {error}
                </p>
              )}
              <p
                className="text-white text-opacity-60 text-xs md:text-sm"
                dangerouslySetInnerHTML={{
                  __html: t("embed-modal.script-info"),
                }}
              />
            </div>
            <div className="flex justify-between items-center mt-6 pt-6 border-t border-theme-modal-border">
              <button
                onClick={closeModal}
                type="button"
                className="transition-all duration-300 text-white hover:bg-zinc-700 px-4 py-2 rounded-lg text-sm"
              >
                {t("embed-modal.cancel")}
              </button>
              <button
                type="submit"
                className="transition-all duration-300 bg-white text-black hover:opacity-60 px-4 py-2 rounded-lg text-sm"
              >
                {t("embed-modal.update-button")}
              </button>
            </div>
          </form>
        </div>
      </div>

      <ConfirmDeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleClearChats}
        title={t("embed-modal.clear-chats-button", { count: chatCount })}
        message={t("embed-modal.confirm-clear-chats", { count: chatCount })}
        loading={deleting}
      />
    </div>
  );
}

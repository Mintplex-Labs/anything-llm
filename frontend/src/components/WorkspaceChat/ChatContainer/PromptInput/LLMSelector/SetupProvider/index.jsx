import { createPortal } from "react-dom";
import ModalWrapper from "@/components/ModalWrapper";
import { X } from "@phosphor-icons/react";
import System from "@/models/system";
import showToast from "@/utils/toast";
import { useTranslation } from "react-i18next";

export default function SetupProvider({
  isOpen,
  closeModal,
  postSubmit,
  settings,
  llmProvider,
}) {
  if (!isOpen) return null;

  async function handleUpdate(e) {
    e.preventDefault();
    e.stopPropagation();
    const data = {};
    const form = new FormData(e.target);
    for (var [key, value] of form.entries()) data[key] = value;
    const { error } = await System.updateSystem(data);
    if (error) {
      showToast(
        `Failed to save ${llmProvider.name} settings: ${error}`,
        "error"
      );
      return;
    }

    closeModal();
    postSubmit();
    return false;
  }

  return createPortal(
    <ModalWrapper isOpen={isOpen}>
      <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center">
        <div className="relative w-full max-w-2xl bg-theme-bg-secondary rounded-lg shadow border-2 border-theme-modal-border">
          <div className="relative p-6 border-b rounded-t border-theme-modal-border">
            <div className="w-full flex gap-x-2 items-center">
              <h3 className="text-xl font-semibold text-white overflow-hidden overflow-ellipsis whitespace-nowrap">
                {llmProvider.name} Settings
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
          <form id="provider-form" onSubmit={handleUpdate}>
            <div className="px-7 py-6">
              <div className="space-y-6 max-h-[60vh] overflow-y-auto p-1">
                <p className="text-sm text-white/60">
                  To use {llmProvider.name} as this workspace's LLM you need to
                  set it up first.
                </p>
                <div>
                  {llmProvider.options(settings, { credentialsOnly: true })}
                </div>
              </div>
            </div>
            <div className="flex justify-between items-center mt-6 pt-6 border-t border-theme-modal-border px-7 pb-6">
              <button
                type="button"
                onClick={closeModal}
                className="transition-all duration-300 text-white hover:bg-zinc-700 px-4 py-2 rounded-lg text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="provider-form"
                className="transition-all duration-300 bg-white text-black hover:opacity-60 px-4 py-2 rounded-lg text-sm"
              >
                Save settings
              </button>
            </div>
          </form>
        </div>
      </div>
    </ModalWrapper>,
    document.body
  );
}

export function NoSetupWarning({ showing, onSetupClick }) {
  const { t } = useTranslation();
  if (!showing) return null;

  return (
    <button
      type="button"
      onClick={onSetupClick}
      className="border border-blue-500 rounded-lg p-2 flex flex-col items-center gap-y-2 bg-blue-600/10 text-blue-600 hover:bg-blue-600/20 transition-all duration-300"
    >
      <p className="text-sm text-center">
        <b>{t("chat_window.workspace_llm_manager.missing_credentials")}</b>
      </p>
      <p className="text-xs text-center">
        {t("chat_window.workspace_llm_manager.missing_credentials_description")}
      </p>
    </button>
  );
}

import Modal, {
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalPrimaryButton,
  ModalSecondaryButton,
} from "@/components/lib/Modal";
import { WarningCircle } from "@phosphor-icons/react";
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

  return (
    <Modal isOpen={isOpen} onClose={closeModal} size="lg">
      <form
        id="provider-form"
        onSubmit={handleUpdate}
        className="flex flex-col gap-y-5"
      >
        <ModalHeader
          title={`${llmProvider.name} Settings`}
          onClose={closeModal}
        />
        <ModalBody>
          <div className="space-y-6 max-h-[60vh] overflow-y-auto p-1">
            <p className="text-sm text-zinc-400 light:text-slate-600">
              To use {llmProvider.name} as this workspace's LLM you need to set
              it up first.
            </p>
            <div>
              {llmProvider.options(settings, { credentialsOnly: true })}
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <ModalSecondaryButton type="button" onClick={closeModal}>
            Cancel
          </ModalSecondaryButton>
          <ModalPrimaryButton type="submit" form="provider-form">
            Save settings
          </ModalPrimaryButton>
        </ModalFooter>
      </form>
    </Modal>
  );
}

export function NoSetupWarning({ showing, onSetupClick }) {
  const { t } = useTranslation();
  if (!showing) return null;

  return (
    <div className="flex items-start gap-1.5">
      <WarningCircle
        size={16}
        className="text-white light:text-slate-800 shrink-0 mt-0.5"
      />
      <p className="text-[13px] text-white light:text-slate-800 leading-5">
        {t("chat_window.workspace_llm_manager.missing_credentials")}{" "}
        <span
          onClick={onSetupClick}
          className="text-sky-400 font-semibold cursor-pointer hover:underline"
          role="button"
        >
          {t(
            "chat_window.workspace_llm_manager.missing_credentials_description"
          )}
        </span>
      </p>
    </div>
  );
}

import { useModal } from "@/hooks/useModal";
import Modal, { ModalHeader } from "@/components/lib/Modal";
import { SlidersHorizontal } from "@phosphor-icons/react";
import { useTranslation } from "react-i18next";
import MaxToolCallStack from "./MaxToolCallStack";
import AgentClarifyingQuestions from "./AgentClarifyingQuestions";
import AgentSkillReranker from "./AgentSkillReranker";

export default function AgentSkillSettings() {
  const { isOpen, openModal, closeModal } = useModal();
  return (
    <>
      <button
        type="button"
        onClick={openModal}
        className={`w-10 h-10 flex items-center justify-center light:border-black/10 light:border-solid border-none light:!border rounded-lg transition-colors outline-none bg-transparent hover:bg-theme-bg-secondary`}
      >
        <SlidersHorizontal size={24} className={`text-theme-text-secondary`} />
      </button>
      <AgentSkillSettingsModal isOpen={isOpen} closeModal={closeModal} />
    </>
  );
}

function AgentSkillSettingsModal({ isOpen, closeModal }) {
  const { t } = useTranslation();
  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={closeModal}>
      <ModalHeader title={t("agent.settings.title")} onClose={closeModal} />
      <div className="flex flex-col gap-y-5 w-full">
        <MaxToolCallStack />
        <div className="border-b border-zinc-800 light:border-slate-200 h-[1px] w-full" />
        <AgentSkillReranker />
        <div className="border-b border-zinc-800 light:border-slate-200 h-[1px] w-full" />
        <AgentClarifyingQuestions />
      </div>
    </Modal>
  );
}

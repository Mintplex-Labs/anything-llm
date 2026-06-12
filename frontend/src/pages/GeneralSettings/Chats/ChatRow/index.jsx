import truncate from "truncate";
import { Trash } from "@phosphor-icons/react";
import System from "@/models/system";
import Modal, { ModalHeader, ModalBody } from "@/components/lib/Modal";
import { useModal } from "@/hooks/useModal";
import MarkdownRenderer from "../MarkdownRenderer";
import { safeJsonParse } from "@/utils/request";

export default function ChatRow({ chat, onDelete }) {
  const {
    isOpen: isPromptOpen,
    openModal: openPromptModal,
    closeModal: closePromptModal,
  } = useModal();
  const {
    isOpen: isResponseOpen,
    openModal: openResponseModal,
    closeModal: closeResponseModal,
  } = useModal();

  const handleDelete = async () => {
    if (
      !window.confirm(
        `Are you sure you want to delete this chat?\n\nThis action is irreversible.`
      )
    )
      return false;
    await System.deleteChat(chat.id);
    onDelete(chat.id);
  };

  return (
    <>
      <tr className="bg-transparent text-white text-opacity-80 text-xs font-medium border-b border-white/10 h-10">
        <td className="px-6 font-medium whitespace-nowrap text-white">
          {chat.id}
        </td>
        <td className="px-6 font-medium whitespace-nowrap text-white">
          {chat.user?.username}
        </td>
        <td className="px-6">{chat.workspace?.name}</td>
        <td
          onClick={openPromptModal}
          className="px-6 border-transparent cursor-pointer transform transition-transform duration-200 hover:scale-105 hover:shadow-lg"
        >
          {truncate(chat.prompt, 40)}
        </td>
        <td
          onClick={openResponseModal}
          className="px-6 cursor-pointer transform transition-transform duration-200 hover:scale-105 hover:shadow-lg"
        >
          {truncate(safeJsonParse(chat.response, {})?.text, 40)}
        </td>
        <td className="px-6">{chat.createdAt}</td>
        <td className="px-6 flex items-center gap-x-6 h-full mt-1">
          <button
            onClick={handleDelete}
            className="text-xs font-medium text-white/80 light:text-black/80 hover:light:text-red-500 hover:text-red-300 rounded-lg px-2 py-1 hover:bg-white hover:light:bg-red-50 hover:bg-opacity-10"
          >
            <Trash className="h-5 w-5" />
          </button>
        </td>
      </tr>
      <Modal isOpen={isPromptOpen} onClose={closePromptModal}>
        <TextPreview text={chat.prompt} closeModal={closePromptModal} />
      </Modal>
      <Modal isOpen={isResponseOpen} onClose={closeResponseModal}>
        <TextPreview
          text={
            <MarkdownRenderer
              content={safeJsonParse(chat.response, {})?.text}
            />
          }
          closeModal={closeResponseModal}
        />
      </Modal>
    </>
  );
}
const TextPreview = ({ text, closeModal }) => {
  return (
    <form className="flex flex-col gap-y-5">
      <ModalHeader title="Viewing Text" onClose={closeModal} />
      <ModalBody>
        <pre className="w-full h-[200px] py-2 px-4 whitespace-pre-line overflow-auto rounded-lg bg-zinc-800 light:bg-white border border-zinc-800 light:border-slate-300 text-zinc-100 light:text-slate-900 text-sm">
          {text}
        </pre>
      </ModalBody>
    </form>
  );
};

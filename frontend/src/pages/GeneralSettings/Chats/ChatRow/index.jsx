import truncate from "truncate";
import { X, Trash } from "@phosphor-icons/react";
import System from "@/models/system";
import ModalWrapper from "@/components/ModalWrapper";
import { useModal } from "@/hooks/useModal";

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
      <tr className="bg-transparent text-white text-opacity-80 text-sm font-medium">
        <td className="px-6 py-4 font-medium whitespace-nowrap text-white">
          {chat.id}
        </td>
        <td className="px-6 py-4 font-medium whitespace-nowrap text-white">
          {chat.user?.username}
        </td>
        <td className="px-6 py-4">{chat.workspace?.name}</td>
        <td
          onClick={openPromptModal}
          className="px-6 py-4 border-transparent cursor-pointer transform transition-transform duration-200 hover:scale-105 hover:shadow-lg"
        >
          {truncate(chat.prompt, 40)}
        </td>
        <td
          onClick={openResponseModal}
          className="px-6 py-4 cursor-pointer transform transition-transform duration-200 hover:scale-105 hover:shadow-lg"
        >
          {truncate(JSON.parse(chat.response)?.text, 40)}
        </td>
        <td className="px-6 py-4">{chat.createdAt}</td>
        <td className="px-6 py-4 flex items-center gap-x-6">
          <button
            onClick={handleDelete}
            className="font-medium text-red-300 px-2 py-1 rounded-lg hover:bg-red-800 hover:bg-opacity-20"
          >
            <Trash className="h-5 w-5" />
          </button>
        </td>
      </tr>
      <ModalWrapper isOpen={isPromptOpen}>
        <TextPreview text={chat.prompt} closeModal={closePromptModal} />
      </ModalWrapper>
      <ModalWrapper isOpen={isResponseOpen}>
        <TextPreview
          text={JSON.parse(chat.response)?.text}
          closeModal={closeResponseModal}
        />
      </ModalWrapper>
    </>
  );
}
const TextPreview = ({ text, closeModal }) => {
  return (
    <div className="relative w-full md:max-w-2xl max-h-full">
      <div className="relative bg-main-gradient rounded-lg shadow">
        <div className="flex items-start justify-between p-4 border-b rounded-t border-gray-600">
          <h3 className="text-xl font-semibold text-white">Viewing Text</h3>
          <button
            onClick={closeModal}
            type="button"
            className="transition-all duration-300 text-gray-400 bg-transparent hover:border-white/60 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center bg-sidebar-button hover:bg-menu-item-selected-gradient hover:border-slate-100 hover:border-opacity-50 border-transparent border"
          >
            <X className="text-gray-300 text-lg" />
          </button>
        </div>
        <div className="w-full p-6">
          <pre className="w-full h-[200px] py-2 px-4 whitespace-pre-line overflow-auto rounded-lg bg-zinc-900 border border-gray-500 text-white text-sm">
            {text}
          </pre>
        </div>
      </div>
    </div>
  );
};

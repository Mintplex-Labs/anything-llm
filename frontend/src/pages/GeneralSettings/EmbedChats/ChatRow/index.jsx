import truncate from "truncate";
import { X, Trash, LinkSimple } from "@phosphor-icons/react";
import ModalWrapper from "@/components/ModalWrapper";
import { useModal } from "@/hooks/useModal";
import paths from "@/utils/paths";
import Embed from "@/models/embed";

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
    await Embed.deleteChat(chat.id);
    onDelete(chat.id);
  };

  return (
    <>
      <tr className="bg-transparent text-white text-opacity-80 text-sm font-medium">
        <td className="px-6 py-4 font-medium whitespace-nowrap text-white">
          <a
            href={paths.settings.embedSetup()}
            target="_blank"
            rel="noreferrer"
            className="text-white flex items-center hover:underline"
          >
            <LinkSimple className="mr-2 w-5 h-5" />{" "}
            {chat.embed_config.workspace.name}
          </a>
        </td>
        <td className="px-6 py-4 font-medium whitespace-nowrap text-white">
          <div className="flex flex-col">
            <p>{truncate(chat.session_id, 20)}</p>
            <ConnectionDetails
              connection_information={chat.connection_information}
            />
          </div>
        </td>
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
            className="font-medium px-2 py-1 rounded-lg hover:bg-sidebar-gradient text-white hover:text-white/80 hover:bg-opacity-20"
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

const ConnectionDetails = ({ connection_information }) => {
  let details = {};
  try {
    details = JSON.parse(connection_information);
  } catch {}

  if (Object.keys(details).length === 0) return null;
  return (
    <>
      {details.ip && <p className="text-xs text-slate-400">{details.ip}</p>}
      {details.host && <p className="text-xs text-slate-400">{details.host}</p>}
    </>
  );
};

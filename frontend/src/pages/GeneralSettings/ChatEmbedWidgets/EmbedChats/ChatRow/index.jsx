import truncate from "truncate";
import Modal, { ModalHeader, ModalBody } from "@/components/lib/Modal";
import { useModal } from "@/hooks/useModal";
import paths from "@/utils/paths";
import Embed from "@/models/embed";
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
  const {
    isOpen: isConnectionDetailsModalOpen,
    openModal: openConnectionDetailsModal,
    closeModal: closeConnectionDetailsModal,
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
      <tr className="bg-transparent text-white text-opacity-80 text-xs font-medium border-b border-white/10 h-10">
        <td className="px-6 font-medium whitespace-nowrap text-white">
          <a
            href={paths.settings.embedChatWidgets()}
            target="_blank"
            rel="noreferrer"
            className="text-white flex items-center hover:underline"
          >
            {chat.embed_config.workspace.name}
          </a>
        </td>
        <td
          onClick={openConnectionDetailsModal}
          className="px-6 cursor-pointer hover:shadow-lg"
        >
          <div className="flex flex-col">
            <p>{truncate(chat.session_id, 20)}</p>
          </div>
        </td>
        <td
          onClick={openPromptModal}
          className="px-6 border-transparent cursor-pointer hover:shadow-lg"
        >
          {truncate(chat.prompt, 40)}
        </td>
        <td
          onClick={openResponseModal}
          className="px-6 cursor-pointer hover:shadow-lg"
        >
          {truncate(safeJsonParse(chat.response, {})?.text, 40)}
        </td>
        <td className="px-6">{chat.createdAt}</td>
        <td className="px-6 flex items-center gap-x-6 h-full mt-1">
          <button
            onClick={handleDelete}
            className="group text-xs font-medium text-theme-text-secondary px-2 py-1 rounded-lg hover:bg-theme-button-delete-hover-bg"
          >
            <span className="group-hover:text-theme-button-delete-hover-text">
              Delete
            </span>
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
      <Modal
        isOpen={isConnectionDetailsModalOpen}
        onClose={closeConnectionDetailsModal}
      >
        <TextPreview
          text={
            <ConnectionDetails
              sessionId={chat.session_id}
              verbose={true}
              connection_information={chat.connection_information}
            />
          }
          closeModal={closeConnectionDetailsModal}
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
        <div className="w-full h-[60vh] py-2 px-4 whitespace-pre-line overflow-auto rounded-lg bg-zinc-800 light:bg-white border border-zinc-800 light:border-slate-300 text-zinc-100 light:text-slate-900 text-sm">
          {text}
        </div>
      </ModalBody>
    </form>
  );
};

const ConnectionDetails = ({
  sessionId,
  verbose = false,
  connection_information,
}) => {
  const details = safeJsonParse(connection_information, {});
  if (Object.keys(details).length === 0) return null;

  if (verbose) {
    return (
      <>
        <p className="text-xs text-zinc-400 light:text-slate-500">
          sessionID: {sessionId}
        </p>
        {details.username && (
          <p className="text-xs text-zinc-400 light:text-slate-500">
            username: {details.username}
          </p>
        )}
        {details.ip && (
          <p className="text-xs text-zinc-400 light:text-slate-500">
            client ip address: {details.ip}
          </p>
        )}
        {details.host && (
          <p className="text-xs text-zinc-400 light:text-slate-500">
            client host URL: {details.host}
          </p>
        )}
      </>
    );
  }

  return (
    <>
      {details.username && (
        <p className="text-xs text-zinc-400 light:text-slate-500">
          {details.username}
        </p>
      )}
      {details.ip && (
        <p className="text-xs text-zinc-400 light:text-slate-500">
          {details.ip}
        </p>
      )}
      {details.host && (
        <p className="text-xs text-zinc-400 light:text-slate-500">
          {details.host}
        </p>
      )}
    </>
  );
};

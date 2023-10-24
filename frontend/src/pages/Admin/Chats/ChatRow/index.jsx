import { useRef } from "react";
import Admin from "../../../../models/admin";
import truncate from "truncate";
import { X, Trash } from "@phosphor-icons/react";

export default function ChatRow({ chat }) {
  const rowRef = useRef(null);
  const handleDelete = async () => {
    if (
      !window.confirm(
        `Are you sure you want to delete this chat?\n\nThis action is irreversible.`
      )
    )
      return false;
    rowRef?.current?.remove();
    await Admin.deleteChat(chat.id);
  };

  return (
    <>
      <tr
        ref={rowRef}
        className="bg-transparent text-white text-opacity-80 text-sm font-medium"
      >
        <td className="px-6 py-4 font-medium whitespace-nowrap text-white">
          {chat.id}
        </td>
        <td className="px-6 py-4 font-medium whitespace-nowrap text-white">
          {chat.user?.username}
        </td>
        <td className="px-6 py-4">{chat.workspace?.name}</td>
        <td
          onClick={() => {
            document.getElementById(`chat-${chat.id}-prompt`)?.showModal();
          }}
          className="px-6 py-4 border-transparent cursor-pointer transform transition-transform duration-200 hover:scale-105 hover:shadow-lg"
        >
          {truncate(chat.prompt, 40)}
        </td>
        <td
          onClick={() => {
            document.getElementById(`chat-${chat.id}-response`)?.showModal();
          }}
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
      <TextPreview text={chat.prompt} modalName={`chat-${chat.id}-prompt`} />
      <TextPreview
        text={JSON.parse(chat.response)?.text}
        modalName={`chat-${chat.id}-response`}
      />
    </>
  );
}

function hideModal(modalName) {
  document.getElementById(modalName)?.close();
}

const TextPreview = ({ text, modalName }) => {
  return (
    <dialog id={modalName} className="bg-transparent outline-none w-full">
      <div className="relative w-full max-w-2xl max-h-full min-w-1/2">
        <div className="min-w-1/2 relative rounded-lg shadow bg-stone-700">
          <div className="flex items-start justify-between p-4 border-b rounded-t border-gray-600">
            <h3 className="text-xl font-semibold text-white">Viewing Text</h3>
            <button
              onClick={() => hideModal(modalName)}
              type="button"
              className="text-gray-400 bg-transparent rounded-lg text-sm p-1.5 ml-auto inline-flex items-center hover:bg-gray-600 hover:text-white"
              data-modal-hide="staticModal"
            >
              <X className="text-gray-300 text-lg" />
            </button>
          </div>
          <div className="w-full p-4 flex">
            <pre className="w-full flex h-[200px] py-2 px-4 overflow-scroll rounded-lg bg-gray-200 text-slate-800">
              {text}
            </pre>
          </div>
        </div>
      </div>
    </dialog>
  );
};

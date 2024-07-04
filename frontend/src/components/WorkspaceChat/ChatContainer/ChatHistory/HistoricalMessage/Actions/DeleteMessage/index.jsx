import Workspace from "@/models/workspace";
import { Trash } from "@phosphor-icons/react";
import { useState, useEffect } from "react";
import { Tooltip } from "react-tooltip";
const DELETE_EVENT = "delete-message";

export function useWatchDeleteMessage({ chatId = null }) {
  const [isDeleted, setIsDeleted] = useState(false);

  async function onDeleteEvent(e) {
    if (e.detail.chatId === chatId) {
      setIsDeleted(true);
      await Workspace.deleteChat(chatId);
      return false;
    }
  }

  useEffect(() => {
    function listenForEvent() {
      console.log({ chatId })
      if (!chatId) return;
      window.addEventListener(DELETE_EVENT, onDeleteEvent);
    }
    listenForEvent();
    return () => {
      window.removeEventListener(DELETE_EVENT, onDeleteEvent);
    };
  }, [chatId]);

  return { isDeleted };
}

export function DeleteMessage({ chatId, isEditing, role }) {
  if (!chatId || isEditing || role === "user") return null;

  function emitDeleteEvent() {
    window.dispatchEvent(
      new CustomEvent(DELETE_EVENT, { detail: { chatId } })
    );
  }

  return (
    <div className="mt-3 relative">
      <button
        onClick={emitDeleteEvent}
        data-tooltip-id={`delete-message-${chatId}`}
        data-tooltip-content="Delete message"
        className="border-none text-zinc-300"
        aria-label="Delete"
      >
        <Trash size={18} className="mb-1" />
      </button>
      <Tooltip
        id={`delete-message-${chatId}`}
        place="bottom"
        delayShow={300}
        className="tooltip !text-xs"
      />
    </div>
  );
}
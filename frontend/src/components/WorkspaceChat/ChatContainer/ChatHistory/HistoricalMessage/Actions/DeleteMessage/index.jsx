import { useState, useEffect } from "react";
import { Trash } from "@phosphor-icons/react";
import { Tooltip } from "react-tooltip";
import Workspace from "@/models/workspace";
const DELETE_EVENT = "delete-message";

export function useWatchDeleteMessage({ chatId = null, role = "user" }) {
  const [isDeleted, setIsDeleted] = useState(false);
  const [completeDelete, setCompleteDelete] = useState(false);

  useEffect(() => {
    function listenForEvent() {
      if (!chatId) return;
      window.addEventListener(DELETE_EVENT, onDeleteEvent);
    }
    listenForEvent();
    return () => {
      window.removeEventListener(DELETE_EVENT, onDeleteEvent);
    };
  }, [chatId]);

  function onEndAnimation() {
    if (!isDeleted) return;
    setCompleteDelete(true);
  }

  async function onDeleteEvent(e) {
    if (e.detail.chatId === chatId) {
      setIsDeleted(true);
      // Do this to prevent double-emission of the PUT/DELETE api call
      // because then there will be a race condition and it will make an error log for nothing
      // as one call will complete and the other will fail.
      if (role === "assistant") await Workspace.deleteChat(chatId);
      return false;
    }
  }

  return { isDeleted, completeDelete, onEndAnimation };
}

export function DeleteMessage({ chatId, isEditing, role }) {
  if (!chatId || isEditing || role === "user") return null;

  function emitDeleteEvent() {
    window.dispatchEvent(new CustomEvent(DELETE_EVENT, { detail: { chatId } }));
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

import { useState, useEffect } from "react";
import { Trash } from "@phosphor-icons/react";
import Workspace from "@/models/workspace";
import { useTranslation } from "react-i18next";

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
      if (role === "assistant") await Workspace.deleteChat(chatId);
      return false;
    }
  }

  return { isDeleted, completeDelete, onEndAnimation };
}

export function DeleteMessage({ chatId, isEditing, role }) {
  const { t } = useTranslation();

  if (!chatId || isEditing || role === "user") return null;

  function emitDeleteEvent() {
    window.dispatchEvent(new CustomEvent(DELETE_EVENT, { detail: { chatId } }));
  }

  return (
    <button
      onClick={emitDeleteEvent}
      className="border-none flex items-center gap-x-1 w-full"
      role="menuitem"
    >
      <Trash size={21} weight="fill" />
      <p>{t("deleteMessage.delete")}</p>
    </button>
  );
}

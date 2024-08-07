import { AI_BACKGROUND_COLOR, USER_BACKGROUND_COLOR } from "@/utils/constants";
import { Pencil } from "@phosphor-icons/react";
import { useState, useEffect, useRef } from "react";
import { Tooltip } from "react-tooltip";

const EDIT_EVENT = "toggle-message-edit";

export function useEditMessage({ chatId, role }) {
  const [isEditing, setIsEditing] = useState(false);

  function onEditEvent(e) {
    if (e.detail.chatId !== chatId || e.detail.role !== role) {
      setIsEditing(false);
      return false;
    }
    setIsEditing((prev) => !prev);
  }

  useEffect(() => {
    function listenForEdits() {
      if (!chatId || !role) return;
      window.addEventListener(EDIT_EVENT, onEditEvent);
    }
    listenForEdits();
    return () => {
      window.removeEventListener(EDIT_EVENT, onEditEvent);
    };
  }, [chatId, role]);

  return { isEditing, setIsEditing };
}

export function EditMessageAction({ chatId = null, role, isEditing }) {
  function handleEditClick() {
    window.dispatchEvent(
      new CustomEvent(EDIT_EVENT, { detail: { chatId, role } })
    );
  }

  if (!chatId || isEditing) return null;
  return (
    <div
      className={`mt-3 relative ${
        role === "user" && !isEditing ? "" : "!opacity-100"
      }`}
    >
      <button
        onClick={handleEditClick}
        data-tooltip-id="edit-input-text"
        data-tooltip-content={`Edit ${
          role === "user" ? "Prompt" : "Response"
        } `}
        className="border-none text-zinc-300"
        aria-label={`Edit ${role === "user" ? "Prompt" : "Response"}`}
      >
        <Pencil size={21} className="mb-1" />
      </button>
      <Tooltip
        id="edit-input-text"
        place="bottom"
        delayShow={300}
        className="tooltip !text-xs"
      />
    </div>
  );
}

export function EditMessageForm({
  role,
  chatId,
  message,
  attachments = [],
  adjustTextArea,
  saveChanges,
}) {
  const formRef = useRef(null);
  function handleSaveMessage(e) {
    e.preventDefault();
    const form = new FormData(e.target);
    const editedMessage = form.get("editedMessage");
    saveChanges({ editedMessage, chatId, role, attachments });
    window.dispatchEvent(
      new CustomEvent(EDIT_EVENT, { detail: { chatId, role, attachments } })
    );
  }

  function cancelEdits() {
    window.dispatchEvent(
      new CustomEvent(EDIT_EVENT, { detail: { chatId, role, attachments } })
    );
    return false;
  }

  useEffect(() => {
    if (!formRef || !formRef.current) return;
    formRef.current.focus();
    adjustTextArea({ target: formRef.current });
  }, [formRef]);

  return (
    <form onSubmit={handleSaveMessage} className="flex flex-col w-full">
      <textarea
        ref={formRef}
        name="editedMessage"
        className={`w-full rounded ${
          role === "user" ? USER_BACKGROUND_COLOR : AI_BACKGROUND_COLOR
        } border border-white/20 active:outline-none focus:outline-none focus:ring-0 pr-16 pl-1.5 pt-1.5 resize-y`}
        defaultValue={message}
        onChange={adjustTextArea}
      />
      <div className="mt-3 flex justify-center">
        <button
          type="submit"
          className="px-2 py-1 bg-gray-200 text-gray-700 font-medium rounded-md mr-2 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Save & Submit
        </button>
        <button
          type="button"
          className="px-2 py-1 bg-historical-msg-system text-white font-medium rounded-md hover:bg-historical-msg-user/90 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
          onClick={cancelEdits}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

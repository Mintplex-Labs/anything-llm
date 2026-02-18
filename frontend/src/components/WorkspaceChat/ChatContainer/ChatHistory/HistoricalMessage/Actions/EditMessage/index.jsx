import { Info, Pencil } from "@phosphor-icons/react";
import { useState, useEffect, useRef } from "react";
import Appearance from "@/models/appearance";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();
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
        data-tooltip-content={`${
          role === "user"
            ? t("chat_window.edit_prompt")
            : t("chat_window.edit_response")
        } `}
        className="border-none text-zinc-300 light:text-slate-500"
        aria-label={`Edit ${role === "user" ? t("chat_window.edit_prompt") : t("chat_window.edit_response")}`}
      >
        <Pencil size={21} className="mb-1" />
      </button>
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

  function handleSubmit(e) {
    e.preventDefault();
    const editedMessage = formRef.current.value;
    saveChanges({ editedMessage, chatId, role, attachments });
    window.dispatchEvent(
      new CustomEvent(EDIT_EVENT, { detail: { chatId, role, attachments } })
    );
  }

  function handleSave() {
    const editedMessage = formRef.current.value;
    saveChanges({
      editedMessage,
      chatId,
      role,
      attachments,
      saveOnly: true,
    });
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
    if (!formRef?.current) return;
    formRef.current.focus();
    adjustTextArea({ target: formRef.current });
  }, []);

  if (role === "user") {
    return (
      <form
        onSubmit={handleSubmit}
        className="flex flex-col w-full max-w-[650px]"
      >
        <textarea
          ref={formRef}
          name="editedMessage"
          spellCheck={Appearance.get("enableSpellCheck")}
          className="text-white light:text-slate-900 w-full rounded-2xl bg-zinc-800 light:bg-slate-100 border border-sky-300 focus:border-sky-300 active:outline-none focus:outline-none focus:ring-0 px-4 py-3 resize-none overflow-hidden"
          defaultValue={message}
          onChange={adjustTextArea}
        />
        <EditActionBar
          onCancel={cancelEdits}
          onSave={handleSave}
          isUserMessage
        />
      </form>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col w-full max-w-[650px]"
    >
      <textarea
        ref={formRef}
        name="editedMessage"
        spellCheck={Appearance.get("enableSpellCheck")}
        className="text-white light:text-slate-900 w-full rounded-2xl bg-zinc-800 light:bg-slate-100 border border-sky-300 focus:border-sky-300 active:outline-none focus:outline-none focus:ring-0 px-4 py-3 resize-none overflow-hidden"
        defaultValue={message}
        onChange={adjustTextArea}
      />
      <EditActionBar onCancel={cancelEdits} />
    </form>
  );
}

function EditActionBar({ onCancel, onSave, isUserMessage = false }) {
  const { t } = useTranslation();
  return (
    <div className="mt-2 flex flex-col md:flex-row md:items-center justify-between gap-2 bg-zinc-800 light:bg-slate-200 rounded-lg p-2">
      <div className="flex items-start gap-2">
        <Info
          size={12}
          className="shrink-0 mt-0.5 text-zinc-200 light:text-slate-800"
        />
        <span className="text-zinc-200 light:text-slate-800 text-xs leading-4">
          {isUserMessage
            ? t("chat_window.edit_info_user")
            : t("chat_window.edit_info_assistant")}
        </span>
      </div>
      <div className="flex items-center gap-2 self-end shrink-0">
        <button
          type="button"
          onClick={onCancel}
          className="border-none text-white light:text-slate-900 text-sm font-medium w-[70px] h-9 rounded-lg hover:bg-white/5 light:hover:bg-slate-300"
        >
          {t("chat_window.cancel")}
        </button>
        {isUserMessage && (
          <button
            type="button"
            onClick={onSave}
            className="border border-zinc-600 light:border-slate-600 text-white light:text-slate-900 text-sm font-medium w-[70px] h-9 rounded-lg hover:bg-white/5 light:hover:bg-slate-300"
          >
            {t("chat_window.save")}
          </button>
        )}
        <button
          type="submit"
          className="border-none bg-zinc-50 light:bg-slate-800 text-zinc-800 light:text-white text-sm font-medium w-[70px] h-9 rounded-lg hover:bg-zinc-200 light:hover:bg-slate-800"
        >
          {isUserMessage ? t("chat_window.submit") : t("chat_window.save")}
        </button>
      </div>
    </div>
  );
}

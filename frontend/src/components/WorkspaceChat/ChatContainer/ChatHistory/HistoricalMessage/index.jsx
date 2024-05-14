import React, { memo, useState, useRef } from "react";
import { Warning } from "@phosphor-icons/react";
import Jazzicon from "../../../../UserIcon";
import Actions from "./Actions";
import renderMarkdown from "@/utils/chat/markdown";
import { userFromStorage } from "@/utils/request";
import Citations from "../Citation";
import { AI_BACKGROUND_COLOR, USER_BACKGROUND_COLOR } from "@/utils/constants";
import { v4 } from "uuid";
import createDOMPurify from "dompurify";

const DOMPurify = createDOMPurify(window);
const HistoricalMessage = ({
  uuid = v4(),
  message,
  role,
  workspace,
  sources = [],
  error = false,
  feedbackScore = null,
  chatId = null,
  isLastMessage = false,
  regenerateMessage,
  saveEditedMessage,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const editableRef = useRef(null);

  const handleSaveMessage = (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    const editedMessage = form.get("editedMessage");
    console.log("chatid", chatId);
    saveEditedMessage(editedMessage, chatId);
    setIsEditing(false);
  };

  const startEditing = () => {
    setIsEditing(true);
    setTimeout(() => {
      // focus and move cursor to the end
      editableRef.current.focus();
      editableRef.current.selectionStart = editableRef.current.value.length;
    }, 0);
  };

  const adjustTextArea = (event) => {
    const element = event.target;
    element.style.height = "auto";
    element.style.height = element.scrollHeight + "px";
  };

  return (
    <div
      key={uuid}
      className={`flex justify-center items-end w-full ${
        role === "user" ? USER_BACKGROUND_COLOR : AI_BACKGROUND_COLOR
      }`}
    >
      <div
        className={`py-8 px-4 w-full flex gap-x-5 md:max-w-[800px] flex-col`}
      >
        <div className="flex gap-x-5">
          <ProfileImage role={role} workspace={workspace} />
          {error ? (
            <div className="p-2 rounded-lg bg-red-50 text-red-500">
              <span className={`inline-block `}>
                <Warning className="h-4 w-4 mb-1 inline-block" /> Could not
                respond to message.
              </span>
              <p className="text-xs font-mono mt-2 border-l-2 border-red-300 pl-2 bg-red-200 p-2 rounded-sm">
                {error}
              </p>
            </div>
          ) : isEditing ? (
            <form onSubmit={handleSaveMessage} className="flex flex-col w-full">
              <textarea
                ref={editableRef}
                name="editedMessage"
                className={`w-full rounded bg-historical-msg-user active:outline-none focus:outline-none focus:ring-0 pr-16 pl-1.5 pt-1.5 resize-none overflow-hidden`}
                defaultValue={message}
                onKeyUp={adjustTextArea}
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
                  onClick={() => {
                    setIsEditing(false);
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <span
              className={`flex flex-col gap-y-1`}
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(renderMarkdown(message)),
              }}
            />
          )}
        </div>
        {!error && (
          <div className="flex gap-x-5">
            <div className="relative w-[35px] h-[35px] rounded-full flex-shrink-0 overflow-hidden" />
            <Actions
              message={DOMPurify.sanitize(message)}
              feedbackScore={feedbackScore}
              chatId={chatId}
              slug={workspace?.slug}
              isLastMessage={isLastMessage}
              regenerateMessage={regenerateMessage}
              role={role}
              startEditing={startEditing}
            />
          </div>
        )}
        {role === "assistant" && <Citations sources={sources} />}
      </div>
    </div>
  );
};

function ProfileImage({ role, workspace }) {
  if (role === "assistant" && workspace.pfpUrl) {
    return (
      <div className="relative w-[35px] h-[35px] rounded-full flex-shrink-0 overflow-hidden">
        <img
          src={workspace.pfpUrl}
          alt="Workspace profile picture"
          className="absolute top-0 left-0 w-full h-full object-cover rounded-full bg-white"
        />
      </div>
    );
  }

  return (
    <Jazzicon
      size={36}
      user={{
        uid: role === "user" ? userFromStorage()?.username : workspace.slug,
      }}
      role={role}
    />
  );
}

export default memo(
  HistoricalMessage,
  // Skip re-render the historical message:
  // if the content is the exact same AND (not streaming)
  // the lastMessage status is the same (regen icon)
  // and the chatID matches between renders. (feedback icons)
  (prevProps, nextProps) => {
    return (
      prevProps.message === nextProps.message &&
      prevProps.isLastMessage === nextProps.isLastMessage &&
      prevProps.chatId === nextProps.chatId
    );
  }
);

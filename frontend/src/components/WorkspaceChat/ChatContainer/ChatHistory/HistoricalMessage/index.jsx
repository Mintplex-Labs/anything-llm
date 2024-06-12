import React, { memo } from "react";
import { Warning } from "@phosphor-icons/react";
import UserIcon from "../../../../UserIcon";
import Actions from "./Actions";
import renderMarkdown from "@/utils/chat/markdown";
import { userFromStorage } from "@/utils/request";
import Citations from "../Citation";
import { AI_BACKGROUND_COLOR, USER_BACKGROUND_COLOR } from "@/utils/constants";
import { v4 } from "uuid";
import createDOMPurify from "dompurify";
import { EditMessageForm, useEditMessage } from "./Actions/EditMessage";

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
  const { isEditing } = useEditMessage({ chatId, role });
  const adjustTextArea = (event) => {
    const element = event.target;
    element.style.height = "auto";
    element.style.height = element.scrollHeight + "px";
  };

  if (!!error) {
    return (
      <div
        key={uuid}
        className={`flex justify-center items-end w-full ${
          role === "user" ? USER_BACKGROUND_COLOR : AI_BACKGROUND_COLOR
        }`}
      >
        <div className="py-8 px-4 w-full flex gap-x-5 md:max-w-[80%] flex-col">
          <div className="flex gap-x-5">
            <ProfileImage role={role} workspace={workspace} />
            <div className="p-2 rounded-lg bg-red-50 text-red-500">
              <span className="inline-block">
                <Warning className="h-4 w-4 mb-1 inline-block" /> Could not
                respond to message.
              </span>
              <p className="text-xs font-mono mt-2 border-l-2 border-red-300 pl-2 bg-red-200 p-2 rounded-sm">
                {error}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      key={uuid}
      className={`flex justify-center items-end w-full group ${
        role === "user" ? USER_BACKGROUND_COLOR : AI_BACKGROUND_COLOR
      }`}
    >
      <div className={`py-8 px-4 w-full flex gap-x-5 md:max-w-[80%] flex-col`}>
        <div className="flex gap-x-5">
          <ProfileImage role={role} workspace={workspace} />
          {isEditing ? (
            <EditMessageForm
              role={role}
              chatId={chatId}
              message={message}
              adjustTextArea={adjustTextArea}
              saveChanges={saveEditedMessage}
            />
          ) : (
            <span
              className={`flex flex-col gap-y-1`}
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(renderMarkdown(message)),
              }}
            />
          )}
        </div>
        <div className="flex gap-x-5">
          <div className="relative w-[35px] h-[35px] rounded-full flex-shrink-0 overflow-hidden" />
          <Actions
            message={message}
            feedbackScore={feedbackScore}
            chatId={chatId}
            slug={workspace?.slug}
            isLastMessage={isLastMessage}
            regenerateMessage={regenerateMessage}
            isEditing={isEditing}
            role={role}
          />
        </div>
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
    <UserIcon
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

import React from "react";
import UserIcon from "../UserIcon";
import { userFromStorage } from "@/utils/request";
import { AI_BACKGROUND_COLOR, USER_BACKGROUND_COLOR } from "@/utils/constants";

export default function ChatBubble({ message, type, popMsg }) {
  const isUser = type === "user";
  const backgroundColor = isUser ? USER_BACKGROUND_COLOR : AI_BACKGROUND_COLOR;

  return (
    <div className={`flex justify-center items-end w-full ${backgroundColor}`}>
      <div className={`py-8 px-4 w-full flex gap-x-5 md:max-w-[80%] flex-col`}>
        <div className="flex gap-x-5">
          <UserIcon
            user={{ uid: isUser ? userFromStorage()?.username : "system" }}
            role={type}
          />

          <span
            className={`whitespace-pre-line text-forest font-normal text-sm md:text-sm flex flex-col gap-y-1 mt-2`}
          >
            {message}
          </span>
        </div>
      </div>
    </div>
  );
}

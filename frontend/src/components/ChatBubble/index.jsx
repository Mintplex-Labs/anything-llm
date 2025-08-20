import React from "react";
import UserIcon from "../UserIcon";
import { userFromStorage } from "@/utils/request";
import renderMarkdown from "@/utils/chat/markdown";
import DOMPurify from "@/utils/chat/purify";
import { cn } from "@/lib/utils";

export default function ChatBubble({ message, type, popMsg, timestamp, status }) {
  const isUser = type === "user";
  const meta = [timestamp, status].filter(Boolean).join(" • ");

  return (
    <div className="flex justify-center items-end w-full">
      <div className="py-8 px-4 w-full flex gap-x-5 md:max-w-[80%] flex-col">
        <div className="flex gap-x-5">
          <UserIcon
            user={{ uid: isUser ? userFromStorage()?.username : "system" }}
            role={type}
          />

          <div className="flex flex-col">
            <div
              className={cn(
                "markdown whitespace-pre-line font-normal text-sm md:text-sm flex flex-col gap-y-1 mt-2 bubble",
                isUser ? "bubble-user" : "bubble-assistant"
              )}
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(renderMarkdown(message)),
              }}
            />
            {meta && <div className="bubble-meta">{meta}</div>}
          </div>
        </div>
      </div>
    </div>
  );
}

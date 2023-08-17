import React from "react";

export default function ChatBubble({ message, type, popMsg }) {
  const isUser = type === "user";

  return (
    <div
      className={`flex w-full mt-2 items-center ${
        popMsg ? "chat__message" : ""
      } ${isUser ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`p-4 max-w-full md:max-w-[75%] ${
          isUser
            ? "bg-slate-200 dark:bg-amber-800"
            : "bg-orange-100 dark:bg-stone-700"
        } rounded-b-2xl ${isUser ? "rounded-tl-2xl" : "rounded-tr-2xl"} ${
          isUser ? "rounded-tr-sm" : "rounded-tl-sm"
        }`}
      >
        {message && (
          <p className="text-slate-800 dark:text-slate-200 font-[500] md:font-semibold text-sm md:text-base">
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

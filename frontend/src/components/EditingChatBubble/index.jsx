import React, { useState } from "react";
import { X } from "react-feather";

export default function EditingChatBubble({
  message,
  index,
  type,
  handleMessageChange,
  removeMessage,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempMessage, setTempMessage] = useState(message[type]);
  const isUser = type === "user";

  return (
    <div
      className={`flex w-full mt-2 items-center ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      {isUser && (
        <button
          className="flex items-center text-red-500 hover:text-red-700 transition mr-2"
          onClick={() => removeMessage(index)}
        >
          <X className="mr-2" size={20} />
        </button>
      )}
      <div
        className={`p-4 max-w-full md:max-w-[75%] ${
          isUser
            ? "bg-slate-200 dark:bg-amber-800"
            : "bg-orange-100 dark:bg-stone-700"
        } rounded-b-2xl ${isUser ? "rounded-tl-2xl" : "rounded-tr-2xl"} ${
          isUser ? "rounded-tr-sm" : "rounded-tl-sm"
        }`}
        onDoubleClick={() => setIsEditing(true)}
      >
        {isEditing ? (
          <input
            value={tempMessage}
            onChange={(e) => setTempMessage(e.target.value)}
            onBlur={() => {
              handleMessageChange(index, type, tempMessage);
              setIsEditing(false);
            }}
            autoFocus
          />
        ) : (
          tempMessage && (
            <p className="text-slate-800 dark:text-slate-200 font-[500] md:font-semibold text-sm md:text-base">
              {tempMessage}
            </p>
          )
        )}
      </div>
      {!isUser && (
        <button
          className="flex items-center text-red-500 hover:text-red-700 transition ml-2"
          onClick={() => removeMessage(index)}
        >
          <X className="mr-2" size={20} />
        </button>
      )}
    </div>
  );
}

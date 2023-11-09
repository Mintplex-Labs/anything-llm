import React, { useState } from "react";
import { X } from "@phosphor-icons/react";

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
      className={`relative flex w-full mt-2 items-start ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      <button
        className={`transition-all duration-300 absolute z-10 text-white bg-neutral-700 rounded-full hover:bg-selected-preference-gradient hover:border-white border-transparent border shadow-lg ${
          isUser ? "right-0 mr-2" : "ml-2"
        }`}
        style={{ top: "-8px", [isUser ? "right" : "left"]: "255px" }}
        onClick={() => removeMessage(index)}
      >
        <X className="m-0.5" size={20} />
      </button>
      <div
        className={`p-4 max-w-full md:w-[290px] ${
          isUser ? "bg-sky-400 text-black" : "bg-white text-black"
        } ${
          isUser
            ? "rounded-tr-[40px] rounded-tl-[40px] rounded-bl-[40px]"
            : "rounded-br-[40px] rounded-tl-[40px] rounded-tr-[40px]"
        }
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
            className="w-full"
          />
        ) : (
          tempMessage && (
            <p className="text-black font-[500] md:font-semibold text-sm md:text-base break-words">
              {tempMessage}
            </p>
          )
        )}
      </div>
    </div>
  );
}

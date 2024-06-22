import React, { useState } from "react";
import { X } from "@phosphor-icons/react";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();

  return (
    <div>
      <p className={`text-xs text-[#D3D4D4] ${isUser ? "text-right" : ""}`}>
        {isUser ? t("common.user") : t("appearance.message.assistant")}
      </p>
      <div
        className={`relative flex w-full mt-2 items-start ${
          isUser ? "justify-end" : "justify-start"
        }`}
      >
        <button
          className={`transition-all duration-300 absolute z-10 text-white rounded-full hover:bg-neutral-700 hover:border-white border-transparent border shadow-lg ${
            isUser ? "right-0 mr-2" : "ml-2"
          }`}
          style={{ top: "6px", [isUser ? "right" : "left"]: "290px" }}
          onClick={() => removeMessage(index)}
        >
          <X className="m-0.5" size={20} />
        </button>
        <div
          className={`p-2 max-w-full md:w-[290px] text-black rounded-[8px] ${
            isUser ? "bg-[#41444C] text-white" : "bg-[#2E3036] text-white"
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
              className={`w-full ${
                isUser ? "bg-[#41444C] text-white" : "bg-[#2E3036] text-white"
              }`}
            />
          ) : (
            tempMessage && (
              <p className=" font-[500] md:font-semibold text-sm md:text-base break-words">
                {tempMessage}
              </p>
            )
          )}
        </div>
      </div>
    </div>
  );
}

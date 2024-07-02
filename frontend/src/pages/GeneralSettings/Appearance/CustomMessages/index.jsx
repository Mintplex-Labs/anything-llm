import EditingChatBubble from "@/components/EditingChatBubble";
import System from "@/models/system";
import showToast from "@/utils/toast";
import { Plus } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export default function CustomMessages() {
  const [hasChanges, setHasChanges] = useState(false);
  const [messages, setMessages] = useState([]);
  const { t } = useTranslation();

  useEffect(() => {
    async function fetchMessages() {
      const messages = await System.getWelcomeMessages();
      setMessages(messages);
    }
    fetchMessages();
  }, []);

  const addMessage = (type) => {
    if (type === "user") {
      setMessages([
        ...messages,
        { user: t("appearance.message.double-click"), response: "" },
      ]);
    } else {
      setMessages([
        ...messages,
        { user: "", response: t("appearance.message.double-click") },
      ]);
    }
  };

  const removeMessage = (index) => {
    setHasChanges(true);
    setMessages(messages.filter((_, i) => i !== index));
  };

  const handleMessageChange = (index, type, value) => {
    setHasChanges(true);
    const newMessages = [...messages];
    newMessages[index][type] = value;
    setMessages(newMessages);
  };

  const handleMessageSave = async () => {
    const { success, error } = await System.setWelcomeMessages(messages);
    if (!success) {
      showToast(`Failed to update welcome messages: ${error}`, "error");
      return;
    }
    showToast("Successfully updated welcome messages.", "success");
    setHasChanges(false);
  };

  return (
    <div className="mb-8">
      <div className="flex flex-col gap-y-1">
        <h2 className="text-base leading-6 font-bold text-white">
          {t("appearance.message.title")}
        </h2>
        <p className="text-xs leading-[18px] font-base text-white/60">
          {t("appearance.message.description")}
        </p>
      </div>
      <div className="mt-3 flex flex-col gap-y-6 bg-dark-highlight rounded-lg pr-[31px] pl-[12px] pt-4 max-w-[700px]">
        {messages.map((message, index) => (
          <div key={index} className="flex flex-col gap-y-2">
            {message.user && (
              <EditingChatBubble
                message={message}
                index={index}
                type="user"
                handleMessageChange={handleMessageChange}
                removeMessage={removeMessage}
              />
            )}
            {message.response && (
              <EditingChatBubble
                message={message}
                index={index}
                type="response"
                handleMessageChange={handleMessageChange}
                removeMessage={removeMessage}
              />
            )}
          </div>
        ))}
        <div className="flex gap-4 mt-12 justify-between pb-[15px]">
          <button
            className="self-end text-white hover:text-white/60 transition"
            onClick={() => addMessage("response")}
          >
            <div className="flex items-center justify-start text-sm font-normal -ml-2">
              <Plus className="m-2" size={16} weight="bold" />
              <span className="leading-5">
                {t("appearance.message.new")}{" "}
                <span className="font-bold italic mr-1">
                  {t("appearance.message.system")}
                </span>{" "}
                {t("appearance.message.message")}
              </span>
            </div>
          </button>
          <button
            className="self-end text-white hover:text-white/60 transition"
            onClick={() => addMessage("user")}
          >
            <div className="flex items-center justify-start text-sm font-normal">
              <Plus className="m-2" size={16} weight="bold" />
              <span className="leading-5">
                {t("appearance.message.new")}{" "}
                <span className="font-bold italic mr-1">
                  {t("appearance.message.user")}
                </span>{" "}
                {t("appearance.message.message")}
              </span>
            </div>
          </button>
        </div>
      </div>
      {hasChanges && (
        <div className="flex justify-start pt-6">
          <button
            className="transition-all duration-300 border border-slate-200 px-4 py-2 rounded-lg text-white text-sm items-center flex gap-x-2 hover:bg-slate-200 hover:text-slate-800 focus:ring-gray-800"
            onClick={handleMessageSave}
          >
            {t("appearance.message.save")}
          </button>
        </div>
      )}
    </div>
  );
}

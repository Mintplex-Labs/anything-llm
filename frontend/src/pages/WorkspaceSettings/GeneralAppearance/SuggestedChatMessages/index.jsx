import PreLoader from "@/components/Preloader";
import Workspace from "@/models/workspace";
import showToast from "@/utils/toast";
import { useEffect, useState } from "react";
import { Plus, X } from "@phosphor-icons/react";
import { useTranslation } from "react-i18next";

export default function SuggestedChatMessages({ slug }) {
  const [suggestedMessages, setSuggestedMessages] = useState([]);
  const [editingIndex, setEditingIndex] = useState(-1);
  const [newMessage, setNewMessage] = useState({ heading: "", message: "" });
  const [hasChanges, setHasChanges] = useState(false);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();
  useEffect(() => {
    async function fetchWorkspace() {
      if (!slug) return;
      const suggestedMessages = await Workspace.getSuggestedMessages(slug);
      setSuggestedMessages(suggestedMessages);
      setLoading(false);
    }
    fetchWorkspace();
  }, [slug]);

  const handleSaveSuggestedMessages = async () => {
    const validMessages = suggestedMessages.filter(
      (msg) =>
        msg?.heading?.trim()?.length > 0 || msg?.message?.trim()?.length > 0
    );
    const { success, error } = await Workspace.setSuggestedMessages(
      slug,
      validMessages
    );
    if (!success) {
      showToast(`Failed to update welcome messages: ${error}`, "error");
      return;
    }
    showToast("Successfully updated welcome messages.", "success");
    setHasChanges(false);
  };

  const addMessage = () => {
    setEditingIndex(-1);
    if (suggestedMessages.length >= 4) {
      showToast("Maximum of 4 messages allowed.", "warning");
      return;
    }
    const defaultMessage = {
      heading: t("general.message.heading"),
      message: t("general.message.body"),
    };
    setNewMessage(defaultMessage);
    setSuggestedMessages([...suggestedMessages, { ...defaultMessage }]);
    setHasChanges(true);
  };

  const removeMessage = (index) => {
    const messages = [...suggestedMessages];
    messages.splice(index, 1);
    setSuggestedMessages(messages);
    setHasChanges(true);
  };

  const startEditing = (e, index) => {
    e.preventDefault();
    setEditingIndex(index);
    setNewMessage({ ...suggestedMessages[index] });
  };

  const handleRemoveMessage = (index) => {
    removeMessage(index);
    setEditingIndex(-1);
  };

  const onEditChange = (e) => {
    const updatedNewMessage = {
      ...newMessage,
      [e.target.name]: e.target.value,
    };
    setNewMessage(updatedNewMessage);
    const updatedMessages = suggestedMessages.map((message, index) => {
      if (index === editingIndex) {
        return { ...message, [e.target.name]: e.target.value };
      }
      return message;
    });

    setSuggestedMessages(updatedMessages);
    setHasChanges(true);
  };

  if (loading)
    return (
      <div className="flex flex-col">
        <label className="block input-label">
          {t("general.message.title")}
        </label>
        <p className="text-white text-opacity-60 text-xs font-medium py-1.5">
          {t("general.message.description")}
        </p>
        <p className="text-white text-opacity-60 text-sm font-medium mt-6">
          <PreLoader size="4" />
        </p>
      </div>
    );
  return (
    <div className="w-screen mt-6">
      <div className="flex flex-col">
        <label className="block input-label">
          {t("general.message.title")}
        </label>
        <p className="text-white text-opacity-60 text-xs font-medium py-1.5">
          {t("general.message.description")}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-white/60 text-xs mt-2 w-full justify-center max-w-[600px]">
        {suggestedMessages.map((suggestion, index) => (
          <div key={index} className="relative w-full">
            <button
              className="transition-all duration-300 absolute z-10 text-neutral-700 bg-white rounded-full hover:bg-zinc-600 hover:border-zinc-600 hover:text-white border-transparent border shadow-lg ml-2"
              style={{
                top: -8,
                left: 265,
              }}
              onClick={() => handleRemoveMessage(index)}
            >
              <X className="m-[1px]" size={20} />
            </button>
            <button
              key={index}
              onClick={(e) => startEditing(e, index)}
              className={`text-left p-2.5 border rounded-xl w-full border-white/20 bg-sidebar hover:bg-workspace-item-selected-gradient ${
                editingIndex === index ? "border-sky-400" : ""
              }`}
            >
              <p className="font-semibold">{suggestion.heading}</p>
              <p>{suggestion.message}</p>
            </button>
          </div>
        ))}
      </div>
      {editingIndex >= 0 && (
        <div className="flex flex-col gap-y-4 mr-2 mt-8">
          <div className="w-1/2">
            <label className="text-white text-sm font-semibold block mb-2">
              Heading
            </label>
            <input
              placeholder="Message heading"
              className=" bg-zinc-900 text-white placeholder:text-white/20 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 w-full"
              value={newMessage.heading}
              name="heading"
              onChange={onEditChange}
            />
          </div>
          <div className="w-1/2">
            <label className="text-white text-sm font-semibold block mb-2">
              Message
            </label>
            <input
              placeholder="Message"
              className="bg-zinc-900 text-white placeholder:text-white/20 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 w-full"
              value={newMessage.message}
              name="message"
              onChange={onEditChange}
            />
          </div>
        </div>
      )}
      {suggestedMessages.length < 4 && (
        <button
          type="button"
          onClick={addMessage}
          className="flex gap-x-2 items-center justify-center mt-6 text-white text-sm hover:text-sky-400 transition-all duration-300"
        >
          {t("general.message.add")}{" "}
          <Plus className="" size={24} weight="fill" />
        </button>
      )}

      {hasChanges && (
        <div className="flex justify-start py-6">
          <button
            type="button"
            className="transition-all duration-300 border border-slate-200 px-4 py-2 rounded-lg text-white text-sm items-center flex gap-x-2 hover:bg-slate-200 hover:text-slate-800 focus:ring-gray-800"
            onClick={handleSaveSuggestedMessages}
          >
            {t("general.message.save")}
          </button>
        </div>
      )}
    </div>
  );
}

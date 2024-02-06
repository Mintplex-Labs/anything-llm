import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { isMobile } from "react-device-detect";
import showToast from "@/utils/toast";
import { ArrowUUpLeft, Plus, X } from "@phosphor-icons/react";
import Workspace from "@/models/workspace";
import paths from "@/utils/paths";

export default function WorkspaceSettings() {
  const [hasChanges, setHasChanges] = useState(false);
  const [workspace, setWorkspace] = useState(null);
  const [suggestedMessages, setSuggestedMessages] = useState([]);
  const [editingIndex, setEditingIndex] = useState(-1);
  const [newMessage, setNewMessage] = useState({ heading: "", message: "" });
  const { slug } = useParams();

  useEffect(() => {
    async function fetchWorkspace() {
      if (!slug) return;
      const workspace = await Workspace.bySlug(slug);
      const suggestedMessages = await Workspace.getSuggestedMessages(slug);
      setWorkspace(workspace);
      setSuggestedMessages(suggestedMessages);
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
      heading: "Explain to me",
      message: "the benefits of AnythingLLM",
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

  const startEditing = (index) => {
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

  return (
    <div className="w-screen h-screen overflow-hidden bg-sidebar flex">
      <a
        href={paths.workspace.chat(slug)}
        className="absolute top-2 left-2 md:top-16 md:left-10 transition-all duration-300 p-2 rounded-full text-white bg-sidebar-button hover:bg-menu-item-selected-gradient hover:border-slate-100 hover:border-opacity-50 border-transparent border z-10"
      >
        <ArrowUUpLeft className="h-4 w-4" />
      </a>
      <div
        style={{ height: isMobile ? "100%" : "calc(100% - 32px)" }}
        className="transition-all duration-500 relative md:ml-[16px] md:mr-[16px] md:my-[16px] md:rounded-[26px] bg-main-gradient w-full h-full overflow-y-scroll border-4 border-accent"
      >
        <div className="flex flex-col w-full px-1 md:px-20 md:py-12 py-16">
          <div className="w-full flex flex-col gap-y-1 pb-6 border-white border-b-2 border-opacity-10">
            <div className="items-center flex gap-x-4">
              <p className="text-2xl font-semibold text-white">
                Workspace Settings ({workspace?.name})
              </p>
            </div>
            <p className="text-sm font-base text-white text-opacity-60">
              Customize your workspace.
            </p>
          </div>
          <div className="my-6">
            <div className="flex flex-col gap-y-2">
              <h2 className="leading-tight font-medium text-white">
                Suggested Chat Messages
              </h2>
              <p className="text-sm font-base text-white/60">
                Customize the messages that will be suggested to your workspace
                users.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-white/60 text-xs mt-6 w-full justify-center max-w-[600px]">
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
                    onClick={() => startEditing(index)}
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
                    className=" bg-sidebar text-white placeholder-white placeholder-opacity-60 text-sm rounded-lg focus:border-white block w-full p-2.5"
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
                    className="bg-sidebar text-white placeholder-white placeholder-opacity-60 text-sm rounded-lg focus:border-white block w-full p-2.5"
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
                Add new message <Plus className="" size={24} weight="fill" />
              </button>
            )}

            {hasChanges && (
              <div className="flex justify-center py-6">
                <button
                  type="button"
                  className="transition-all duration-300 border border-slate-200 px-4 py-2 rounded-lg text-white text-sm items-center flex gap-x-2 hover:bg-slate-200 hover:text-slate-800 focus:ring-gray-800"
                  onClick={handleSaveSuggestedMessages}
                >
                  Save Messages
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

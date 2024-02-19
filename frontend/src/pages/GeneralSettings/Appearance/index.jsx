import React, { useState, useEffect } from "react";
import Sidebar from "@/components/SettingsSidebar";
import { isMobile } from "react-device-detect";
import AnythingLLM from "@/media/logo/anything-llm.png";
import useLogo from "@/hooks/useLogo";
import System from "@/models/system";
import EditingChatBubble from "@/components/EditingChatBubble";
import showToast from "@/utils/toast";
import { Plus } from "@phosphor-icons/react";
import FooterCustomization from "./FooterCustomization";

export default function Appearance() {
  const { logo: _initLogo, setLogo: _setLogo } = useLogo();
  const [logo, setLogo] = useState("");
  const [hasChanges, setHasChanges] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isDefaultLogo, setIsDefaultLogo] = useState(true);

  useEffect(() => {
    async function logoInit() {
      setLogo(_initLogo || "");
      const _isDefaultLogo = await System.isDefaultLogo();
      setIsDefaultLogo(_isDefaultLogo);
    }
    logoInit();
  }, [_initLogo]);

  useEffect(() => {
    async function fetchMessages() {
      const messages = await System.getWelcomeMessages();
      setMessages(messages);
    }
    fetchMessages();
  }, []);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return false;

    const objectURL = URL.createObjectURL(file);
    setLogo(objectURL);

    const formData = new FormData();
    formData.append("logo", file);
    const { success, error } = await System.uploadLogo(formData);
    if (!success) {
      showToast(`Failed to upload logo: ${error}`, "error");
      setLogo(_initLogo);
      return;
    }

    const logoURL = await System.fetchLogo();
    _setLogo(logoURL);

    showToast("Image uploaded successfully.", "success");
    setIsDefaultLogo(false);
  };

  const handleRemoveLogo = async () => {
    setLogo("");
    setIsDefaultLogo(true);

    const { success, error } = await System.removeCustomLogo();
    if (!success) {
      console.error("Failed to remove logo:", error);
      showToast(`Failed to remove logo: ${error}`, "error");
      const logoURL = await System.fetchLogo();
      setLogo(logoURL);
      setIsDefaultLogo(false);
      return;
    }

    const logoURL = await System.fetchLogo();
    _setLogo(logoURL);

    showToast("Image successfully removed.", "success");
  };

  const addMessage = (type) => {
    if (type === "user") {
      setMessages([
        ...messages,
        { user: "Double click to edit...", response: "" },
      ]);
    } else {
      setMessages([
        ...messages,
        { user: "", response: "Double click to edit..." },
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
    <div className="w-screen h-screen overflow-hidden bg-sidebar flex">
      <Sidebar />
      <div
        style={{ height: isMobile ? "100%" : "calc(100% - 32px)" }}
        className="transition-all duration-500 relative md:ml-[2px] md:mr-[16px] md:my-[16px] md:rounded-[26px] bg-main-gradient w-full h-full overflow-y-scroll border-4 border-accent"
      >
        <div className="flex flex-col w-full px-1 md:px-20 md:py-12 py-16">
          <div className="w-full flex flex-col gap-y-1 pb-6 border-white border-b-2 border-opacity-10">
            <div className="items-center flex gap-x-4">
              <p className="text-2xl font-semibold text-white">
                Appearance Settings
              </p>
            </div>
            <p className="text-sm font-base text-white text-opacity-60">
              Customize the appearance settings of your platform.
            </p>
          </div>
          <div className="my-6">
            <div className="flex flex-col gap-y-2">
              <h2 className="leading-tight font-medium text-white">
                Custom Logo
              </h2>
              <p className="text-sm font-base text-white/60">
                Upload your custom logo to make your chatbot yours.
              </p>
            </div>
            <div className="flex md:flex-row flex-col items-center">
              <img
                src={logo}
                alt="Uploaded Logo"
                className="w-48 h-48 object-contain mr-6"
                hidden={isDefaultLogo}
                onError={(e) => (e.target.src = AnythingLLM)}
              />
              <div className="flex flex-row gap-x-8">
                <label
                  className="mt-5 transition-all duration-300 hover:opacity-60"
                  hidden={!isDefaultLogo}
                >
                  <input
                    id="logo-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                  <div
                    className="w-80 py-4 bg-zinc-900/50 rounded-2xl border-2 border-dashed border-white border-opacity-60 justify-center items-center inline-flex cursor-pointer"
                    htmlFor="logo-upload"
                  >
                    <div className="flex flex-col items-center justify-center">
                      <div className="rounded-full bg-white/40">
                        <Plus className="w-6 h-6 text-black/80 m-2" />
                      </div>
                      <div className="text-white text-opacity-80 text-sm font-semibold py-1">
                        Add a custom logo
                      </div>
                      <div className="text-white text-opacity-60 text-xs font-medium py-1">
                        Recommended size: 800 x 200
                      </div>
                    </div>
                  </div>
                </label>
                <button
                  onClick={handleRemoveLogo}
                  className="text-white text-base font-medium hover:text-opacity-60"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
          <div className="mb-6">
            <div className="flex flex-col gap-y-2">
              <h2 className="leading-tight font-medium text-white">
                Custom Messages
              </h2>
              <p className="text-sm font-base text-white/60">
                Customize the automatic messages displayed to your users.
              </p>
            </div>
            <div className="mt-6 flex flex-col gap-y-6 bg-zinc-900 rounded-lg px-6 pt-4 max-w-[700px]">
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
              <div className="flex gap-4 mt-12 justify-between pb-7">
                <button
                  className="self-end text-white hover:text-white/60 transition"
                  onClick={() => addMessage("response")}
                >
                  <div className="flex items-center justify-start">
                    <Plus className="w-5 h-5 m-2" weight="fill" /> New System
                    Message
                  </div>
                </button>
                <button
                  className="self-end text-sky-400 hover:text-sky-400/60 transition"
                  onClick={() => addMessage("user")}
                >
                  <div className="flex items-center">
                    <Plus className="w-5 h-5 m-2" weight="fill" /> New User
                    Message
                  </div>
                </button>
              </div>
            </div>
            {hasChanges && (
              <div className="flex justify-center py-6">
                <button
                  className="transition-all duration-300 border border-slate-200 px-4 py-2 rounded-lg text-white text-sm items-center flex gap-x-2 hover:bg-slate-200 hover:text-slate-800 focus:ring-gray-800"
                  onClick={handleMessageSave}
                >
                  Save Messages
                </button>
              </div>
            )}
          </div>
          <FooterCustomization />
        </div>
      </div>
    </div>
  );
}

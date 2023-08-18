import { useEffect, useState } from "react";
import useLogo from "../../../../hooks/useLogo";
import usePrefersDarkMode from "../../../../hooks/usePrefersDarkMode";
import System from "../../../../models/system";
import EditingChatBubble from "../../../EditingChatBubble";
import AnythingLLMLight from "../../../../media/logo/anything-llm-light.png";
import AnythingLLMDark from "../../../../media/logo/anything-llm-dark.png";

export default function Appearance() {
  const { logo: _initLogo } = useLogo();
  const prefersDarkMode = usePrefersDarkMode();
  const [logo, setLogo] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [hasChanges, setHasChanges] = useState(false);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    async function fetchMessages() {
      const messages = await System.getWelcomeMessages();
      setMessages(messages);
    }
    fetchMessages();
  }, []);

  useEffect(() => {
    async function setInitLogo() {
      setLogo(_initLogo || "");
    }
    setInitLogo();
  }, [_initLogo]);

  useEffect(() => {
    if (!!successMsg) {
      setTimeout(() => {
        setSuccessMsg("");
      }, 3_500);
    }

    if (!!errorMsg) {
      setTimeout(() => {
        setErrorMsg("");
      }, 3_500);
    }
  }, [successMsg, errorMsg]);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return false;

    const formData = new FormData();
    formData.append("logo", file);
    const { success, error } = await System.uploadLogo(formData);
    if (!success) {
      console.error("Failed to upload logo:", error);
      setErrorMsg(error);
      setSuccessMsg("");
      return;
    }

    const logoURL = await System.fetchLogo();
    setLogo(logoURL);
    setSuccessMsg("Image uploaded successfully");
    setErrorMsg("");
  };

  const handleRemoveLogo = async () => {
    const { success, error } = await System.removeCustomLogo();
    if (!success) {
      console.error("Failed to remove logo:", error);
      setErrorMsg(error);
      setSuccessMsg("");
      return;
    }

    const logoURL = await System.fetchLogo();
    setLogo(logoURL);
    setSuccessMsg("Image successfully removed");
    setErrorMsg("");
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
      setErrorMsg(error);
      return;
    }
    setSuccessMsg("Successfully updated welcome messages.");
    setHasChanges(false);
  };

  return (
    <div className="relative w-full w-full max-h-full">
      <div className="relative bg-white rounded-lg shadow dark:bg-stone-700">
        <div className="flex items-start justify-between px-6 py-4">
          <p className="text-gray-800 dark:text-stone-200 text-base ">
            Customize the appearance settings of AnythingLLM instance.
          </p>
        </div>

        <div className="px-1 md:px-8 pb-10">
          <div className="mb-6">
            <div className="flex flex-col gap-y-2">
              <h2 className="leading-tight font-medium text-black dark:text-white">
                Custom Logo
              </h2>
              <p className="leading-tight text-sm text-gray-500 dark:text-slate-400">
                Change the logo that appears in the sidebar.
              </p>
            </div>
            <div className="flex flex-col md:flex-row items-center">
              <img
                src={logo}
                alt="Uploaded Logo"
                className="w-48 h-48 object-contain mr-6"
                onError={(e) =>
                  (e.target.src = prefersDarkMode
                    ? AnythingLLMLight
                    : AnythingLLMDark)
                }
              />
              <div className="flex flex-col">
                <div className="mb-4">
                  <label className="cursor-pointer text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600">
                    Upload Image
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileUpload}
                    />
                  </label>
                  <button
                    onClick={handleRemoveLogo}
                    className="ml-4 cursor-pointer text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
                  >
                    Remove Custom Logo
                  </button>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  Upload your logo. Recommended size: 800x200.
                </div>
              </div>
            </div>
          </div>
          <div className="mb-6">
            <div className="flex flex-col gap-y-2">
              <h2 className="leading-tight font-medium text-black dark:text-white">
                Custom Messages
              </h2>
              <p className="leading-tight text-sm text-gray-500 dark:text-slate-400">
                Change the default messages that are displayed to the users.
              </p>
            </div>
            <div className="mt-6 flex flex-col gap-y-6 bg-white dark:bg-black-900 p-4 rounded-lg">
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
              <div className="flex gap-4 mt-4 justify-between">
                <button
                  className="self-end text-orange-500 hover:text-orange-700 transition"
                  onClick={() => addMessage("response")}
                >
                  + System Message
                </button>
                <button
                  className="self-end text-orange-500 hover:text-orange-700 transition"
                  onClick={() => addMessage("user")}
                >
                  + User Message
                </button>
              </div>
            </div>
            {hasChanges && (
              <div className="flex justify-center py-6">
                <button
                  className="ml-4 cursor-pointer text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
                  onClick={handleMessageSave}
                >
                  Save Messages
                </button>
              </div>
            )}
          </div>
          {errorMsg && (
            <div className="mt-4 text-sm text-red-600 dark:text-red-400 text-center">
              {errorMsg}
            </div>
          )}
          {successMsg && (
            <div className="mt-4 text-sm text-green-600 dark:text-green-400 text-center">
              {successMsg}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

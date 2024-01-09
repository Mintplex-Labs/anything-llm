import { useState, useEffect, useRef } from "react";
import ChatHistory from "./ChatHistory";
import PromptInput from "./PromptInput";
import Workspace from "@/models/workspace";
import handleChat from "@/utils/chat";
import { isMobile } from "react-device-detect";
import { SidebarMobileHeader } from "../../Sidebar";
import showToast from "@/utils/toast";

export default function ChatContainer({ workspace, knownHistory = [] }) {
  const [message, setMessage] = useState("");
  const [loadingResponse, setLoadingResponse] = useState(false);
  const [chatHistory, setChatHistory] = useState(knownHistory);
  const [showSlashCommands, setShowSlashCommands] = useState(false);
  const [slashCommandClicked, setSlashCommandClicked] = useState(false);
  const slashCommandsRef = useRef(null);
  const slashCommandsButtonRef = useRef(null);

  const toggleSlashCommands = () => {
    setShowSlashCommands(!showSlashCommands);
  };

  const handleMessageChange = (event) => {
    setMessage(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!message || message === "") return false;

    const prevChatHistory = [
      ...chatHistory,
      { content: message, role: "user" },
      {
        content: "",
        role: "assistant",
        pending: true,
        userMessage: message,
        animate: true,
      },
    ];

    setChatHistory(prevChatHistory);
    setMessage("");
    setLoadingResponse(true);

    if (message === "/reset") {
      showToast("Successfully reset, please wait...", "success");
      setTimeout(() => window.location.reload(), 1500);
    }
  };

  // Reset the chat when clicking the slash command option
  const handleReset = () => {
    setShowSlashCommands(false);
    setSlashCommandClicked(true);
    setMessage("/reset");
  };
  useEffect(() => {
    if (message === "/reset" && slashCommandClicked) {
      handleSubmit({ preventDefault: () => {} });
    }
  }, [message]);

  useEffect(() => {
    async function fetchReply() {
      const promptMessage =
        chatHistory.length > 0 ? chatHistory[chatHistory.length - 1] : null;
      const remHistory = chatHistory.length > 0 ? chatHistory.slice(0, -1) : [];
      var _chatHistory = [...remHistory];

      if (!promptMessage || !promptMessage?.userMessage) {
        setLoadingResponse(false);
        return false;
      }

      // TODO: Delete this snippet once we have streaming stable.
      // const chatResult = await Workspace.sendChat(
      //   workspace,
      //   promptMessage.userMessage,
      //   window.localStorage.getItem(`workspace_chat_mode_${workspace.slug}`) ??
      //   "chat",
      // )
      // handleChat(
      //   chatResult,
      //   setLoadingResponse,
      //   setChatHistory,
      //   remHistory,
      //   _chatHistory
      // )

      await Workspace.streamChat(
        workspace,
        promptMessage.userMessage,
        window.localStorage.getItem(`workspace_chat_mode_${workspace.slug}`) ??
          "chat",
        (chatResult) =>
          handleChat(
            chatResult,
            setLoadingResponse,
            setChatHistory,
            remHistory,
            _chatHistory
          )
      );
      return;
    }
    loadingResponse === true && fetchReply();
  }, [loadingResponse, chatHistory, workspace]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        slashCommandsRef.current &&
        !slashCommandsRef.current.contains(event.target) &&
        slashCommandsButtonRef.current &&
        !slashCommandsButtonRef.current.contains(event.target)
      ) {
        setShowSlashCommands(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      style={{ height: isMobile ? "100%" : "calc(100% - 32px)" }}
      className="transition-all duration-500 relative md:ml-[2px] md:mr-[16px] md:my-[16px] md:rounded-[26px] bg-main-gradient w-full h-full overflow-y-scroll border-4 border-accent"
    >
      {isMobile && <SidebarMobileHeader />}
      <div className="flex flex-col h-full w-full md:mt-0 mt-[40px]">
        {showSlashCommands && (
          <div
            ref={slashCommandsRef}
            className="w-full flex justify-center absolute md:bottom-[146px] md:-left-32 bottom-20 left-0 z-10"
          >
            <div className="p-2 w-full md:w-fit bg-zinc-800 rounded-2xl shadow flex-col justify-center items-start gap-2.5 inline-flex">
              <button
                onClick={handleReset}
                className="hover:cursor-pointer hover:bg-zinc-700 px-2 py-2 rounded-xl flex flex-col justify-start"
              >
                <div className="text-white text-sm font-bold">/reset</div>
                <div className="text-white text-opacity-60 text-sm">
                  Clear your chat history and begin a new chat
                </div>
              </button>
            </div>
          </div>
        )}
        <ChatHistory history={chatHistory} workspace={workspace} />
        <PromptInput
          workspace={workspace}
          message={message}
          submit={handleSubmit}
          onChange={handleMessageChange}
          inputDisabled={loadingResponse}
          buttonDisabled={loadingResponse}
          toggleSlashCommands={toggleSlashCommands}
          showSlashCommands={showSlashCommands}
          slashCommandsButtonRef={slashCommandsButtonRef}
        />
      </div>
    </div>
  );
}

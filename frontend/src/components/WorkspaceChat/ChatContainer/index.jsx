import { useState, useEffect } from "react";
import ChatHistory from "./ChatHistory";
import PromptInput from "./PromptInput";
import Workspace from "@/models/workspace";
import handleChat from "@/utils/chat";
import { isMobile } from "react-device-detect";
import { SidebarMobileHeader } from "../../Sidebar";
import { useParams } from "react-router-dom";

export default function ChatContainer({ workspace, knownHistory = [] }) {
  const { threadSlug = null } = useParams();
  const [message, setMessage] = useState("");
  const [loadingResponse, setLoadingResponse] = useState(false);
  const [chatHistory, setChatHistory] = useState(knownHistory);
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
  };

  const sendCommand = async (command, submit = false) => {
    if (!command || command === "") return false;
    if (!submit) {
      setMessage(command);
      return;
    }

    const prevChatHistory = [
      ...chatHistory,
      { content: command, role: "user" },
      {
        content: "",
        role: "assistant",
        pending: true,
        userMessage: command,
        animate: true,
      },
    ];

    setChatHistory(prevChatHistory);
    setMessage("");
    setLoadingResponse(true);
  };

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

      if (!!threadSlug) {
        await Workspace.threads.streamChat(
          { workspaceSlug: workspace.slug, threadSlug },
          promptMessage.userMessage,
          (chatResult) =>
            handleChat(
              chatResult,
              setLoadingResponse,
              setChatHistory,
              remHistory,
              _chatHistory
            )
        );
      } else {
        await Workspace.streamChat(
          workspace,
          promptMessage.userMessage,
          (chatResult) =>
            handleChat(
              chatResult,
              setLoadingResponse,
              setChatHistory,
              remHistory,
              _chatHistory
            )
        );
      }
      return;
    }
    loadingResponse === true && fetchReply();
  }, [loadingResponse, chatHistory, workspace]);

  return (
    <div
      style={{ height: isMobile ? "100%" : "calc(100% - 32px)" }}
      className="transition-all duration-500 relative md:ml-[2px] md:mr-[16px] md:my-[16px] md:rounded-[16px] bg-main-gradient w-full h-full overflow-y-scroll border-2 border-outline"
    >
      {isMobile && <SidebarMobileHeader />}
      <div className="flex flex-col h-full w-full md:mt-0 mt-[40px]">
        <ChatHistory
          history={chatHistory}
          workspace={workspace}
          sendCommand={sendCommand}
        />
        <PromptInput
          workspace={workspace}
          message={message}
          submit={handleSubmit}
          onChange={handleMessageChange}
          inputDisabled={loadingResponse}
          buttonDisabled={loadingResponse}
          sendCommand={sendCommand}
        />
      </div>
    </div>
  );
}

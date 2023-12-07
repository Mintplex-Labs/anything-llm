import { useState, useEffect } from "react";
import ChatHistory from "./ChatHistory";
import PromptInput from "./PromptInput";
import Workspace from "@/models/workspace";
import handleChat from "@/utils/chat";
import { isMobile } from "react-device-detect";
import { SidebarMobileHeader } from "../../Sidebar";

export default function ChatContainer({ workspace, knownHistory = [] }) {
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

  return (
    <div
      style={{ height: isMobile ? "100%" : "calc(100% - 32px)" }}
      className="transition-all duration-500 relative md:ml-[2px] md:mr-[16px] md:my-[16px] md:rounded-[26px] bg-main-gradient w-full h-full overflow-y-scroll border-4 border-accent"
    >
      {isMobile && <SidebarMobileHeader />}
      <div className="flex flex-col h-full w-full md:mt-0 mt-[40px]">
        <ChatHistory history={chatHistory} workspace={workspace} />
        <PromptInput
          workspace={workspace}
          message={message}
          submit={handleSubmit}
          onChange={handleMessageChange}
          inputDisabled={loadingResponse}
          buttonDisabled={loadingResponse}
        />
      </div>
    </div>
  );
}

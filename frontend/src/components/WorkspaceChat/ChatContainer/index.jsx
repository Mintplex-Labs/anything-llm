import { useState, useEffect } from "react";
import ChatHistory from "./ChatHistory";
import PromptInput from "./PromptInput";
import Workspace from "@/models/workspace";
import handleChat from "@/utils/chat";
import { isMobile } from "react-device-detect";
import { SidebarMobileHeader } from "../../Sidebar";
import { useParams } from "react-router-dom";
import { extractMetaData } from "@/utils/chat/extractMetaData";
import DynamicInput from "./DynamicInput";
import { ArrowUUpLeft, Keyboard } from "@phosphor-icons/react";

export default function ChatContainer({
  workspace,
  knownHistory = [],
  isDynamicInput,
  currentInputMeta,
  setCurrentInputMeta,
}) {
  const { threadSlug = null } = useParams();
  const [message, setMessage] = useState("");
  const [loadingResponse, setLoadingResponse] = useState(false);
  const [chatHistory, setChatHistory] = useState(knownHistory);
  const [finalizedChatHistory, setFinalizedChatHistory] =
    useState(knownHistory);
  const [isForcedTextInput, setIsForcedTextInput] = useState(false);

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
    setFinalizedChatHistory(prevChatHistory);
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

      if (isDynamicInput) {
        const { remainingText, metaData } = extractMetaData(
          _chatHistory[_chatHistory.length - 1].content
        );
        _chatHistory[_chatHistory.length - 1].content = remainingText;
        setFinalizedChatHistory(_chatHistory);
        setCurrentInputMeta(metaData);
        console.log("metaData", metaData);
      }

      return;
    }
    loadingResponse === true && fetchReply();
  }, [loadingResponse, chatHistory, workspace]);

  const renderInputComponent = () => {
    if (
      !isDynamicInput ||
      currentInputMeta?.inputs?.type === "text" ||
      currentInputMeta?.inputs === undefined ||
      isForcedTextInput
    ) {
      return (
        <PromptInput
          workspace={workspace}
          message={message}
          submit={handleSubmit}
          onChange={handleMessageChange}
          inputDisabled={loadingResponse}
          buttonDisabled={loadingResponse}
          sendCommand={sendCommand}
        />
      );
    }

    if (currentInputMeta?.inputs?.type !== "text") {
      return <DynamicInput {...currentInputMeta} />;
    }
  };

  return (
    <div
      style={{ height: isMobile ? "100%" : "calc(100% - 32px)" }}
      className="transition-all duration-500 relative md:ml-[2px] md:mr-[16px] md:my-[16px] md:rounded-[16px] bg-main-gradient w-full h-full overflow-y-scroll border-2 border-outline"
    >
      {isMobile && <SidebarMobileHeader />}
      <div className="flex flex-col h-full w-full md:mt-0 mt-[40px]">
        <ChatHistory
          history={isDynamicInput ? finalizedChatHistory : chatHistory}
          workspace={workspace}
          sendCommand={sendCommand}
        />
        {renderInputComponent()}
        {isDynamicInput && currentInputMeta?.inputs != undefined && (
          <div className="w-full fixed md:absolute -bottom-1 left-0 z-10 md:z-0 flex justify-center items-center">
            <button
              type="button"
              className="transition-all w-fit duration-300 px-5 py-2.5 rounded-lg text-white/50 text-xs items-center flex gap-x-2 hover:text-white focus:ring-gray-800"
              onClick={() => setIsForcedTextInput(!isForcedTextInput)}
            >
              {isForcedTextInput ? (
                <>
                  <ArrowUUpLeft className="h-5 w-5" /> back to options
                </>
              ) : (
                <>
                  <Keyboard className="h-5 w-5" /> Type another answer
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

import { useEffect, useRef } from "react";
import { v4 } from "uuid";
import ChatWindowHeader from "./Header";
import SessionId from "../SessionId";
import useChatHistory from "@/hooks/chat/useChatHistory";
import MessageHistory from "./Messages";
import PromptInput from "./PromptInput";

function scrollToBottom(messagesEndRef = null) {
  if (!messagesEndRef) return;
  messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
}

export default function ChatWindow({ closeChat, settings, sessionId }) {
  const { chatHistory: messages, setChatHistory: setMessages } = useChatHistory(
    settings,
    sessionId
  );
  const messagesEndRef = useRef(null);

  useEffect(() => {
    scrollToBottom(messagesEndRef);
  }, [messages]);

  const appendMessage = (newMessage, sender) => {
    setMessages((prev) => [...prev, { ...newMessage, id: v4(), sender }]);
  };

  return (
    <div className="flex flex-col">
      <ChatWindowHeader closeChat={closeChat} />
      <div className="mb-4 p-4 bg-gray-100 rounded flex flex-col items-center">
        <MessageHistory messages={messages} messagesEndRef={messagesEndRef} />
        <PromptInput
          settings={settings}
          sessionId={sessionId}
          appendMessage={appendMessage}
          setMessages={setMessages}
        />
      </div>
      <SessionId />
    </div>
  );
}

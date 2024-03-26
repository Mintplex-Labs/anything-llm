import ChatService from "@/models/chatService";

export default function ResetChat({ setChatHistory, settings, sessionId }) {
  const handleChatReset = async () => {
    await ChatService.resetEmbedChatSession(settings, sessionId);
    setChatHistory([]);
  };

  return (
    <div className="w-full flex justify-center">
      <button
        className="text-sm text-[#7A7D7E] hover:text-[#7A7D7E]/80 hover:underline"
        onClick={() => handleChatReset()}
      >
        Reset Chat
      </button>
    </div>
  );
}

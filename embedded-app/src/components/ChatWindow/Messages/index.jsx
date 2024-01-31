export default function MessageHistory({ messages, messagesEndRef }) {
  return (
    <div className="chat-messages w-full h-64 overflow-y-auto mb-2">
      {messages.map((msg, index) => (
        <div
          key={msg?.id || index}
          className={`p-2  my-1 rounded-md shadow ${
            msg.sender === "user"
              ? "w-[90%] bg-gray-700 float-left"
              : "w-fit bg-blue-600 float-right text-right"
          }`}
        >
          <p className="text-sm text-white">{msg.textResponse || msg.error}</p>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
}

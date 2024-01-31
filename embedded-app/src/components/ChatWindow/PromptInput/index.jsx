import { useRef, useState } from "react";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import { v4 } from "uuid";

export default function PromptInput({
  settings,
  sessionId,
  appendMessage,
  setMessages,
}) {
  const eventSourceRef = useRef(null);
  const [chatLoading, setChatLoading] = useState(false);
  const { baseApiUrl, slug } = settings;

  const addChunkToLastMessage = (textChunk, sender) => {
    setMessages((prev) => {
      const lastMessage = prev.length > 0 ? prev[prev.length - 1] : null;
      if (lastMessage && lastMessage.sender === sender && !lastMessage.close) {
        return [
          ...prev.slice(0, -1),
          {
            ...lastMessage,
            textResponse: lastMessage.textResponse + textChunk,
          },
        ];
      } else {
        return [...prev, { id: v4(), textResponse: textChunk, sender }];
      }
    });
  };

  const streamMessages = async (message) => {
    appendMessage({ textResponse: message, close: false }, "user");
    setChatLoading(true);

    const ctrl = new AbortController();
    eventSourceRef.current = ctrl;

    await fetchEventSource(`${baseApiUrl}/workspace/stream-embedded-chat`, {
      method: "POST",
      body: JSON.stringify({
        prompt,
        message,
        sessionId,
        mode: "chat",
        slug,
      }),
      signal: ctrl.signal,
      openWhenHidden: true,
      onopen(response) {
        if (!response.ok) {
          appendMessage(
            {
              textResponse: `Error: Response code ${response.status}`,
              close: true,
            },
            "system"
          );
          ctrl.abort();
        }
      },
      onmessage(msg) {
        try {
          const chatResult = JSON.parse(msg.data);
          addChunkToLastMessage(chatResult.textResponse, "system");
          if (chatResult.close) {
            setChatLoading(false);
            finalizeLastMessage();
          }
        } catch (error) {
          appendMessage(
            { textResponse: `Error: ${error.message}`, close: true },
            "system"
          );
          setChatLoading(false);
        }
      },
      onerror(err) {
        appendMessage(
          { textResponse: `Error: ${err.message}`, close: true },
          "system"
        );
        ctrl.abort();
        setChatLoading(false);
      },
    });
  };

  const finalizeLastMessage = () => {
    setMessages((prev) => {
      const lastMessage = prev.length > 0 ? prev[prev.length - 1] : null;
      if (lastMessage) {
        return [...prev.slice(0, -1), { ...lastMessage, close: true }];
      }
      return prev;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const message = e.target.message.value;
    e.target.message.value = "";
    await streamMessages(message);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full mt-2">
      <div className="flex w-full">
        <textarea
          name="message"
          required={true}
          placeholder="Enter a message..."
          className="flex-1 px-2 py-1 border text-sm rounded-l-lg outline-none focus:ring-0 disabled:cursor-not-allowed resize-none"
          disabled={chatLoading}
          autoComplete="off"
          rows={3}
        ></textarea>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 rounded-r-lg disabled:cursor-not-allowed hover:bg-blue-700/90"
          disabled={chatLoading}
        >
          Send
        </button>
      </div>
    </form>
  );
}

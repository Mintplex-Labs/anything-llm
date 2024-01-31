import { useEffect, useState, useRef } from "react";
import AnythingLLMLogo from "./assets/anything-llm-dark.png";
import { v4 } from "uuid";
import { fetchEventSource } from "@microsoft/fetch-event-source";

export default function App() {
  const BASE_API_URL = "http://localhost:3001/api";
  const SLUG = "yo";
  const PROMPT =
    "Given the following conversation, relevant context, and a follow up question, reply with an answer to the current question the user is asking. Return only your response to the question given the above information following the users instructions as needed.";
  // system prompt
  // preset history (array of messages)
  // LLM model to select
  // temperature
  // chat mode (query or chat)
  // possible option for citations (show or hide)

  const [isOpen, setIsOpen] = useState(false);
  const [userId, setUserId] = useState("");
  const [messages, setMessages] = useState([]);
  const [chatLoading, setChatLoading] = useState(false);
  const eventSourceRef = useRef(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  useEffect(() => {
    let id = localStorage.getItem("userId");
    if (!id) {
      id = v4();
      localStorage.setItem("userId", id);
    }
    setUserId(id);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const fetchData = async () => {
      try {
        const url = `${BASE_API_URL}/workspace/${SLUG}/chats-embedded-app`;

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Invalid response from server");
        }

        const responseData = await response.json();

        const formattedMessages = responseData.history.map((msg) => ({
          ...msg,
          id: v4(),
          sender: msg.role === "user" ? "user" : "system",
          textResponse: msg.content,
          close: false,
        }));

        setMessages(formattedMessages);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [SLUG, isOpen]);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  const addMessage = (newMessage, sender) => {
    setMessages((prev) => [...prev, { ...newMessage, id: v4(), sender }]);
  };

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
    addMessage({ textResponse: message, close: false }, "user");
    setChatLoading(true);

    const ctrl = new AbortController();
    eventSourceRef.current = ctrl;

    await fetchEventSource(`${BASE_API_URL}/workspace/stream-embedded-chat`, {
      method: "POST",
      body: JSON.stringify({
        prompt: PROMPT,
        message,
        mode: "chat",
        userId,
        slug: SLUG,
      }),
      signal: ctrl.signal,
      openWhenHidden: true,
      onopen(response) {
        if (!response.ok) {
          addMessage(
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
          addMessage(
            { textResponse: `Error: ${error.message}`, close: true },
            "system"
          );
          setChatLoading(false);
        }
      },
      onerror(err) {
        addMessage(
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
    <>
      <head>
        <link
          href="https://unpkg.com/tailwindcss@^1.0/dist/tailwind.min.css"
          rel="stylesheet"
        />
      </head>
      <div className="fixed bottom-0 right-0 mb-4 mr-4 z-50">
        <div
          className={`transition-all duration-300 ease-in-out ${
            isOpen
              ? "max-w-md p-4 bg-white rounded-lg border shadow-lg"
              : "w-16 h-16 rounded-full"
          }`}
        >
          {isOpen && (
            <div className="flex flex-col">
              <div className="flex justify-between items-center">
                <img
                  className="h-10"
                  src={AnythingLLMLogo}
                  alt="AnythingLLM Logo"
                />
                <button onClick={toggleOpen} className="text-xl font-bold">
                  X
                </button>
              </div>
              <div className="mb-4 p-4 bg-gray-100 rounded flex flex-col items-center">
                <div className="chat-messages h-64 w-72 overflow-y-auto mb-2">
                  {messages.map((msg, index) => (
                    <div
                      key={index}
                      className={`p-2 my-1 rounded-md shadow ${
                        msg.sender === "user" ? "bg-gray-700" : "bg-blue-600"
                      }`}
                    >
                      <p className="text-sm text-white">
                        {msg.textResponse || msg.error}
                      </p>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
                <form onSubmit={handleSubmit} className="w-full mt-2">
                  <div className="flex w-full">
                    <input
                      type="text"
                      name="message"
                      placeholder="Enter a message..."
                      className="flex-1 px-2 py-1 border rounded-l-lg disabled:cursor-not-allowed"
                      disabled={chatLoading}
                    />
                    <button
                      type="submit"
                      className="bg-blue-500 text-white px-4 rounded-r-lg disabled:cursor-not-allowed hover:bg-blue-700/90"
                      disabled={chatLoading}
                    >
                      Send
                    </button>
                  </div>
                </form>
              </div>
              <div className="text-xs text-gray-500 w-full text-center">
                ID: {userId}
              </div>
            </div>
          )}
          {!isOpen && (
            <button
              onClick={toggleOpen}
              className="w-16 h-16 rounded-full bg-blue-500 text-white text-2xl"
              aria-label="Toggle Menu"
            >
              +
            </button>
          )}
        </div>
      </div>
    </>
  );
}

// SCRIPT TO LOAD THE EMBEDDED-ANYTHING-LLM.UMD.JS ON PAGE WITH <SCRIPT></SCRIPT>
// var script = document.createElement('script');
// script.src = 'http://localhost:5000/embedded-anything-llm.umd.js';
// document.head.appendChild(script);

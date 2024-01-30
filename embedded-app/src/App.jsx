import { useEffect, useState, useRef } from "react";
import AnythingLLMLogo from "./assets/anything-llm-dark.png";
import "./App.css";
import { v4 } from "uuid";
import { fetchEventSource } from "@microsoft/fetch-event-source";

export default function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [userId, setUserId] = useState("");
  const [messages, setMessages] = useState([]);
  const [chatLoading, setChatLoading] = useState(false);
  const eventSourceRef = useRef(null);

  useEffect(() => {
    let id = localStorage.getItem("userId");
    if (!id) {
      id = v4();
      localStorage.setItem("userId", id);
    }
    setUserId(id);
  }, []);

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

    await fetchEventSource(
      `http://localhost:3001/api/workspace/hello/stream-embedded-chat`,
      {
        method: "POST",
        body: JSON.stringify({ message, mode: "chat" }),
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
      }
    );
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
                <div className="chat-messages h-64 overflow-y-auto w-full mb-2">
                  {messages.map((msg, index) => (
                    <div
                      key={index}
                      className={`p-2 my-1 rounded shadow ${
                        msg.sender === "user" ? "bg-gray-500" : "bg-blue-500"
                      }`}
                    >
                      <p className="text-sm text-white">
                        {msg.textResponse || msg.error}
                      </p>
                    </div>
                  ))}
                </div>
                <form onSubmit={handleSubmit}>
                  <div className="flex">
                    <input
                      type="text"
                      name="message"
                      placeholder="Enter a message..."
                      className="px-2 py-1 border rounded-l-lg flex-grow disabled:cursor-not-allowed"
                      disabled={chatLoading}
                    />
                    <button
                      type="submit"
                      className="bg-blue-500 text-white px-4 rounded-r-lg disabled:cursor-not-allowed"
                      disabled={chatLoading}
                    >
                      Send
                    </button>
                  </div>
                </form>
              </div>
              <p className="text-blue-500 hover:text-opacity-70 cursor-pointer text-center">
                Learn more
              </p>
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

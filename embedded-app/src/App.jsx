import { useEffect, useState, useRef } from "react";
import AnythingLLMLogo from "./assets/anything-llm-dark.png";
import "./App.css";
import { v4 } from "uuid";
import { fetchEventSource } from "@microsoft/fetch-event-source";

export default function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [userId, setUserId] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
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
    // if (!isOpen) {
    //   streamMessages();
    // }
  };

  const handleChat = (chatResult) => {
    setChatMessages((prev) => [...prev, chatResult]);
    if (chatResult.close) {
      eventSourceRef.current?.abort();
      console.log("message stream completed");
    }
  };

  const streamMessages = async () => {
    const ctrl = new AbortController();
    eventSourceRef.current = ctrl;

    await fetchEventSource(
      `http://localhost:3001/api/workspace/hello/stream-chat`,
      {
        method: "POST",
        body: JSON.stringify({ message, mode: "chat" }),
        // headers: baseHeaders(),
        signal: ctrl.signal,
        openWhenHidden: true,
        onopen(response) {
          if (response.ok) {
            // everything's good
          } else {
            handleChat({
              id: v4(),
              type: "abort",
              textResponse: null,
              sources: [],
              close: true,
              error: `An error occurred while streaming response. Code ${response.status}`,
            });
            ctrl.abort();
          }
        },
        onmessage(msg) {
          try {
            const chatResult = JSON.parse(msg.data);
            console.log("chatResult: ", chatResult);
            handleChat(chatResult);
          } catch (error) {
            console.error("Error parsing message:", error);
          }
        },
        onerror(err) {
          handleChat({
            id: v4(),
            type: "abort",
            textResponse: null,
            sources: [],
            close: true,
            error: `An error occurred while streaming response. ${err.message}`,
          });
          ctrl.abort();
        },
      }
    );
  };

  const sendMessage = async () => {
    console.log("EMBEDDED MESSAGE: ", message);
    await streamMessages();
    fetch(`http://localhost:3001/api/workspace/${userId}/embedded-chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: message,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("Success:", data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  console.log("chatMessages: ", chatMessages);
  console.log("isOpen: ", isOpen);

  return (
    <div className="fixed bottom-0 right-0 mb-4 mr-4 z-50">
      <div
        className={`transition-all duration-300 ease-in-out ${
          isOpen
            ? "max-w-sm p-4 bg-white rounded-lg border shadow-lg"
            : "w-16 h-16 rounded-full"
        }`}
      >
        {isOpen && (
          <>
            <div className="flex justify-center">
              <img
                className="px-10"
                src={AnythingLLMLogo}
                alt="AnythingLLM Logo"
              />
            </div>
            <h1 className="text-md text-center font-semibold">
              Hello from Embedded App 👋
            </h1>
            <div className="card mt-4 p-4 bg-gray-100 rounded flex flex-col items-center justify-center">
              <div className="flex">
                <input
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Enter a message..."
                ></input>
                <button onClick={sendMessage}>Send message</button>
              </div>
              <div className="chat-messages">
                {chatMessages.map((msg) => (
                  <p key={msg.id}>{msg.textResponse || msg.error}</p>
                ))}
              </div>
            </div>
            <p className="mt-4 text-md text-blue-500 hover:text-opacity-30 text-center hover:cursor-pointer">
              Learn more
            </p>
          </>
        )}
        <button
          onClick={toggleOpen}
          className={`absolute top-0 right-0 w-16 h-16 rounded-full ${
            isOpen ? "bg-white" : "bg-blue-500"
          }`}
          aria-label="Toggle Menu"
        >
          {isOpen ? "X" : "+"}
        </button>
      </div>
    </div>
  );
}

// SCRIPT TO LOAD THE EMBEDDED-ANYTHING-LLM.UMD.JS ON PAGE WITH <SCRIPT></SCRIPT>
// var script = document.createElement('script');
// script.src = 'http://localhost:5000/embedded-anything-llm.umd.js';
// document.head.appendChild(script);

import { useEffect, useState } from "react";

const historyURL = ({ baseApiUrl, slug }) =>
  `${baseApiUrl}/workspace/${slug}/chats-embedded-app`;

export default function useChatHistory(settings = null, sessionId = null) {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    async function fetchChatHistory() {
      if (!sessionId || !settings) return;
      try {
        const formattedMessages = await fetch(historyURL(settings))
          .then((res) => {
            if (res.ok) return res.json();
            throw new Error("Invalid response from server");
          })
          .then((res) => {
            return res.history.map((msg) => ({
              ...msg,
              id: v4(),
              sender: msg.role === "user" ? "user" : "system",
              textResponse: msg.content,
              close: false,
            }));
          })
          .catch((e) => {
            console.error(e);
            return [];
          });
        setMessages(formattedMessages);
      } catch (error) {
        console.error("Error fetching historical chats:", error);
      }
    }
    fetchChatHistory();
  }, [sessionId, settings]);

  return { chatHistory: messages, setChatHistory: setMessages };
}

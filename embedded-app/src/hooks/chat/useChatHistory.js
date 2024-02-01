import { useEffect, useState } from "react";
import { v4 } from "uuid";

const historyURL = ({ embedId, baseApiUrl }, sessionId) =>
  `${baseApiUrl}/${embedId}/${sessionId}`;

export default function useChatHistory(settings = null, sessionId = null) {
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    async function fetchChatHistory() {
      if (!sessionId || !settings) return;
      try {
        const formattedMessages = await fetch(historyURL(settings, sessionId))
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
        setLoading(false);
      } catch (error) {
        console.error("Error fetching historical chats:", error);
        setLoading(false);
      }
    }
    fetchChatHistory();
  }, [sessionId, settings]);

  return { chatHistory: messages, setChatHistory: setMessages, loading };
}

import useGetScriptAttributes from "@/hooks/useScriptAttributes";
import useSessionId from "@/hooks/useSessionId";
import useOpenChat from "@/hooks/useOpen";
import Head from "@/components/Head";
import OpenButton from "@/components/OpenButton";
import ChatWindow from "./components/ChatWindow";
import { useEffect } from "react";

export default function App() {
  const { isChatOpen, toggleOpenChat } = useOpenChat();
  const embedSettings = useGetScriptAttributes();
  const sessionId = useSessionId();

  useEffect(() => {
    toggleOpenChat(embedSettings.openOnLoad === "on");
  }, [embedSettings.loaded]);

  if (!embedSettings.loaded) return null;
  return (
    <>
      <Head />
      <div className="fixed bottom-0 right-0 mb-4 mr-4 z-50">
        <div
          style={{
            width: isChatOpen ? 320 : "auto",
            height: isChatOpen ? "93vh" : "auto",
          }}
          className={`transition-all duration-300 ease-in-out ${
            isChatOpen
              ? "max-w-md p-4 bg-white rounded-lg border shadow-lg w-72"
              : "w-16 h-16 rounded-full"
          }`}
        >
          {isChatOpen && (
            <ChatWindow
              closeChat={() => toggleOpenChat(false)}
              settings={embedSettings}
              sessionId={sessionId}
            />
          )}
          <OpenButton
            settings={embedSettings}
            isOpen={isChatOpen}
            toggleOpen={toggleOpenChat}
          />
        </div>
      </div>
    </>
  );
}

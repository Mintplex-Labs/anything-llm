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
    if (embedSettings.openOnLoad === "on") {
      toggleOpenChat(true);
    }
  }, [embedSettings.loaded]);

  if (!embedSettings.loaded) return null;

  const positionClasses = {
    "bottom-left": "bottom-0 left-0 ml-4",
    "bottom-right": "bottom-0 right-0 mr-4",
    "top-left": "top-0 left-0 ml-4 mt-4",
    "top-right": "top-0 right-0 mr-4 mt-4",
  };

  const position = embedSettings.position || "bottom-right";

  return (
    <>
      <Head />
      <div className={`fixed inset-0 z-50 ${isChatOpen ? "block" : "hidden"}`}>
        <div
          className={`w-full h-full bg-white md:max-w-[400px] md:max-h-[700px] md:fixed md:bottom-0 md:right-0 md:mb-4 md:mr-4 md:rounded-2xl md:border md:border-gray-300 md:shadow-[0_4px_14px_rgba(0,0,0,0.25)] ${positionClasses[position]}`}
        >
          {isChatOpen && (
            <ChatWindow
              closeChat={() => toggleOpenChat(false)}
              settings={embedSettings}
              sessionId={sessionId}
            />
          )}
        </div>
      </div>
      {!isChatOpen && (
        <div
          className={`fixed bottom-0 ${positionClasses[position]} mb-4 z-50`}
        >
          <OpenButton
            settings={embedSettings}
            isOpen={isChatOpen}
            toggleOpen={() => toggleOpenChat(true)}
          />
        </div>
      )}
    </>
  );
}

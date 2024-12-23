import { useIsAgentSessionActive } from "@/utils/chat/agent";

export default function ResetCommand({ setShowing, sendCommand }) {
  const isActiveAgentSession = useIsAgentSessionActive();
  if (isActiveAgentSession) return null; // cannot reset during active agent chat

  return (
    <button
      onClick={() => {
        setShowing(false);
        sendCommand("/reset", true);
      }}
      className="border-none w-full hover:cursor-pointer hover:bg-theme-action-menu-item-hover px-2 py-2 rounded-xl flex flex-col justify-start"
    >
      <div className="w-full flex-col text-left flex pointer-events-none">
        <div className="text-white text-sm font-bold">/reset</div>
        <div className="text-white text-opacity-60 text-sm">
          Clear your chat history and begin a new chat
        </div>
      </div>
    </button>
  );
}

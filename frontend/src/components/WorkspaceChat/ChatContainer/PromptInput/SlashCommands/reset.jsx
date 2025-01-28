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
      className="border-none w-full hover:cursor-pointer px-2 py-2 rounded-xl flex flex-col justify-start hover:bg-slate-500/20"
    >
      <div className="w-full flex-col text-left flex pointer-events-none">
        <div className="text-white text-sm font-bold custom-text-secondary">/reset</div>
        <div className="text-white text-opacity-60 text-sm custom-text-secondary">
          Clear your chat history and begin a new chat
        </div>
      </div>
    </button>
  );
}

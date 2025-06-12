import { useIsAgentSessionActive } from "@/utils/chat/agent";

export default function ResetCommand({ setShowing, sendCommand, workspace }) {
  const isActiveAgentSession = useIsAgentSessionActive();
  
  // Hide reset command only if there's an active agent session AND the workspace is NOT in agent mode
  // If workspace is in agent mode, reset should always be available (except during active sessions, but then the logic is different)
  if (isActiveAgentSession && workspace?.chatMode !== "agent") return null;

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

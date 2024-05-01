import { useIsAgentSessionActive } from "@/utils/chat/agent";
import { useNavigate } from "react-router-dom";

export default function ResetCommand({ setShowing, sendCommand }) {
  const isActiveAgentSession = useIsAgentSessionActive();
  const navigate = useNavigate();
  if (isActiveAgentSession) return null; // cannot reset during active agent chat

  function handleReset() {
    setShowing(false);
    sendCommand("/reset", true);
    setTimeout(() => {
      navigate(0);
    }, 500);
  }

  return (
    <button
      onClick={handleReset}
      className="w-full hover:cursor-pointer hover:bg-zinc-700 px-2 py-2 rounded-xl flex flex-col justify-start"
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

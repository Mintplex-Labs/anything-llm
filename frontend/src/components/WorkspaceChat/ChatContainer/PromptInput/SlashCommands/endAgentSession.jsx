import { useIsAgentSessionActive } from "@/utils/chat/agent";

export default function EndAgentSession({ setShowing, sendCommand }) {
  const isActiveAgentSession = useIsAgentSessionActive();
  if (!isActiveAgentSession) return null;

  return (
    <button
      onClick={() => {
        setShowing(false);
        sendCommand("/exit", true);
      }}
      className="border-none w-full hover:cursor-pointer hover:bg-theme-action-menu-item-hover px-2 py-2 rounded-xl flex flex-col justify-start"
    >
      <div className="w-full flex-col text-left flex pointer-events-none">
        <div className="text-white text-sm font-bold">/exit</div>
        <div className="text-white text-opacity-60 text-sm">
          Halt the current agent session.
        </div>
      </div>
    </button>
  );
}

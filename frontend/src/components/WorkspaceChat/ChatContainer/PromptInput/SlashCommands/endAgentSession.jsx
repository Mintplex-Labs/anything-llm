import { useIsAgentSessionActive } from "@/utils/chat/agent";

export default function EndAgentSession({
  setShowing,
  sendCommand,
  workspace,
}) {
  const isActiveAgentSession = useIsAgentSessionActive();

  // Only show exit command if there's an active agent session AND workspace is NOT in agent mode
  // If workspace is in agent mode, we don't want users to exit the agent
  if (!isActiveAgentSession || workspace?.chatMode === "agent") return null;

  return (
    <button
      onClick={() => {
        setShowing(false);
        sendCommand({ text: "/exit", autoSubmit: true });
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

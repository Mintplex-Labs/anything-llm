import { useIsAgentSessionActive } from "@/utils/chat/agent";

export default function SlashPresets({ setShowing, sendCommand }) {
  const isActiveAgentSession = useIsAgentSessionActive();
  if (isActiveAgentSession) return null; // cannot reset during active agent chat

  return (
    <button
      onClick={() => {
        setShowing(false);
        sendCommand("/reset", true);
      }}
      className="w-full hover:cursor-pointer hover:bg-zinc-700 px-2 py-2 rounded-xl flex flex-col justify-start"
    >
      <div className="w-full flex-col text-left flex pointer-events-none">
        <div className="text-white text-sm font-bold">Add New Preset</div>
        <div className="text-white text-opacity-60 text-sm">
          Create presets for prompts you use repeatedly
        </div>
      </div>
    </button>
  );
}

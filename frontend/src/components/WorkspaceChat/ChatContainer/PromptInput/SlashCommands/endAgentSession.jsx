import { useEffect, useState } from "react";

export const AGENT_SESSION_START = "agentSessionStart";
export const AGENT_SESSION_END = "agentSessionEnd";

export default function EndAgentSession({ setShowing, sendCommand }) {
  const [visible, setVisibility] = useState(false);
  useEffect(() => {
    function listenForAgentSession() {
      if (!window) return;
      window.addEventListener(AGENT_SESSION_START, () => setVisibility(true));
      window.addEventListener(AGENT_SESSION_END, () => setVisibility(false));
    }
    listenForAgentSession();
  }, []);

  if (!visible) return null;
  return (
    <button
      onClick={() => {
        setShowing(false);
        sendCommand("/exit", true);
      }}
      className="w-full hover:cursor-pointer hover:bg-zinc-700 px-2 py-2 rounded-xl flex flex-col justify-start"
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

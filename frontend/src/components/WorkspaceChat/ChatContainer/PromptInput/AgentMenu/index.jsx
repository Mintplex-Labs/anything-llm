import { useEffect, useRef, useState } from "react";
import { Tooltip } from "react-tooltip";
import { At } from "@phosphor-icons/react";
import { useIsAgentSessionActive } from "@/utils/chat/agent";

export default function AvailableAgentsButton({ showing, setShowAgents }) {
  const agentSessionActive = useIsAgentSessionActive();
  if (agentSessionActive) return null;
  return (
    <div
      id="agent-list-btn"
      data-tooltip-id="tooltip-agent-list-btn"
      data-tooltip-content="View all available agents you can use for chatting."
      aria-label="View all available agents you can use for chatting."
      onClick={() => setShowAgents(!showing)}
      className={`flex justify-center items-center opacity-60 hover:opacity-100 cursor-pointer ${
        showing ? "!opacity-100" : ""
      }`}
    >
      <At className="w-6 h-6 pointer-events-none text-white" />
      <Tooltip
        id="tooltip-agent-list-btn"
        place="top"
        delayShow={300}
        className="tooltip !text-xs z-99"
      />
    </div>
  );
}

function AbilityTag({ text }) {
  return (
    <div className="px-2 bg-white/20 text-white/60 text-black text-xs w-fit rounded-sm">
      <p>{text}</p>
    </div>
  );
}

export function AvailableAgents({
  showing,
  setShowing,
  sendCommand,
  promptRef,
}) {
  const formRef = useRef(null);
  const agentSessionActive = useIsAgentSessionActive();
  useEffect(() => {
    function listenForOutsideClick() {
      if (!showing || !formRef.current) return false;
      document.addEventListener("click", closeIfOutside);
    }
    listenForOutsideClick();
  }, [showing, formRef.current]);

  const closeIfOutside = ({ target }) => {
    if (target.id === "agent-list-btn") return;
    const isOutside = !formRef?.current?.contains(target);
    if (!isOutside) return;
    setShowing(false);
  };

  if (agentSessionActive) return null;
  return (
    <>
      <div hidden={!showing}>
        <div className="w-full flex justify-center absolute bottom-[130px] md:bottom-[150px] left-0 z-10 px-4">
          <div
            ref={formRef}
            className="w-[600px] p-2 bg-zinc-800 rounded-2xl shadow flex-col justify-center items-start gap-2.5 inline-flex"
          >
            <button
              onClick={() => {
                setShowing(false);
                sendCommand("@agent ", false);
                promptRef?.current?.focus();
              }}
              className="w-full hover:cursor-pointer hover:bg-zinc-700 px-2 py-2 rounded-xl flex flex-col justify-start group"
            >
              <div className="w-full flex-col text-left flex pointer-events-none">
                <div className="text-white text-sm">
                  <b>@agent</b> - the default agent for this workspace.
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  <AbilityTag text="rag-search" />
                  <AbilityTag text="web-scraping" />
                  <AbilityTag text="web-browsing" />
                  <AbilityTag text="save-file-to-browser" />
                  <AbilityTag text="list-documents" />
                  <AbilityTag text="summarize-document" />
                  <AbilityTag text="chart-generation" />
                </div>
              </div>
            </button>
            <button
              type="button"
              disabled={true}
              className="w-full rounded-xl flex flex-col justify-start group"
            >
              <div className="w-full flex-col text-center flex pointer-events-none">
                <div className="text-white text-xs text-white/50 italic">
                  custom agents are coming soon!
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export function useAvailableAgents() {
  const [showAgents, setShowAgents] = useState(false);
  return { showAgents, setShowAgents };
}

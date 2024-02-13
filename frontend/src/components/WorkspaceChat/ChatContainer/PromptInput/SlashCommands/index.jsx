import { useEffect, useRef, useState } from "react";
import SlashCommandIcon from "./icons/slash-commands-icon.svg";
import { Tooltip } from "react-tooltip";

export default function SlashCommandsButton({ showing, setShowSlashCommand }) {
  return (
    <div
      id="slash-cmd-btn"
      data-tooltip-id="tooltip-slash-cmd-btn"
      data-tooltip-content="View all available slash commands for chatting."
      onClick={() => setShowSlashCommand(!showing)}
      className={`flex justify-center items-center opacity-60 hover:opacity-100 cursor-pointer ${
        showing ? "!opacity-100" : ""
      }`}
    >
      <img
        src={SlashCommandIcon}
        className="w-6 h-6 pointer-events-none"
        alt="Slash commands button"
      />
      <Tooltip
        id="tooltip-slash-cmd-btn"
        place="top"
        delayShow={300}
        className="tooltip !text-xs z-99"
      />
    </div>
  );
}

export function SlashCommands({ showing, setShowing, sendCommand }) {
  const cmdRef = useRef(null);
  useEffect(() => {
    function listenForOutsideClick() {
      if (!showing || !cmdRef.current) return false;
      document.addEventListener("click", closeIfOutside);
    }
    listenForOutsideClick();
  }, [showing, cmdRef.current]);

  if (!showing) return null;
  const closeIfOutside = ({ target }) => {
    if (target.id === "slash-cmd-btn") return;
    const isOutside = !cmdRef?.current?.contains(target);
    if (!isOutside) return;
    setShowing(false);
  };

  return (
    <div className="w-full flex justify-center absolute bottom-[130px] md:bottom-[150px] left-0 z-10 px-4">
      <div
        ref={cmdRef}
        className="w-[600px] p-2 bg-zinc-800 rounded-2xl shadow flex-col justify-center items-start gap-2.5 inline-flex"
      >
        <button
          onClick={() => {
            setShowing(false);
            sendCommand("/reset", true);
          }}
          className="w-full hover:cursor-pointer hover:bg-zinc-700 px-2 py-2 rounded-xl flex flex-col justify-start"
        >
          <div className="w-full flex-col text-left flex pointer-events-none">
            <div className="text-white text-sm font-bold">/reset</div>
            <div className="text-white text-opacity-60 text-sm">
              Clear your chat history and begin a new chat
            </div>
          </div>
        </button>
      </div>
    </div>
  );
}

export function useSlashCommands() {
  const [showSlashCommand, setShowSlashCommand] = useState(false);
  return { showSlashCommand, setShowSlashCommand };
}

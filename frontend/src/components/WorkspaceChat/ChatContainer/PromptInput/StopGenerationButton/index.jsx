import { ABORT_STREAM_EVENT } from "@/utils/chat";
import { Stop } from "@phosphor-icons/react";
import { Tooltip } from "react-tooltip";

export default function StopGenerationButton() {
  function emitHaltEvent() {
    window.dispatchEvent(new CustomEvent(ABORT_STREAM_EVENT));
  }

  return (
    <>
      <button
        type="button"
        onClick={emitHaltEvent}
        data-tooltip-id="stop-generation-button"
        data-tooltip-content="Stop generating response"
        className="border-none inline-flex justify-center items-center rounded-full cursor-pointer w-[20px] h-[20px] bg-white hover:opacity-80 transition-opacity"
        aria-label="Stop generating"
      >
        <Stop className="w-[12px] h-[12px] text-black" weight="fill" />
      </button>
      <Tooltip
        id="stop-generation-button"
        place="bottom"
        delayShow={300}
        className="tooltip !text-xs z-99"
      />
    </>
  );
}

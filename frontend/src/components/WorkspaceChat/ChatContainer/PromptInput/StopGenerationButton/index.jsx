import { ABORT_STREAM_EVENT } from "@/utils/chat";
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
        className="border-none text-white/60 cursor-pointer group"
        aria-label="Stop generating"
      >
        <svg
          width="28"
          height="28"
          viewBox="0 0 28 28"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            className="group-hover:stroke-[#46C8FF] stroke-white"
            cx="10"
            cy="10.562"
            r="9"
            strokeWidth="2"
          />
          <rect
            className="group-hover:fill-[#46C8FF] fill-white"
            x="6.3999"
            y="6.96204"
            width="7.2"
            height="7.2"
            rx="2"
          />
        </svg>
      </button>
      <Tooltip
        id="stop-generation-button"
        place="bottom"
        delayShow={300}
        className="tooltip !text-xs invert"
      />
    </>
  );
}

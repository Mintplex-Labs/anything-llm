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
        className="border-none cursor-pointer group -mr-1.5 mt-1.5 h-10 w-10 flex items-center justify-center rounded text-white group-hover:text-primary-button light:text-theme-text-secondary light:group-hover:text-primary-button focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-button focus-visible:ring-offset-2 focus-visible:ring-offset-theme-bg-chat"
        aria-label="Stop generating"
      >
        <svg
          width="28"
          height="28"
          viewBox="0 0 28 28"
          xmlns="http://www.w3.org/2000/svg"
          style={{ transform: "scale(1.3)" }}
          className="opacity-60 group-hover:opacity-100 light:opacity-100 light:group-hover:opacity-60"
        >
          <circle cx="10" cy="10.562" r="9" strokeWidth="2" fill="none" />
          <rect x="6.3999" y="6.96204" width="7.2" height="7.2" rx="2" />
        </svg>
      </button>
      <Tooltip
        id="stop-generation-button"
        place="bottom"
        delayShow={300}
        className="tooltip !text-xs z-99 -ml-1"
      />
    </>
  );
}

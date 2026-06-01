import { ABORT_STREAM_EVENT } from "@/utils/chat";
import { Tooltip } from "react-tooltip";
import { useTranslation } from "react-i18next";

export default function StopGenerationButton() {
  const { t } = useTranslation();
  function emitHaltEvent() {
    window.dispatchEvent(new CustomEvent(ABORT_STREAM_EVENT));
  }

  return (
    <>
      <button
        type="button"
        onClick={emitHaltEvent}
        data-tooltip-id="stop-generation-button"
        data-tooltip-content={t("chat_window.stop_generating")}
        className="border-none inline-flex justify-center items-center rounded-full cursor-pointer w-8 h-8 bg-white light:bg-slate-800 hover:opacity-80 transition-opacity"
        aria-label="Stop generating"
      >
        <div className="w-3.5 h-3.5 rounded-[4px] bg-zinc-800 light:bg-white" />
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

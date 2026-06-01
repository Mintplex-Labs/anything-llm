import { useCallback, useEffect } from "react";
import { Microphone, CircleNotch } from "@phosphor-icons/react";
import { Tooltip } from "react-tooltip";
import { useTranslation } from "react-i18next";
import { PROMPT_INPUT_EVENT } from "../../../PromptInput";

/**
 * Shared microphone button for all speech-to-text providers. Owns the Ctrl+M
 * shortcut and the PROMPT_INPUT_EVENT listener so each provider only has to
 * implement start/stop.
 * @param {Object} props - The component props
 * @param {boolean} props.listening - Whether the provider is actively listening
 * @param {boolean} [props.processing] - Whether a transcription request is in flight
 * @param {() => void} props.onStart - Called to begin listening
 * @param {() => void} props.onStop - Called to end listening
 * @returns {React.ReactElement} The MicButton component
 */
export default function MicButton({
  listening,
  processing = false,
  onStart,
  onStop,
}) {
  const { t } = useTranslation();

  const toggle = useCallback(() => {
    if (processing) return;
    if (listening) onStop();
    else onStart();
  }, [listening, processing, onStart, onStop]);

  useEffect(() => {
    const onKey = (event) => {
      // CTRL + m on Mac and Windows to toggle STT listening
      if (event.ctrlKey && event.keyCode === 77) toggle();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [toggle]);

  useEffect(() => {
    const onPromptUpdate = (e) => {
      if (!e?.detail && listening) onStop();
    };
    window.addEventListener(PROMPT_INPUT_EVENT, onPromptUpdate);
    return () => window.removeEventListener(PROMPT_INPUT_EVENT, onPromptUpdate);
  }, [listening, onStop]);

  const active = listening || processing;
  return (
    <div
      data-tooltip-id="tooltip-microphone-btn"
      data-tooltip-content={`${t("chat_window.microphone")} (CTRL + M)`}
      aria-label={t("chat_window.microphone")}
      onClick={toggle}
      className={`group border-none relative flex justify-center items-center cursor-pointer w-8 h-8 rounded-full hover:bg-zinc-700 light:hover:bg-slate-200 ${
        active ? "bg-zinc-700 light:bg-slate-200" : ""
      }`}
    >
      {processing ? (
        <CircleNotch
          size={18}
          weight="bold"
          className="pointer-events-none text-white light:text-slate-800 animate-spin shrink-0"
        />
      ) : (
        <Microphone
          weight="regular"
          size={18}
          className={`pointer-events-none text-zinc-300 light:text-slate-600 group-hover:text-white light:group-hover:text-slate-600 shrink-0 ${
            listening
              ? "animate-pulse-glow !text-white light:!text-slate-800"
              : ""
          }`}
        />
      )}
      <Tooltip
        id="tooltip-microphone-btn"
        place="top"
        delayShow={300}
        className="tooltip !text-xs z-99"
      />
    </div>
  );
}

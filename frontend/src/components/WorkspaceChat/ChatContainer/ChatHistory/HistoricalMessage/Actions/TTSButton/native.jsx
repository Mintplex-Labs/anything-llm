import React from "react";
import { SpeakerHigh, PauseCircle } from "@phosphor-icons/react";
import { useTTS } from "@/contexts/TTSProvider";

export default function NativeTTSMessage({ message }) {
  const { isPlaying, togglePlay } = useTTS();

  if (!("speechSynthesis" in window)) return null;
  return (
    <div className="mt-3 relative">
      <button
        onClick={() => togglePlay(message)}
        data-tooltip-id="message-to-speech"
        data-tooltip-content={
          isPlaying ? "Pause TTS speech of message" : "TTS Speak message"
        }
        className="border-none text-[var(--theme-sidebar-footer-icon-fill)]"
        aria-label={isPlaying ? "Pause speech" : "Speak message"}
      >
        {isPlaying ? (
          <PauseCircle size={18} className="mb-1" />
        ) : (
          <SpeakerHigh size={18} className="mb-1" />
        )}
      </button>
    </div>
  );
}

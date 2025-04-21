import { SpeakerHigh, PauseCircle, CircleNotch } from "@phosphor-icons/react";
import { useTTS } from "@/contexts/TTSProvider";

export default function AsyncTTSMessage({ slug, chatId, message }) {
  const { isPlaying, isLoading, togglePlay } = useTTS();

  if (!chatId) return null;
  return (
    <div className="mt-3 relative">
      <button
        onClick={() => togglePlay(message, chatId, slug)}
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
          <>
            {isLoading ? (
              <CircleNotch size={18} className="mb-1 animate-spin" />
            ) : (
              <SpeakerHigh size={18} className="mb-1" />
            )}
          </>
        )}
      </button>
    </div>
  );
}

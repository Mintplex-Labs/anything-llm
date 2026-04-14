import { useEffect, useState, useRef } from "react";
import { SpeakerHigh, PauseCircle, CircleNotch } from "@phosphor-icons/react";
import Workspace from "@/models/workspace";
import showToast from "@/utils/toast";
import { useTranslation } from "react-i18next";

export default function AsyncTTSMessage({ slug, chatId }) {
  const playerRef = useRef(null);
  const [speaking, setSpeaking] = useState(false);
  const [loading, setLoading] = useState(false);
  const [audioSrc, setAudioSrc] = useState(null);
  const { t } = useTranslation();

  function speakMessage() {
    if (speaking) {
      playerRef?.current?.pause();
      return;
    }

    try {
      if (!audioSrc) {
        setLoading(true);
        // Use streaming URL - audio starts playing as chunks arrive
        const streamUrl = Workspace.ttsStreamUrl(slug, chatId);
        setAudioSrc(streamUrl);
        // Note: loading state will be cleared when audio starts playing (canplay event)
      } else {
        playerRef.current.play();
      }
    } catch (e) {
      console.error(e);
      setLoading(false);
      setSpeaking(false);
    }
  }

  useEffect(() => {
    function setupPlayer() {
      if (!playerRef?.current) return;

      playerRef.current.addEventListener("play", () => {
        setSpeaking(true);
        setLoading(false);
      });

      playerRef.current.addEventListener("pause", () => {
        playerRef.current.currentTime = 0;
        setSpeaking(false);
      });

      // Clear loading when audio can start playing (streaming)
      playerRef.current.addEventListener("canplay", () => {
        setLoading(false);
      });

      // Handle errors
      playerRef.current.addEventListener("error", (e) => {
        console.error("TTS audio error:", e);
        setLoading(false);
        setSpeaking(false);
        setAudioSrc(null);
        showToast(t("toast.components.tts-play-error"), "error", { clear: true });
      });
    }
    setupPlayer();
  }, []);

  if (!chatId) return null;
  return (
    <div className="mt-3 relative">
      <button
        onClick={speakMessage}
        data-auto-play-chat-id={chatId}
        data-tooltip-id="message-to-speech"
        data-tooltip-content={
          speaking
            ? t("pause_tts_speech_message")
            : t("chat_window.tts_speak_message")
        }
        className="border-none text-[var(--theme-sidebar-footer-icon-fill)]"
        aria-label={speaking ? "Pause speech" : "Speak message"}
      >
        {speaking ? (
          <PauseCircle size={18} className="mb-1" />
        ) : (
          <>
            {loading ? (
              <CircleNotch size={18} className="mb-1 animate-spin" />
            ) : (
              <SpeakerHigh size={18} className="mb-1" />
            )}
          </>
        )}
        <audio
          ref={playerRef}
          hidden={true}
          src={audioSrc}
          autoPlay={true}
          controls={false}
        />
      </button>
    </div>
  );
}

import { useEffect, useState, useRef } from "react";
import { SpeakerHigh, PauseCircle, CircleNotch } from "@phosphor-icons/react";
import Workspace from "@/models/workspace";
import showToast from "@/utils/toast";

export default function AsyncTTSMessage({ slug, chatId }) {
  const playerRef = useRef(null);
  const [speaking, setSpeaking] = useState(false);
  const [loading, setLoading] = useState(false);
  const [audioSrc, setAudioSrc] = useState(null);

  function speakMessage() {
    if (speaking) {
      playerRef?.current?.pause();
      return;
    }

    try {
      if (!audioSrc) {
        setLoading(true);
        Workspace.ttsMessage(slug, chatId)
          .then((audioBlob) => {
            if (!audioBlob)
              throw new Error("Failed to load or play TTS message response.");
            setAudioSrc(audioBlob);
          })
          .catch((e) => showToast(e.message, "error", { clear: true }))
          .finally(() => setLoading(false));
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
      });

      playerRef.current.addEventListener("pause", () => {
        playerRef.current.currentTime = 0;
        setSpeaking(false);
      });
    }
    setupPlayer();
  }, []);

  if (!chatId) return null;
  return (
    <div className="mt-3 relative">
      <button
        onClick={speakMessage}
        data-tooltip-id="message-to-speech"
        data-tooltip-content={
          speaking ? "Pause TTS speech of message" : "TTS Speak message"
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

import { useEffect, useState, useRef } from "react";
import { SpeakerHigh, PauseCircle, CircleNotch } from "@phosphor-icons/react";
import PiperTTSClient from "@/utils/piperTTS";
import { useTranslation } from "react-i18next";

export default function PiperTTS({ voiceId = null, message }) {
  const { t } = useTranslation();
  const playerRef = useRef(null);
  const [speaking, setSpeaking] = useState(false);
  const [loading, setLoading] = useState(false);
  const [audioSrc, setAudioSrc] = useState(null);

  async function speakMessage(e) {
    e.preventDefault();
    if (speaking) {
      playerRef?.current?.pause();
      return;
    }

    try {
      if (!audioSrc) {
        setLoading(true);
        const client = new PiperTTSClient({ voiceId });
        const blobUrl = await client.getAudioBlobForText(message);
        setAudioSrc(blobUrl);
        setLoading(false);
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

  return (
    <div className="mt-3 relative">
      <button
        type="button"
        onClick={speakMessage}
        disabled={loading}
        data-tooltip-id="message-to-speech"
        data-tooltip-content={
          speaking ? t("action.tts_stop") : t("action.tts")
        }
        className="border-none text-[var(--theme-sidebar-footer-icon-fill)]"
        aria-label={speaking ? t("action.tts_stop") : t("action.tts")}
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

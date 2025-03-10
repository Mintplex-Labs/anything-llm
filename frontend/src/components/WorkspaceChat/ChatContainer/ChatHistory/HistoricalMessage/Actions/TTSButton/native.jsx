import React, { useEffect, useState } from "react";
import { SpeakerHigh, PauseCircle } from "@phosphor-icons/react";
import { useTranslation } from "react-i18next";

export default function NativeTTSMessage({ message }) {
  const { t } = useTranslation();
  const [speaking, setSpeaking] = useState(false);
  const [supported, setSupported] = useState(false);
  useEffect(() => {
    setSupported("speechSynthesis" in window);
  }, []);

  function endSpeechUtterance() {
    window.speechSynthesis?.cancel();
    setSpeaking(false);
    return;
  }

  function speakMessage() {
    // if the user is pausing this particular message
    // while the synth is speaking we can end it.
    // If they are clicking another message's TTS
    // we need to ignore that until they pause the one that is playing.
    if (window.speechSynthesis.speaking && speaking) {
      endSpeechUtterance();
      return;
    }

    if (window.speechSynthesis.speaking && !speaking) return;
    const utterance = new SpeechSynthesisUtterance(message);
    utterance.addEventListener("end", endSpeechUtterance);
    window.speechSynthesis.speak(utterance);
    setSpeaking(true);
  }

  if (!supported) return null;
  return (
    <div className="mt-3 relative">
      <button
        onClick={speakMessage}
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
          <SpeakerHigh size={18} className="mb-1" />
        )}
      </button>
    </div>
  );
}

import { useEffect, useCallback, useRef } from "react";
import { Microphone } from "@phosphor-icons/react";
import { Tooltip } from "react-tooltip";
import "regenerator-runtime";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { PROMPT_INPUT_EVENT } from "../../PromptInput";
import { STOP_STT_EVENT } from "./index";
import { useTranslation } from "react-i18next";
import Appearance from "@/models/appearance";

let timeout;
const SILENCE_INTERVAL = 3_200;

export default function NativeSpeechToText({ sendCommand }) {
  const previousTranscriptRef = useRef("");
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
    browserSupportsContinuousListening,
    isMicrophoneAvailable,
  } = useSpeechRecognition({
    clearTranscriptOnListen: true,
  });
  const { t } = useTranslation();

  function startSTTSession() {
    if (!isMicrophoneAvailable) {
      alert(
        "AnythingLLM does not have access to microphone. Please enable for this site to use this feature."
      );
      return;
    }

    resetTranscript();
    previousTranscriptRef.current = "";
    SpeechRecognition.startListening({
      continuous: browserSupportsContinuousListening,
      language: window?.navigator?.language ?? "en-US",
    });
  }

  function endSTTSession() {
    SpeechRecognition.stopListening();

    if (Appearance.get("autoSubmitSttInput")) {
      sendCommand({
        text: "",
        autoSubmit: true,
        writeMode: "append",
      });
    }

    resetTranscript();
    previousTranscriptRef.current = "";
    clearTimeout(timeout);
  }

  const handleKeyPress = useCallback(
    (event) => {
      if (event.ctrlKey && event.keyCode === 77) {
        if (listening) {
          endSTTSession();
        } else {
          startSTTSession();
        }
      }
    },
    [listening, endSTTSession, startSTTSession]
  );

  function handlePromptUpdate(e) {
    if (!e?.detail && timeout) {
      endSTTSession();
      clearTimeout(timeout);
    }
  }

  useEffect(() => {
    document.addEventListener("keydown", handleKeyPress);
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [handleKeyPress]);

  useEffect(() => {
    if (!!window)
      window.addEventListener(PROMPT_INPUT_EVENT, handlePromptUpdate);
    return () =>
      window?.removeEventListener(PROMPT_INPUT_EVENT, handlePromptUpdate);
  }, []);

  useEffect(() => {
    const handler = () => endSTTSession();
    window.addEventListener(STOP_STT_EVENT, handler);
    return () => window.removeEventListener(STOP_STT_EVENT, handler);
  }, []);

  useEffect(() => {
    if (transcript?.length > 0 && listening) {
      const previousTranscript = previousTranscriptRef.current;
      const newContent = transcript.slice(previousTranscript.length);

      if (newContent.length > 0)
        sendCommand({ text: newContent, writeMode: "append" });

      previousTranscriptRef.current = transcript;
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        endSTTSession();
      }, SILENCE_INTERVAL);
    }
  }, [transcript, listening]);

  if (!browserSupportsSpeechRecognition) return null;
  return (
    <div
      data-tooltip-id="tooltip-microphone-btn"
      data-tooltip-content={`${t("chat_window.microphone")} (CTRL + M)`}
      aria-label={t("chat_window.microphone")}
      onClick={listening ? endSTTSession : startSTTSession}
      className={`group border-none relative flex justify-center items-center cursor-pointer w-8 h-8 rounded-full hover:bg-zinc-700 light:hover:bg-slate-200 ${
        listening ? "bg-zinc-700 light:bg-slate-200" : ""
      }`}
    >
      <Microphone
        weight="regular"
        size={18}
        className={`pointer-events-none text-zinc-300 light:text-slate-600 group-hover:text-white light:group-hover:text-slate-600 shrink-0 ${
          listening
            ? "animate-pulse-glow !text-white light:!text-slate-800"
            : ""
        }`}
      />
      <Tooltip
        id="tooltip-microphone-btn"
        place="top"
        delayShow={300}
        className="tooltip !text-xs z-99"
      />
    </div>
  );
}

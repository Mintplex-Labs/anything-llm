import { useEffect, useCallback, useRef, useState } from "react";
import { Microphone } from "@phosphor-icons/react";
import { Tooltip } from "react-tooltip";
import { STOP_STT_EVENT } from "./index";
import { useTranslation } from "react-i18next";
import Appearance from "@/models/appearance";
import System from "@/models/system";

const SILENCE_INTERVAL = 3_200;
const SILENCE_THRESHOLD = 0.01;
const SILENCE_CHECK_INTERVAL = 200;

/**
 * Server-backed Speech-to-Text component that records audio via MediaRecorder,
 * sends it to the server for transcription via an OpenAI-compatible STT API,
 * and feeds the transcript into the chat input.
 */
export default function ServerSpeechToText({ sendCommand }) {
  const [listening, setListening] = useState(false);
  const [transcribing, setTranscribing] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const streamRef = useRef(null);
  const silenceCheckRef = useRef(null);
  const silenceTimeoutRef = useRef(null);
  const { t } = useTranslation();

  async function startSTTSession() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const audioContext = new AudioContext();
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 2048;
      source.connect(analyser);

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        stopSilenceDetection();
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/webm",
        });
        audioChunksRef.current = [];

        if (audioBlob.size > 0) {
          setTranscribing(true);
          const { text, error } = await System.transcribeAudio(audioBlob);
          setTranscribing(false);

          if (text && !error) {
            if (Appearance.get("autoSubmitSttInput")) {
              sendCommand({
                text,
                autoSubmit: true,
                writeMode: "append",
              });
            } else {
              sendCommand({ text, writeMode: "append" });
            }
          } else if (error) {
            console.error("STT transcription error:", error);
          }
        }
      };

      mediaRecorder.start();
      setListening(true);
      startSilenceDetection(analyser);
    } catch (e) {
      console.error("Failed to start recording:", e);
      alert(
        "AnythingLLM does not have access to microphone. Please enable for this site to use this feature."
      );
    }
  }

  function endSTTSession() {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      mediaRecorderRef.current.stop();
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    stopSilenceDetection();
    setListening(false);
  }

  function startSilenceDetection(analyser) {
    const dataArray = new Float32Array(analyser.fftSize);
    silenceCheckRef.current = setInterval(() => {
      analyser.getFloatTimeDomainData(dataArray);
      let sum = 0;
      for (let i = 0; i < dataArray.length; i++) {
        sum += dataArray[i] * dataArray[i];
      }
      const rms = Math.sqrt(sum / dataArray.length);

      if (rms < SILENCE_THRESHOLD) {
        if (!silenceTimeoutRef.current) {
          silenceTimeoutRef.current = setTimeout(() => {
            endSTTSession();
          }, SILENCE_INTERVAL);
        }
      } else {
        clearTimeout(silenceTimeoutRef.current);
        silenceTimeoutRef.current = null;
      }
    }, SILENCE_CHECK_INTERVAL);
  }

  function stopSilenceDetection() {
    if (silenceCheckRef.current) {
      clearInterval(silenceCheckRef.current);
      silenceCheckRef.current = null;
    }
    clearTimeout(silenceTimeoutRef.current);
    silenceTimeoutRef.current = null;
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
    [listening]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyPress);
    return () => document.removeEventListener("keydown", handleKeyPress);
  }, [handleKeyPress]);

  useEffect(() => {
    const handler = () => endSTTSession();
    window.addEventListener(STOP_STT_EVENT, handler);
    return () => window.removeEventListener(STOP_STT_EVENT, handler);
  }, []);

  useEffect(() => {
    return () => endSTTSession();
  }, []);

  const isActive = listening || transcribing;
  return (
    <div
      data-tooltip-id="tooltip-microphone-btn"
      data-tooltip-content={`${t("chat_window.microphone")} (CTRL + M)`}
      aria-label={t("chat_window.microphone")}
      onClick={isActive ? endSTTSession : startSTTSession}
      className={`group border-none relative flex justify-center items-center cursor-pointer w-8 h-8 rounded-full hover:bg-zinc-700 light:hover:bg-slate-200 ${
        isActive ? "bg-zinc-700 light:bg-slate-200" : ""
      }`}
    >
      <Microphone
        weight="regular"
        size={18}
        className={`pointer-events-none text-zinc-300 light:text-slate-600 group-hover:text-white light:group-hover:text-slate-600 shrink-0 ${
          isActive ? "animate-pulse-glow !text-white light:!text-slate-800" : ""
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

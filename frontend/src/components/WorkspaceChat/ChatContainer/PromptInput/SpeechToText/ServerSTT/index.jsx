import { useCallback, useEffect, useRef, useState } from "react";
import { Microphone, CircleNotch } from "@phosphor-icons/react";
import { Tooltip } from "react-tooltip";
import { useTranslation } from "react-i18next";
import Appearance from "@/models/appearance";
import System from "@/models/system";
import showToast from "@/utils/toast";
import { PROMPT_INPUT_EVENT } from "../../../PromptInput";

const SILENCE_INTERVAL = 3_200; // ms of silence before auto-stop, matches BrowserNative.
const SILENCE_RMS_THRESHOLD = 0.02; // 0..1 — RMS volume below which we treat the mic as silent.
const ANALYSER_FFT_SIZE = 2048;

/**
 * Records audio from the user's mic in the browser, then uploads it to the
 * server-side STT provider for transcription. Silence detection uses Web
 * Audio API RMS amplitude — when the mic stays below the threshold for
 * SILENCE_INTERVAL ms after speech has started, recording auto-stops.
 * @param {Object} props - The component props
 * @param {(textToAppend: string, autoSubmit: boolean) => void} props.sendCommand - The function to send the command
 * @returns {React.ReactElement} The ServerSTT component
 */
export default function ServerSTT({ sendCommand }) {
  const { t } = useTranslation();
  const [listening, setListening] = useState(false);
  const [processing, setProcessing] = useState(false);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const streamRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const rafRef = useRef(null);
  const silenceTimerRef = useRef(null);
  const hasSpokenRef = useRef(false);

  const cleanupAudio = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== "closed") {
      audioContextRef.current.close().catch(() => {});
    }
    audioContextRef.current = null;
    analyserRef.current = null;
    hasSpokenRef.current = false;
  }, []);

  const stopListening = useCallback(() => {
    const recorder = mediaRecorderRef.current;
    if (recorder && recorder.state !== "inactive") recorder.stop();
    setListening(false);
  }, []);

  const tickVAD = useCallback(() => {
    const analyser = analyserRef.current;
    if (!analyser) return;
    const buffer = new Uint8Array(analyser.fftSize);
    analyser.getByteTimeDomainData(buffer);

    let sumSquares = 0;
    for (let i = 0; i < buffer.length; i++) {
      const sample = buffer[i] / 128 - 1;
      sumSquares += sample * sample;
    }
    const rms = Math.sqrt(sumSquares / buffer.length);

    if (rms > SILENCE_RMS_THRESHOLD) {
      hasSpokenRef.current = true;
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
        silenceTimerRef.current = null;
      }
    } else if (hasSpokenRef.current && !silenceTimerRef.current) {
      silenceTimerRef.current = setTimeout(() => {
        stopListening();
      }, SILENCE_INTERVAL);
    }

    rafRef.current = requestAnimationFrame(tickVAD);
  }, [stopListening]);

  const handleRecorderStop = useCallback(async () => {
    const chunks = audioChunksRef.current;
    audioChunksRef.current = [];
    const mimeType = mediaRecorderRef.current?.mimeType || "audio/webm";
    cleanupAudio();
    mediaRecorderRef.current = null;

    const blob = chunks.length ? new Blob(chunks, { type: mimeType }) : null;
    if (!blob || blob.size === 0) return;

    setProcessing(true);
    const extension = mimeType.includes("ogg") ? "ogg" : "webm";
    const { text, error } = await System.transcribeAudio(
      blob,
      `audio.${extension}`
    );
    setProcessing(false);

    if (error) {
      showToast(`Transcription failed: ${error}`, "error", { clear: true });
      return;
    }
    if (!text) return;

    sendCommand({
      text,
      autoSubmit: !!Appearance.get("autoSubmitSttInput"),
      writeMode: "append",
    });
  }, [cleanupAudio, sendCommand]);

  const startListening = useCallback(async () => {
    if (listening || processing) return;
    if (!navigator.mediaDevices?.getUserMedia) {
      showToast("Microphone access is not supported in this browser.", "error");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : MediaRecorder.isTypeSupported("audio/webm")
          ? "audio/webm"
          : MediaRecorder.isTypeSupported("audio/ogg;codecs=opus")
            ? "audio/ogg;codecs=opus"
            : "";
      const recorder = mimeType
        ? new MediaRecorder(stream, { mimeType })
        : new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      audioChunksRef.current = [];
      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) audioChunksRef.current.push(e.data);
      };
      recorder.onstop = handleRecorderStop;
      recorder.start();

      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      const audioContext = new AudioCtx();
      audioContextRef.current = audioContext;
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = ANALYSER_FFT_SIZE;
      analyser.smoothingTimeConstant = 0.3;
      source.connect(analyser);
      analyserRef.current = analyser;
      hasSpokenRef.current = false;
      rafRef.current = requestAnimationFrame(tickVAD);

      setListening(true);
    } catch (e) {
      console.error("Failed to start microphone:", e);
      showToast(
        "Could not access the microphone. Please grant permission and try again.",
        "error",
        { clear: true }
      );
      cleanupAudio();
    }
  }, [listening, processing, handleRecorderStop, tickVAD, cleanupAudio]);

  const handleKeyPress = useCallback(
    (event) => {
      if (event.ctrlKey && event.keyCode === 77) {
        if (listening) stopListening();
        else startListening();
      }
    },
    [listening, startListening, stopListening]
  );

  const handlePromptUpdate = useCallback(
    (e) => {
      if (!e?.detail && listening) stopListening();
    },
    [listening, stopListening]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyPress);
    return () => document.removeEventListener("keydown", handleKeyPress);
  }, [handleKeyPress]);

  useEffect(() => {
    window.addEventListener(PROMPT_INPUT_EVENT, handlePromptUpdate);
    return () =>
      window.removeEventListener(PROMPT_INPUT_EVENT, handlePromptUpdate);
  }, [handlePromptUpdate]);

  useEffect(() => {
    return () => cleanupAudio();
  }, [cleanupAudio]);

  const active = listening || processing;
  const onClick = () => {
    if (processing) return;
    if (listening) stopListening();
    else startListening();
  };

  return (
    <div
      data-tooltip-id="tooltip-microphone-btn"
      data-tooltip-content={`${t("chat_window.microphone")} (CTRL + M)`}
      aria-label={t("chat_window.microphone")}
      onClick={onClick}
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

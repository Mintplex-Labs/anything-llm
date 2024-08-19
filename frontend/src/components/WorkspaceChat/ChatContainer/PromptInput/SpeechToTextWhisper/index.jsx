import { CircleNotch, DownloadSimple, Microphone } from "@phosphor-icons/react";
import { Tooltip } from "react-tooltip";
import { PROMPT_INPUT_EVENT } from "../../PromptInput";
import useSpeechRecognition from "./utils/useSpeechRecognition";
import { useCallback, useEffect } from "react";
import { TranscriptionWorker } from "@/utils/whisperSTT";

export default function SpeechToTextWhisper({ sendCommand }) {
  /**
   * Handle the response from transcription received.
   * @param {import("./utils/utils").WorkerTranscriptionResponse}
   */
  function onTranscript({ transcript, error }) {
    if (!!error) return console.error(error); // we already alerts used via toast.
    if (typeof transcript !== "string" || transcript.length === 0)
      return console.error("Nothing found from transcription");
    sendCommand(transcript, true);
  }

  const {
    loading,
    recording,
    startRecording,
    stopRecording,
    transcribing,
    downloading,
  } = useSpeechRecognition({
    debug: false,
    onTranscript,
  });

  // Handle hotkey events for session
  const handleKeyPress = useCallback(
    /**
     * @param {KeyboardEvent} event
     */
    (event) => {
      // Pressing ctrl (both win & mac) + M
      if (event.ctrlKey && event.code === "KeyM") {
        recording ? stopRecording() : startRecording();
      }

      if (event.key === "Enter" && recording) stopRecording();
    },
    [recording, stopRecording, startRecording]
  );
  useEffect(() => {
    document.addEventListener("keydown", handleKeyPress);
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [handleKeyPress]);

  // Handle external prompt field updates.
  function handlePromptUpdate(e) {
    if (!e?.detail) stopRecording();
    return;
  }
  useEffect(() => {
    if (!!window)
      window.addEventListener(PROMPT_INPUT_EVENT, handlePromptUpdate);
    return () =>
      window?.removeEventListener(PROMPT_INPUT_EVENT, handlePromptUpdate);
  }, []);

  // On unload destroy worker if it was started.
  useEffect(() => {
    return () => {
      // Worker was booted and does exist.
      if (
        !!TranscriptionWorker._instance &&
        !!TranscriptionWorker._instance._worker
      ) {
        console.log("Cleaning up worker");
        TranscriptionWorker._instance._worker.terminate();
        TranscriptionWorker._instance._worker = null;
      }
    };
  }, []);

  if (loading) return null;
  return (
    <button
      id="text-size-btn"
      data-tooltip-id="tooltip-text-size-btn"
      data-tooltip-content={
        transcribing
          ? downloading
            ? "Downloading whisper model from local or remote storage"
            : "Transcribing voice"
          : "Speak your prompt"
      }
      aria-label={
        transcribing
          ? downloading
            ? "Downloading whisper model from local or remote storage"
            : "Transcribing voice"
          : "Speak your prompt"
      }
      onClick={recording ? stopRecording : startRecording}
      disabled={transcribing}
      type="button"
      className={`border-none relative flex justify-center items-center opacity-60 hover:opacity-100 cursor-pointer ${
        !!recording ? "!opacity-100" : ""
      }`}
    >
      {transcribing ? (
        <>
          {downloading ? (
            <DownloadSimple
              className={`w-6 h-6 pointer-events-none text-white overflow-hidden rounded-full animate-pulse-glow`}
            />
          ) : (
            <CircleNotch
              className={`w-6 h-6 pointer-events-none text-white overflow-hidden rounded-full animate-spin`}
            />
          )}
        </>
      ) : (
        <Microphone
          weight="fill"
          className={`w-6 h-6 pointer-events-none text-white overflow-hidden rounded-full ${
            recording ? "animate-pulse-glow" : ""
          }`}
        />
      )}
      <Tooltip
        id="tooltip-text-size-btn"
        place="top"
        delayShow={300}
        className="tooltip !text-xs z-99"
      />
    </button>
  );
}

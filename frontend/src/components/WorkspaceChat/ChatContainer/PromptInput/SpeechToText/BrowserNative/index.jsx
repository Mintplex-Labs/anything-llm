import { useEffect, useRef } from "react";
import "regenerator-runtime"; //required polyfill for speech recognition;
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import Appearance from "@/models/appearance";
import MicButton from "../MicButton";

let timeout;
const SILENCE_INTERVAL = 3_200; // wait in seconds of silence before closing.

/**
 * Browser-native speech-to-text using the Web Speech API.
 * @param {Object} props - The component props
 * @param {(textToAppend: string, autoSubmit: boolean) => void} props.sendCommand - The function to send the command
 * @returns {React.ReactElement} The SpeechToText component
 */
export default function BrowserNativeSTT({ sendCommand }) {
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

    // If auto submit is enabled, send an empty string to the chat window to submit the current transcript
    // since every chunk of text should have been streamed to the chat window by now.
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

  useEffect(() => {
    if (transcript?.length > 0 && listening) {
      const previousTranscript = previousTranscriptRef.current;
      const newContent = transcript.slice(previousTranscript.length);

      // Stream just the diff of the new content since transcript is an accumulating string.
      // and not just the new content transcribed.
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
    <MicButton
      listening={listening}
      onStart={startSTTSession}
      onStop={endSTTSession}
    />
  );
}

import { useEffect, useState } from "react";
import System from "@/models/system";
import NativeSpeechToText from "./native";
import ServerSpeechToText from "./server";

export const STOP_STT_EVENT = "stop_stt_session";

/**
 * Speech-to-text input component for the chat window.
 * Renders the appropriate STT implementation based on the system's SpeechToTextProvider setting.
 * @param {Object} props - The component props
 * @param {Function} props.sendCommand - The function to send the command
 * @returns {React.ReactElement|null}
 */
export default function SpeechToText({ sendCommand }) {
  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    System.keys().then((res) => {
      setProvider(res?.SpeechToTextProvider || "native");
      setLoading(false);
    });
  }, []);

  if (loading) return null;

  if (provider === "generic-openai") {
    return <ServerSpeechToText sendCommand={sendCommand} />;
  }

  return <NativeSpeechToText sendCommand={sendCommand} />;
}

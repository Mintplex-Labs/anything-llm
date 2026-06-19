import { useEffect, useState } from "react";
import System from "@/models/system";
import BrowserNativeSTT from "./BrowserNative";
import ServerSTT from "./ServerSTT";

/**
 * Speech-to-text input dispatcher for the chat window. Loads the configured
 * provider once and renders either the browser-native implementation or the
 * server-side implementation that uploads audio to a remote STT service.
 * @param {Object} props - The component props
 * @param {(textToAppend: string, autoSubmit: boolean) => void} props.sendCommand - The function to send the command
 * @returns {React.ReactElement|null} The SpeechToText component
 */
export default function SpeechToText({ sendCommand }) {
  const [provider, setProvider] = useState(null);

  useEffect(() => {
    let cancelled = false;
    System.keys()
      .then((settings) => {
        if (cancelled) return;
        setProvider(settings?.SpeechToTextProvider || "native");
      })
      .catch(() => {
        if (!cancelled) setProvider("native");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (provider === null) return null;
  if (provider === "native")
    return <BrowserNativeSTT sendCommand={sendCommand} />;
  return <ServerSTT sendCommand={sendCommand} />;
}

import { useEffect, useState } from "react";
import BrowserNative from "./BrowserNative";
import DeepgramSpeechToText from "./Deepgram";
import System from "@/models/system";

export default function SpeechToText({ sendCommand }) {
  const [provider, setProvider] = useState("native");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProvider() {
      const settings = await System.keys();
      setProvider(settings?.SpeechToTextProvider || "native");
      setLoading(false);
    }
    fetchProvider();
  }, []);

  if (loading) return null;

  if (provider === "deepgram") {
    return <DeepgramSpeechToText sendCommand={sendCommand} />;
  }

  // fallback to browser native
  return <BrowserNative sendCommand={sendCommand} />;
}

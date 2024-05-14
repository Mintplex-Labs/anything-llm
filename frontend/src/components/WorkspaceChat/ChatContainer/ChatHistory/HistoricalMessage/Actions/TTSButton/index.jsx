import { useEffect, useState } from "react";
import NativeTTSMessage from "./native";
import AsyncTTSMessage from "./asyncTts";
import System from "@/models/system";

export default function TTSMessage({ slug, chatId, message }) {
  const [provider, setProvider] = useState("native");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getSettings() {
      const _settings = await System.keys();
      setProvider(_settings?.TextToSpeechProvider ?? "native");
      setLoading(false);
    }
    getSettings();
  }, []);

  if (loading) return null;
  if (provider !== "native")
    return <AsyncTTSMessage slug={slug} chatId={chatId} />;
  return <NativeTTSMessage message={message} />;
}

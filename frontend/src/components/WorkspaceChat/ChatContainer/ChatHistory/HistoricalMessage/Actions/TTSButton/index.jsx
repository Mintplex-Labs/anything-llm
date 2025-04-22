import { useTTSProvider } from "@/components/contexts/TTSProvider";
import NativeTTSMessage from "./native";
import AsyncTTSMessage from "./asyncTts";
import PiperTTSMessage from "./piperTTS";

export default function TTSMessage({ slug, chatId, message }) {
  const { settings, provider, loading } = useTTSProvider();
  if (!chatId || loading) return null;

  switch (provider) {
    case "openai":
    case "generic-openai":
    case "elevenlabs":
      return <AsyncTTSMessage slug={slug} chatId={chatId} />;
    case "piper_local":
      return (
        <PiperTTSMessage
          chatId={chatId}
          voiceId={settings?.TTSPiperTTSVoiceModel}
          message={message}
        />
      );
    default:
      return <NativeTTSMessage chatId={chatId} message={message} />;
  }
}

import React from "react";
import NativeTTSMessage from "./native";
import AsyncTTSMessage from "./asyncTts";
import PiperTTSMessage from "./piperTTS";
import { useTTS } from "@/contexts/TTSProvider";

export default function TTSMessage({ slug, chatId, message }) {
  const { provider, settings } = useTTS();

  if (!chatId) return null;

  switch (provider) {
    case "openai":
    case "generic-openai":
    case "elevenlabs":
      return <AsyncTTSMessage slug={slug} chatId={chatId} message={message} />;
    case "piper_local":
      return (
        <PiperTTSMessage
          voiceId={settings?.TTSPiperTTSVoiceModel}
          message={message}
          chatId={chatId}
          slug={slug}
        />
      );
    default:
      return <NativeTTSMessage message={message} />;
  }
}

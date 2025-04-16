import { useState, useEffect } from "react";
import Workspace from "@/models/workspace";
import PiperTTSClient from "@/utils/piperTTS";
import System from "@/models/system";

export const TTS_EVENTS = {
  PLAYING: 'tts-playing',
  STOPPED: 'tts-stopped',
  LOADING: 'tts-loading',
  LOADING_COMPLETE: 'tts-loading-complete',
};

export function useTTS() {
  const [provider, setProvider] = useState("native");
  const [settings, setSettings] = useState({});

  useEffect(() => {
    async function getSettings() {
      const _settings = await System.keys();
      setProvider(_settings?.TextToSpeechProvider ?? "native");
      setSettings(_settings);
    }
    getSettings();
  }, []);

  const speak = (message, chatId, slug) => {
    let utterance;
    let client;

    switch (provider) {
      case "native":
        if (window.speechSynthesis.speaking) return;
        utterance = new SpeechSynthesisUtterance(message);
        window.speechSynthesis.speak(utterance);
        break;
      case "openai":
      case "generic-openai":
      case "elevenlabs":
        if (!chatId) return;
        console.log("LOADING", chatId, "slug", slug);
        // HERE WE NEED TO TRIGGER THE LOADING EVENT IN THE ASYNC TTS COMPONENT
        window.dispatchEvent(new CustomEvent(TTS_EVENTS.LOADING, {
          detail: { chatId, slug }
        }));
        Workspace.ttsMessage(slug, chatId)
          .then((audioBlob) => {
            if (!audioBlob) return;
            const audio = new Audio(audioBlob);
            audio.onended = () => {
              // HERE WE NEED TO TRIGGER THE STOPPED EVENT IN THE ASYNC TTS COMPONENT
              console.log("stopped chatId", chatId, "slug", slug);
              window.dispatchEvent(new CustomEvent(TTS_EVENTS.STOPPED, {
                detail: { chatId, slug }
              }));
            };
            audio.play();
            // HERE WE NEED TO TRIGGER THE PLAYING EVENT IN THE ASYNC TTS COMPONENT
            window.dispatchEvent(new CustomEvent(TTS_EVENTS.PLAYING, {
              detail: { chatId, slug }
            }));
            console.log("playing chatId", chatId, "slug", slug);
          })
          .catch(console.error)
          .finally(() => {
            window.dispatchEvent(new CustomEvent(TTS_EVENTS.LOADING_COMPLETE, {
              detail: { chatId, slug }
            }));
          });
        break;
      case "piper_local":
        client = new PiperTTSClient({ voiceId: settings?.TTSPiperTTSVoiceModel });
        client.getAudioBlobForText(message)
          .then((blobUrl) => {
            const audio = new Audio(blobUrl);
            audio.onended = () => {
              window.dispatchEvent(new CustomEvent(TTS_EVENTS.STOPPED, {
                detail: { chatId, slug }
              }));
            };
            audio.play();
            window.dispatchEvent(new CustomEvent(TTS_EVENTS.PLAYING, {
              detail: { chatId, slug }
            }));
          })
          .catch(console.error);
        break;
    }
  };

  const stop = (chatId, slug) => {
    switch (provider) {
      case "native":
        window.speechSynthesis?.cancel();
        break;
      default:
        window.dispatchEvent(new CustomEvent(TTS_EVENTS.STOPPED, {
          detail: { chatId, slug }
        }));
    }
  };

  return { speak, stop, TTS_EVENTS };
}
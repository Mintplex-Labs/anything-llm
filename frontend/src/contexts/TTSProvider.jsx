import { createContext, useContext, useState, useRef, useEffect } from "react";
import System from "@/models/system";
import Workspace from "@/models/workspace";
import PiperTTSClient from "@/utils/piperTTS";

const TTSContext = createContext();

export function TTSProvider({ children }) {
  const [provider, setProvider] = useState("native");
  const [settings, setSettings] = useState({});
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef(null);
  const audioSrcRef = useRef(null);
  const piperClientRef = useRef(null);

  useEffect(() => {
    async function getSettings() {
      const _settings = await System.keys();
      setProvider(_settings?.TextToSpeechProvider ?? "native");
      setSettings(_settings);
    }
    getSettings();
  }, []);

  const playAudio = async (message, chatId, slug) => {
    if (!chatId) return;

    try {
      setIsLoading(true);
      const audioBlob = await Workspace.ttsMessage(slug, chatId);
      if (!audioBlob) throw new Error("Failed to load TTS message response.");

      audioSrcRef.current = audioBlob;
      if (audioRef.current) {
        audioRef.current.src = audioBlob;
        audioRef.current.play();
      }
    } catch (e) {
      console.error(e);
      setIsLoading(false);
      setIsPlaying(false);
    }
  };

  const playPiperAudio = async (message, voiceId) => {
    try {
      setIsLoading(true);
      if (!piperClientRef.current) {
        piperClientRef.current = new PiperTTSClient({ voiceId });
      }
      const blobUrl = await piperClientRef.current.getAudioBlobForText(message);
      audioSrcRef.current = blobUrl;
      if (audioRef.current) {
        audioRef.current.src = blobUrl;
        audioRef.current.play();
      }
    } catch (e) {
      console.error(e);
      setIsLoading(false);
      setIsPlaying(false);
    }
  };

  const speak = (message, chatId, slug, voiceId = null) => {
    switch (provider) {
      case "native": {
        if (window.speechSynthesis.speaking) return;
        const utterance = new SpeechSynthesisUtterance(message);
        window.speechSynthesis.speak(utterance);
        setIsPlaying(true);
        break;
      }
      case "piper_local":
        playPiperAudio(message, voiceId);
        break;
      case "openai":
      case "generic-openai":
      case "elevenlabs":
        playAudio(message, chatId, slug);
        break;
    }
  };

  const stop = () => {
    switch (provider) {
      case "native":
        window.speechSynthesis?.cancel();
        break;
      default:
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
        }
    }
    setIsPlaying(false);
  };

  const togglePlay = (message, chatId, slug, voiceId = null) => {
    if (isPlaying) {
      stop();
    } else {
      speak(message, chatId, slug, voiceId);
    }
  };

  // Setup audio element listeners
  useEffect(() => {
    if (!audioRef.current) return;

    const handlePlay = () => {
      setIsPlaying(true);
      setIsLoading(false);
    };

    const handlePause = () => {
      setIsPlaying(false);
    };

    audioRef.current.addEventListener("play", handlePlay);
    audioRef.current.addEventListener("pause", handlePause);

    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener("play", handlePlay);
        audioRef.current.removeEventListener("pause", handlePause);
      }
    };
  }, []);

  return (
    <TTSContext.Provider
      value={{
        isPlaying,
        isLoading,
        togglePlay,
        stop,
        provider,
        settings,
        speak
      }}
    >
      {children}
      <audio ref={audioRef} hidden={true} />
    </TTSContext.Provider>
  );
}

export function useTTS() {
  const context = useContext(TTSContext);
  if (!context) {
    throw new Error("useTTS must be used within a TTSProvider");
  }
  return context;
}
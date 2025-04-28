import { createContext, useContext, useEffect, useState } from "react";
import System from "@/models/system";
import Appearance from "@/models/appearance";

const ASSISTANT_MESSAGE_COMPLETE_EVENT = "ASSISTANT_MESSAGE_COMPLETE_EVENT";
const TTSProviderContext = createContext();

/**
 * This component is used to provide the TTS provider context to the application.
 *
 * TODO: This context provider simply wraps around the System.keys() call to get the TTS provider settings.
 * However, we use .keys() in a ton of places and it might make more sense to make a generalized hook that
 * can be used anywhere we need to get _any_ setting from the System by just grabbing keys() and reusing it
 * as a hook where needed.
 *
 * For now, since TTSButtons are rendered on every message, we can save a ton of requests by just using this
 * hook where for now so we can recycle the TTS settings in the chat container.
 */
export function TTSProvider({ children }) {
  const [settings, setSettings] = useState({});
  const [provider, setProvider] = useState("native");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getSettings() {
      const _settings = await System.keys();
      setProvider(_settings?.TextToSpeechProvider ?? "native");
      setSettings(_settings);
      setLoading(false);
    }
    getSettings();
  }, []);

  return (
    <TTSProviderContext.Provider
      value={{
        settings,
        provider,
        loading,
      }}
    >
      {children}
    </TTSProviderContext.Provider>
  );
}

/**
 * This hook is used to get the TTS provider settings easily without
 * having to refetch the settings from the System.keys() call each component mount.
 *
 * @returns {{settings: {TTSPiperTTSVoiceModel: string|null}, provider: string, loading: boolean}} The TTS provider settings.
 */
export function useTTSProvider() {
  const context = useContext(TTSProviderContext);
  if (!context)
    throw new Error("useTTSProvider must be used within a TTSProvider");
  return context;
}

/**
 * This function will emit the ASSISTANT_MESSAGE_COMPLETE_EVENT event.
 *
 * This event is used to notify the TTSProvider that a message has been fully generated and that the TTS response
 * should be played if the user setting is enabled.
 *
 * @param {string} chatId - The chatId of the message that has been fully generated.
 */
export function emitAssistantMessageCompleteEvent(chatId) {
  window.dispatchEvent(
    new CustomEvent(ASSISTANT_MESSAGE_COMPLETE_EVENT, { detail: { chatId } })
  );
}

/**
 * This hook will establish a listener for the ASSISTANT_MESSAGE_COMPLETE_EVENT event.
 * When the event is triggered, the hook will attempt to play the TTS response for the given chatId.
 * It will attempt to play the TTS response for the given chatId until it is successful or the maximum number of attempts
 * is reached.
 *
 * This is accomplished by looking for a button with the data-auto-play-chat-id attribute that matches the chatId.
 */
export function useWatchForAutoPlayAssistantTTSResponse() {
  const autoPlayAssistantTtsResponse = Appearance.get(
    "autoPlayAssistantTtsResponse"
  );

  function handleAutoPlayTTSEvent(event) {
    let autoPlayAttempts = 0;
    const { chatId } = event.detail;

    /**
     * Attempt to play the TTS response for the given chatId.
     * This is a recursive function that will attempt to play the TTS response
     * for the given chatId until it is successful or the maximum number of attempts
     * is reached.
     * @returns {boolean} true if the TTS response was played, false otherwise.
     */
    function attemptToPlay() {
      const playBtn = document.querySelector(
        `[data-auto-play-chat-id="${chatId}"]`
      );
      if (!playBtn) {
        autoPlayAttempts++;
        if (autoPlayAttempts > 3) return false;
        setTimeout(() => {
          attemptToPlay();
        }, 1000 * autoPlayAttempts);
        return false;
      }
      playBtn.click();
      return true;
    }
    setTimeout(() => {
      attemptToPlay();
    }, 800);
  }

  // Only bother to listen for these events if the user has autoPlayAssistantTtsResponse
  // setting enabled.
  useEffect(() => {
    if (autoPlayAssistantTtsResponse) {
      window.addEventListener(
        ASSISTANT_MESSAGE_COMPLETE_EVENT,
        handleAutoPlayTTSEvent
      );
      return () => {
        window.removeEventListener(
          ASSISTANT_MESSAGE_COMPLETE_EVENT,
          handleAutoPlayTTSEvent
        );
      };
    } else {
      console.log("Assistant TTS auto-play is disabled");
    }
  }, [autoPlayAssistantTtsResponse]);
}

import { useEffect, useCallback, useRef, useState } from "react";
import { Microphone } from "@phosphor-icons/react";
import { Tooltip } from "react-tooltip";
import { PROMPT_INPUT_EVENT } from "../../PromptInput";
import { useTranslation } from "react-i18next";
import Appearance from "@/models/appearance";
import System from "@/models/system";
import showToast from "@/utils/toast";

const SILENCE_INTERVAL = 3200; // wait in ms of silence before closing.

export default function DeepgramSpeechToText({ sendCommand }) {
  const { t } = useTranslation();
  const [listening, setListening] = useState(false);
  const [socket, setSocket] = useState(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const silenceTimeoutRef = useRef(null);

  const startSTTSession = async () => {
    try {
      const { token, error } = await System.getDeepgramSttToken();
      if (error || !token) {
        showToast("Deepgram streaming token could not be fetched.", "error");
        return;
      }

      // We need to request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      if (!stream) {
        alert(
          "AnythingLLM does not have access to microphone. Please enable for this site to use this feature."
        );
        return;
      }

      const ws = new WebSocket(
        "wss://api.deepgram.com/v1/listen?punctuate=true&interim_results=true",
        ["token", token]
      );

      ws.onopen = () => {
        setListening(true);
        const recorder = new MediaRecorder(stream, {
          mimeType: "audio/webm",
        });

        recorder.addEventListener("dataavailable", (event) => {
          if (event.data.size > 0 && ws.readyState === 1) {
            ws.send(event.data);
          }
        });

        recorder.start(250); // Send audio every 250ms
        setMediaRecorder(recorder);
      };

      ws.onmessage = (message) => {
        const received = JSON.parse(message.data);
        const transcript = received.channel.alternatives[0].transcript;

        if (transcript && received.is_final) {
          sendCommand({ text: transcript + " ", writeMode: "append" });

          clearTimeout(silenceTimeoutRef.current);
          silenceTimeoutRef.current = setTimeout(() => {
            endSTTSession();
          }, SILENCE_INTERVAL);
        }
      };

      ws.onerror = (error) => {
        console.error("Deepgram WebSocket error", error);
        endSTTSession();
      };

      ws.onclose = () => {
        endSTTSession();
      };

      setSocket(ws);
    } catch (e) {
      console.error(e);
      showToast("Failed to initialize Deepgram WebSocket STT.", "error");
      endSTTSession();
    }
  };

  const endSTTSession = useCallback(() => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      mediaRecorder.stream.getTracks().forEach((track) => track.stop());
    }
    if (socket) {
      socket.close();
    }
    setListening(false);
    setMediaRecorder(null);
    setSocket(null);
    clearTimeout(silenceTimeoutRef.current);

    if (Appearance.get("autoSubmitSttInput")) {
      sendCommand({
        text: "",
        autoSubmit: true,
        writeMode: "append",
      });
    }
  }, [mediaRecorder, socket, sendCommand]);

  const handleKeyPress = useCallback(
    (event) => {
      if (event.ctrlKey && event.keyCode === 77) {
        if (listening) {
          endSTTSession();
        } else {
          startSTTSession();
        }
      }
    },
    [listening, endSTTSession]
  );

  function handlePromptUpdate(e) {
    if (!e?.detail && listening) {
      endSTTSession();
    }
  }

  useEffect(() => {
    document.addEventListener("keydown", handleKeyPress);
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [handleKeyPress]);

  useEffect(() => {
    if (!!window)
      window.addEventListener(PROMPT_INPUT_EVENT, handlePromptUpdate);
    return () =>
      window?.removeEventListener(PROMPT_INPUT_EVENT, handlePromptUpdate);
  }, [listening]);

  return (
    <div
      data-tooltip-id="tooltip-microphone-btn"
      data-tooltip-content={`${t("chat_window.microphone")} (CTRL + M)`}
      aria-label={t("chat_window.microphone")}
      onClick={listening ? endSTTSession : startSTTSession}
      className={`group border-none relative flex justify-center items-center cursor-pointer w-8 h-8 rounded-full hover:bg-zinc-700 light:hover:bg-slate-200 ${
        listening ? "bg-zinc-700 light:bg-slate-200" : ""
      }`}
    >
      <Microphone
        weight="regular"
        size={18}
        className={`pointer-events-none text-zinc-300 light:text-slate-600 group-hover:text-white light:group-hover:text-slate-600 shrink-0 ${
          listening
            ? "animate-pulse-glow !text-white light:!text-slate-800"
            : ""
        }`}
      />
      <Tooltip
        id="tooltip-microphone-btn"
        place="top"
        delayShow={300}
        className="tooltip !text-xs z-99"
      />
    </div>
  );
}

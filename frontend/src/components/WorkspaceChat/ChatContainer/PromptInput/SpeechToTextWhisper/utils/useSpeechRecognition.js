import { useEffect, useRef, useState } from "react";
import { getMediaAccessLevels, requestMediaAccess } from "@/ipc/node-api";
import { getMimeType, webmFixDuration, debugAudioBlobUrl } from "./utils.js";
import { transcribeAudio } from "@/utils/whisperSTT/index.js";
import i18next from "i18next";
import showToast from "@/utils/toast.js";

export default function useSpeechRecognition({
  debug = false, // Will append the audio player to the document body to debug.
  onTranscript = console.log,
}) {
  const [loading, setLoading] = useState(true);
  // We currently don't allow other models due to resource limitations
  const [sttModel, _setSttModel] = useState("Xenova/whisper-tiny");
  const [microphoneEnabled, setMicrophoneEnabled] = useState(false);
  const [recording, setRecording] = useState(false);
  const [transcribing, setTranscribing] = useState(false);
  const [downloading, setDownloading] = useState(false);

  /** @type {import("react").MutableRefObject<MediaStream|null>} */
  const streamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  /**
   * Requests device access for the user to the microphone.
   * @returns {Promise<boolean>}
   */
  async function requestMicrophonePermissions() {
    const enabled = await requestMediaAccess("microphone");
    setMicrophoneEnabled(enabled);
    return enabled;
  }

  /**
   * Begins a recording session
   */
  async function startRecording() {
    if (!microphoneEnabled) await requestMicrophonePermissions();

    let startTime = Date.now();
    try {
      if (!streamRef.current) {
        streamRef.current = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
      }

      const mimeType = getMimeType();
      const { listenForSilence, cleanupSilenceListener } = silenceListener(
        streamRef,
        stopRecording
      );
      const mediaRecorder = new MediaRecorder(streamRef.current, {
        mimeType,
      });

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.addEventListener("dataavailable", async (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data);

        if (mediaRecorder.state === "inactive") {
          cleanupSilenceListener();
          streamRef.current.getAudioTracks().forEach((track) => track.stop());
          const duration = Date.now() - startTime;

          // Received a stop event
          let blob = new Blob(chunksRef.current, { type: mimeType });

          // audio/webm will cause really bad responses in Chromium.
          if (mimeType === "audio/webm") {
            blob = await webmFixDuration(blob, duration, blob.type);
          }

          /** @type {import("./utils.js").RecordedBlobResponse} */
          const readerOutput = await new Promise((resolve) => {
            const blobUrl = URL.createObjectURL(blob);
            const fileReader = new FileReader();
            fileReader.onloadend = async () => {
              const audioCTX = new AudioContext({
                sampleRate: 16000,
              });
              const arrayBuffer = fileReader.result;
              const decoded = await audioCTX.decodeAudioData(arrayBuffer);
              resolve({
                buffer: decoded,
                url: blobUrl,
                source: "recording",
                mimeType: blob.type,
              });
            };
            fileReader.readAsArrayBuffer(blob);
          });

          if (debug) debugAudioBlobUrl(readerOutput.url);
          chunksRef.current = [];
          setTranscribing(true);
          await transcribeAudio(readerOutput.buffer, {
            model: sttModel,
            multilingual: i18next.language.startsWith("en") !== true,
          })
            .then((response) => {
              if (!!response.error || response.transcript === "[BLANK_AUDIO]")
                throw new Error(response.error ?? "Audio recording was blank.");
              onTranscript?.(response);
            })
            .catch((e) => showToast(e.message, "error", { clear: true }))
            .finally(() => {
              // Detach tracks and stop them and release stream so we don't show Mic as busy when not in use.
              streamRef.current
                .getAudioTracks()
                .forEach((track) => track.stop());
              streamRef.current = null;
              setTranscribing(false);
            });
        }
      });

      listenForSilence();
      mediaRecorder.start();
      setRecording(true);
      setDownloading(false);
    } catch (error) {
      console.error("Failed to start recording:", error);
    }
  }

  function stopRecording() {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state === "recording"
    ) {
      mediaRecorderRef.current.stop(); // set state to inactive
      setRecording(false);
      setDownloading(false);
    }
  }

  // Load current microphone permissions
  useEffect(() => {
    getMediaAccessLevels()
      .then(({ microphone }) => setMicrophoneEnabled(microphone === "granted"))
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  }, []);

  const handleDownloadEvent = () => {
    if (!downloading) setDownloading(true);
  };
  const handleDownloadDoneEvent = () => {
    setDownloading(false);
  };
  useEffect(() => {
    window.addEventListener("whisper_model_downloading", handleDownloadEvent);
    window.addEventListener(
      "whisper_model_downloading_done",
      handleDownloadDoneEvent
    );
    return () => {
      window.removeEventListener(
        "whisper_model_downloading",
        handleDownloadEvent
      );
      window.removeEventListener(
        "whisper_model_downloading_done",
        handleDownloadDoneEvent
      );
    };
  }, []);

  return {
    loading,
    transcribing,
    startRecording,
    stopRecording,
    recording,
    downloading,
  };
}

const SILENCE_THRESHOLD = -30;
const SILENCE_INTERVAL = 3_200; // wait in seconds of silence before closing.
/**
 * Creates listener function that waits for silence for 3.2s intervals below some average volume decibels
 * @param {import("react").MutableRefObject} streamRef
 * @param {VoidFunction} onSilence
 * @returns {{listenForSilence: VoidFunction, cleanupSilenceListener: VoidFunction}}
 */
function silenceListener(streamRef, onSilence) {
  if (!streamRef?.current) return;
  let animationFrameId;
  let silenceTimer;

  const audioContext = new AudioContext();
  const source = audioContext.createMediaStreamSource(streamRef.current);
  const analyzer = audioContext.createAnalyser();
  source.connect(analyzer);

  analyzer.fftSize = 2048;
  const bufferLength = analyzer.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);

  function cleanupSilenceListener() {
    if (audioContext.state !== "closed") audioContext.close();
    if (!!silenceTimer) clearTimeout(silenceTimer);
    if (animationFrameId) cancelAnimationFrame(animationFrameId);
  }

  function checkAudioLevel() {
    analyzer.getByteFrequencyData(dataArray);
    const average =
      dataArray.reduce((sum, value) => sum + value, 0) / bufferLength;
    const volume = 20 * Math.log10(average / 255);
    if (volume < SILENCE_THRESHOLD) {
      if (!silenceTimer) {
        silenceTimer = setTimeout(() => {
          cleanupSilenceListener();
          onSilence?.();
        }, SILENCE_INTERVAL);
      }
    } else {
      if (silenceTimer) {
        clearTimeout(silenceTimer);
        silenceTimer = null;
      }
    }
    animationFrameId = requestAnimationFrame(checkAudioLevel);
  }

  return { listenForSilence: checkAudioLevel, cleanupSilenceListener };
}

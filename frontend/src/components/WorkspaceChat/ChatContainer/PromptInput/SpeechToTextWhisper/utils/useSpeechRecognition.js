import { useEffect, useRef, useState } from "react";
import { getMediaAccessLevels, requestMediaAccess } from "@/ipc/node-api";
import { getMimeType, webmFixDuration, debugAudioBlobUrl } from "./utils.js";
import { transcribeAudio } from "@/utils/whisperSTT/index.js";

export default function useSpeechRecognition({
  debug = false, // Will append the audio player to the document body to debug.
  onTranscript = console.log,
}) {
  const [loading, setLoading] = useState(true);
  const [microphoneEnabled, setMicrophoneEnabled] = useState(false)
  const [recording, setRecording] = useState(false);
  const [transcribing, setTranscribing] = useState(false);

  const streamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  /**
   * Requests device access for the user to the microphone.
   * @returns {Promise<boolean>}
   */
  async function requestMicrophonePermissions() {
    const enabled = await requestMediaAccess('microphone');
    setMicrophoneEnabled(enabled);
    return enabled
  }

  /** 
   * Begins a recording session
   */
  async function startRecording() {
    if (!microphoneEnabled) await requestMicrophonePermissions();

    // Reset recording (if any)
    // setRecordedBlob(null);
    let startTime = Date.now();
    try {
      if (!streamRef.current) {
        streamRef.current = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
      }

      const mimeType = getMimeType();
      const mediaRecorder = new MediaRecorder(streamRef.current, {
        mimeType,
      });

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.addEventListener("dataavailable", async (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data);

        if (mediaRecorder.state === "inactive") {
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
            fileReader.onprogress = (event) => {
              console.log(event.loaded, event.total)
            };
            fileReader.onloadend = async () => {
              const audioCTX = new AudioContext({
                sampleRate: 16000,
              });
              const arrayBuffer = fileReader.result;
              const decoded = await audioCTX.decodeAudioData(arrayBuffer);
              resolve({
                buffer: decoded,
                url: blobUrl,
                source: 'recording',
                mimeType: blob.type,
              })
            };
            fileReader.readAsArrayBuffer(blob);
          })

          // setRecordedBlob(readerOutput);
          if (debug) debugAudioBlobUrl(readerOutput.url)
          chunksRef.current = [];
          setTranscribing(true);
          await transcribeAudio(readerOutput.buffer)
            .then((response) => onTranscript?.(response))
            .finally(() => setTranscribing(false))
        }
      });
      mediaRecorder.start();
      setRecording(true);
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
    }
  }

  // Load current microphone permissions
  useEffect(() => {
    getMediaAccessLevels()
      .then(({ microphone }) => setMicrophoneEnabled(microphone === 'granted'))
      .catch((e) => console.error(e))
      .finally(() => setLoading(false))
  }, []);

  // Manage stream
  useEffect(() => {
    let stream = null;
    return () => {
      if (stream) stream.getTracks().forEach((track) => track.stop());
    };
  }, [recording]);

  return {
    loading,
    transcribing,
    startRecording,
    stopRecording,
    recording,
  }
}
import { useEffect, useRef, useState } from "react";
import { Microphone } from "@phosphor-icons/react";
import { Tooltip } from "react-tooltip";
import { PROMPT_INPUT_EVENT } from "../../PromptInput";
import { getMediaAccessLevels, requestMediaAccess } from "@/ipc/node-api";
import { webmFixDuration } from "./utils";
import { transcribeAudio } from "@/utils/whisperSTT";

const addAudioElement = (blob) => {
  const url = URL.createObjectURL(blob);
  const audio = document.createElement("audio");
  audio.src = url;
  audio.controls = true;
  document.body.appendChild(audio);
};

/**
 * 
 * @param {import("react-audio-voice-recorder/dist/hooks/useAudioRecorder").recorderControls} recorderControls 
 * @returns 
 */
function useMicrophone() {
  const [loading, setLoading] = useState(true);
  const [microphoneEnabled, setMicrophoneEnabled] = useState(false)

  async function requestPermissions() {
    const enabled = await requestMediaAccess('microphone');
    setMicrophoneEnabled(enabled);
    return enabled
  }

  useEffect(() => {
    async function getPermissions() {
      const permissions = await getMediaAccessLevels();
      setMicrophoneEnabled(permissions.microphone === 'granted');
      setLoading(false)
    }
    getPermissions()
  }, []);

  return {
    loading,
    microphoneEnabled,
    requestPermissions,
  }
}

function getMimeType() {
  const types = [
    "audio/webm",
    "audio/mp4",
    "audio/ogg",
    "audio/wav",
    "audio/aac",
  ];
  for (let i = 0; i < types.length; i++) {
    if (MediaRecorder.isTypeSupported(types[i])) {
      return types[i];
    }
  }
  return undefined;
}

export default function SpeechToText({ sendCommand }) {
  const { loading, microphoneEnabled, requestPermissions } = useMicrophone();
  const [recording, setRecording] = useState(false);
  const [duration, setDuration] = useState(0);
  const [recordedBlob, setRecordedBlob] = useState(null);

  const streamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const audioRef = useRef(null);

  const startSTTSession = async () => {
    if (!microphoneEnabled) await requestPermissions();
    // Reset recording (if any)
    setRecordedBlob(null);
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
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
        if (mediaRecorder.state === "inactive") {
          const duration = Date.now() - startTime;

          // Received a stop event
          let blob = new Blob(chunksRef.current, { type: mimeType });

          if (mimeType === "audio/webm") {
            blob = await webmFixDuration(blob, duration, blob.type);
          }

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

          setRecordedBlob(blob);
          await transcribeAudio(readerOutput.buffer);
          chunksRef.current = [];
        }
      });
      mediaRecorder.start();
      setRecording(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  const endTTSSession = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state === "recording"
    ) {
      mediaRecorderRef.current.stop(); // set state to inactive
      setDuration(0);
      setRecording(false);
    }
  };

  useEffect(() => {
    let stream = null;

    if (recording) {
      const timer = setInterval(() => {
        setDuration((prevDuration) => prevDuration + 1);
      }, 1000);

      return () => {
        clearInterval(timer);
      };
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [recording]);

  const handleToggleRecording = () => {
    if (!recording) {
      startSTTSession();
    } else {
      endTTSSession();
    }
  };


  if (loading) return null;
  return (
    <>
      <div
        id="text-size-btn"
        data-tooltip-id="tooltip-text-size-btn"
        data-tooltip-content="Speak your prompt"
        aria-label="Speak your prompt"
        onClick={handleToggleRecording}
        className={`relative flex justify-center items-center opacity-60 hover:opacity-100 cursor-pointer ${!!recording ? "!opacity-100" : ""
          }`}
      >
        <Microphone
          weight="fill"
          className={`w-6 h-6 pointer-events-none text-white overflow-hidden rounded-full ${recording ? "animate-pulse" : ""
            }`}
        />
        <Tooltip
          id="tooltip-text-size-btn"
          place="top"
          delayShow={300}
          className="tooltip !text-xs z-99"
        />
      </div>
      {recordedBlob && (
        <audio className='w-full' ref={audioRef} controls>
          <source
            src={URL.createObjectURL(recordedBlob)}
            type={recordedBlob.type}
          />
        </audio>
      )}
    </>
  );
}

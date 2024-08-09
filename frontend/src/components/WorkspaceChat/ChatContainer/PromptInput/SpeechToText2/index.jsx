import { useEffect, useState } from "react";
import { Microphone } from "@phosphor-icons/react";
import { Tooltip } from "react-tooltip";
import { getMediaAccessLevels, requestMediaAccess } from "@/ipc/node-api";
import showToast from "@/utils/toast";
import MediaStreamRecorder from 'msr'
import Crunker from "./crunker";
import { generateAudioPost, transcribeAudio } from "@/utils/whisperSTT";
import { API_BASE } from "@/utils/api";

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
  // const [parts, setParts] = useState([])
  const [recorder, setRecorder] = useState(null)
  const [listening, setListening] = useState(false)
  const [loading, setLoading] = useState(true);
  const [microphoneEnabled, setMicrophoneEnabled] = useState(false)

  async function requestPermissions() {
    const enabled = await requestMediaAccess('microphone');
    setMicrophoneEnabled(enabled);
    return enabled
  }

  function onMediaSuccess(stream) {
    let mediaRecorder = new MediaStreamRecorder(stream);
    mediaRecorder.parts = [];
    mediaRecorder.mimeType = 'audio/wav'; // check this line for audio/wav
    mediaRecorder.ondataavailable = function (blob) {
      mediaRecorder.parts.push(blob)
      console.log(`BlobCount`, mediaRecorder.parts.length)
    };
    mediaRecorder.start(3000);
    setRecorder(mediaRecorder)
    setListening(true)
  }

  function onMediaError(e) {
    console.error('media error', e);
  }

  async function startSTTSession() {
    if (!microphoneEnabled) {
      const allowed = await requestPermissions();
      if (!allowed) {
        showToast("You cannot use this feature without enabling the microphone", 'error');
        return;
      }
    }
    navigator.getUserMedia({ audio: true, video: false }, onMediaSuccess, onMediaError);
  }

  async function endTTSSession() {
    recorder.stop();
    if (recorder.parts && recorder.parts.length > 0) {
      const Crunk = new Crunker({ sampleRate: 44100 });
      const mergedBlob = await Crunk.concatAudioBlobs(recorder.parts);
      await fetch(`${API_BASE()}/system/transcribe-audio`, {
        method: 'POST',
        headers: { Accept: "application/json" },
        body: JSON.stringify(await generateAudioPost(mergedBlob)),
      })
        .then((res) => res.json())
        .then((res) => console.log(res))
      addAudioElement(mergedBlob)
    }

    setListening(false);
    setRecorder(null);
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
    listening,
    startSTTSession,
    endTTSSession,
  }
}

export default function SpeechToText({ sendCommand }) {
  const {
    loading,
    listening,
    startSTTSession,
    endTTSSession
  } = useMicrophone();

  if (loading) return null;
  return (
    <>
      <div
        id="text-size-btn"
        data-tooltip-id="tooltip-text-size-btn"
        data-tooltip-content="Speak your prompt"
        aria-label="Speak your prompt"
        onClick={listening ? endTTSSession : startSTTSession}
        className={`relative flex justify-center items-center opacity-60 hover:opacity-100 cursor-pointer ${!!listening ? "!opacity-100" : ""
          }`}
      >
        <Microphone
          weight="fill"
          className={`w-6 h-6 pointer-events-none text-white overflow-hidden rounded-full ${listening ? "animate-pulse" : ""
            }`}
        />
        <Tooltip
          id="tooltip-text-size-btn"
          place="top"
          delayShow={300}
          className="tooltip !text-xs z-99"
        />
      </div>
    </>
  );
}

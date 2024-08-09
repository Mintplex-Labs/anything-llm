import { useEffect, useState } from "react";
import { Microphone } from "@phosphor-icons/react";
import { Tooltip } from "react-tooltip";
import { PROMPT_INPUT_EVENT } from "../../PromptInput";
import { getMediaAccessLevels, requestMediaAccess } from "@/ipc/node-api";
import showToast from "@/utils/toast";
import { AudioRecorder, useAudioRecorder } from "react-audio-voice-recorder";
import { API_BASE } from "@/utils/api";
import { bufferToMergedAudioChannel, generateAudioPost, transcribeAudio } from "@/utils/whisperSTT";
// import { transcribeAudio } from "@/utils/whisperSTT";

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
function useMicrophone(recorderControls) {
  const [loading, setLoading] = useState(true);
  const [microphoneEnabled, setMicrophoneEnabled] = useState(false)

  async function requestPermissions() {
    const enabled = await requestMediaAccess('microphone');
    setMicrophoneEnabled(enabled);
    return enabled
  }

  async function startSTTSession() {
  }


  // async function startSTTSession() {
  //   if (!microphoneEnabled) {
  //     const allowed = await requestPermissions();
  //     if (!allowed) {
  //       showToast("You cannot use this feature without enabling the microphone", 'error');
  //       return;
  //     }
  //   }
  //   recorderControls.startRecording();
  // }

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
    listening: recorderControls.isRecording,
    startSTTSession,
    endTTSSession: recorderControls.stopRecording,
  }
}

export default function SpeechToText({ sendCommand }) {
  const recorderControls = useAudioRecorder({
    noiseSuppression: true,
    echoCancellation: true,
    onNotAllowedOrFound: (err) => console.table(err),
  })
  const {
    loading,
    listening,
    startSTTSession,
    endTTSSession
  } = useMicrophone(recorderControls);

  async function handleTranscription(blob) {
    addAudioElement(blob)
    await transcribeAudio(blob)
  }

  if (loading) return null;
  return (
    <>
      <AudioRecorder
        classes={{ AudioRecorderClass: '!hidden' }}
        onRecordingComplete={handleTranscription}
        recorderControls={recorderControls}
        mediaRecorderOptions={{
          audioBitsPerSecond: 128000,
        }}
      />
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

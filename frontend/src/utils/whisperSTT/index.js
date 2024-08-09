import showToast from "../toast";

const CONSTANTS = {
  DEFAULT_MODEL: "Xenova/whisper-tiny",
  DEFAULT_SUBTASK: "transcribe",
  DEFAULT_LANGUAGE: "english",
  DEFAULT_QUANTIZED: false,
  DEFAULT_MULTILINGUAL: false,
}

export async function generateAudioPost(blob) {
  return {
    audio: Array.from(await bufferToMergedAudioChannel(blob)),
    model: CONSTANTS.DEFAULT_MODEL,
    // multilingual: CONSTANTS.DEFAULT_MULTILINGUAL,
    // quantized: CONSTANTS.DEFAULT_QUANTIZED,
    // subtask: null,
    language: null
  }
}


/**
 * @typedef {Object} TranscriberUpdateData
 * @property {[string, {chunks: {text: string, timestamp: [number, number|null]}[]}]} data - The data array.
 */

/** 
 * @typedef TranscriberCompleteData 
 * @property {{text: string, chunks: { text: string; timestamp: [number, number | null] }[]}} data;
**/
/**
 * 
 * @param {Blob|AudioBuffer} audioBlob 
 */
export async function transcribeAudio(buffer) {
  const audio = await bufferToMergedAudioChannel(buffer);
  if (!audio) return showToast("No audio track found!", 'error', { clear: true });

  const transcriptionWorker = new Worker(new URL("./worker.js", import.meta.url), {
    type: "module",
  });

  async function messageEventHandler(event) {
    console.log(event)
    const message = event.data;
    // Update the state with the result
    switch (message.status) {
      case "progress":
        console.log("progress on modelfile", message.progress);
        break;
      case "update":
        // Received partial update
        /** @type {TranscriberUpdateData} */
        const updateMessage = message;
        console.log("update", {
          text: updateMessage.data[0],
          chunks: updateMessage.data[1].chunks,
        });
        break;
      case "complete":
        // Received complete transcript
        /** @type {TranscriberCompleteData} */
        const completeMessage = message;
        console.log("complete", {
          text: completeMessage.data.text,
          chunks: completeMessage.data.chunks,
        });
        break;

      case "initiate":
        console.log("Loading model", message)
        break;
      case "ready":
        console.log("Ready")
        break;
      case "error":
        console.log("Error", message)
        alert(
          `${message.data.message} This is most likely because you are using Safari on an M1/M2 Mac. Please try again from Chrome, Firefox, or Edge.\n\nIf this is not the case, please file a bug report.`,
        );
        break;
      case "done":
        console.log("Model download done.")
        break;

      default:
        console.log("Unknown", message)
        break;
    }
  }
  transcriptionWorker.addEventListener("message", messageEventHandler);
  transcriptionWorker.postMessage({
    audio,
    model: CONSTANTS.DEFAULT_MODEL,
    multilingual: CONSTANTS.DEFAULT_MULTILINGUAL,
    quantized: CONSTANTS.DEFAULT_QUANTIZED,
    subtask: null,
    language: null
    // subtask: CONSTANTS.DEFAULT_MULTILINGUAL ? CONSTANTS.DEFAULT_SUBTASK : null,
    // language: CONSTANTS.DEFAULT_MULTILINGUAL  && language !== "auto" ? language : null,
  })

  return true;
}

/**
 * Convert audio in stereo or mono AudioBuffer to mono audio channel Float32Array
 * @param {Blob|AudioBuffer} buffer 
 * @returns {Promise<Float32Array>}
 */
export async function bufferToMergedAudioChannel(buffer) {
  let audioData;
  if (buffer instanceof AudioBuffer) {
    audioData = buffer
  } else {
    const arrayBuffer = await audioBlob.arrayBuffer();
    audioData = await (new AudioContext()).decodeAudioData(arrayBuffer)
    if (!audioData) throw new Error("No audio data decoded.")
  }

  let audio;
  if (audioData.numberOfChannels === 2) {
    const SCALING_FACTOR = Math.sqrt(2);

    let left = audioData.getChannelData(0);
    let right = audioData.getChannelData(1);

    audio = new Float32Array(left.length);
    for (let i = 0; i < audioData.length; ++i) {
      audio[i] = SCALING_FACTOR * (left[i] + right[i]) / 2;
    }
  } else {
    // If the audio is mono, we can just use the first channel:
    audio = audioData.getChannelData(0);
  }

  return audio;
}
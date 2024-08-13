import showToast from "../toast";

const CONSTANTS = {
  DEFAULT_MODEL: "Xenova/whisper-tiny",
  DEFAULT_SUBTASK: "transcribe",
  DEFAULT_LANGUAGE: "english",
  DEFAULT_QUANTIZED: false,
  DEFAULT_MULTILINGUAL: false,
};

export class TranscriptionWorker {
  /** @type {TranscriptionWorker}  */
  static _instance;
  /** @type {Worker} - the direct webworker instance to use for transcribing */
  _worker;

  constructor() {
    if (TranscriptionWorker._instance) return TranscriptionWorker._instance;
    this._worker = new Worker(new URL("./worker.js", import.meta.url), {
      type: "module",
    });
    TranscriptionWorker._instance = this;
  }

  /**
   * Gets or instantiates a new worker for Whisper predictions
   * @returns {Worker}
   */
  get worker() {
    if (this._worker) return this._worker;
    this._worker = new Worker(new URL("./worker.js", import.meta.url), {
      type: "module",
    });
    return this._worker;
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
 * Transcribes a full audio stream via WebWorker
 * ----
 * Todo:
 * - Do chunk streaming on each audioBuffer so you don't have to wait on entire audio to be formed.
 * @param {AudioBuffer} audioBuffer
 * @param {{model: string, multilingual: boolean|null}} options
 * @returns {Promise<{transcript: null|string, error: null|string}>}
 */
export async function transcribeAudio(audioBuffer, options = {}) {
  if (!(audioBuffer instanceof AudioBuffer))
    return showToast("No valid audio buffer found!", "error", { clear: true });
  const audio = await bufferToMergedAudioChannel(audioBuffer);
  const transcriptionWorker = new TranscriptionWorker().worker;
  const hasCachedFiles = await browserCacheExists(
    options.model ?? CONSTANTS.DEFAULT_MODEL
  );

  return new Promise((resolve) => {
    let neededToDownload = false;
    async function messageEventHandler(event) {
      const message = event.data;
      switch (message.status) {
        case "progress":
          if (!hasCachedFiles) {
            emitDownloadProgressEvent();
            neededToDownload = true;
          }
          break;
        case "update":
          // Received partial update
          // /** @type {TranscriberUpdateData} */
          // const updateMessage = message;
          // console.log("update", {
          //   text: updateMessage.data[0],
          //   chunks: updateMessage.data[1].chunks,
          // });
          break;
        case "complete":
          // Received complete transcript
          /** @type {TranscriberCompleteData} */
          const completeMessage = message;
          resolve({
            transcript: completeMessage.data.text.trim(),
            error: null,
          });
          break;
        case "initiate":
          // console.log("Loading model", message)
          break;
        case "ready":
          if (neededToDownload) emitDownloadProgressEvent(true);
          console.log("Model ready for prediction");
          break;
        case "error":
          console.log("Error", message);
          showToast(message.data.message, "error", { clear: true });
          resolve({ transcript: null, error: message.data.message });
          break;
        case "done":
          // console.log("Model download complete.")
          break;

        default:
          console.log("Unknown", message);
          break;
      }
    }
    transcriptionWorker.addEventListener("message", messageEventHandler);
    transcriptionWorker.postMessage({
      audio,
      model: options?.model ?? CONSTANTS.DEFAULT_MODEL,
      multilingual: options.hasOwnProperty("multilingual")
        ? options.multilingual
        : CONSTANTS.DEFAULT_MULTILINGUAL,
      quantized: CONSTANTS.DEFAULT_QUANTIZED, // always true.
      subtask: null,
      language: null,
    });
  });
}

/**
 * Convert audio in stereo or mono AudioBuffer to mono audio channel Float32Array
 * @param {Blob|AudioBuffer} buffer
 * @returns {Promise<Float32Array>}
 */
export async function bufferToMergedAudioChannel(audioData) {
  let audio;
  if (audioData.numberOfChannels === 2) {
    const SCALING_FACTOR = Math.sqrt(2);

    let left = audioData.getChannelData(0);
    let right = audioData.getChannelData(1);

    audio = new Float32Array(left.length);
    for (let i = 0; i < audioData.length; ++i) {
      audio[i] = (SCALING_FACTOR * (left[i] + right[i])) / 2;
    }
  } else {
    // If the audio is mono, we can just use the first channel:
    audio = audioData.getChannelData(0);
  }

  return audio;
}

function emitDownloadProgressEvent(done = false) {
  return window.dispatchEvent(
    new CustomEvent(`whisper_model_downloading${done ? "_done" : ""}`)
  );
}

async function browserCacheExists(model = CONSTANTS.DEFAULT_MODEL) {
  const modelKey = model.toLowerCase();
  return await window.caches
    .open("transformers-cache")
    .then((transformersCache) => transformersCache)
    .then((tCache) => tCache.keys())
    .then((keys) => keys.map((k) => k.url))
    .then((urls) => urls.some((url) => url.toLowerCase().includes(modelKey)));
}

import * as TTS from "@mintplex-labs/piper-tts-web";

/** @type {import("@mintplexlabs/piper-web-tts").TtsSession | null} */
let PIPER_SESSION = null;

/**
 * @typedef PredictionRequest
 * @property {('init')} type
 * @property {string} text - the text to inference on
 * @property {import('@mintplexlabs/piper-web-tts').VoiceId} voiceId - the voiceID key to use.
 * @property {string|null} baseUrl - the base URL to fetch WASMs from.
 * @property {boolean} [stream] - when true, audio is posted back per sentence
 * chunk ({type:'stream-chunk'}) as it renders, followed by {type:'stream-end'},
 * instead of a single {type:'result'} blob for the entire text.
 */
/**
 * @typedef PredictionRequestResponse
 * @property {('result')} type
 * @property {Blob} audio - the text to inference on
 */

/**
 * @typedef VoicesRequest
 * @property {('voices')} type
 * @property {string|null} baseUrl - the base URL to fetch WASMs from.
 */
/**
 * @typedef VoicesRequestResponse
 * @property {('voices')} type
 * @property {[import("@mintplex-labs/piper-tts-web/dist/types")['Voice']]} voices - available voices in array
 */

/**
 * @typedef FlushRequest
 * @property {('flush')} type
 */
/**
 * @typedef FlushRequestResponse
 * @property {('flush')} type
 * @property {true} flushed
 */

/**
 * Web worker for generating client-side PiperTTS predictions
 * @param {MessageEvent<PredictionRequest | VoicesRequest | FlushRequest>} event - The event object containing the prediction request
 * @returns {Promise<PredictionRequestResponse|VoicesRequestResponse|FlushRequestResponse>}
 */
async function main(event) {
  if (event.data.type === "voices") {
    const stored = await TTS.stored();
    const voices = await TTS.voices();
    voices.forEach((voice) => (voice.is_stored = stored.includes(voice.key)));

    self.postMessage({ type: "voices", voices });
    return;
  }

  if (event.data.type === "flush") {
    await TTS.flush();
    self.postMessage({ type: "flush", flushed: true });
    return;
  }

  if (event.data?.type !== "init") return;
  if (!PIPER_SESSION) {
    PIPER_SESSION = new TTS.TtsSession({
      voiceId: event.data.voiceId,
      progress: (e) => self.postMessage(JSON.stringify(e)),
      logger: (msg) => self.postMessage(msg),
      ...(!!event.data.baseUrl
        ? {
            wasmPaths: {
              onnxWasm: `${event.data.baseUrl}/piper/ort/`,
              piperData: `${event.data.baseUrl}/piper/piper_phonemize.data`,
              piperWasm: `${event.data.baseUrl}/piper/piper_phonemize.wasm`,
            },
          }
        : {}),
    });
  }

  if (event.data.voiceId && PIPER_SESSION.voiceId !== event.data.voiceId)
    PIPER_SESSION.voiceId = event.data.voiceId;

  if (event.data.stream === true) {
    // Streamed mode: render sentence-sized chunks sequentially and post each
    // audio blob as soon as it is ready so playback can begin immediately.
    try {
      const chunks = splitIntoChunks(String(event.data.text));
      if (chunks.length === 0) throw new Error("No text to predict on.");
      self.postMessage({ type: "stream-start", total: chunks.length });
      for (let i = 0; i < chunks.length; i++) {
        const audio = await PIPER_SESSION.predict(chunks[i]);
        self.postMessage({
          type: "stream-chunk",
          audio,
          index: i,
          total: chunks.length,
        });
      }
      self.postMessage({ type: "stream-end" });
    } catch (error) {
      self.postMessage({ type: "error", message: error.message, error });
    }
    return;
  }

  PIPER_SESSION.predict(event.data.text)
    .then((res) => {
      if (res instanceof Blob) {
        self.postMessage({ type: "result", audio: res });
        return;
      }
    })
    .catch((error) => {
      self.postMessage({ type: "error", message: error.message, error }); // Will be an error.
    });
}

/**
 * Splits text into sentence-aligned chunks (mirrors the chunking inside
 * @mintplex-labs/piper-tts-web) so each streamed predict() call stays small
 * enough for a single OrtRun and audio starts after the first sentence group.
 * @param {string} text
 * @param {number} maxLength
 * @returns {string[]}
 */
function splitIntoChunks(text, maxLength = 400) {
  const trimmed = text.trim();
  if (!trimmed) return [];
  if (trimmed.length <= maxLength) return [trimmed];

  const sentences = trimmed.match(/[^.!?…\n]+[.!?…]*\s*/g) ?? [trimmed];
  const chunks = [];
  let current = "";

  const pushCurrent = () => {
    const c = current.trim();
    if (c) chunks.push(c);
    current = "";
  };

  for (const sentence of sentences) {
    if ((current + sentence).length > maxLength) pushCurrent();
    if (sentence.length > maxLength) {
      // A single run-on sentence longer than the limit: split on word boundaries.
      let piece = "";
      for (const word of sentence.split(/\s+/)) {
        if ((piece + " " + word).trim().length > maxLength) {
          const p = piece.trim();
          if (p) chunks.push(p);
          piece = word;
        } else {
          piece = piece ? `${piece} ${word}` : word;
        }
      }
      current = piece;
    } else {
      current += sentence;
    }
  }
  pushCurrent();

  return chunks;
}

self.addEventListener("message", main);

import showToast from "../toast";

/**
 * Strips <think>...</think> reasoning blocks (including an unterminated
 * trailing <think> block) so internal model reasoning is never sent to the
 * TTS worker regardless of which caller built the text.
 * @param {string} text
 * @returns {string}
 */
function stripThinkTags(text = "") {
  return String(text)
    .replace(/<think>[\s\S]*?<\/think>/gi, " ")
    .replace(/<think>[\s\S]*$/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export default class PiperTTSClient {
  static _instance;
  voiceId = "en_US-hfc_female-medium";
  worker = null;

  constructor({ voiceId } = { voiceId: null }) {
    if (PiperTTSClient._instance) {
      this.voiceId = voiceId !== null ? voiceId : this.voiceId;
      return PiperTTSClient._instance;
    }

    this.voiceId = voiceId !== null ? voiceId : this.voiceId;
    PiperTTSClient._instance = this;
    return this;
  }

  #getWorker() {
    if (!this.worker)
      this.worker = new Worker(new URL("./worker.js", import.meta.url), {
        type: "module",
      });
    return this.worker;
  }

  /**
   * Get all available voices for a client
   * @returns {Promise<import("@mintplex-labs/piper-tts-web/dist/types").Voice[]}>}
   */
  static async voices() {
    const tmpWorker = new Worker(new URL("./worker.js", import.meta.url), {
      type: "module",
    });
    tmpWorker.postMessage({ type: "voices" });
    return new Promise((resolve, reject) => {
      let timeout = null;
      const handleMessage = (event) => {
        if (event.data.type !== "voices") {
          console.log("PiperTTSWorker debug event:", event.data);
          return;
        }
        resolve(event.data.voices);
        tmpWorker.removeEventListener("message", handleMessage);
        timeout && clearTimeout(timeout);
        tmpWorker.terminate();
      };

      timeout = setTimeout(() => {
        reject("TTS Worker timed out.");
      }, 30_000);
      tmpWorker.addEventListener("message", handleMessage);
    });
  }

  static async flush() {
    const tmpWorker = new Worker(new URL("./worker.js", import.meta.url), {
      type: "module",
    });
    tmpWorker.postMessage({ type: "flush" });
    return new Promise((resolve, reject) => {
      let timeout = null;
      const handleMessage = (event) => {
        if (event.data.type !== "flush") {
          console.log("PiperTTSWorker debug event:", event.data);
          return;
        }
        resolve(event.data.flushed);
        tmpWorker.removeEventListener("message", handleMessage);
        timeout && clearTimeout(timeout);
        tmpWorker.terminate();
      };

      timeout = setTimeout(() => {
        reject("TTS Worker timed out.");
      }, 30_000);
      tmpWorker.addEventListener("message", handleMessage);
    });
  }

  /**
   * Runs prediction via webworker so we can get an audio blob back.
   * @returns {Promise<{blobURL: string|null, error: string|null}>} objectURL blob: type.
   *
   * Waits for the worker to post back a result or error - long text is chunked
   * and inferenced sequentially in the worker, so there is intentionally no
   * timeout here. The prediction runs as long as needed (progress is relayed
   * via debug events) and is only abandoned on error or page unload.
   * @param {((percent: number) => void)|null} onProgress - called with 0-100 as
   * chunked inference progresses (only fires for long text that gets chunked).
   */
  async waitForBlobResponse(onProgress = null) {
    return new Promise((resolve) => {
      const handleMessage = (event) => {
        if (event.data.type === "error") {
          this.worker.removeEventListener("message", handleMessage);
          return resolve({ blobURL: null, error: event.data.message });
        }

        if (event.data.type !== "result") {
          // Progress events from @mintplex-labs/piper-tts-web arrive as
          // JSON-encoded strings - inference progress uses a reserved tts:// url.
          if (typeof event.data === "string" && event.data.startsWith("{")) {
            try {
              const progress = JSON.parse(event.data);
              if (
                progress?.url === "tts://inference-progress" &&
                progress?.total > 0
              ) {
                const percent = Math.round(
                  (progress.loaded / progress.total) * 100
                );
                console.log(`PiperTTSWorker inference progress: ${percent}%`);
                onProgress?.(percent);
                return;
              }
            } catch {}
          }
          console.log("PiperTTSWorker debug event:", event.data);
          return;
        }
        resolve({
          blobURL: URL.createObjectURL(event.data.audio),
          error: null,
        });
        this.worker.removeEventListener("message", handleMessage);
      };

      this.worker.addEventListener("message", handleMessage);
    });
  }

  /**
   * Streams TTS audio for text as sentence-sized chunks so playback can start
   * as soon as the first chunk is rendered instead of waiting for the entire
   * text to inference. Chunks always arrive in order.
   * @param {string} textToSpeak
   * @param {string|null} voiceId
   * @param {{
   *  onChunk?: (blobURL: string, index: number, total: number) => void,
   *  onEnd?: () => void,
   *  onError?: (message: string) => void,
   * }} handlers
   * @returns {() => void} abort - stops generation of any remaining chunks and
   * detaches the handlers. Call when the consuming component unmounts (eg:
   * thread change) so the shared worker does not keep rendering audio.
   */
  streamAudioForText(textToSpeak, voiceId = null, handlers = {}) {
    const { onChunk, onEnd, onError } = handlers;
    const primaryWorker = this.#getWorker();
    // Unique id for this stream - all worker messages for it carry the id, so
    // this listener never reacts to chunks from a previous (superseded) stream
    // and the abort below only targets this stream.
    const streamId = `tts-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

    const handleMessage = (event) => {
      const data = event.data;
      // Ignore messages that belong to a different stream on the shared worker.
      if (data?.streamId && data.streamId !== streamId) return;
      if (data?.type === "error") {
        primaryWorker.removeEventListener("message", handleMessage);
        showToast(
          `Could not generate voice prediction. Error: ${data.message}`,
          "error",
          { clear: true }
        );
        onError?.(data.message);
        return;
      }

      if (data?.type === "stream-chunk") {
        const rendered = data.index + 1;
        console.log(
          `PiperTTSWorker stream progress: chunk ${rendered}/${data.total} rendered (${Math.round((rendered / data.total) * 100)}%)`
        );
        onChunk?.(URL.createObjectURL(data.audio), data.index, data.total);
        return;
      }

      if (data?.type === "stream-end") {
        console.log(
          data.aborted
            ? "PiperTTSWorker stream progress: stream aborted."
            : "PiperTTSWorker stream progress: all chunks rendered."
        );
        primaryWorker.removeEventListener("message", handleMessage);
        onEnd?.();
        return;
      }

      if (data?.type === "stream-start") {
        console.log(
          `PiperTTSWorker stream progress: starting - ${data.total} chunk(s) to render.`
        );
        return;
      }

      console.log("PiperTTSWorker debug event:", data);
    };

    primaryWorker.addEventListener("message", handleMessage);
    primaryWorker.postMessage({
      type: "init",
      stream: true,
      streamId,
      text: stripThinkTags(textToSpeak),
      voiceId: voiceId ?? this.voiceId,
    });

    return () => {
      console.log("PiperTTSWorker: abort requested - stopping stream.");
      primaryWorker.removeEventListener("message", handleMessage);
      primaryWorker.postMessage({ type: "abort", streamId });
    };
  }

  async getAudioBlobForText(textToSpeak, voiceId = null, onProgress = null) {
    const primaryWorker = this.#getWorker();
    primaryWorker.postMessage({
      type: "init",
      text: stripThinkTags(textToSpeak),
      voiceId: voiceId ?? this.voiceId,
      // Don't reference WASM because in the docker image
      // the user will be connected to internet (mostly)
      // and it bloats the app size on the frontend or app significantly
      // and running the docker image fully offline is not an intended use-case unlike the app.
    });

    const { blobURL, error } = await this.waitForBlobResponse(onProgress);
    if (!!error) {
      showToast(
        `Could not generate voice prediction. Error: ${error}`,
        "error",
        { clear: true }
      );
      return;
    }

    return blobURL;
  }
}

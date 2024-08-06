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
   * @returns {Promise<string>} objectURL blob: type.
   */
  async waitForBlobResponse() {
    return new Promise((resolve, reject) => {
      let timeout = null;
      const handleMessage = (event) => {
        if (event.data.type !== "result") {
          console.log("PiperTTSWorker debug event:", event.data);
          return;
        }
        resolve(URL.createObjectURL(event.data.audio));
        this.worker.removeEventListener("message", handleMessage);
        timeout && clearTimeout(timeout);
      };

      timeout = setTimeout(() => {
        reject("TTS Worker timed out.");
      }, 30_000);
      this.worker.addEventListener("message", handleMessage);
    });
  }

  async getAudioBlobForText(textToSpeak, voiceId = null) {
    const primaryWorker = this.#getWorker();
    primaryWorker.postMessage({
      type: "init",
      text: String(textToSpeak),
      voiceId: voiceId ?? this.voiceId,
      baseUrl: import.meta.env.DEV
        ? `${window.location.origin}/public`
        : `${window.location.origin}/`,
    });

    const blobURL = await this.waitForBlobResponse();
    return blobURL;
  }
}

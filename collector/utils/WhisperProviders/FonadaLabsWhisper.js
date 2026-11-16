const fs = require("fs");
const os = require("os");
const path = require("path");
const { spawn } = require("child_process");

const FONADA_TRANSCRIBE_URL = "https://api.fonada.ai/v3/asr/transcribe";
const MAX_UPLOAD_BYTES = 25_000_000;
const CHUNK_TARGET_BYTES = 23_000_000;
const CHUNK_BITRATE = 96_000;

class FonadaLabsWhisper {
  constructor({ options }) {
    if (!options.WhisperFonadaLabsApiKey)
      throw new Error("No FonadaLabs API key was set.");

    this.apiKey = options.WhisperFonadaLabsApiKey;
    this.languageId = options.WhisperFonadaLabsLanguageId || "en";
    this.maxConcurrency = Math.max(
      1,
      Math.min(4, Number(options.WhisperFonadaLabsMaxConcurrency) || 2)
    );
    this.#log("Initialized.");
  }

  #log(text, ...args) {
    console.log(`\x1b[32m[FonadaLabsWhisper]\x1b[0m ${text}`, ...args);
  }

  async #transcribeFile(fullFilePath) {
    try {
      const audio = await fs.promises.readFile(fullFilePath);
      const form = new FormData();
      form.append(
        "file",
        new Blob([audio]),
        path.basename(fullFilePath) || "audio.wav"
      );
      form.append("language_id", this.languageId);

      // A lost response can still represent a billed transcription. Do not retry
      // automatically; the user can decide whether a resubmission is appropriate.
      const response = await fetch(FONADA_TRANSCRIBE_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          Accept: "application/json",
        },
        body: form,
        signal: AbortSignal.timeout(15 * 60_000),
      });
      const payload = await response.json().catch(() => null);

      if (!response.ok) {
        const message = payload?.message || payload?.error?.message;
        return {
          content: "",
          error: message || `FonadaLabs transcription failed (HTTP ${response.status}).`,
        };
      }

      const result = payload?.result && typeof payload.result === "object"
        ? payload.result
        : payload;
      const text = result?.text || result?.transcript || result?.transcription;
      if (typeof text !== "string" || !text.trim()) {
        return { content: "", error: "FonadaLabs returned no transcription text." };
      }
      return { content: text, error: null };
    } catch (error) {
      this.#log("Could not get a response from FonadaLabs", error.message);
      return { content: "", error: error.message };
    }
  }

  async #splitLargeFile(fullFilePath) {
    const temporaryDirectory = await fs.promises.mkdtemp(
      path.join(os.tmpdir(), "fonadalabs-asr-")
    );
    const segmentSeconds = Math.floor((CHUNK_TARGET_BYTES * 8) / CHUNK_BITRATE);
    const outputPattern = path.join(temporaryDirectory, "chunk-%04d.mp3");

    try {
      await new Promise((resolve, reject) => {
        const ffmpeg = spawn(
          "ffmpeg",
          [
            "-i", fullFilePath,
            "-map", "0:a:0",
            "-vn",
            "-ac", "1",
            "-ar", "16000",
            "-c:a", "libmp3lame",
            "-b:a", "96k",
            "-f", "segment",
            "-segment_time", String(segmentSeconds),
            "-reset_timestamps", "1",
            "-y", outputPattern,
          ],
          { stdio: ["ignore", "ignore", "pipe"] }
        );
        let stderr = "";
        ffmpeg.stderr.on("data", (data) => (stderr += data));
        ffmpeg.on("error", reject);
        ffmpeg.on("close", (code) =>
          code === 0 ? resolve() : reject(new Error(`FFMPEG split failed: ${stderr}`))
        );
      });

      const chunks = (await fs.promises.readdir(temporaryDirectory))
        .filter((filename) => filename.endsWith(".mp3"))
        .sort()
        .map((filename) => path.join(temporaryDirectory, filename));
      if (!chunks.length) throw new Error("FFMPEG produced no audio chunks.");
      return { temporaryDirectory, chunks };
    } catch (error) {
      await fs.promises.rm(temporaryDirectory, { recursive: true, force: true });
      throw error;
    }
  }

  async #transcribeChunks(chunks) {
    const results = new Array(chunks.length);
    let nextIndex = 0;
    let firstError = null;
    const worker = async () => {
      while (!firstError) {
        const index = nextIndex++;
        if (index >= chunks.length) return;
        const result = await this.#transcribeFile(chunks[index]);
        if (result.error) {
          firstError = `Chunk ${index + 1} of ${chunks.length}: ${result.error}`;
          return;
        }
        results[index] = result.content;
      }
    };
    await Promise.all(Array.from({ length: Math.min(this.maxConcurrency, chunks.length) }, worker));
    return firstError
      ? { content: "", error: firstError }
      : { content: results.join("\n\n"), error: null };
  }

  async processFile(fullFilePath) {
    try {
      const stats = await fs.promises.stat(fullFilePath);
      if (stats.size <= MAX_UPLOAD_BYTES) return await this.#transcribeFile(fullFilePath);

      this.#log("Splitting oversized recording into ordered transcription chunks.");
      const { temporaryDirectory, chunks } = await this.#splitLargeFile(fullFilePath);
      try {
        return await this.#transcribeChunks(chunks);
      } finally {
        await fs.promises.rm(temporaryDirectory, { recursive: true, force: true });
      }
    } catch (error) {
      this.#log("Could not prepare FonadaLabs transcription", error.message);
      return { content: "", error: error.message };
    }
  }
}

module.exports = { FonadaLabsWhisper };

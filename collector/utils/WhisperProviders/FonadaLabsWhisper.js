const fs = require("fs");
const os = require("os");
const path = require("path");
const { spawn } = require("child_process");
const { createHash, createHmac, randomUUID } = require("crypto");
const gates = new Map();

const FONADA_TRANSCRIBE_URL = "https://api.fonada.ai/v3/asr/transcribe";
const MAX_UPLOAD_BYTES = 25_000_000;
// Keep a wide margin below FonadaLabs' advertised 25 MB ceiling. In practice,
// smaller decoded/re-encoded uploads are more reliable than near-limit chunks.
const CHUNK_SECONDS = 60;

class FonadaLabsWhisper {
  constructor({ options }) {
    if (!options.WhisperFonadaLabsApiKey)
      throw new Error("No FonadaLabs API key was set.");

    this.apiKey = options.WhisperFonadaLabsApiKey;
    this.languageId = options.WhisperFonadaLabsLanguageId || "en";
    const account = createHash("sha256").update(this.apiKey).digest("hex");
    if (!gates.has(account)) gates.set(account, { next: 0 });
    this.gate = gates.get(account);
    this.maxConcurrency = Math.max(
      1,
      Math.min(4, Number(options.WhisperFonadaLabsMaxConcurrency) || 2)
    );
    this.#log("Initialized.");
  }

  #log(text, ...args) {
    console.log(`\x1b[32m[FonadaLabsWhisper]\x1b[0m ${text}`, ...args);
  }

  async #transcribeFile(fullFilePath, stopped) {
    try {
      const audio = await fs.promises.readFile(fullFilePath);
      if (!audio.length || audio.length > MAX_UPLOAD_BYTES)
        return {
          content: "",
          error: "Prepared audio chunk is empty or exceeds 25 MB.",
        };
      const createForm = () => {
        const form = new FormData();
        form.append(
          "file",
          new Blob([audio], { type: "audio/mpeg" }),
          path.basename(fullFilePath) || "audio.wav"
        );
        form.append("language_id", this.languageId);
        return form;
      };

      let response;
      let payload;
      let rateLimitRetries = 0;
      let upstreamRetries = 0;
      while (true) {
        while (true) {
          if (stopped()) return { stopped: true };
          const delay = this.gate.next - Date.now();
          if (delay <= 0) {
            // Six seconds still reached the account's observed rate limit.
            // Eight seconds keeps two workers useful without bursting Fonada.
            this.gate.next = Date.now() + 8000;
            break;
          }
          await new Promise((resolve) =>
            setTimeout(resolve, Math.min(delay, 1000))
          );
        }
        response = await fetch(FONADA_TRANSCRIBE_URL, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            Accept: "application/json",
          },
          body: createForm(),
          signal: AbortSignal.timeout(15 * 60_000),
        });
        payload = await response.json().catch(() => null);
        // Fonada's gateway can truncate the JSON error body, but its observed
        // HTTP 502 response represents ASR upstream_unavailable. Handle the
        // status itself so a malformed error body does not disable recovery.
        const upstreamUnavailable = response.status === 502;
        if (response.status !== 429 && !upstreamUnavailable) break;

        // Rate-limit and upstream failures have independent retry budgets. A
        // preceding 429 must not consume recovery attempts for a subsequent
        // 502 from Fonada's ASR gateway.
        if (upstreamUnavailable) {
          if (upstreamRetries >= 4) break;
          upstreamRetries += 1;
        } else {
          if (rateLimitRetries >= 1) break;
          rateLimitRetries += 1;
        }

        const header = response.headers.get("retry-after");
        const retryAfter = /^\d+$/.test(header || "")
          ? Number(header)
          : (Date.parse(header) - Date.now()) / 1000;
        const waitSeconds = upstreamUnavailable
          ? Math.min(120, 60 * upstreamRetries)
          : Math.max(60, Number.isFinite(retryAfter) ? retryAfter : 60);
        this.gate.next = Math.max(
          this.gate.next,
          Date.now() + waitSeconds * 1000
        );
        if (waitSeconds > 3600) {
          return {
            content: "",
            error: "FonadaLabs rate limit cooldown exceeds one hour.",
          };
        }
        this.#log(
          `${upstreamUnavailable ? "FonadaLabs upstream unavailable" : "Rate limited"}; ` +
            `retrying after ${waitSeconds} seconds ` +
            `(${upstreamUnavailable ? `upstream retry ${upstreamRetries}/4` : "rate-limit retry 1/1"}).`
        );
      }

      if (!response.ok) {
        const messages = {
          400: "FonadaLabs rejected the audio or language.",
          401: "FonadaLabs rejected the API key.",
          402: "FonadaLabs reports a credit or payment problem.",
          403: "FonadaLabs denied access to this request.",
          413: "FonadaLabs rejected the audio size.",
          429: "FonadaLabs rate limit remained active after one retry.",
          502: "FonadaLabs ASR remained unavailable after four recovery retries.",
        };
        const message =
          messages[response.status] ||
          payload?.message ||
          payload?.error?.message;
        this.#log(`FonadaLabs returned HTTP ${response.status}.`);
        return {
          content: "",
          error:
            message ||
            `FonadaLabs transcription failed (HTTP ${response.status}).`,
        };
      }

      const result =
        payload?.result && typeof payload.result === "object"
          ? payload.result
          : payload;
      const text = result?.text || result?.transcript || result?.transcription;
      if (typeof text !== "string" || !text.trim()) {
        return {
          content: "",
          error: "FonadaLabs returned no transcription text.",
        };
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
    const segmentSeconds = CHUNK_SECONDS;
    const outputPattern = path.join(temporaryDirectory, "chunk-%04d.mp3");

    try {
      await new Promise((resolve, reject) => {
        const ffmpeg = spawn(
          "ffmpeg",
          [
            "-i",
            fullFilePath,
            "-map",
            "0:a:0",
            "-vn",
            "-ac",
            "1",
            "-ar",
            "16000",
            "-c:a",
            "libmp3lame",
            "-b:a",
            "96k",
            "-f",
            "segment",
            "-segment_time",
            String(segmentSeconds),
            "-reset_timestamps",
            "1",
            "-y",
            outputPattern,
          ],
          { stdio: ["ignore", "ignore", "pipe"] }
        );
        let stderr = "";
        ffmpeg.stderr.on(
          "data",
          (data) => (stderr = (stderr + data).slice(-4096))
        );
        ffmpeg.on("error", reject);
        ffmpeg.on("close", (code) =>
          code === 0
            ? resolve()
            : reject(new Error(`FFMPEG split failed: ${stderr}`))
        );
      });

      const chunks = (await fs.promises.readdir(temporaryDirectory))
        .filter((filename) => filename.endsWith(".mp3"))
        .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
        .map((filename) => path.join(temporaryDirectory, filename));
      if (!chunks.length) throw new Error("FFMPEG produced no audio chunks.");
      return { temporaryDirectory, chunks };
    } catch (error) {
      await fs.promises.rm(temporaryDirectory, {
        recursive: true,
        force: true,
      });
      throw error;
    }
  }

  async #transcribeChunks(chunks) {
    const checkpointDir = path.join(
      process.env.STORAGE_DIR || path.resolve(__dirname, "../../storage"),
      "fonadalabs-checkpoints"
    );
    await fs.promises.mkdir(checkpointDir, { recursive: true, mode: 0o700 });
    const results = new Array(chunks.length);
    let nextIndex = 0;
    let firstError = null;
    const worker = async () => {
      while (!firstError) {
        const index = nextIndex++;
        if (index >= chunks.length) return;
        const bytes = await fs.promises.readFile(chunks[index]);
        const key = createHmac("sha256", this.apiKey)
          .update(this.languageId)
          .update("\0kapture-v3\0")
          .update(bytes)
          .digest("hex");
        const saved = path.join(checkpointDir, key + ".json");
        try {
          const cached = JSON.parse(await fs.promises.readFile(saved, "utf8"));
          if (typeof cached.text === "string") {
            results[index] = cached.text;
            continue;
          }
        } catch (error) {
          if (error.code !== "ENOENT" && !(error instanceof SyntaxError))
            throw error;
        }
        const result = await this.#transcribeFile(
          chunks[index],
          () => !!firstError
        );
        if (result.stopped) return;
        if (result.error) {
          firstError ||= `Chunk ${index + 1} of ${chunks.length}: ${result.error}`;
          return;
        }
        const pending = saved + "." + randomUUID();
        await fs.promises.writeFile(
          pending,
          JSON.stringify({ text: result.content }),
          { mode: 0o600 }
        );
        await fs.promises.rename(pending, saved);
        results[index] = result.content;
        this.#log(`Completed chunk ${index + 1}/${chunks.length}.`);
      }
    };
    await Promise.all(
      Array.from(
        { length: Math.min(this.maxConcurrency, chunks.length) },
        async () => {
          try {
            await worker();
          } catch {
            firstError ||= "Could not read or save transcription checkpoint.";
          }
        }
      )
    );
    return firstError
      ? {
          content: "",
          error: `${firstError} ${results.filter((t) => typeof t === "string").length}/${chunks.length} chunks saved or reused. Re-uploading reuses saved chunks; check provider billing before retrying the failed chunk.`,
        }
      : { content: results.join("\n\n"), error: null };
  }

  async processFile(fullFilePath) {
    try {
      // Compressed byte size does not bound audio duration. Normalize every
      // recording, including long compressed files below the upload ceiling.
      this.#log("Preparing ordered 60-second audio chunks.");
      const { temporaryDirectory, chunks } =
        await this.#splitLargeFile(fullFilePath);
      try {
        return await this.#transcribeChunks(chunks);
      } finally {
        await fs.promises.rm(temporaryDirectory, {
          recursive: true,
          force: true,
        });
      }
    } catch (error) {
      this.#log("Could not prepare FonadaLabs transcription", error.message);
      return { content: "", error: error.message };
    }
  }
}

module.exports = { FonadaLabsWhisper };

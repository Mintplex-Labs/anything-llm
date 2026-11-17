/**
 * GMI Cloud text-to-speech.
 *
 * GMI Cloud serves several speech model families behind one multimodal
 * request queue: Inworld Realtime TTS (`inworld-tts-*`), MiniMax speech
 * synthesis (`minimax-tts-speech-*`) and Resemble AI's Chatterbox
 * (`Chatterbox-tts`, requires a Resemble voice UUID as the voice).
 *
 * Requests go to `POST /api/v1/ie/requestqueue/apikey/requests` with the
 * payload shape selected from the model id. A response is either synchronous
 * (an inline `outcome`) or queued (`status: dispatched/queued` plus a
 * `request_id` that is polled until it reports `success`).
 *
 * Audio is always requested as WAV and normalized by this provider: responses
 * are concatenated PCM-wise into a single WAV buffer, so long replies (which
 * are split at sentence boundaries to respect the per-request text limit) come
 * back as one playable file.
 */
const DEFAULT_ENDPOINT = "https://console.gmicloud.ai";
const QUEUE_PATH = "/api/v1/ie/requestqueue/apikey/requests";

// Inworld caps `text` at 2,000 characters per request (HTTP 400 above that):
// https://docs.gmicloud.ai/model-quickstarts/audio/inworld-tts-2-flash
const MAX_CHUNK_CHARACTERS = 1900;

// Polling budget for queued generations: 90 attempts x 2s. MiniMax generations
// go through the queue and are usually quick, but an occasional request runs long.
const POLL_ATTEMPTS = 90;
const POLL_INTERVAL_MS = 2000;

// Poll statuses worth retrying; anything else is a permanent failure.
const TRANSIENT_POLL_STATUSES = new Set([408, 429]);

class GmicloudTTS {
  constructor() {
    if (!process.env.TTS_GMICLOUD_API_KEY)
      throw new Error("No GMI Cloud API key was set.");
    this.apiKey = process.env["TTS_" + "GMICLOUD_API_KEY"];
    this.model = process.env.TTS_GMICLOUD_MODEL || "inworld-tts-2";
    this.voice = process.env.TTS_GMICLOUD_VOICE_MODEL || undefined;
    this.endpoint = (
      process.env.TTS_GMICLOUD_ENDPOINT || DEFAULT_ENDPOINT
    ).replace(/\/+$/, "");
    this.#log(
      `Service (${this.endpoint}) with model: ${this.model}` +
        (this.voice ? ` and voice: ${this.voice}` : "")
    );
  }

  #log(text, ...args) {
    console.log(`\x1b[32m[GmicloudTTS]\x1b[0m ${text}`, ...args);
  }

  /** Request family from the model id; unknown ids use the Inworld shape. */
  static family(model = "") {
    const id = String(model).toLowerCase();
    if (id.startsWith("minimax")) return "minimax";
    if (id.startsWith("chatterbox")) return "chatterbox";
    return "inworld";
  }

  /** Documented default voice per family when none was configured. */
  static familyDefaultVoice(family) {
    if (family === "minimax") return "English_expressive_narrator";
    if (family === "inworld") return "Dennis";
    return undefined;
  }

  /** Split long input at sentence boundaries, keeping each part under the cap. */
  static chunkText(text, limit = MAX_CHUNK_CHARACTERS) {
    const chunks = [];
    let rest = String(text).trim();
    while (rest.length > limit) {
      let cut = -1;
      for (const mark of [". ", "? ", "! ", "; ", ", ", " "]) {
        cut = Math.max(cut, rest.lastIndexOf(mark, limit));
      }
      if (cut <= 0) cut = limit;
      else cut += rest[cut] === "." || rest[cut] === "?" || rest[cut] === "!" ? 1 : 0;
      chunks.push(rest.slice(0, cut).trim());
      rest = rest.slice(cut).trim();
    }
    if (rest) chunks.push(rest);
    return chunks.filter(Boolean);
  }

  /** Map one text chunk onto GMI Cloud's per-family request payload. */
  static buildRequest(text, model, voice) {
    const family = GmicloudTTS.family(model);
    const chosen = voice || GmicloudTTS.familyDefaultVoice(family);
    let request;
    if (family === "inworld") {
      request = {
        text,
        audio_encoding: "WAV",
        speaking_rate: 1.0,
        ...(chosen && { voice_id: chosen }),
      };
    } else if (family === "minimax") {
      request = {
        text,
        speed: "1.0",
        format: "wav",
        ...(chosen && { voice_id: chosen }),
      };
    } else {
      if (!chosen)
        throw new Error(
          "Chatterbox models require a Resemble voice UUID: set TTS_GMICLOUD_VOICE_MODEL to your voice UUID."
        );
      request = { data: text, voice_uuid: chosen, output_format: "wav" };
    }
    return { model, payload: request };
  }

  /** First audio URL from a queue response outcome, whichever documented shape. */
  static extractAudioUrl(data = {}) {
    const outcome = data.outcome;
    if (!outcome || typeof outcome !== "object") return undefined;
    if (typeof outcome.audio_url === "string" && outcome.audio_url)
      return outcome.audio_url;
    for (const key of ["media_urls", "medias", "media"]) {
      for (const item of outcome[key] ?? []) {
        if (item && typeof item.url === "string" && item.url) return item.url;
      }
    }
    return undefined;
  }

  /**
   * Resolve a response that may be synchronous or queued. Permanent HTTP
   * errors while polling raise immediately; 408/429/5xx keep polling.
   */
  async #resolveResult(data) {
    let status = data?.status;
    const requestId = data?.request_id;
    let audioUrl = GmicloudTTS.extractAudioUrl(data);

    if (!audioUrl && status !== "failed" && requestId) {
      const url = `${this.endpoint}${QUEUE_PATH}/${requestId}`;
      for (let attempt = 0; attempt < POLL_ATTEMPTS; attempt += 1) {
        await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS));
        const response = await fetch(url, {
          headers: { Authorization: `Bearer ${this.apiKey}` },
        });
        if (response.status === 200) {
          data = await response.json();
        } else if (
          TRANSIENT_POLL_STATUSES.has(response.status) ||
          response.status >= 500
        ) {
          continue; // transient: keep polling
        } else {
          throw new Error(
            `GMI Cloud queue poll error: HTTP ${response.status} - ${await response.text()}`
          );
        }
        status = data?.status;
        audioUrl = GmicloudTTS.extractAudioUrl(data);
        if (status === "success" || status === "failed" || audioUrl) break;
      }
    }

    return { data, audioUrl };
  }

  /** Run one chunk to completion and return its WAV bytes. */
  async #synthesizeChunk(text) {
    const body = GmicloudTTS.buildRequest(text, this.model, this.voice);
    const response = await fetch(`${this.endpoint}${QUEUE_PATH}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    if (!response.ok)
      throw new Error(
        `GMI Cloud API error: HTTP ${response.status} - ${await response.text()}`
      );

    const { data, audioUrl } = await this.#resolveResult(await response.json());
    if (data?.status !== "success" || !audioUrl)
      throw new Error(
        `GMI Cloud TTS failed: status=${JSON.stringify(
          data?.status
        )}, request_id=${JSON.stringify(data?.request_id)}`
      );

    const audio = await fetch(audioUrl);
    if (!audio.ok)
      throw new Error(`GMI Cloud audio download error: HTTP ${audio.status}`);
    return Buffer.from(await audio.arrayBuffer());
  }

  /**
   * Split a WAV blob into (pcm, sampleRate, channels, sampleWidth).
   * Returns null when the blob is not a parseable WAV file.
   */
  static parseWav(buf) {
    try {
      return GmicloudTTS.#parseWavUnsafe(buf);
    } catch {
      return null;
    }
  }

  static #parseWavUnsafe(buf) {
    if (!Buffer.isBuffer(buf) || buf.length < 44) return null;
    if (buf.toString("ascii", 0, 4) !== "RIFF" || buf.toString("ascii", 8, 12) !== "WAVE")
      return null;
    let offset = 12;
    let format = null;
    let pcm = null;
    while (offset + 8 <= buf.length) {
      const id = buf.toString("ascii", offset, offset + 4);
      const size = buf.readUInt32LE(offset + 4);
      const body = offset + 8;
      if (id === "fmt ") {
        format = {
          channels: buf.readUInt16LE(body + 2),
          sampleRate: buf.readUInt32LE(body + 4),
          sampleWidth: buf.readUInt16LE(body + 14) / 8,
        };
      } else if (id === "data") {
        pcm = buf.subarray(body, body + size);
      }
      offset = body + size + (size % 2);
    }
    if (!format || !pcm) return null;
    return { pcm, ...format };
  }

  /** Wrap mono/stereo 16-bit PCM in a WAV container. */
  static wrapWav(pcm, sampleRate, channels, sampleWidth) {
    const header = Buffer.alloc(44);
    header.write("RIFF", 0);
    header.writeUInt32LE(36 + pcm.length, 4);
    header.write("WAVE", 8);
    header.write("fmt ", 12);
    header.writeUInt32LE(16, 16);
    header.writeUInt16LE(1, 20);
    header.writeUInt16LE(channels, 22);
    header.writeUInt32LE(sampleRate, 24);
    header.writeUInt32LE(sampleRate * channels * sampleWidth, 28);
    header.writeUInt16LE(channels * sampleWidth, 32);
    header.writeUInt16LE(sampleWidth * 8, 34);
    header.write("data", 36);
    header.writeUInt32LE(pcm.length, 40);
    return Buffer.concat([header, pcm]);
  }

  /**
   * Convert a text input into one WAV buffer. Long inputs are split at
   * sentence boundaries and the per-chunk PCM is concatenated into a single
   * WAV file.
   * @param {string} textInput
   * @returns {Promise<Buffer|null>} WAV audio bytes or null on failure.
   */
  async ttsBuffer(textInput) {
    try {
      const chunks = GmicloudTTS.chunkText(textInput ?? "");
      if (chunks.length === 0) return null;

      let merged = null;
      for (const chunk of chunks) {
        const wav = await this.#synthesizeChunk(chunk);
        const parsed = GmicloudTTS.parseWav(wav);
        if (!parsed) throw new Error("GMI Cloud TTS error: response is not WAV audio");
        if (merged && (parsed.sampleRate !== merged.sampleRate || parsed.channels !== merged.channels || parsed.sampleWidth !== merged.sampleWidth))
          throw new Error("GMI Cloud TTS error: inconsistent audio format between chunks");
        merged = merged
          ? { ...merged, pcm: Buffer.concat([merged.pcm, parsed.pcm]) }
          : parsed;
      }

      const { pcm, sampleRate, channels, sampleWidth } = merged;
      this.#log(
        `generated ${pcm.length} bytes of WAV audio (${sampleRate} Hz, ${channels} ch)`
      );
      return GmicloudTTS.wrapWav(pcm, sampleRate, channels, sampleWidth);
    } catch (e) {
      console.error(`\x1b[31m[GmicloudTTS]\x1b[0m ${e.message}`, e);
    }
    return null;
  }
}

module.exports = {
  GmicloudTTS,
};

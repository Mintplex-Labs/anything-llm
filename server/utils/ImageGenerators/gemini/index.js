const { BaseImageGenerator } = require("../base");

const GEMINI_API_BASE = "https://generativelanguage.googleapis.com/v1/models";
const DEFAULT_MODEL = "gemini-3.1-flash-image";
const DEFAULT_ASPECT_RATIO = "1:1";

// Gemini image models take aspect ratios, not WxH pixel sizes. WxH sizes are
// mapped to the nearest ratio every Gemini image model accepts - extreme ratios
// like 1:4 or 8:1 are model-specific and must be passed explicitly.
// https://ai.google.dev/gemini-api/docs/image-generation
const SUPPORTED_ASPECT_RATIOS = [
  ["1:1", 1],
  ["16:9", 16 / 9],
  ["9:16", 9 / 16],
  ["4:3", 4 / 3],
  ["3:4", 3 / 4],
  ["3:2", 3 / 2],
  ["2:3", 2 / 3],
  ["5:4", 5 / 4],
  ["4:5", 4 / 5],
  ["21:9", 21 / 9],
];

/**
 * Gemini native image generation via generateContent (Nano Banana models).
 * Unlike OpenAI-compatible providers, Gemini does not expose /images/generations —
 * images are returned as inlineData parts on generateContent responses.
 * Both text-to-image and image editing (reference images) are supported.
 * @see https://ai.google.dev/gemini-api/docs/image-generation
 */
class GeminiImageGenerator extends BaseImageGenerator {
  constructor() {
    if (!process.env.IMAGE_GEN_GEMINI_API_KEY)
      throw new Error("No Gemini image generation API key was set.");
    super({
      client: null,
      model: process.env.IMAGE_GEN_MODEL_PREF || DEFAULT_MODEL,
      className: "GeminiImageGenerator",
    });
    this.apiKey = process.env.IMAGE_GEN_GEMINI_API_KEY;
  }

  /**
   * Maps IMAGE_GEN_SIZE_PREF / size overrides to a Gemini aspect ratio.
   * Accepts either a ratio string ("16:9") or a WxH size ("1024x1024").
   * Unknown ratio strings that match N:M are passed through so newly supported
   * Gemini ratios keep working without a code change.
   * @param {string} [size]
   * @returns {string}
   */
  _resolveAspectRatio(size) {
    const pref =
      size || process.env.IMAGE_GEN_SIZE_PREF || DEFAULT_ASPECT_RATIO;
    if (/^\d+:\d+$/.test(pref)) return pref;

    const match = String(pref)
      .toLowerCase()
      .match(/^(\d+)\s*[x×]\s*(\d+)$/);
    if (!match) return DEFAULT_ASPECT_RATIO;

    const width = Number(match[1]);
    const height = Number(match[2]);
    if (!width || !height) return DEFAULT_ASPECT_RATIO;

    const ratio = width / height;
    return SUPPORTED_ASPECT_RATIOS.reduce((best, cur) =>
      Math.abs(cur[1] - ratio) < Math.abs(best[1] - ratio) ? cur : best
    )[0];
  }

  /**
   * @param {object} payload
   * @returns {Buffer}
   */
  _extractImageBuffer(payload) {
    const parts = payload?.candidates?.[0]?.content?.parts || [];
    for (const part of parts) {
      const data = part?.inlineData?.data || part?.inline_data?.data;
      if (typeof data === "string" && data.length > 0)
        return Buffer.from(data, "base64");
    }

    const blockReason =
      payload?.promptFeedback?.blockReason ||
      payload?.candidates?.[0]?.finishReason;
    if (blockReason && blockReason !== "STOP") {
      throw new Error(
        `Gemini image generation was blocked (${blockReason}). Try a different prompt.`
      );
    }
    if (payload?.error?.message)
      throw new Error(
        `Gemini image generation failed: ${payload.error.message}`
      );
    throw new Error("Gemini returned no image data.");
  }

  /**
   * @param {{prompt: string, images?: Buffer[], size?: string, signal?: AbortSignal}} params
   * @returns {Promise<{buffer: Buffer}>}
   */
  async #generateContent({ prompt, images = [], size, signal }) {
    if (typeof prompt !== "string" || !prompt.trim())
      throw new Error(
        "A non-empty prompt is required for Gemini image generation."
      );

    const aspectRatio = this._resolveAspectRatio(size);
    this.log(
      `${images.length ? "Editing" : "Generating"} image with ${this.model} (${aspectRatio}` +
        `${images.length ? `, ${images.length} reference(s)` : ""}).`
    );

    const parts = [
      ...images.map((buf) => ({
        inline_data: {
          mime_type: "image/png",
          data: Buffer.isBuffer(buf)
            ? buf.toString("base64")
            : Buffer.from(buf).toString("base64"),
        },
      })),
      { text: prompt.trim() },
    ];

    const body = {
      contents: [{ role: "user", parts }],
      generationConfig: {
        responseModalities: ["TEXT", "IMAGE"],
        imageConfig: { aspectRatio },
      },
    };

    const url = `${GEMINI_API_BASE}/${encodeURIComponent(this.model)}:generateContent`;
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": this.apiKey,
      },
      body: JSON.stringify(body),
      signal: signal ?? null,
    });

    const raw = await res.text().catch(() => "");
    let payload = {};
    try {
      payload = raw ? JSON.parse(raw) : {};
    } catch {
      payload = { error: { message: raw || res.statusText } };
    }

    if (!res.ok) {
      const message =
        payload?.error?.message || raw || res.statusText || "Unknown error";
      throw new Error(
        `Gemini image request failed (${res.status}): ${message}`
      );
    }

    return { buffer: this._extractImageBuffer(payload) };
  }

  async generateImage({ prompt, size, signal }) {
    const result = await this.#generateContent({ prompt, size, signal });
    this._sendImageTelemetry("image_generated");
    return result;
  }

  async editImage({ prompt, images, size, signal }) {
    if (!Array.isArray(images) || images.length === 0)
      throw new Error(
        "Gemini image editing requires at least one reference image."
      );

    const result = await this.#generateContent({
      prompt,
      images,
      size,
      signal,
    });
    this._sendImageTelemetry("image_generated", {
      withReferences: true,
    });
    return result;
  }
}

module.exports = {
  GeminiImageGenerator,
  DEFAULT_MODEL,
  DEFAULT_ASPECT_RATIO,
  SUPPORTED_ASPECT_RATIOS,
};

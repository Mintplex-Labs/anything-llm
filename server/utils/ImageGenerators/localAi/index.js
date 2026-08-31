const { BaseImageGenerator } = require("../base");

// LocalAI only supports reference images on the flux.1-kontext-dev model - every
// other model silently ignores `ref_images` and returns a fresh generation.
// https://localai.io/docs/features/image-generation/
const REF_IMAGE_SUPPORTED_MODELS = ["flux.1-kontext-dev"];

class LocalAiImageGenerator extends BaseImageGenerator {
  constructor() {
    if (!process.env.IMAGE_GEN_LOCALAI_BASE_PATH)
      throw new Error("No LocalAI image generation base path was set.");
    if (!process.env.IMAGE_GEN_MODEL_PREF)
      throw new Error("No LocalAI image generation model was set.");
    const { OpenAI: OpenAIApi } = require("openai");
    super({
      client: new OpenAIApi({
        baseURL: process.env.IMAGE_GEN_LOCALAI_BASE_PATH,
        apiKey: process.env.IMAGE_GEN_LOCALAI_API_KEY || null,
      }),
      model: process.env.IMAGE_GEN_MODEL_PREF,
      className: "LocalAiImageGenerator",
    });
  }

  /**
   * Whether the configured model can accept reference images.
   * @returns {boolean}
   */
  get supportsReferenceImages() {
    return REF_IMAGE_SUPPORTED_MODELS.includes(this.model);
  }

  /**
   * @param {{prompt: string, size?: string, signal?: AbortSignal}} params
   * @returns {Promise<import("../base").GeneratedImage>}
   */
  async generateImage({ prompt, size, signal }) {
    return this.#requestImage({ prompt, images: [], size, signal });
  }

  /**
   * @param {{prompt: string, images: Buffer[], size?: string, signal?: AbortSignal}} params
   * @returns {Promise<import("../base").GeneratedImage>}
   */
  async editImage({ prompt, images, size, signal }) {
    if (!this.supportsReferenceImages)
      throw new Error(
        `LocalAI only supports reference images on the ${REF_IMAGE_SUPPORTED_MODELS.join(", ")} model - the configured model (${this.model}) will ignore them. Remove the attached image(s) and send a text-only prompt, or switch your LocalAI image generation model.`
      );
    return this.#requestImage({ prompt, images, size, signal });
  }

  /**
   * Performs the `/images/generations` request, optionally with `ref_images`.
   * @param {{prompt: string, images: Buffer[], size?: string, signal?: AbortSignal}} params
   * @returns {Promise<import("../base").GeneratedImage>}
   */
  async #requestImage({ prompt, images = [], size, signal }) {
    const imageSize = size || process.env.IMAGE_GEN_SIZE_PREF || "1024x1024";
    this.log(
      images.length
        ? `Editing image with ${this.model} (${images.length} reference(s)) via ref_images.`
        : `Generating ${imageSize} image with ${this.model}.`
    );

    const baseURL = this.client.baseURL.replace(/\/+$/, "");
    const headers = { "Content-Type": "application/json" };
    if (this.client.apiKey)
      headers.Authorization = `Bearer ${this.client.apiKey}`;

    const res = await fetch(`${baseURL}/images/generations`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        model: this.model,
        prompt,
        size: imageSize,
        n: 1,
        ...(images.length && {
          ref_images: images.map((buffer) => buffer.toString("base64")),
        }),
      }),
      signal: signal ?? null,
    });

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      throw new Error(
        `Image ${images.length ? "edit" : "generation"} failed (${res.status}): ${body || res.statusText}`
      );
    }

    const payload = await res.json();
    const image = payload?.data?.[0];
    let result;
    if (image?.b64_json) {
      result = { buffer: Buffer.from(image.b64_json, "base64") };
    } else if (image?.url) {
      const imgRes = await fetch(image.url, { signal: signal ?? null });
      if (!imgRes.ok)
        throw new Error(`Failed to fetch generated image: ${imgRes.status}`);
      result = { buffer: Buffer.from(await imgRes.arrayBuffer()) };
    } else {
      throw new Error("Image provider returned no image data.");
    }
    this._sendImageTelemetry("image_generated", {
      withReferences: images.length > 0,
    });
    return result;
  }
}

module.exports = { LocalAiImageGenerator };

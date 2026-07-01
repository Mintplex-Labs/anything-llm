/**
 * @typedef {Object} GeneratedImage
 * @property {Buffer} buffer - the raw PNG image bytes
 */

// 1024x1024 is supported by every current provider/model, so it is the safe
// default. Users on a model/provider that needs a different size can override it
// with IMAGE_GEN_SIZE_PREF rather than us maintaining per-model size tables.
const DEFAULT_IMAGE_SIZE = "1024x1024";

/**
 * Shared base for all image generation providers. Every supported provider
 * (OpenAI, Ollama, Lemonade, OpenRouter) speaks the OpenAI
 * `images.generate` API, so the only per-provider difference is the client
 * configuration (baseURL/apiKey) and the selected model.
 */
class BaseImageGenerator {
  /**
   * @param {{client: import("openai").OpenAI, model: string, className: string}} config
   */
  constructor({ client, model, className }) {
    this.client = client;
    this.model = model;
    this.className = className;
  }

  log(text, ...args) {
    console.log(`\x1b[36m[${this.className}]\x1b[0m ${text}`, ...args);
  }

  /**
   * Generate a single image from a text prompt at the requested size, falling
   * back to the configured IMAGE_GEN_SIZE_PREF and then the default size. The
   * size is passed straight to the provider - if the model rejects it, the error
   * surfaces to the caller so the user can adjust IMAGE_GEN_SIZE_PREF.
   * @param {{prompt: string, size?: string}} params
   * @returns {Promise<GeneratedImage>}
   */
  async generateImage({ prompt, size }) {
    const imageSize =
      size || process.env.IMAGE_GEN_SIZE_PREF || DEFAULT_IMAGE_SIZE;
    return await this.requestImage(prompt, imageSize);
  }

  /**
   * Performs the actual image request and normalizes the response to a buffer.
   * We do not force a `response_format` because some models (e.g. gpt-image-1)
   * reject it and always return base64, while others default to a URL - so we
   * accept whichever the provider returns.
   * @param {string} prompt
   * @param {string} size
   * @returns {Promise<GeneratedImage>}
   */
  async requestImage(prompt, size) {
    this.log(`Generating ${size} image with ${this.model}.`);
    const result = await this.client.images.generate({
      model: this.model,
      prompt,
      size,
      n: 1,
    });

    // Some OpenAI-compatible providers (e.g. Ollama) return the body with a
    // non-JSON content-type (`application/x-ndjson`), so the SDK hands back the
    // raw string unparsed. Normalize to an object before reading the image.
    const { safeJsonParse } = require("../http");
    const payload = typeof result === "string" ? safeJsonParse(result) : result;
    const image = payload?.data?.[0];
    if (image?.b64_json)
      return { buffer: Buffer.from(image.b64_json, "base64") };
    if (image?.url) {
      const res = await fetch(image.url);
      if (!res.ok)
        throw new Error(`Failed to fetch generated image: ${res.status}`);
      return { buffer: Buffer.from(await res.arrayBuffer()) };
    }
    throw new Error("Image provider returned no image data.");
  }
}

module.exports = { BaseImageGenerator };

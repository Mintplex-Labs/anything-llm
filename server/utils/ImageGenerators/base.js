/**
 * @typedef {Object} GeneratedImage
 * @property {Buffer} buffer - the raw PNG image bytes
 */

// Not every model supports the 512x512 target. For known model families we pick
// the best size up front; otherwise we send the target and, if the API rejects
// it, parse the supported sizes from the error and retry once. Keys are matched
// as substrings of the model id, so "gpt-image" covers gpt-image-1, -mini, -2.
const TARGET_SIZE = 512;
const MODEL_SUPPORTED_SIZES = {
  "dall-e-2": ["256x256", "512x512", "1024x1024"],
  "dall-e-3": ["1024x1024", "1024x1792", "1792x1024"],
  "gpt-image": ["1024x1024", "1024x1536", "1536x1024"],
};

/**
 * Picks the smallest square size that is >= the target, falling back to the
 * largest square (or first size) available.
 * @param {string[]} sizes - e.g. ["1024x1024", "1024x1536"]
 * @returns {string|null}
 */
function bestSize(sizes = []) {
  const squares = sizes
    .filter((s) => {
      const [w, h] = s.split("x").map(Number);
      return w === h;
    })
    .sort((a, b) => Number(a.split("x")[0]) - Number(b.split("x")[0]));
  return (
    squares.find((s) => Number(s.split("x")[0]) >= TARGET_SIZE) ??
    squares.at(-1) ??
    sizes[0] ??
    null
  );
}

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
   * Resolves a requested size to one a known model supports (fast path).
   * Unknown models pass the requested size through - the API error is handled
   * reactively in generateImage if the size turns out to be unsupported.
   * @param {string} requestedSize - e.g. "512x512"
   * @returns {string}
   */
  resolveSize(requestedSize) {
    const family = Object.keys(MODEL_SUPPORTED_SIZES).find((key) =>
      this.model.includes(key)
    );
    const supported = family ? MODEL_SUPPORTED_SIZES[family] : null;
    if (!supported || supported.includes(requestedSize)) return requestedSize;
    return bestSize(supported) ?? requestedSize;
  }

  /**
   * Generate a single image from a text prompt. If the model rejects the size,
   * the supported sizes are parsed from the error and the request is retried
   * once at the best of those.
   * @param {{prompt: string, size?: string}} params
   * @returns {Promise<GeneratedImage>}
   */
  async generateImage({ prompt, size = "512x512" }) {
    const initialSize = this.resolveSize(size);
    try {
      return await this.requestImage(prompt, initialSize);
    } catch (e) {
      // The error lists the sizes the model supports (and echoes back the
      // invalid one we sent) - exclude that and retry with the best supported.
      const supported = (e?.message?.match(/\d+x\d+/g) || []).filter(
        (s) => s !== initialSize
      );
      const retrySize = bestSize(supported);
      if (!retrySize || retrySize === initialSize) throw e;
      this.log(`Size ${initialSize} not supported, retrying at ${retrySize}.`);
      return await this.requestImage(prompt, retrySize);
    }
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

    const image = result?.data?.[0];
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

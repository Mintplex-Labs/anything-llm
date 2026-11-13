const { BaseImageGenerator } = require("../base");

/**
 * MiniMax image generation and editing through its OpenAI compatible images
 * API, which adds its own sizing and prompt enhancement parameters.
 * https://platform.minimax.io/docs/api-reference/image-generation-h3-generations
 * https://platform.minimax.io/docs/api-reference/image-generation-h3-edits
 */
class MinimaxImageGenerator extends BaseImageGenerator {
  constructor() {
    if (!process.env.IMAGE_GEN_MINIMAX_API_KEY)
      throw new Error("No MiniMax image generation API key was set.");
    const { OpenAI: OpenAIApi } = require("openai");
    super({
      client: new OpenAIApi({
        baseURL: "https://api.minimax.io/v1",
        apiKey: process.env.IMAGE_GEN_MINIMAX_API_KEY,
        // Requests are not idempotent - MiniMax bills a retried request again.
        maxRetries: 0,
      }),
      model: process.env.IMAGE_GEN_MODEL_PREF || "MiniMax-H3-Image",
      className: "MinimaxImageGenerator",
    });
  }

  /**
   * @param {string} prompt
   * @param {string} size
   * @param {AbortSignal} [signal]
   * @returns {Promise<import("../base").GeneratedImage>}
   */
  async requestImage(prompt, size, signal) {
    // MiniMax rejects the "auto" aspect ratio without prompt enhancement.
    const enhance =
      process.env.IMAGE_GEN_MINIMAX_PROMPT_ENHANCEMENT === "true" ||
      size === "auto";
    const sizeParams = this.#sizeParams(size);
    this.log(
      `Generating image with ${this.model} (${this.#describe(sizeParams, enhance)}).`
    );
    const result = await this.client.images.generate(
      {
        model: this.model,
        prompt,
        n: 1,
        // MiniMax defaults to JPEG.
        output_format: "png",
        ...sizeParams,
        ...(!enhance && { disable_prompt_enhanced: true }),
      },
      { signal: signal ?? undefined }
    );
    return this.#download(result, signal);
  }

  /**
   * MiniMax always enhances the prompt on edits and rejects
   * `disable_prompt_enhanced` on this endpoint.
   * @param {{prompt: string, images: Buffer[], size?: string, signal?: AbortSignal}} params
   * @returns {Promise<import("../base").GeneratedImage>}
   */
  async editImage({ prompt, images, size, signal }) {
    const sizeParams = this.#sizeParams(
      size || process.env.IMAGE_GEN_SIZE_PREF || "auto"
    );
    this.log(
      `Editing image with ${this.model} (${images.length} reference(s), ${this.#describe(sizeParams, true)}).`
    );
    const { toFile } = require("openai");
    const result = await this.client.images.edit(
      {
        model: this.model,
        prompt,
        n: 1,
        output_format: "png",
        ...sizeParams,
        image: await Promise.all(
          images.map((buffer, i) =>
            toFile(buffer, `reference-${i}.png`, { type: "image/png" })
          )
        ),
      },
      { signal: signal ?? undefined }
    );
    this._sendImageTelemetry("image_generated", {
      withReferences: images.length > 0,
    });
    return this.#download(result, signal);
  }

  /**
   * MiniMax takes either an exact WxH `size`, or an `aspect_ratio` ("auto" or
   * "16:9") with a target `area` (1K, 2K, 4K), and rejects both together.
   * @param {string} size
   * @returns {{size: string}|{aspect_ratio: string, area: string}}
   */
  #sizeParams(size) {
    if (/^\d+x\d+$/.test(size)) return { size };
    return {
      aspect_ratio: size,
      area: process.env.IMAGE_GEN_MINIMAX_RESOLUTION || "1K",
    };
  }

  /**
   * @param {{size: string}|{aspect_ratio: string, area: string}} sizeParams
   * @param {boolean} enhance
   * @returns {string}
   */
  #describe(sizeParams, enhance) {
    const sizing = sizeParams.size
      ? `size: ${sizeParams.size}`
      : `aspect: ${sizeParams.aspect_ratio}, resolution: ${sizeParams.area}`;
    return `${sizing}, prompt enhancement: ${enhance ? "on" : "off"}`;
  }

  /**
   * @param {import("openai").OpenAI.ImagesResponse} result
   * @param {AbortSignal} [signal]
   * @returns {Promise<import("../base").GeneratedImage>}
   */
  async #download(result, signal) {
    const url = result?.data?.[0]?.url;
    if (!url) throw new Error("MiniMax returned no image data.");
    const res = await fetch(url, { signal: signal ?? null });
    if (!res.ok)
      throw new Error(`Failed to fetch generated image: ${res.status}`);
    return { buffer: Buffer.from(await res.arrayBuffer()) };
  }
}

module.exports = { MinimaxImageGenerator };

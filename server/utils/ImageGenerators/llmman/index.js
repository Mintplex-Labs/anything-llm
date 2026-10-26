const { BaseImageGenerator } = require("../base");

class LlmmanImageGenerator extends BaseImageGenerator {
  constructor() {
    if (!process.env.IMAGE_GEN_LLMMAN_BASE_PATH)
      throw new Error("No llmman image generation base path was set.");
    if (!process.env.IMAGE_GEN_MODEL_PREF)
      throw new Error("No llmman image generation model was set.");
    const { OpenAI: OpenAIApi } = require("openai");
    const basePath = process.env.IMAGE_GEN_LLMMAN_BASE_PATH.replace(/\/+$/, "");
    super({
      client: new OpenAIApi({
        baseURL: `${basePath}/v1`,
        apiKey: process.env.IMAGE_GEN_LLMMAN_AUTH_TOKEN || "llmman",
      }),
      model: process.env.IMAGE_GEN_MODEL_PREF,
      className: "LlmmanImageGenerator",
    });
  }

  /**
   * llmman's OpenAI-compatible image endpoint does not implement image editing
   * or accept reference images in any form, so there is nothing we can do with
   * them - we surface a descriptive error instead of silently dropping them and
   * returning an unrelated image.
   * @param {{prompt: string, images: Buffer[], size?: string, signal?: AbortSignal}} _params
   * @returns {Promise<never>}
   */
  async editImage(_params) {
    throw new Error(
      "llmman image generation does not support reference images. Remove the attached image(s) and send a text-only prompt, or switch to an image generation provider that supports image editing."
    );
  }
}

module.exports = { LlmmanImageGenerator };

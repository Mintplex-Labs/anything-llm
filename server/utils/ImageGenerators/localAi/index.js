const { BaseImageGenerator } = require("../base");

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

  async editImage({ prompt, images, signal }) {
    this.log(
      `LocalAI does not support image editing. Dropping ${images.length} reference image(s) and generating from prompt only.`
    );
    const result = await this.generateImage({ prompt, signal });
    result.notice =
      "LocalAI does not support image editing — your reference images were ignored and a new image was generated from the prompt only.";
    return result;
  }
}

module.exports = { LocalAiImageGenerator };

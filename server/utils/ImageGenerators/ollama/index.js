const { BaseImageGenerator } = require("../base");

class OllamaImageGenerator extends BaseImageGenerator {
  constructor() {
    if (!process.env.IMAGE_GEN_OLLAMA_BASE_PATH)
      throw new Error("No Ollama image generation base path was set.");
    if (!process.env.IMAGE_GEN_MODEL_PREF)
      throw new Error("No Ollama image generation model was set.");
    const { OpenAI: OpenAIApi } = require("openai");
    // Ollama serves image generation through its OpenAI-compatible `/v1`
    // endpoint (experimental, macOS only).
    const basePath = process.env.IMAGE_GEN_OLLAMA_BASE_PATH.replace(/\/+$/, "");
    super({
      client: new OpenAIApi({
        baseURL: `${basePath}/v1`,
        apiKey: process.env.IMAGE_GEN_OLLAMA_AUTH_TOKEN || "ollama",
      }),
      model: process.env.IMAGE_GEN_MODEL_PREF,
      className: "OllamaImageGenerator",
    });
  }

  async editImage({ prompt, images, signal }) {
    this.log(
      `Ollama does not support image editing. Dropping ${images.length} reference image(s) and generating from prompt only.`
    );
    const result = await this.generateImage({ prompt, signal });
    result.notice =
      "Ollama does not support image editing — your reference images were ignored and a new image was generated from the prompt only.";
    return result;
  }
}

module.exports = { OllamaImageGenerator };

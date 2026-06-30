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
}

module.exports = { OllamaImageGenerator };

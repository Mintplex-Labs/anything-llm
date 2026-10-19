const { BaseImageGenerator } = require("../base");

class OpenAiImageGenerator extends BaseImageGenerator {
  constructor() {
    if (!process.env.IMAGE_GEN_OPENAI_KEY)
      throw new Error("No OpenAI image generation API key was set.");
    const { OpenAI: OpenAIApi } = require("openai");
    super({
      client: new OpenAIApi({
        apiKey: process.env.IMAGE_GEN_OPENAI_KEY,
      }),
      model: process.env.IMAGE_GEN_MODEL_PREF || "gpt-image-2.5-flare",
      className: "OpenAiImageGenerator",
    });
  }

  imageFieldName(count) {
    return count > 1 ? "image[]" : "image";
  }
}

module.exports = { OpenAiImageGenerator };

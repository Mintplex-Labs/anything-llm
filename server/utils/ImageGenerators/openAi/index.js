const { BaseImageGenerator } = require("../base");

class OpenAiImageGenerator extends BaseImageGenerator {
  constructor() {
    if (!process.env.IMAGE_GEN_OPENAI_KEY)
      throw new Error("No OpenAI image generation API key was set.");
    const { OpenAI: OpenAIApi } = require("openai");
    // gpt-image-1 is the default since OpenAI has deprecated the dall-e models.
    // It does not support 512x512, so base.js upsizes to the nearest supported
    // square (1024x1024) automatically.
    super({
      client: new OpenAIApi({
        apiKey: process.env.IMAGE_GEN_OPENAI_KEY,
      }),
      model: process.env.IMAGE_GEN_MODEL_PREF || "gpt-image-1",
      className: "OpenAiImageGenerator",
    });
  }
}

module.exports = { OpenAiImageGenerator };

const { BaseImageGenerator } = require("../base");

class OpenAiImageGenerator extends BaseImageGenerator {
  constructor() {
    if (!process.env.OPEN_AI_KEY) throw new Error("No OpenAI API key was set.");
    const { OpenAI: OpenAIApi } = require("openai");
    // dall-e-2 is the default because it supports the 512x512 target size.
    super({
      client: new OpenAIApi({
        apiKey: process.env.OPEN_AI_KEY,
      }),
      model: process.env.IMAGE_GENERATION_MODEL_PREF || "dall-e-2",
      className: "OpenAiImageGenerator",
    });
  }
}

module.exports = { OpenAiImageGenerator };

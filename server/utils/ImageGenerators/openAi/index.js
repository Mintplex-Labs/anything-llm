const { BaseImageGenerator } = require("../base");

class OpenAiImageGenerator extends BaseImageGenerator {
  constructor() {
    if (!process.env.IMAGE_GEN_OPENAI_KEY)
      throw new Error("No OpenAI image generation API key was set.");
    const { OpenAI: OpenAIApi } = require("openai");
    // gpt-image-1 shuts down on 2026-10-23, so the default moves to
    // gpt-image-2.5-flare - OpenAI's default-tier replacement
    // (gpt-image-2.5-sunburst is the precision tier and stays available via
    // IMAGE_GEN_MODEL_PREF). Both support 1024x1024, so base.js needs no
    // size-handling changes.
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

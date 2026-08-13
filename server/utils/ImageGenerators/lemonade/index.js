const { parseLemonadeServerEndpoint } = require("../../AiProviders/lemonade");
const { BaseImageGenerator } = require("../base");

class LemonadeImageGenerator extends BaseImageGenerator {
  constructor() {
    if (!process.env.IMAGE_GEN_LEMONADE_BASE_PATH)
      throw new Error("No Lemonade image generation base path was set.");
    if (!process.env.IMAGE_GEN_MODEL_PREF)
      throw new Error("No Lemonade image generation model was set.");
    const { OpenAI: OpenAIApi } = require("openai");
    super({
      client: new OpenAIApi({
        baseURL: parseLemonadeServerEndpoint(
          process.env.IMAGE_GEN_LEMONADE_BASE_PATH,
          "openai"
        ),
        apiKey: process.env.IMAGE_GEN_LEMONADE_API_KEY || null,
      }),
      model: process.env.IMAGE_GEN_MODEL_PREF,
      className: "LemonadeImageGenerator",
    });
  }
}

module.exports = { LemonadeImageGenerator };

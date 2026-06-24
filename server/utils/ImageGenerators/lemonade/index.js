const { parseLemonadeServerEndpoint } = require("../../AiProviders/lemonade");
const { BaseImageGenerator } = require("../base");

class LemonadeImageGenerator extends BaseImageGenerator {
  constructor() {
    if (!process.env.LEMONADE_LLM_BASE_PATH)
      throw new Error("No Lemonade base path was set.");
    if (!process.env.IMAGE_GENERATION_MODEL_PREF)
      throw new Error("No Lemonade image generation model was set.");
    const { OpenAI: OpenAIApi } = require("openai");
    super({
      client: new OpenAIApi({
        baseURL: parseLemonadeServerEndpoint(
          process.env.LEMONADE_LLM_BASE_PATH,
          "openai"
        ),
        apiKey: process.env.LEMONADE_LLM_API_KEY || null,
      }),
      model: process.env.IMAGE_GENERATION_MODEL_PREF,
      className: "LemonadeImageGenerator",
    });
  }
}

module.exports = { LemonadeImageGenerator };

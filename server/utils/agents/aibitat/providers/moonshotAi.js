const OpenAI = require("openai");
const Provider = require("./ai-provider.js");
const InheritMultiple = require("./helpers/classes.js");
const UnTooled = require("./helpers/untooled.js");

/**
 * The agent provider for the Moonshot AI provider.
 */
class MoonshotAiProvider extends InheritMultiple([Provider, UnTooled]) {
  model;

  constructor(config = {}) {
    const { model = "moonshot-v1-32k" } = config;
    super();
    const client = new OpenAI({
      baseURL: "https://api.moonshot.ai/v1",
      apiKey: process.env.MOONSHOT_AI_API_KEY,
      maxRetries: 3,
    });

    this._client = client;
    this.model = model;
    this.verbose = true;
  }
}

module.exports = MoonshotAiProvider;

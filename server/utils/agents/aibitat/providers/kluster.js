const OpenAI = require("openai");
const Provider = require("./ai-provider.js");
const InheritMultiple = require("./helpers/classes.js");
const UnTooled = require("./helpers/untooled.js");
const { toValidNumber } = require("../../../http/index.js");

/**
 * The agent provider for Kluster.ai API.
 * Kluster.ai is OpenAI-compatible, so we extend the GenericOpenAiProvider.
 */
class KlusterProvider extends InheritMultiple([Provider, UnTooled]) {
  model;

  constructor(config = {}) {
    super();
    const { model = "klusterai/Meta-Llama-3.3-70B-Instruct-Turbo" } = config;
    const client = new OpenAI({
      baseURL: "https://api.kluster.ai/v1",
      apiKey: process.env.KLUSTER_API_KEY ?? null,
      maxRetries: 3,
    });

    this._client = client;
    this.model = model;
    this.verbose = true;
    this.maxTokens = process.env.KLUSTER_MAX_TOKENS
      ? toValidNumber(process.env.KLUSTER_MAX_TOKENS, 1024)
      : 1024;
  }

  get client() {
    return this._client;
  }

  async #handleFunctionCallChat({ messages = [] }) {
    return await this.client.chat.completions
      .create({
        model: this.model,
        temperature: 0,
        messages,
        max_tokens: this.maxTokens,
      })
      .then((result) => {
        if (!result.hasOwnProperty("choices"))
          throw new Error("Kluster.ai chat: No results!");
        if (result.choices.length === 0)
          throw new Error("Kluster.ai chat: No results length!");
        return result.choices[0].message.content;
      });
  }

  async complete(messages, functions = [], options = {}) {
    try {
      if (functions.length > 0) {
        return await this.#handleFunctionCallChat({ messages });
      }

      const response = await this.client.chat.completions.create({
        model: this.model,
        messages,
        max_tokens: this.maxTokens,
        stream: options.stream || false,
        temperature: options.temperature || 0.7,
      });

      if (options.stream) {
        return response;
      }

      if (!response.hasOwnProperty("choices"))
        throw new Error("Kluster.ai chat: No results!");
      if (response.choices.length === 0)
        throw new Error("Kluster.ai chat: No results length!");

      return response.choices[0].message.content;
    } catch (error) {
      throw new Error(`Kluster.ai chat failed: ${error.message}`);
    }
  }

  getCost(_usage) {
    return 0; // Kluster.ai pricing is not publicly documented
  }
}

module.exports = KlusterProvider; 
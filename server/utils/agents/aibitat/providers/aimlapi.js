const OpenAI = require("openai");
const {
  AIMLAPI_HEADERS,
  AIMLAPI_BASE_URL,
} = require("../../AiProviders/aimlapi");
const Provider = require("./ai-provider.js");
const InheritMultiple = require("./helpers/classes.js");
const UnTooled = require("./helpers/untooled.js");

class AimlApiProvider extends InheritMultiple([Provider, UnTooled]) {
  model;

  constructor(config = {}) {
    super();
    const { model = "gpt-3.5-turbo" } = config;
    const client = new OpenAI({
      baseURL: AIMLAPI_BASE_URL,
      apiKey: process.env.AIML_API_KEY ?? null,
      maxRetries: 3,
      defaultHeaders: AIMLAPI_HEADERS,
    });

    this._client = client;
    this.model = model;
    this.verbose = true;
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
      })
      .then((result) => {
        if (!result.hasOwnProperty("choices"))
          throw new Error("AimlApi chat: No results!");
        if (result.choices.length === 0)
          throw new Error("AimlApi chat: No results length!");
        return result.choices[0].message.content;
      })
      .catch(() => {
        return null;
      });
  }

  async complete(messages, functions = []) {
    try {
      let completion;
      if (functions.length > 0) {
        const { toolCall, text } = await this.functionCall(
          messages,
          functions,
          this.#handleFunctionCallChat.bind(this)
        );

        if (toolCall !== null) {
          this.providerLog(`Valid tool call found - running ${toolCall.name}.`);
          this.deduplicator.trackRun(toolCall.name, toolCall.arguments);
          return {
            result: null,
            functionCall: {
              name: toolCall.name,
              arguments: toolCall.arguments,
            },
            cost: 0,
          };
        }
        completion = { content: text };
      } else {
        completion = await this.client.chat.completions.create({
          model: this.model,
          messages,
        });
        completion = completion.choices[0];
      }
      return { result: completion.content, cost: 0 };
    } catch (e) {
      this.providerLog(e.message);
      return { result: null, cost: 0 };
    }
  }
}

module.exports = AimlApiProvider;

/**
 * A service that provides an AI client to create a completion.
 */

const { ChatOpenAI } = require("langchain/chat_models/openai");
const { ChatAnthropic } = require("langchain/chat_models/anthropic");

class Provider {
  _client;
  constructor(client) {
    if (this.constructor == Provider) {
      throw new Error("Class is of abstract type and can't be instantiated");
    }
    this._client = client;
  }

  get client() {
    return this._client;
  }

  static LangChainChatModel(provider = "openai", config = {}) {
    switch (provider) {
      case "openai":
        return new ChatOpenAI({
          openAIApiKey: process.env.OPEN_AI_KEY,
          ...config,
        });
      case "anthropic":
        return new ChatAnthropic({
          anthropicApiKey: process.env.ANTHROPIC_API_KEY,
          ...config,
        });
      default:
        return new ChatOpenAI({
          openAIApiKey: process.env.OPEN_AI_KEY,
          ...config,
        });
    }
  }

  static contextLimit(provider = "openai") {
    switch (provider) {
      case "openai":
        return 8_000;
      case "anthropic":
        return 100_000;
      default:
        return 8_000;
    }
  }
}

module.exports = Provider;

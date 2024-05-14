/**
 * A service that provides an AI client to create a completion.
 */

const { ChatOpenAI } = require("@langchain/openai");
const { ChatAnthropic } = require("@langchain/anthropic");
const DEFAULT_WORKSPACE_PROMPT =
  "You are a helpful ai assistant who can assist the user and use tools available to help answer the users prompts and questions.";

class Provider {
  _client;
  constructor(client) {
    if (this.constructor == Provider) {
      return;
    }
    this._client = client;
  }

  providerLog(text, ...args) {
    console.log(
      `\x1b[36m[AgentLLM${this?.model ? ` - ${this.model}` : ""}]\x1b[0m ${text}`,
      ...args
    );
  }

  get client() {
    return this._client;
  }

  static LangChainChatModel(provider = "openai", config = {}) {
    switch (provider) {
      case "openai":
        return new ChatOpenAI({
          apiKey: process.env.OPEN_AI_KEY,
          ...config,
        });
      case "anthropic":
        return new ChatAnthropic({
          apiKey: process.env.ANTHROPIC_API_KEY,
          ...config,
        });
      default:
        return new ChatOpenAI({
          apiKey: process.env.OPEN_AI_KEY,
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

  // For some providers we may want to override the system prompt to be more verbose.
  // Currently we only do this for lmstudio, but we probably will want to expand this even more
  // to any Untooled LLM.
  static systemPrompt(provider = null) {
    switch (provider) {
      case "lmstudio":
        return "You are a helpful ai assistant who can assist the user and use tools available to help answer the users prompts and questions. Tools will be handled by another assistant and you will simply receive their responses to help answer the user prompt - always try to answer the user's prompt the best you can with the context available to you and your general knowledge.";
      default:
        return DEFAULT_WORKSPACE_PROMPT;
    }
  }
}

module.exports = Provider;

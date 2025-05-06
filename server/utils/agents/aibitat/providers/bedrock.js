const Provider = require("./ai-provider.js");
const InheritMultiple = require("./helpers/classes.js");
const UnTooled = require("./helpers/untooled.js");
const { ChatBedrockConverse } = require("@langchain/aws");
const {
  HumanMessage,
  SystemMessage,
  AIMessage,
} = require("@langchain/core/messages");

/**
 * The agent provider for the AWS Bedrock provider.
 */
class AWSBedrockProvider extends InheritMultiple([Provider, UnTooled]) {
  model;

  constructor(_config = {}) {
    super();
    this.verbose = true;
    this._lastConfig = null;
    this._lastAuthMethod = null;
    this.refreshClient();
  }

  get client() {
    if (this.shouldRefreshClient()) {
      this.refreshClient();
    }
    return this._client;
  }

  getClientConfig() {
    const model = process.env.AWS_BEDROCK_LLM_MODEL_PREFERENCE ?? null;
    const region = process.env.AWS_BEDROCK_LLM_REGION;
    const authMethod = process.env.AWS_BEDROCK_LLM_CONNECTION_METHOD;

    const clientConfig = {
      region,
      model,
    };

    if (
      authMethod === "iam_user" &&
      process.env.AWS_BEDROCK_LLM_ACCESS_KEY_ID &&
      process.env.AWS_BEDROCK_LLM_ACCESS_KEY
    ) {
      clientConfig.credentials = {
        accessKeyId: process.env.AWS_BEDROCK_LLM_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_BEDROCK_LLM_ACCESS_KEY,
      };
    }

    return clientConfig;
  }

  getCurrentAuthMethod() {
    return process.env.AWS_BEDROCK_LLM_CONNECTION_METHOD || "iam";
  }

  shouldRefreshClient() {
    if (!this._client || !this._lastConfig) return true;

    const currentConfig = this.getClientConfig();
    const currentAuthMethod = this.getCurrentAuthMethod();

    return (
      JSON.stringify(currentConfig) !== JSON.stringify(this._lastConfig) ||
      currentAuthMethod !== this._lastAuthMethod
    );
  }

  refreshClient() {
    const config = this.getClientConfig();
    this._client = new ChatBedrockConverse(config);
    this.model = config.model;
    this._lastConfig = config;
    this._lastAuthMethod = this.getCurrentAuthMethod();
    return this._client;
  }

  // For streaming we use Langchain's wrapper to handle weird chunks
  // or otherwise absorb headaches that can arise from Ollama models
  #convertToLangchainPrototypes(chats = []) {
    const langchainChats = [];
    const roleToMessageMap = {
      system: SystemMessage,
      user: HumanMessage,
      assistant: AIMessage,
    };

    for (const chat of chats) {
      if (!roleToMessageMap.hasOwnProperty(chat.role)) continue;
      const MessageClass = roleToMessageMap[chat.role];
      langchainChats.push(new MessageClass({ content: chat.content }));
    }

    return langchainChats;
  }

  async #handleFunctionCallChat({ messages = [] }) {
    const response = await this.client
      .invoke(this.#convertToLangchainPrototypes(messages))
      .then((res) => res)
      .catch((e) => {
        console.error(e);
        return null;
      });

    return response?.content;
  }

  /**
   * Create a completion based on the received messages.
   *
   * @param messages A list of messages to send to the API.
   * @param functions
   * @returns The completion.
   */
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
      }

      if (!completion?.content) {
        this.providerLog(
          "Will assume chat completion without tool call inputs."
        );
        const response = await this.client.invoke(
          this.#convertToLangchainPrototypes(this.cleanMsgs(messages))
        );
        completion = response;
      }

      // The UnTooled class inherited Deduplicator is mostly useful to prevent the agent
      // from calling the exact same function over and over in a loop within a single chat exchange
      // _but_ we should enable it to call previously used tools in a new chat interaction.
      this.deduplicator.reset("runs");
      return {
        result: completion.content,
        cost: 0,
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get the cost of the completion.
   *
   * @param _usage The completion to get the cost for.
   * @returns The cost of the completion.
   * Stubbed since KoboldCPP has no cost basis.
   */
  getCost(_usage) {
    return 0;
  }
}

module.exports = AWSBedrockProvider;

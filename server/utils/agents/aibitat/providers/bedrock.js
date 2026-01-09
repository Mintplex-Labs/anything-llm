const {
  createBedrockCredentials,
  getBedrockAuthMethod,
  createBedrockChatClient,
} = require("../../../AiProviders/bedrock/utils.js");
const { AWSBedrockLLM } = require("../../../AiProviders/bedrock/index.js");
const Provider = require("./ai-provider.js");
const InheritMultiple = require("./helpers/classes.js");
const UnTooled = require("./helpers/untooled.js");
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
    const model = process.env.AWS_BEDROCK_LLM_MODEL_PREFERENCE ?? null;
    const client = createBedrockChatClient(
      {},
      this.authMethod,
      this.credentials,
      model
    );

    this._client = client;
    this.model = model;
    this.verbose = true;
  }

  /**
   * Some Bedrock models (Titan, Cohere) don't support streaming.
   * Set AWS_BEDROCK_STREAMING_DISABLED to any value to disable streaming for those models.
   * Since this can be any model even custom models we leave it to the user to disable streaming if needed.
   * @returns {boolean} True if streaming is supported, false otherwise.
   */
  get supportsAgentStreaming() {
    if (!!process.env.AWS_BEDROCK_STREAMING_DISABLED) return false;
    return true;
  }

  /**
   * Gets the credentials for the AWS Bedrock LLM based on the authentication method provided.
   * @returns {object} The credentials object.
   */
  get credentials() {
    return createBedrockCredentials(this.authMethod);
  }

  /**
   * Gets the configured AWS authentication method ('iam' or 'sessionToken').
   * Defaults to 'iam' if the environment variable is invalid.
   * @returns {"iam" | "iam_role" | "sessionToken"} The authentication method.
   */
  get authMethod() {
    return getBedrockAuthMethod();
  }

  get client() {
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
   * Create a streaming response from the Langchain Bedrock client and convert
   * it to OpenAI-compatible format expected by UnTooled.
   * @param {Object} options - The options object containing messages.
   * @param {Array} options.messages - The messages to send to the LLM.
   * @returns {AsyncGenerator} An async iterable yielding OpenAI-compatible chunks.
   */
  async #handleFunctionCallStream({ messages = [] }) {
    const langchainMessages = this.#convertToLangchainPrototypes(messages);
    const stream = await this.client.stream(langchainMessages);

    // Wrap Langchain stream to OpenAI format expected by UnTooled
    const self = this;
    return {
      async *[Symbol.asyncIterator]() {
        try {
          for await (const chunk of stream) {
            // Langchain chunks have .content property directly
            const content =
              typeof chunk.content === "string" ? chunk.content : "";
            if (content) {
              yield {
                choices: [
                  {
                    delta: {
                      content: content,
                    },
                  },
                ],
              };
            }
          }
        } catch (e) {
          AWSBedrockLLM.errorToHumanReadable(e, {
            method: "stream",
            model: self.model,
          });
        }
      },
    };
  }

  /**
   * Stream a chat completion from the Bedrock LLM with tool calling.
   *
   * @param {any[]} messages - The messages to send to the LLM.
   * @param {any[]} functions - The functions to use in the LLM.
   * @param {function} eventHandler - The event handler to use to report stream events.
   * @returns {Promise<{ functionCall: any, textResponse: string }>} - The result of the chat completion.
   */
  async stream(messages, functions = [], eventHandler = null) {
    return await UnTooled.prototype.stream.call(
      this,
      messages,
      functions,
      this.#handleFunctionCallStream.bind(this),
      eventHandler
    );
  }

  /**
   * Create a completion based on the received messages.
   *
   * @param messages A list of messages to send to the API.
   * @param functions
   * @returns The completion.
   */
  async complete(messages, functions = []) {
    return await UnTooled.prototype.complete.call(
      this,
      messages,
      functions,
      this.#handleFunctionCallChat.bind(this)
    );
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

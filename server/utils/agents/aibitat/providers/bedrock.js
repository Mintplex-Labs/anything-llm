const {
  createBedrockCredentials,
  getBedrockAuthMethod,
  createBedrockChatClient,
} = require("../../../AiProviders/bedrock/utils.js");
const { AWSBedrockLLM } = require("../../../AiProviders/bedrock/index.js");
const Provider = require("./ai-provider.js");
const InheritMultiple = require("./helpers/classes.js");
const UnTooled = require("./helpers/untooled.js");
const { safeJsonParse } = require("../../../http");
const { v4 } = require("uuid");
const {
  HumanMessage,
  SystemMessage,
  AIMessage,
  ToolMessage,
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
    this._supportsToolCalling = null;
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
   * Whether this provider supports native tool calling via the Bedrock Converse API.
   * Checks the ENV to see if the provider supports tool calling.
   * If the ENV is not set, we default to false.
   * @returns {boolean}
   */
  supportsNativeToolCalling() {
    if (this._supportsToolCalling !== null) return this._supportsToolCalling;
    const supportsToolCalling =
      process.env.PROVIDER_SUPPORTS_NATIVE_TOOL_CALLING?.includes("bedrock");

    if (supportsToolCalling)
      this.providerLog("AWS Bedrock native tool calling is ENABLED via ENV.");
    else
      this.providerLog(
        "AWS Bedrock native tool calling is DISABLED via ENV. Will use UnTooled instead."
      );
    this._supportsToolCalling = supportsToolCalling;
    return supportsToolCalling;
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

  /**
   * Convert aibitat message history to Langchain message prototypes with
   * proper tool call / tool result handling for native tool calling.
   * role:"function" messages (from previous aibitat tool runs) are converted
   * to AIMessage(tool_calls) + ToolMessage pairs that Langchain expects.
   * @param {Array} chats - The aibitat message history.
   * @returns {Array} Langchain message instances.
   */
  #convertToLangchainPrototypesWithTools(chats = []) {
    const langchainChats = [];

    for (const chat of chats) {
      if (chat.role === "function") {
        if (chat.originalFunctionCall?.id) {
          const prevMsg = langchainChats[langchainChats.length - 1];
          if (
            !prevMsg ||
            !(prevMsg instanceof AIMessage) ||
            !prevMsg.tool_calls?.length
          ) {
            langchainChats.push(
              new AIMessage({
                content: "",
                tool_calls: [
                  {
                    name: chat.originalFunctionCall.name,
                    args:
                      typeof chat.originalFunctionCall.arguments === "string"
                        ? safeJsonParse(chat.originalFunctionCall.arguments, {})
                        : chat.originalFunctionCall.arguments,
                    id: chat.originalFunctionCall.id,
                  },
                ],
              })
            );
          }
          langchainChats.push(
            new ToolMessage({
              content:
                typeof chat.content === "string"
                  ? chat.content
                  : JSON.stringify(chat.content),
              tool_call_id: chat.originalFunctionCall.id,
            })
          );
        } else {
          const toolCallId = `call_${v4()}`;
          langchainChats.push(
            new AIMessage({
              content: "",
              tool_calls: [{ name: chat.name, args: {}, id: toolCallId }],
            })
          );
          langchainChats.push(
            new ToolMessage({
              content:
                typeof chat.content === "string"
                  ? chat.content
                  : JSON.stringify(chat.content),
              tool_call_id: toolCallId,
            })
          );
        }
      } else if (chat.role === "system") {
        langchainChats.push(new SystemMessage({ content: chat.content }));
      } else if (chat.role === "user") {
        langchainChats.push(new HumanMessage({ content: chat.content }));
      } else if (chat.role === "assistant") {
        langchainChats.push(new AIMessage({ content: chat.content }));
      }
    }

    return langchainChats;
  }

  /**
   * Convert aibitat function definitions to the format expected by
   * Langchain's ChatBedrockConverse.bindTools().
   * @param {Array<{name: string, description: string, parameters: object}>} functions
   * @returns {Array<{type: "function", function: {name: string, description: string, parameters: object}}>}
   */
  #formatFunctionsToLangchainTools(functions) {
    if (!Array.isArray(functions) || functions.length === 0) return [];
    return functions.map((func) => ({
      type: "function",
      function: {
        name: func.name,
        description: func.description,
        parameters: func.parameters,
      },
    }));
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
   * Uses native Bedrock Converse tool calling when supported, otherwise falls back to UnTooled.
   *
   * @param {any[]} messages - The messages to send to the LLM.
   * @param {any[]} functions - The functions to use in the LLM.
   * @param {function} eventHandler - The event handler to use to report stream events.
   * @returns {Promise<{ functionCall: any, textResponse: string }>} - The result of the chat completion.
   */
  async stream(messages, functions = [], eventHandler = null) {
    const useNative = functions.length > 0 && this.supportsNativeToolCalling();

    if (!useNative) {
      return await UnTooled.prototype.stream
        .call(
          this,
          messages,
          functions,
          this.#handleFunctionCallStream.bind(this),
          eventHandler
        )
        .catch((e) => {
          AWSBedrockLLM.errorToHumanReadable(e, {
            method: "stream",
            model: this.model,
          });
        });
    }

    this.providerLog(
      "Provider.stream (tooled) - will process this chat completion."
    );

    try {
      const langchainMessages =
        this.#convertToLangchainPrototypesWithTools(messages);
      const tools = this.#formatFunctionsToLangchainTools(functions);
      const modelWithTools = this.client.bindTools(tools);
      const stream = await modelWithTools.stream(langchainMessages);

      const msgUUID = v4();
      let textResponse = "";
      let finalMessage = null;

      for await (const chunk of stream) {
        finalMessage =
          finalMessage === null ? chunk : finalMessage.concat(chunk);

        const content = typeof chunk.content === "string" ? chunk.content : "";
        if (content) {
          textResponse += content;
          eventHandler?.("reportStreamEvent", {
            type: "textResponseChunk",
            uuid: msgUUID,
            content,
          });
        }

        if (chunk.tool_call_chunks?.length) {
          for (const toolChunk of chunk.tool_call_chunks) {
            if (toolChunk.name) {
              eventHandler?.("reportStreamEvent", {
                uuid: `${msgUUID}:tool_call_invocation`,
                type: "toolCallInvocation",
                content: `Assembling Tool Call: ${toolChunk.name}`,
              });
            }
          }
        }
      }

      if (finalMessage?.tool_calls?.length > 0) {
        const toolCall = finalMessage.tool_calls[0];
        return {
          textResponse,
          functionCall: {
            id: toolCall.id || `call_${v4()}`,
            name: toolCall.name,
            arguments: toolCall.args || {},
          },
          cost: 0,
        };
      }

      return { textResponse, functionCall: null, cost: 0 };
    } catch (e) {
      AWSBedrockLLM.errorToHumanReadable(e, {
        method: "stream",
        model: this.model,
      });
    }
  }

  /**
   * Create a non-streaming completion with tool calling support.
   * Uses native Bedrock Converse tool calling when supported, otherwise falls back to UnTooled.
   *
   * @param {any[]} messages A list of messages to send to the API.
   * @param {any[]} functions The function definitions available to the model.
   * @returns The completion.
   */
  async complete(messages, functions = []) {
    const useNative = functions.length > 0 && this.supportsNativeToolCalling();

    if (!useNative) {
      return await UnTooled.prototype.complete
        .call(
          this,
          messages,
          functions,
          this.#handleFunctionCallChat.bind(this)
        )
        .catch((e) => {
          AWSBedrockLLM.errorToHumanReadable(e, {
            method: "complete",
            model: this.model,
          });
        });
    }

    try {
      const langchainMessages =
        this.#convertToLangchainPrototypesWithTools(messages);
      const tools = this.#formatFunctionsToLangchainTools(functions);
      const modelWithTools = this.client.bindTools(tools);
      const response = await modelWithTools.invoke(langchainMessages);

      if (response.tool_calls?.length > 0) {
        const toolCall = response.tool_calls[0];
        return {
          textResponse: null,
          functionCall: {
            id: toolCall.id || `call_${v4()}`,
            name: toolCall.name,
            arguments: toolCall.args || {},
          },
          cost: 0,
        };
      }

      return {
        textResponse:
          typeof response.content === "string"
            ? response.content
            : JSON.stringify(response.content),
        cost: 0,
      };
    } catch (e) {
      AWSBedrockLLM.errorToHumanReadable(e, {
        method: "complete",
        model: this.model,
      });
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

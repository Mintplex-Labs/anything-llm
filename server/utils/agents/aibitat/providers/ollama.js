const Provider = require("./ai-provider.js");
const InheritMultiple = require("./helpers/classes.js");
const UnTooled = require("./helpers/untooled.js");
const { formatFunctionsToTools } = require("./helpers/tooled.js");
const { OllamaAILLM } = require("../../../AiProviders/ollama");
const { Ollama } = require("ollama");
const { v4 } = require("uuid");
const { safeJsonParse } = require("../../../http");

/**
 * The agent provider for the Ollama provider.
 * Supports true OpenAI-compatible tool calling when the model supports it,
 * falling back to the UnTooled prompt-based approach otherwise.
 */
class OllamaProvider extends InheritMultiple([Provider, UnTooled]) {
  model;

  constructor(config = {}) {
    const {
      // options = {},
      model = null,
    } = config;

    super();
    const authToken = process.env.OLLAMA_AUTH_TOKEN;
    const basePath = process.env.OLLAMA_BASE_PATH;
    const headers = authToken ? { Authorization: `Bearer ${authToken}` } : {};
    this._client = new Ollama({
      host: basePath,
      headers: headers,
      fetch: OllamaAILLM.applyOllamaFetch(),
    });
    this.model = model;
    this.verbose = true;
    this._supportsToolCalling = null;
  }

  get client() {
    return this._client;
  }

  get supportsAgentStreaming() {
    return true;
  }

  /**
   * Whether this provider supports native OpenAI-compatible tool calling.
   * Override in subclass and return true to use native tool calling instead of UnTooled.
   * @returns {boolean|Promise<boolean>}
   */
  async supportsNativeToolCalling() {
    if (this._supportsToolCalling !== null) return this._supportsToolCalling;
    const ollama = new OllamaAILLM(null, this.model);
    const capabilities = await ollama.getModelCapabilities();
    this._supportsToolCalling = capabilities.tools === true;
    return this._supportsToolCalling;
  }

  get queryOptions() {
    this.providerLog(
      `${this.model} is using a max context window of ${OllamaAILLM.promptWindowLimit(this.model)}/${OllamaAILLM.maxContextWindow(this.model)} tokens.`
    );
    return {
      num_ctx: OllamaAILLM.promptWindowLimit(this.model),
    };
  }

  /**
   * Handle a chat completion with tool calling
   *
   * @param messages
   * @returns {Promise<string|null>} The completion.
   */
  async #handleFunctionCallChat({ messages = [] }) {
    await OllamaAILLM.cacheContextWindows();
    const response = await this.client.chat({
      model: this.model,
      messages,
      options: this.queryOptions,
    });
    return response?.message?.content || null;
  }

  async #handleFunctionCallStream({ messages = [] }) {
    await OllamaAILLM.cacheContextWindows();
    return await this.client.chat({
      model: this.model,
      messages,
      stream: true,
      options: this.queryOptions,
    });
  }

  /**
   * Parse a data URL into base64 data for Ollama images
   * @param {string} dataUrl - Data URL like "data:image/jpeg;base64,/9j/..."
   * @returns {string|null} Base64 encoded image data
   */
  #parseImageDataUrl(dataUrl) {
    if (!dataUrl || !dataUrl.startsWith("data:")) return null;
    const matches = dataUrl.match(/^data:[^;]+;base64,(.+)$/);
    if (!matches) return null;
    return matches[1];
  }

  /**
   * Override formatMessageWithAttachments for Ollama's specific format.
   * Ollama expects images in a separate 'images' array with base64 data (no data URI prefix),
   * not the OpenAI-style content array format.
   * **This is only used for Ollama:untooled fallback mode.**
   * @param {Object} message - Message with potential attachments
   * @returns {Object} Formatted message for Ollama
   */
  formatMessageWithAttachments(message) {
    if (!message.attachments || message.attachments.length === 0) {
      return message;
    }

    const images = [];
    for (const attachment of message.attachments) {
      const imageData = this.#parseImageDataUrl(attachment.contentString);
      if (imageData) {
        images.push(imageData);
      }
    }

    const { attachments: _, ...restOfMessage } = message;
    return {
      ...restOfMessage,
      ...(images.length > 0 ? { images } : {}),
    };
  }

  /**
   * Convert aibitat's internal message history (which uses role:"function" with
   * originalFunctionCall metadata) into the Ollama tool-calling message format
   * (assistant tool_calls + role:"tool" result pairs).
   * Handles image attachments for vision/multimodal support.
   * @param {Array} messages
   * @returns {Array}
   */
  #formatMessagesForOllamaTools(messages) {
    const formatted = [];
    for (const message of messages) {
      if (message.role === "function") {
        const funcName =
          message.originalFunctionCall?.name || message.name || "unknown";
        const funcArgs = message.originalFunctionCall?.arguments || {};
        formatted.push({
          role: "assistant",
          content: "",
          tool_calls: [
            {
              function: {
                name: funcName,
                arguments:
                  typeof funcArgs === "string"
                    ? safeJsonParse(funcArgs, {})
                    : funcArgs,
              },
            },
          ],
        });
        formatted.push({
          role: "tool",
          content:
            typeof message.content === "string"
              ? message.content
              : JSON.stringify(message.content),
        });
      } else {
        // Handle messages with attachments (images) for multimodal support
        if (message.attachments && message.attachments.length > 0) {
          const images = [];
          for (const attachment of message.attachments) {
            const imageData = this.#parseImageDataUrl(attachment.contentString);
            if (imageData) images.push(imageData);
          }
          const { attachments: _, ...restOfMessage } = message;
          formatted.push({
            ...restOfMessage,
            ...(images.length > 0 ? { images } : {}),
          });
        } else {
          formatted.push(message);
        }
      }
    }
    return formatted;
  }

  async streamingFunctionCall(
    messages,
    functions,
    chatCb = null,
    eventHandler = null
  ) {
    const history = [...messages].filter((msg) =>
      ["user", "assistant"].includes(msg.role)
    );
    if (history[history.length - 1].role !== "user") return null;

    const msgUUID = v4();
    let token = "";
    let textResponse = "";
    let reasoningText = "";
    const historyMessages = this.buildToolCallMessages(history, functions);
    const stream = await chatCb({ messages: historyMessages });

    eventHandler?.("reportStreamEvent", {
      type: "statusResponse",
      uuid: v4(),
      content: "Agent is thinking...",
    });

    for await (const chunk of stream) {
      if (!chunk.hasOwnProperty("message")) continue;

      const content = chunk.message?.content;
      const reasoningToken = chunk.message?.thinking;
      if (reasoningToken) {
        if (reasoningText.length === 0) {
          reasoningText = `Thinking:\n\n${reasoningToken}`;
          token = reasoningText;
        } else {
          reasoningText += reasoningToken;
          token = reasoningToken;
        }
      } else if (content.length > 0) {
        if (reasoningText.length > 0) {
          token = `\n\nDone thinking.\n\n${content}`;
          reasoningText = "";
        } else {
          token = content;
        }
        textResponse += content;
      }

      eventHandler?.("reportStreamEvent", {
        type: "statusResponse",
        uuid: msgUUID,
        content: token,
      });
    }

    const call = safeJsonParse(textResponse, null);
    if (call === null)
      return { toolCall: null, text: textResponse, uuid: msgUUID }; // failed to parse, so must be regular text response.

    const { valid, reason } = this.validFuncCall(call, functions);
    if (!valid) {
      this.providerLog(`Invalid function tool call: ${reason}.`);
      eventHandler?.("reportStreamEvent", {
        type: "removeStatusResponse",
        uuid: msgUUID,
        content:
          "The model attempted to make an invalid function call - it was ignored.",
      });
      return { toolCall: null, text: null, uuid: msgUUID };
    }

    const { isDuplicate, reason: duplicateReason } =
      this.deduplicator.isDuplicate(call.name, call.arguments);
    if (isDuplicate) {
      this.providerLog(
        `Cannot call ${call.name} again because ${duplicateReason}.`
      );
      eventHandler?.("reportStreamEvent", {
        type: "removeStatusResponse",
        uuid: msgUUID,
        content:
          "The model tried to call a function with the same arguments as a previous call - it was ignored.",
      });
      return { toolCall: null, text: null, uuid: msgUUID };
    }

    eventHandler?.("reportStreamEvent", {
      uuid: `${msgUUID}:tool_call_invocation`,
      type: "toolCallInvocation",
      content: `Parsed Tool Call: ${call.name}(${JSON.stringify(call.arguments)})`,
    });
    return { toolCall: call, text: null, uuid: msgUUID };
  }

  /**
   * Stream a chat completion with tool calling support.
   * Uses native tool calling when supported, otherwise falls back to the
   * Ollama SDK + UnTooled prompt-based approach.
   *
   * @param messages A list of messages to send to the API.
   * @param functions
   * @param eventHandler
   * @returns The completion.
   */
  async stream(messages, functions = [], eventHandler = null) {
    const useNative =
      functions.length > 0 && (await this.supportsNativeToolCalling());

    if (useNative) {
      this.providerLog(
        "OllamaProvider.stream (tooled) - will process this chat completion."
      );
      this.resetUsage();
      await OllamaAILLM.cacheContextWindows();
      const msgUUID = v4();
      const formattedMessages = this.#formatMessagesForOllamaTools(messages);
      const tools = formatFunctionsToTools(functions);

      const stream = await this.client.chat({
        model: this.model,
        messages: formattedMessages,
        tools,
        stream: true,
        options: this.queryOptions,
      });

      let textResponse = "";
      let toolCalls = null;

      for await (const chunk of stream) {
        // Capture usage from final chunk (Ollama sends usage when done=true)
        if (chunk.done === true) {
          this.recordUsage({
            prompt_tokens: chunk.prompt_eval_count || 0,
            completion_tokens: chunk.eval_count || 0,
          });
        }

        if (!chunk?.message) continue;

        if (chunk.message.content) {
          textResponse += chunk.message.content;
          eventHandler?.("reportStreamEvent", {
            type: "textResponseChunk",
            uuid: msgUUID,
            content: chunk.message.content,
          });
        }

        if (chunk.message.tool_calls?.length > 0) {
          toolCalls = chunk.message.tool_calls;
          eventHandler?.("reportStreamEvent", {
            uuid: `${msgUUID}:tool_call_invocation`,
            type: "toolCallInvocation",
            content: `Tool Call: ${toolCalls[0].function.name}(${JSON.stringify(toolCalls[0].function.arguments)})`,
          });
        }
      }

      if (toolCalls && toolCalls.length > 0) {
        const toolCall = toolCalls[0];
        const args =
          typeof toolCall.function.arguments === "string"
            ? safeJsonParse(toolCall.function.arguments, {})
            : toolCall.function.arguments || {};

        return {
          textResponse,
          functionCall: {
            id: `ollama_${v4()}`,
            name: toolCall.function.name,
            arguments: args,
          },
          cost: 0,
          uuid: msgUUID,
        };
      }

      return { textResponse, functionCall: null, cost: 0, uuid: msgUUID };
    }

    // Fallback: UnTooled prompt-based approach via the native Ollama SDK
    this.providerLog(
      "OllamaProvider.stream - will process this chat completion."
    );
    // eslint-disable-next-line
    try {
      let completion = { content: "" };
      if (functions.length > 0) {
        const {
          toolCall,
          text,
          uuid: msgUUID,
        } = await this.streamingFunctionCall(
          messages,
          functions,
          this.#handleFunctionCallStream.bind(this),
          eventHandler
        );

        if (toolCall !== null) {
          this.providerLog(`Valid tool call found - running ${toolCall.name}.`);
          this.deduplicator.trackRun(toolCall.name, toolCall.arguments, {
            cooldown: this.isMCPTool(toolCall, functions),
          });
          return {
            result: null,
            functionCall: {
              name: toolCall.name,
              arguments: toolCall.arguments,
            },
            cost: 0,
          };
        }

        if (text) {
          this.providerLog(
            `No tool call found in the response - will send as a full text response.`
          );
          completion.content = text;
          eventHandler?.("reportStreamEvent", {
            type: "removeStatusResponse",
            uuid: msgUUID,
            content: "No tool call found in the response",
          });
          eventHandler?.("reportStreamEvent", {
            type: "statusResponse",
            uuid: v4(),
            content: "Done thinking.",
          });
          eventHandler?.("reportStreamEvent", {
            type: "fullTextResponse",
            uuid: v4(),
            content: text,
          });
        }
      }

      if (!completion?.content) {
        eventHandler?.("reportStreamEvent", {
          type: "statusResponse",
          uuid: v4(),
          content: "Done thinking.",
        });
        this.providerLog(
          "Will assume chat completion without tool call inputs."
        );
        const msgUUID = v4();
        completion = { content: "" };
        let reasoningText = "";
        let token = "";
        const stream = await this.#handleFunctionCallStream({
          messages: this.cleanMsgs(messages),
        });

        for await (const chunk of stream) {
          if (!chunk.hasOwnProperty("message")) continue;

          const content = chunk.message?.content;
          const reasoningToken = chunk.message?.thinking;
          if (reasoningToken) {
            if (reasoningText.length === 0) {
              reasoningText = `<think>${reasoningToken}`;
              token = `<think>${reasoningToken}`;
            } else {
              reasoningText += reasoningToken;
              token = reasoningToken;
            }
          } else if (content.length > 0) {
            if (reasoningText.length > 0) {
              token = `</think>${content}`;
              reasoningText = "";
            } else {
              token = content;
            }
          }

          completion.content += token;
          eventHandler?.("reportStreamEvent", {
            type: "textResponseChunk",
            uuid: msgUUID,
            content: token,
          });
        }
      }

      this.deduplicator.reset("runs");
      return {
        textResponse: completion.content,
        cost: 0,
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Create a non-streaming completion with tool calling support.
   * Uses native tool calling when supported, otherwise falls back to UnTooled.
   *
   * @param messages A list of messages to send to the API.
   * @param functions
   * @returns The completion.
   */
  async complete(messages, functions = []) {
    const useNative =
      functions.length > 0 && (await this.supportsNativeToolCalling());

    if (useNative) {
      this.resetUsage();
      await OllamaAILLM.cacheContextWindows();
      const formattedMessages = this.#formatMessagesForOllamaTools(messages);
      const tools = formatFunctionsToTools(functions);

      const response = await this.client.chat({
        model: this.model,
        messages: formattedMessages,
        tools,
        options: this.queryOptions,
      });

      // Record usage (Ollama uses prompt_eval_count/eval_count)
      this.recordUsage({
        prompt_tokens: response.prompt_eval_count || 0,
        completion_tokens: response.eval_count || 0,
      });

      if (response.message?.tool_calls?.length > 0) {
        const toolCall = response.message.tool_calls[0];
        const args =
          typeof toolCall.function.arguments === "string"
            ? safeJsonParse(toolCall.function.arguments, {})
            : toolCall.function.arguments || {};

        return {
          textResponse: null,
          functionCall: {
            id: `ollama_${v4()}`,
            name: toolCall.function.name,
            arguments: args,
          },
          cost: 0,
          usage: this.getUsage(),
        };
      }

      return {
        textResponse: response.message?.content || null,
        cost: 0,
        usage: this.getUsage(),
      };
    }

    // Fallback: UnTooled prompt-based approach via the native Ollama SDK
    this.providerLog(
      "OllamaProvider.complete - will process this chat completion."
    );
    // eslint-disable-next-line
    try {
      let completion = { content: "" };
      if (functions.length > 0) {
        const { toolCall, text } = await this.functionCall(
          messages,
          functions,
          this.#handleFunctionCallChat.bind(this)
        );

        if (toolCall !== null) {
          this.providerLog(`Valid tool call found - running ${toolCall.name}.`);
          this.deduplicator.trackRun(toolCall.name, toolCall.arguments, {
            cooldown: this.isMCPTool(toolCall, functions),
          });
          return {
            result: null,
            functionCall: {
              name: toolCall.name,
              arguments: toolCall.arguments,
            },
            cost: 0,
          };
        }
        completion.content = text;
      }

      if (!completion?.content) {
        this.providerLog(
          "Will assume chat completion without tool call inputs."
        );
        const textResponse = await this.#handleFunctionCallChat({
          messages: this.cleanMsgs(messages),
        });
        completion.content = textResponse;
      }

      this.deduplicator.reset("runs");
      return {
        textResponse: completion.content,
        cost: 0,
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get the cost of the completion.
   * Stubbed since Ollama has no cost basis.
   * @param _usage The completion to get the cost for.
   * @returns The cost of the completion.
   */
  getCost(_usage) {
    return 0;
  }
}

module.exports = OllamaProvider;

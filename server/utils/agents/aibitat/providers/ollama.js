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
      fetch: this.#applyFetch(),
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
   * Convert aibitat's internal message history (which uses role:"function" with
   * originalFunctionCall metadata) into the Ollama tool-calling message format
   * (assistant tool_calls + role:"tool" result pairs).
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
        formatted.push(message);
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
        };
      }

      return { textResponse, functionCall: null };
    }

    // Fallback: UnTooled prompt-based approach via the native Ollama SDK
    this.providerLog(
      "OllamaProvider.stream - will process this chat completion."
    );
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
      await OllamaAILLM.cacheContextWindows();
      const formattedMessages = this.#formatMessagesForOllamaTools(messages);
      const tools = formatFunctionsToTools(functions);

      const response = await this.client.chat({
        model: this.model,
        messages: formattedMessages,
        tools,
        options: this.queryOptions,
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
        };
      }

      return {
        textResponse: response.message?.content || null,
        cost: 0,
      };
    }

    // Fallback: UnTooled prompt-based approach via the native Ollama SDK
    this.providerLog(
      "OllamaProvider.complete - will process this chat completion."
    );
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

  /**
   * Apply a custom fetch function to the Ollama client.
   * This is useful when we want to bypass the default 5m timeout for global fetch
   * for machines which run responses very slowly.
   * @returns {Function} The custom fetch function.
   */
  #applyFetch() {
    try {
      if (!("OLLAMA_RESPONSE_TIMEOUT" in process.env)) return fetch;
      const { Agent } = require("undici");
      const moment = require("moment");
      let timeout = process.env.OLLAMA_RESPONSE_TIMEOUT;

      if (!timeout || isNaN(Number(timeout)) || Number(timeout) <= 5 * 60_000) {
        this.providerLog(
          "Timeout option was not set, is not a number, or is less than 5 minutes in ms - falling back to default",
          { timeout }
        );
        return fetch;
      } else timeout = Number(timeout);

      const noTimeoutFetch = (input, init = {}) => {
        return fetch(input, {
          ...init,
          dispatcher: new Agent({ headersTimeout: timeout }),
        });
      };

      const humanDiff = moment.duration(timeout).humanize();
      this.providerLog(`Applying custom fetch w/timeout of ${humanDiff}.`);
      return noTimeoutFetch;
    } catch (error) {
      this.providerLog(
        "Error applying custom fetch - using default fetch",
        error
      );
      return fetch;
    }
  }
}

module.exports = OllamaProvider;

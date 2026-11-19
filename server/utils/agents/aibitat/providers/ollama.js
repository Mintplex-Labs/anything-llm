const { reasoningParams } = require("../../../helpers/reasoningEffort");
const { TokenManager } = require("../../../helpers/tiktoken");
const Provider = require("./ai-provider.js");
const InheritMultiple = require("./helpers/classes.js");
const UnTooled = require("./helpers/untooled.js");
const {
  formatFunctionsToTools,
  temperatureParam,
} = require("./helpers/tooled.js");
const { OllamaAILLM } = require("../../../AiProviders/ollama");
const { Ollama } = require("ollama");
const { v4 } = require("uuid");
const { safeJsonParse } = require("../../../http");

// Tool results are injected as a user turn so providers can attach images.
// That placeholder is not the question Ollama has to see in the transcript.
const TOOL_ATTACHMENT_PROMPT = "[Attached image(s) from tool result]";

/**
 * The agent provider for the Ollama provider.
 * Supports true OpenAI-compatible tool calling when the model supports it,
 * falling back to the UnTooled prompt-based approach otherwise.
 */
class OllamaProvider extends InheritMultiple([Provider, UnTooled]) {
  model;
  // Last real user prompt seen by this provider. One instance serves a whole
  // tool loop, so a later turn can put the prompt back if history lost it.
  #nativeUserPrompt = null;

  constructor(config = {}) {
    const {
      // options = {},
      model = null,
      reasoningEffort = null,
    } = config;

    super();
    this.providerTag = "ollama";
    const authToken = process.env.OLLAMA_AUTH_TOKEN;
    const basePath = process.env.OLLAMA_BASE_PATH;
    const headers = authToken ? { Authorization: `Bearer ${authToken}` } : {};
    this._client = new Ollama({
      host: basePath,
      headers: headers,
      fetch: OllamaAILLM.applyOllamaFetch(),
    });
    this.model = model;
    this.reasoningEffort = reasoningEffort;
    this.verbose = true;
    this._supportsToolCalling = null;
    this.keepAlive = process.env.OLLAMA_KEEP_ALIVE_TIMEOUT
      ? Number(process.env.OLLAMA_KEEP_ALIVE_TIMEOUT)
      : undefined; // Unset: the Ollama server applies its own default.
  }

  get client() {
    return this._client;
  }

  /**
   * The reasoning portion of the request body. The effort is validated against
   * the model before the provider is built, so it only needs mapping here.
   * @returns {object}
   */
  get reasoningConfig() {
    return reasoningParams("ollama", this.reasoningEffort, this.model);
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
    if (this.optsOutOfNativeToolCallingViaEnv(this.providerTag)) return false;
    if (this._supportsToolCalling !== null) return this._supportsToolCalling;
    const ollama = new OllamaAILLM(null, this.model);
    const capabilities = await ollama.getModelCapabilities();
    this._supportsToolCalling = capabilities.tools === true;
    return this._supportsToolCalling;
  }

  /**
   * Checks Ollama's running-model list (/api/ps) for this model.
   * @returns {Promise<boolean>}
   */
  async isModelLoaded() {
    return await this.client
      .ps()
      .then(({ models = [] }) =>
        models.some((m) => m.name === this.model || m.model === this.model)
      )
      .catch(() => true);
  }

  get queryOptions() {
    this.providerLog(
      `${this.model} is using a max context window of ${OllamaAILLM.promptWindowLimit(this.model)}/${OllamaAILLM.maxContextWindow(this.model)} tokens.`
    );
    return {
      num_ctx: OllamaAILLM.promptWindowLimit(this.model),
      ...temperatureParam(this.temperature),
    };
  }

  /**
   * Handle a chat completion with tool calling
   *
   * @param messages
   * @returns {Promise<string|null>} The completion.
   */
  async #handleFunctionCallChat({ messages = [] }) {
    await OllamaAILLM.contextWindows.ensure(this.model);
    const response = await this.client.chat({
      model: this.model,
      keep_alive: this.keepAlive,
      messages,
      ...this.reasoningConfig,
      options: this.queryOptions,
    });
    this.watchTokenLimit(response);
    return response?.message?.content || null;
  }

  async #handleFunctionCallStream({ messages = [] }) {
    await OllamaAILLM.contextWindows.ensure(this.model);
    return await this.client.chat({
      model: this.model,
      keep_alive: this.keepAlive,
      messages,
      stream: true,
      ...this.reasoningConfig,
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

  /**
   * A user turn Ollama will accept as the query. Tool-image placeholders are
   * user-role messages, but they are not the question that started the loop.
   * @param {object} message
   * @returns {boolean}
   */
  #isNativeUserQuery(message) {
    if (message?.role !== "user" || typeof message.content !== "string")
      return false;
    const content = message.content.trim();
    return content.length > 0 && content !== TOOL_ATTACHMENT_PROMPT;
  }

  /**
   * Keep a role:"user" query in the native tool transcript.
   * Ollama 0.40 qwen renderers return 500 "no user query found in messages"
   * when the array has none. The same provider instance handles every turn of
   * one tool loop, so the prompt from an earlier turn can be put back.
   * @param {Array} messages
   * @returns {Array}
   */
  #withNativeUserPrompt(messages) {
    for (const message of messages) {
      if (this.#isNativeUserQuery(message))
        this.#nativeUserPrompt = message.content;
    }
    if (messages.some((message) => this.#isNativeUserQuery(message)))
      return messages;
    if (!this.#nativeUserPrompt) return messages;

    const user = { role: "user", content: this.#nativeUserPrompt };
    const insertAt = messages.findIndex((message) => message.role !== "system");
    if (insertAt === -1) return [...messages, user];
    return [...messages.slice(0, insertAt), user, ...messages.slice(insertAt)];
  }

  /**
   * Token budget for the native tool request. Stay under num_ctx: Ollama
   * truncates from the front, keeps system messages, and aborts when the
   * candidate tail has no user query instead of truncating further.
   * @returns {number}
   */
  #nativeToolTokenBudget() {
    const limit = OllamaAILLM.promptWindowLimit(this.model);
    const reserve = Math.min(1024, Math.floor(limit / 4));
    return Math.max(256, limit - reserve);
  }

  /**
   * @param {Array} messages
   * @param {Array} tools
   * @returns {number}
   */
  #estimateNativeToolTokens(messages, tools) {
    const text = `${messages.map((message) => JSON.stringify(message)).join("\n")}\n${
      tools?.length ? JSON.stringify(tools) : ""
    }`;
    try {
      const count = new TokenManager(this.model).countFromString(text);
      if (count > 0) return count;
    } catch {}
    return Math.ceil(text.length / 4);
  }

  /**
   * Drop the oldest tool turns until the transcript fits, always keeping the
   * user query and the newest tool result. Clip that result if it alone is
   * larger than the window.
   * @param {Array} messages
   * @param {Array} tools
   * @returns {Array}
   */
  #fitNativeToolMessages(messages, tools) {
    const budget = this.#nativeToolTokenBudget();
    if (this.#estimateNativeToolTokens(messages, tools) <= budget)
      return messages;

    const pinned = new Set();
    let userIndex = -1;
    messages.forEach((message, index) => {
      if (message.role === "system") pinned.add(index);
      if (this.#isNativeUserQuery(message)) userIndex = index;
    });
    if (userIndex !== -1) pinned.add(userIndex);

    for (let index = messages.length - 1; index >= 0; index--) {
      if (messages[index].role !== "tool") continue;
      pinned.add(index);
      if (messages[index - 1]?.role === "assistant") pinned.add(index - 1);
      break;
    }

    const dropped = new Set();
    const kept = () => messages.filter((_, index) => !dropped.has(index));
    for (let index = 0; index < messages.length; index++) {
      if (this.#estimateNativeToolTokens(kept(), tools) <= budget) break;
      if (pinned.has(index) || dropped.has(index)) continue;
      dropped.add(index);
      const next = messages[index + 1];
      if (
        messages[index].role === "assistant" &&
        next?.role === "tool" &&
        !pinned.has(index + 1)
      )
        dropped.add(index + 1);
    }

    let fitted = kept();
    let guard = 0;
    while (
      this.#estimateNativeToolTokens(fitted, tools) > budget &&
      guard < 8
    ) {
      guard += 1;
      const toolIndex = fitted.findIndex(
        (message) =>
          message.role === "tool" &&
          typeof message.content === "string" &&
          message.content.length > 400
      );
      if (toolIndex === -1) break;
      const content = fitted[toolIndex].content;
      fitted = fitted.slice();
      fitted[toolIndex] = {
        ...fitted[toolIndex],
        content: `${content.slice(0, Math.max(200, Math.floor(content.length / 2)))}\n...[truncated]`,
      };
    }

    if (fitted.length !== messages.length)
      this.providerLog(
        "Dropped older Ollama tool turns so the user prompt stays inside the context window."
      );
    return fitted;
  }

  /**
   * @param {Array} messages
   * @param {Array} functions
   * @returns {{messages: Array, tools: Array}}
   */
  #prepareNativeToolMessages(messages, functions) {
    const tools = formatFunctionsToTools(functions);
    const formatted = this.#withNativeUserPrompt(
      this.#formatMessagesForOllamaTools(messages)
    );
    return {
      tools,
      messages: this.#fitNativeToolMessages(formatted, tools),
    };
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
    this.watchTokenLimit(stream);

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

    const call = this.parseFuncCall(textResponse);
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
    messages = OllamaAILLM.stripHistoryReasoning(messages);
    const useNative = await this.supportsNativeToolCalling();

    if (useNative) {
      this.providerLog(
        "OllamaProvider.stream (tooled) - will process this chat completion."
      );
      this.resetUsage();
      await OllamaAILLM.contextWindows.ensure(this.model);
      const msgUUID = v4();
      const { messages: formattedMessages, tools } =
        this.#prepareNativeToolMessages(messages, functions);

      const stream = await this.client.chat({
        model: this.model,
        keep_alive: this.keepAlive,
        messages: formattedMessages,
        ...(tools.length > 0 ? { tools } : {}),
        stream: true,
        ...this.reasoningConfig,
        options: this.queryOptions,
      });
      this.watchTokenLimit(stream);

      let textResponse = "";
      let reasoningText = "";
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

        if (chunk.message.thinking) {
          eventHandler?.("reportStreamEvent", {
            type: "textResponseChunk",
            uuid: msgUUID,
            content:
              reasoningText.length === 0
                ? `<think>${chunk.message.thinking}`
                : chunk.message.thinking,
          });
          reasoningText += chunk.message.thinking;
        }

        if (chunk.message.content) {
          if (reasoningText.length > 0 && !textResponse) {
            eventHandler?.("reportStreamEvent", {
              type: "textResponseChunk",
              uuid: msgUUID,
              content: "</think>",
            });
          }
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

      if (reasoningText.length > 0 && !textResponse) {
        eventHandler?.("reportStreamEvent", {
          type: "textResponseChunk",
          uuid: msgUUID,
          content: "</think>",
        });
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

      if (reasoningText.trim().length > 0)
        textResponse = `<think>${reasoningText}</think>${textResponse}`;
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
        this.watchTokenLimit(stream);

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
    messages = OllamaAILLM.stripHistoryReasoning(messages);
    const useNative = await this.supportsNativeToolCalling();

    if (useNative) {
      this.resetUsage();
      await OllamaAILLM.contextWindows.ensure(this.model);
      const { messages: formattedMessages, tools } =
        this.#prepareNativeToolMessages(messages, functions);

      const response = await this.client.chat({
        model: this.model,
        keep_alive: this.keepAlive,
        messages: formattedMessages,
        ...(tools.length > 0 ? { tools } : {}),
        ...this.reasoningConfig,
        options: this.queryOptions,
      });
      this.watchTokenLimit(response);

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

      const content = response.message?.content || "";
      const reasoning = response.message?.thinking || "";
      return {
        textResponse:
          (reasoning.trim().length > 0
            ? `<think>${reasoning}</think>${content}`
            : content) || null,
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

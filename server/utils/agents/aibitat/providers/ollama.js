const Provider = require("./ai-provider.js");
const InheritMultiple = require("./helpers/classes.js");
const UnTooled = require("./helpers/untooled.js");
const { OllamaAILLM } = require("../../../AiProviders/ollama");
const { Ollama } = require("ollama");
const { v4 } = require("uuid");
const { safeJsonParse } = require("../../../http");

/**
 * The agent provider for the Ollama provider.
 */
class OllamaProvider extends InheritMultiple([Provider, UnTooled]) {
  model;

  constructor(config = {}) {
    const {
      // options = {},
      model = null,
    } = config;

    super();
    const headers = process.env.OLLAMA_AUTH_TOKEN
      ? { Authorization: `Bearer ${process.env.OLLAMA_AUTH_TOKEN}` }
      : {};
    this._client = new Ollama({
      host: process.env.OLLAMA_BASE_PATH,
      headers: headers,
    });
    this.model = model;
    this.verbose = true;
  }

  get client() {
    return this._client;
  }

  get supportsAgentStreaming() {
    return true;
  }

  get performanceMode() {
    return process.env.OLLAMA_PERFORMANCE_MODE || "base";
  }

  get queryOptions() {
    return {
      ...(this.performanceMode === "base"
        ? {}
        : { num_ctx: OllamaAILLM.promptWindowLimit(this.model) }),
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
   * Stream a chat completion from the LLM with tool calling
   * This is overriding the inherited `stream` method since Ollamas
   * SDK has different response structures to other OpenAI.
   *
   * @param messages A list of messages to send to the API.
   * @param functions
   * @param eventHandler
   * @returns The completion.
   */
  async stream(messages, functions = [], eventHandler = null) {
    this.providerLog(
      "OllamaProvider.complete - will process this chat completion."
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

      // The UnTooled class inherited Deduplicator is mostly useful to prevent the agent
      // from calling the exact same function over and over in a loop within a single chat exchange
      // _but_ we should enable it to call previously used tools in a new chat interaction.
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
   * Create a completion based on the received messages.
   *
   * @param messages A list of messages to send to the API.
   * @param functions
   * @returns The completion.
   */
  async complete(messages, functions = []) {
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

      // The UnTooled class inherited Deduplicator is mostly useful to prevent the agent
      // from calling the exact same function over and over in a loop within a single chat exchange
      // _but_ we should enable it to call previously used tools in a new chat interaction.
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
   *
   * @param _usage The completion to get the cost for.
   * @returns The cost of the completion.
   * Stubbed since LMStudio has no cost basis.
   */
  getCost(_usage) {
    return 0;
  }
}

module.exports = OllamaProvider;

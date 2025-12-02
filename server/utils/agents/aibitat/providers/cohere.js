const { CohereClient } = require("cohere-ai");
const Provider = require("./ai-provider");
const InheritMultiple = require("./helpers/classes");
const UnTooled = require("./helpers/untooled");
const { v4 } = require("uuid");
const { safeJsonParse } = require("../../../http");

class CohereProvider extends InheritMultiple([Provider, UnTooled]) {
  model;

  constructor(config = {}) {
    const { model = process.env.COHERE_MODEL_PREF || "command-r" } = config;
    super();
    const client = new CohereClient({
      token: process.env.COHERE_API_KEY,
    });
    this._client = client;
    this.model = model;
    this.verbose = true;
  }

  get client() {
    return this._client;
  }

  get supportsAgentStreaming() {
    return true;
  }

  #convertChatHistoryCohere(chatHistory = []) {
    let cohereHistory = [];
    chatHistory.forEach((message) => {
      switch (message.role) {
        case "system":
          cohereHistory.push({ role: "SYSTEM", message: message.content });
          break;
        case "user":
          cohereHistory.push({ role: "USER", message: message.content });
          break;
        case "assistant":
          cohereHistory.push({ role: "CHATBOT", message: message.content });
          break;
      }
    });

    return cohereHistory;
  }

  async #handleFunctionCallChat({ messages = [] }) {
    const message = messages[messages.length - 1]?.content || "";
    const cohereHistory = this.#convertChatHistoryCohere(messages.slice(0, -1));
    const result = await this.client.chat({
      model: this.model,
      message: message,
      chatHistory: cohereHistory,
    });
    if (!result.text) {
      throw new Error("Cohere returned empty response");
    }
    return result.text;
  }

  async #handleFunctionCallStream({ messages = [] }) {
    const message = messages[messages.length - 1]?.content || "";
    const cohereHistory = this.#convertChatHistoryCohere(messages.slice(0, -1));
    return await this.client.chatStream({
      model: this.model,
      message: message,
      chatHistory: cohereHistory,
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
    if (history[history.length - 1]?.role !== "user") return null;

    const msgUUID = v4();
    let textResponse = "";
    const historyMessages = this.buildToolCallMessages(history, functions);
    const stream = await chatCb({ messages: historyMessages });

    eventHandler?.("reportStreamEvent", {
      type: "statusResponse",
      uuid: v4(),
      content: "Agent is thinking...",
    });

    for await (const event of stream) {
      if (event.eventType === "text-generation") {
        textResponse += event.text;
      }
    }

    const call = safeJsonParse(textResponse, null);
    if (call === null)
      return { toolCall: null, text: textResponse, uuid: msgUUID };

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

    if (this.deduplicator.isDuplicate(call.name, call.arguments)) {
      this.providerLog(
        `Function tool with exact arguments has already been called this stack.`
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
   * Stream a chat completion from the LLM with tool calling.
   * Overrides the inherited stream method to handle
   * the Cohere SDK format
   *
   * @param messages - The messages to send to the LLM.
   * @param functions - The functions to use in the LLM.
   * @param eventHandler - The event handler to use to report stream events.
   * @returns The completion.
   */
  async stream(messages, functions = [], eventHandler = null) {
    this.providerLog(
      "CohereProvider.stream - will process this chat completion."
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
        const stream = await this.#handleFunctionCallStream({
          messages: this.cleanMsgs(messages),
        });

        for await (const event of stream) {
          if (event.eventType === "text-generation") {
            completion.content += event.text;
            eventHandler?.("reportStreamEvent", {
              type: "textResponseChunk",
              uuid: msgUUID,
              content: event.text,
            });
          }
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
   * Create a completion based on the received messages.
   * Overrides the inherited complete method to handle 
   * the Cohere SDK format
   *
   * @param messages - A list of messages to send to the API.
   * @param functions - The functions available for tool calling.
   * @returns The completion.
   */
  async complete(messages, functions = []) {
    this.providerLog(
      "CohereProvider.complete - will process this chat completion."
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
        completion.content = text;
      }

      if (!completion?.content) {
        this.providerLog(
          "Will assume chat completion without tool call inputs."
        );
        const response = await this.#handleFunctionCallChat({
          messages: this.cleanMsgs(messages),
        });
        completion = { content: response };
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

  getCost(_usage) {
    return 0;
  }
}

module.exports = CohereProvider;

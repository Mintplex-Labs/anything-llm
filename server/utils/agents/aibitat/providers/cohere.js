const { CohereClient } = require("cohere-ai");
const Provider = require("./ai-provider");
const InheritMultiple = require("./helpers/classes");
const UnTooled = require("./helpers/untooled");
const { v4 } = require("uuid");
const { safeJsonParse } = require("../../../http");

class CohereProvider extends InheritMultiple([Provider, UnTooled]) {
  model;

  constructor(config = {}) {
    const { model = process.env.COHERE_MODEL_PREF || "command-r-08-2024" } =
      config;
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
        case "SYSTEM":
        case "system":
          cohereHistory.push({ role: "SYSTEM", message: message.content });
          break;
        case "USER":
        case "user":
          cohereHistory.push({ role: "USER", message: message.content });
          break;
        case "CHATBOT":
        case "assistant":
          cohereHistory.push({ role: "CHATBOT", message: message.content });
          break;
      }
    });

    return cohereHistory;
  }

  async #handleFunctionCallStream({ messages = [] }) {
    const userPrompt = messages[messages.length - 1]?.content || "";
    const history = messages.slice(0, -1);
    return await this.client.chatStream({
      model: this.model,
      chatHistory: this.#convertChatHistoryCohere(history),
      message: userPrompt,
    });
  }

  async stream(messages, functions = [], eventHandler = null) {
    return await UnTooled.prototype.stream.call(
      this,
      messages,
      functions,
      this.#handleFunctionCallStream.bind(this),
      eventHandler
    );
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
      if (event.eventType !== "text-generation") continue;
      textResponse += event.text;
      eventHandler?.("reportStreamEvent", {
        type: "statusResponse",
        uuid: msgUUID,
        content: event.text,
      });
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
   * Override the inherited `stream` method since Cohere uses a different API format.
   *
   * @param {any[]} messages - The messages to send to the LLM.
   * @param {any[]} functions - The functions to use in the LLM.
   * @param {function} eventHandler - The event handler to use to report stream events.
   * @returns {Promise<{ functionCall: any, textResponse: string }>} - The result of the chat completion.
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
        const stream = await this.#handleFunctionCallStream({
          messages: this.cleanMsgs(messages),
        });

        for await (const chunk of stream) {
          if (chunk.eventType !== "text-generation") continue;
          completion.content += chunk.text;
          eventHandler?.("reportStreamEvent", {
            type: "textResponseChunk",
            uuid: msgUUID,
            content: chunk.text,
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

  getCost(_usage) {
    return 0;
  }
}

module.exports = CohereProvider;

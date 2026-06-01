const { CohereClientV2 } = require("cohere-ai");
const Provider = require("./ai-provider");
const InheritMultiple = require("./helpers/classes");
const UnTooled = require("./helpers/untooled");
const { v4 } = require("uuid");
const { safeJsonParse } = require("../../../http");

/**
 * The agent provider for the Cohere AI provider.
 * Uses the v2 API which supports OpenAI-compatible message format and vision.
 */
class CohereProvider extends InheritMultiple([Provider, UnTooled]) {
  model;

  constructor(config = {}) {
    const { model = process.env.COHERE_MODEL_PREF || "command-r-08-2024" } =
      config;
    super();
    const client = new CohereClientV2({
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

  /**
   * Whether this provider supports native OpenAI-compatible tool calling.
   * Override in subclass and return true to use native tool calling instead of UnTooled.
   * @returns {boolean|Promise<boolean>}
   */
  supportsNativeToolCalling() {
    return false;
  }

  /**
   * Format a message with attachments for Cohere's v2 API.
   * Cohere SDK uses camelCase (imageUrl) instead of snake_case (image_url).
   * @param {Object} message - Message with potential attachments
   * @returns {Object} Formatted message for Cohere SDK
   */
  formatMessageWithAttachments(message) {
    if (!message.attachments || message.attachments.length === 0) {
      return message;
    }

    const content = [{ type: "text", text: message.content }];
    for (const attachment of message.attachments) {
      content.push({
        type: "image_url",
        imageUrl: {
          url: attachment.contentString,
        },
      });
    }

    const { attachments: _, ...rest } = message;
    return {
      ...rest,
      content,
    };
  }

  /**
   * Stream a chat completion using the Cohere v2 API.
   * The v2 API accepts OpenAI-compatible message format directly,
   * including multimodal content arrays for vision support.
   * @param {Object} options - Options containing messages array
   * @returns {AsyncIterable} Stream of events from Cohere
   */
  async #handleFunctionCallStream({ messages = [] }) {
    return await this.client.chatStream({
      model: this.model,
      messages: messages,
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
      if (event.type !== "content-delta") continue;
      const text = event.delta?.message?.content?.text || "";
      if (!text) continue;
      textResponse += text;
      eventHandler?.("reportStreamEvent", {
        type: "statusResponse",
        uuid: msgUUID,
        content: text,
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
        const stream = await this.#handleFunctionCallStream({
          messages: this.cleanMsgs(messages),
        });

        for await (const chunk of stream) {
          if (chunk.type !== "content-delta") continue;
          const text = chunk.delta?.message?.content?.text || "";
          if (!text) continue;
          completion.content += text;
          eventHandler?.("reportStreamEvent", {
            type: "textResponseChunk",
            uuid: msgUUID,
            content: text,
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

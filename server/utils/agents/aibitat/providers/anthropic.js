const Anthropic = require("@anthropic-ai/sdk");
const { RetryError } = require("../error.js");
const Provider = require("./ai-provider.js");
const { v4 } = require("uuid");
const { safeJsonParse } = require("../../../http");

/**
 * The agent provider for the Anthropic API.
 * By default, the model is set to 'claude-2'.
 */
class AnthropicProvider extends Provider {
  model;

  constructor(config = {}) {
    const {
      options = {
        apiKey: process.env.ANTHROPIC_API_KEY,
        maxRetries: 3,
      },
      model = "claude-3-5-sonnet-20240620",
    } = config;

    const client = new Anthropic(options);

    super(client);
    this.model = model;
  }

  /**
   * Parses the cache control ENV variable
   *
   * If caching is enabled, we can pass less than 1024 tokens and Anthropic will just
   * ignore it unless it is above the model's minimum. Since this feature is opt-in
   * we can safely assume that if caching is enabled that we should just pass the content as is.
   * https://docs.claude.com/en/docs/build-with-claude/prompt-caching#cache-limitations
   *
   * @param {string} value - The ENV value (5m or 1h)
   * @returns {null|{type: "ephemeral", ttl: "5m" | "1h"}} Cache control configuration
   */
  get cacheControl() {
    // Store result in instance variable to avoid recalculating
    if (this._cacheControl) return this._cacheControl;

    if (!process.env.ANTHROPIC_CACHE_CONTROL) this._cacheControl = null;
    else {
      const normalized =
        process.env.ANTHROPIC_CACHE_CONTROL.toLowerCase().trim();
      if (["5m", "1h"].includes(normalized))
        this._cacheControl = { type: "ephemeral", ttl: normalized };
      else this._cacheControl = null;
    }
    return this._cacheControl;
  }

  get supportsAgentStreaming() {
    return true;
  }

  /**
   * Builds system parameter with cache control if applicable
   * @param {string} systemContent - The system prompt content
   * @returns {string|array} System parameter for API call
   */
  #buildSystemPrompt(systemContent) {
    if (!systemContent || !this.cacheControl) return systemContent;
    return [
      {
        type: "text",
        text: systemContent,
        cache_control: this.cacheControl,
      },
    ];
  }

  #prepareMessages(messages = []) {
    // Extract system prompt and filter out any system messages from the main chat.
    let systemPrompt =
      "You are a helpful ai assistant who can assist the user and use tools available to help answer the users prompts and questions.";
    const chatMessages = messages.filter((msg) => {
      if (msg.role === "system") {
        systemPrompt = msg.content;
        return false;
      }
      return true;
    });

    const processedMessages = chatMessages.reduce(
      (processedMessages, message, index) => {
        // Normalize `function` role to Anthropic's `tool_result` format.
        if (message.role === "function") {
          const prevMessage = chatMessages[index - 1];
          if (prevMessage?.role === "assistant") {
            const toolUse = prevMessage.content.find(
              (item) => item.type === "tool_use"
            );
            if (toolUse) {
              processedMessages.push({
                role: "user",
                content: [
                  {
                    type: "tool_result",
                    tool_use_id: toolUse.id,
                    content: message.content
                      ? String(message.content)
                      : "Tool executed successfully.",
                  },
                ],
              });
            }
          }
          return processedMessages;
        }

        // Ensure message content is in array format and filter out empty text blocks.
        let content = Array.isArray(message.content)
          ? message.content
          : [{ type: "text", text: message.content }];
        content = content.filter(
          (item) =>
            item.type !== "text" || (item.text && item.text.trim().length > 0)
        );

        if (content.length === 0) return processedMessages;

        // Add a text block to assistant messages with tool use if one doesn't exist.
        if (
          message.role === "assistant" &&
          content.some((item) => item.type === "tool_use") &&
          !content.some((item) => item.type === "text")
        ) {
          content.unshift({
            type: "text",
            text: "I'll use a tool to help answer this question.",
          });
        }

        const lastMessage = processedMessages[processedMessages.length - 1];
        if (lastMessage && lastMessage.role === message.role) {
          // Merge consecutive messages from the same role.
          lastMessage.content.push(...content);
        } else {
          processedMessages.push({ ...message, content });
        }

        return processedMessages;
      },
      []
    );

    // The first message must be from the user.
    if (processedMessages.length > 0 && processedMessages[0].role !== "user") {
      processedMessages.shift();
    }

    return [systemPrompt, processedMessages];
  }

  // Anthropic does not use the regular schema for functions so here we need to ensure it is in there specific format
  // so that the call can run correctly.
  #formatFunctions(functions = []) {
    return functions.map((func) => {
      const { name, description, parameters, required } = func;
      const { type, properties } = parameters;
      return {
        name,
        description,
        input_schema: {
          type,
          properties,
          required,
        },
      };
    });
  }

  /**
   * Stream a chat completion from the LLM with tool calling
   * Note: This using the Anthropic API SDK and its implementation is specific to Anthropic.
   *
   * @param {any[]} messages - The messages to send to the LLM.
   * @param {any[]} functions - The functions to use in the LLM.
   * @param {function} eventHandler - The event handler to use to report stream events.
   * @returns {Promise<{ functionCall: any, textResponse: string }>} - The result of the chat completion.
   */
  async stream(messages, functions = [], eventHandler = null) {
    try {
      const msgUUID = v4();
      const [systemPrompt, chats] = this.#prepareMessages(messages);
      const response = await this.client.messages.create(
        {
          model: this.model,
          max_tokens: 4096,
          system: this.#buildSystemPrompt(systemPrompt),
          messages: chats,
          stream: true,
          ...(Array.isArray(functions) && functions?.length > 0
            ? { tools: this.#formatFunctions(functions) }
            : {}),
        },
        { headers: { "anthropic-beta": "tools-2024-04-04" } } // Required to we can use tools.
      );

      const result = {
        functionCall: null,
        textResponse: "",
      };

      for await (const chunk of response) {
        if (chunk.type === "content_block_start") {
          if (chunk.content_block.type === "text") {
            result.textResponse += chunk.content_block.text;
            eventHandler?.("reportStreamEvent", {
              type: "textResponseChunk",
              uuid: msgUUID,
              content: chunk.content_block.text,
            });
          }

          if (chunk.content_block.type === "tool_use") {
            result.functionCall = {
              id: chunk.content_block.id,
              name: chunk.content_block.name,
              // The initial arguments are empty {} (object) so we need to set it to an empty string.
              // It is unclear if this is ALWAYS empty on the tool_use block or if it can possible be populated.
              // This is a workaround to ensure the tool call is valid.
              arguments: "",
            };
            eventHandler?.("reportStreamEvent", {
              type: "toolCallInvocation",
              uuid: `${msgUUID}:tool_call_invocation`,
              content: `Assembling Tool Call: ${result.functionCall.name}(${result.functionCall.arguments})`,
            });
          }
        }

        if (chunk.type === "content_block_delta") {
          if (chunk.delta.type === "text_delta") {
            result.textResponse += chunk.delta.text;
            eventHandler?.("reportStreamEvent", {
              type: "textResponseChunk",
              uuid: msgUUID,
              content: chunk.delta.text,
            });
          }

          if (chunk.delta.type === "input_json_delta") {
            result.functionCall.arguments += chunk.delta.partial_json;
            eventHandler?.("reportStreamEvent", {
              type: "toolCallInvocation",
              uuid: `${msgUUID}:tool_call_invocation`,
              content: `Assembling Tool Call: ${result.functionCall.name}(${result.functionCall.arguments})`,
            });
          }
        }
      }

      if (result.functionCall) {
        result.functionCall.arguments = safeJsonParse(
          result.functionCall.arguments,
          {}
        );
        messages.push({
          role: "assistant",
          content: [
            { type: "text", text: result.textResponse },
            {
              type: "tool_use",
              id: result.functionCall.id,
              name: result.functionCall.name,
              input: result.functionCall.arguments,
            },
          ],
        });
        return {
          textResponse: result.textResponse,
          functionCall: {
            name: result.functionCall.name,
            arguments: result.functionCall.arguments,
          },
          cost: 0,
        };
      }

      return {
        textResponse: result.textResponse,
        functionCall: null,
        cost: 0,
      };
    } catch (error) {
      // If invalid Auth error we need to abort because no amount of waiting
      // will make auth better.
      if (error instanceof Anthropic.AuthenticationError) throw error;

      if (
        error instanceof Anthropic.RateLimitError ||
        error instanceof Anthropic.InternalServerError ||
        error instanceof Anthropic.APIError // Also will catch AuthenticationError!!!
      ) {
        throw new RetryError(error.message);
      }

      throw error;
    }
  }

  /**
   * Create a completion based on the received messages.
   *
   * @param messages A list of messages to send to the Anthropic API.
   * @param functions
   * @returns The completion.
   */
  async complete(messages, functions = []) {
    try {
      const [systemPrompt, chats] = this.#prepareMessages(messages);
      const response = await this.client.messages.create(
        {
          model: this.model,
          max_tokens: 4096,
          system: this.#buildSystemPrompt(systemPrompt),
          messages: chats,
          stream: false,
          ...(Array.isArray(functions) && functions?.length > 0
            ? { tools: this.#formatFunctions(functions) }
            : {}),
        },
        { headers: { "anthropic-beta": "tools-2024-04-04" } } // Required to we can use tools.
      );

      // We know that we need to call a tool. So we are about to recurse through completions/handleExecution
      // https://docs.anthropic.com/claude/docs/tool-use#how-tool-use-works
      if (response.stop_reason === "tool_use") {
        // Get the tool call explicitly.
        const toolCall = response.content.find(
          (res) => res.type === "tool_use"
        );

        // Here we need the chain of thought the model may or may not have generated alongside the call.
        // this needs to be in a very specific format so we always ensure there is a 2-item content array
        // so that we can ensure the tool_call content is correct. For anthropic all text items must not
        // be empty, but the api will still return empty text so we need to make 100% sure text is not empty
        // or the tool call will fail.
        // wtf.
        let thought = response.content.find((res) => res.type === "text");
        thought =
          thought?.content?.length > 0
            ? {
                role: thought.role,
                content: [
                  { type: "text", text: thought.content },
                  { ...toolCall },
                ],
              }
            : {
                role: "assistant",
                content: [
                  {
                    type: "text",
                    text: `Okay, im going to use ${toolCall.name} to help me.`,
                  },
                  { ...toolCall },
                ],
              };

        // Modify messages forcefully by adding system thought so that tool_use/tool_result
        // messaging works with Anthropic's disastrous tool calling API.
        messages.push(thought);

        const functionArgs = toolCall.input;
        return {
          result: null,
          functionCall: {
            name: toolCall.name,
            arguments: functionArgs,
          },
          cost: 0,
        };
      }

      const completion = response.content.find((msg) => msg.type === "text");
      return {
        textResponse:
          completion?.text ??
          "The model failed to complete the task and return back a valid response.",
        cost: 0,
      };
    } catch (error) {
      // If invalid Auth error we need to abort because no amount of waiting
      // will make auth better.
      if (error instanceof Anthropic.AuthenticationError) throw error;

      if (
        error instanceof Anthropic.RateLimitError ||
        error instanceof Anthropic.InternalServerError ||
        error instanceof Anthropic.APIError // Also will catch AuthenticationError!!!
      ) {
        throw new RetryError(error.message);
      }

      throw error;
    }
  }
}

module.exports = AnthropicProvider;

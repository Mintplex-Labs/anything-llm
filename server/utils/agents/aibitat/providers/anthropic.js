const Anthropic = require("@anthropic-ai/sdk");
const { RetryError } = require("../error.js");
const Provider = require("./ai-provider.js");

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
      model = "claude-2",
    } = config;

    const client = new Anthropic(options);

    super(client);

    this.model = model;
  }

  // For Anthropic we will always need to ensure the message sequence is role,content
  // as we can attach any data to message nodes and this keeps the message property
  // sent to the API always in spec.
  #sanitize(chats) {
    const sanitized = [...chats];

    // If the first message is not a USER, Anthropic will abort so keep shifting the
    // message array until that is the case.
    while (sanitized.length > 0 && sanitized[0].role !== "user")
      sanitized.shift();

    return sanitized.map((msg) => {
      const { role, content } = msg;
      return { role, content };
    });
  }

  #normalizeChats(messages = []) {
    if (!messages.length) return messages;
    const normalized = [];

    [...messages].forEach((msg, i) => {
      if (msg.role !== "function") return normalized.push(msg);

      // If the last message is a role "function" this is our special aibitat message node.
      // and we need to remove it from the array of messages.
      // Since Anthropic needs to have the tool call resolved, we look at the previous chat to "function"
      // and go through its content "thought" from ~ln:143 and get the tool_call id so we can resolve
      // this tool call properly.
      const functionCompletion = msg;
      const toolCallId = messages[i - 1]?.content?.find(
        (msg) => msg.type === "tool_use"
      )?.id;

      // Append the Anthropic acceptable node to the message chain so function can resolve.
      normalized.push({
        role: "user",
        content: [
          {
            type: "tool_result",
            tool_use_id: toolCallId,
            content: functionCompletion.content,
          },
        ],
      });
    });
    return normalized;
  }

  // Anthropic handles system message as a property, so here we split the system message prompt
  // from all the chats and then normalize them so they will be useable in case of tool_calls or general chat.
  #parseSystemPrompt(messages = []) {
    const chats = [];
    let systemPrompt =
      "You are a helpful ai assistant who can assist the user and use tools available to help answer the users prompts and questions.";
    for (const msg of messages) {
      if (msg.role === "system") {
        systemPrompt = msg.content;
        continue;
      }
      chats.push(msg);
    }

    return [systemPrompt, this.#normalizeChats(chats)];
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
   * Create a completion based on the received messages.
   *
   * @param messages A list of messages to send to the Anthropic API.
   * @param functions
   * @returns The completion.
   */
  async complete(messages, functions = null) {
    try {
      const [systemPrompt, chats] = this.#parseSystemPrompt(messages);
      const response = await this.client.messages.create(
        {
          model: this.model,
          max_tokens: 4096,
          system: systemPrompt,
          messages: this.#sanitize(chats),
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
        result:
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

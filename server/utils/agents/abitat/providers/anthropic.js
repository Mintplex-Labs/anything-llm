const Anthropic = require("@anthropic-ai/sdk");
const { RetryError } = require("../error.js");
const Provider = require("./ai-provider.js");

/**
 * The provider for the Anthropic API.
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

  /**
   * Create a completion based on the received messages.
   *
   * @param messages A list of messages to send to the Anthropic API.
   * @param functions
   * @returns The completion.
   */
  async complete(messages, functions) {
    // clone messages to avoid mutating the original array
    const promptMessages = [...messages];

    if (functions) {
      const functionPrompt = this.getFunctionPrompt(functions);

      // add function prompt after the first message
      promptMessages.splice(1, 0, {
        content: functionPrompt,
        role: "system",
      });
    }

    const prompt = promptMessages
      .map((message) => {
        const { content, role } = message;

        switch (role) {
          case "system":
            return content
              ? `${Anthropic.HUMAN_PROMPT} <admin>${content}</admin>`
              : "";

          case "function":
          case "user":
            return `${Anthropic.HUMAN_PROMPT} ${content}`;

          case "assistant":
            return `${Anthropic.AI_PROMPT} ${content}`;

          default:
            return content;
        }
      })
      .filter(Boolean)
      .join("\n")
      .concat(` ${Anthropic.AI_PROMPT}`);

    try {
      const response = await this.client.completions.create({
        model: this.model,
        max_tokens_to_sample: 3000,
        stream: false,
        prompt,
      });

      const result = response.completion.trim();
      // TODO: get cost from response
      const cost = 0;

      // Handle function calls if the model returns a function call
      if (result.includes("function_name") && functions) {
        let functionCall;
        try {
          functionCall = JSON.parse(result);
        } catch (error) {
          // call the complete function again in case it gets a json error
          return await this.complete(
            [
              ...messages,
              {
                role: "function",
                content: `You gave me this function call: ${result} but I couldn't parse it.
                ${error?.message}
                
                Please try again.`,
              },
            ],
            functions
          );
        }

        return {
          result: null,
          functionCall,
          cost,
        };
      }

      return {
        result,
        cost,
      };
    } catch (error) {
      if (
        error instanceof Anthropic.RateLimitError ||
        error instanceof Anthropic.InternalServerError ||
        error instanceof Anthropic.APIError
      ) {
        throw new RetryError(error.message);
      }

      throw error;
    }
  }

  getFunctionPrompt(functions = []) {
    const functionPrompt = `<functions>You have been trained to directly call a Javascript function passing a JSON Schema parameter as a response to this chat. This function will return a string that you can use to keep chatting.
  
  Here is a list of functions available to you:
  ${JSON.stringify(functions, null, 2)}
  
  When calling any of those function in order to complete your task, respond only this JSON format. Do not include any other information or any other stuff.
  
  Function call format:
  {
     function_name: "givenfunctionname",
     parameters: {}
  }
  </functions>`;

    return functionPrompt;
  }
}

module.exports = AnthropicProvider;

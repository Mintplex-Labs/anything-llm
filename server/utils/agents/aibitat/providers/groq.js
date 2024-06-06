const OpenAI = require("openai");
const Provider = require("./ai-provider.js");
const { RetryError } = require("../error.js");

/**
 * The agent provider for the Groq provider.
 * Using OpenAI tool calling with groq really sucks right now
 * its just fast and bad. We should probably migrate this to Untooled to improve
 * coherence.
 */
class GroqProvider extends Provider {
  model;

  constructor(config = {}) {
    const { model = "llama3-8b-8192" } = config;
    const client = new OpenAI({
      baseURL: "https://api.groq.com/openai/v1",
      apiKey: process.env.GROQ_API_KEY,
      maxRetries: 3,
    });
    super(client);
    this.model = model;
    this.verbose = true;
  }

  /**
   * Create a completion based on the received messages.
   *
   * @param messages A list of messages to send to the API.
   * @param functions
   * @returns The completion.
   */
  async complete(messages, functions = null) {
    try {
      const response = await this.client.chat.completions.create({
        model: this.model,
        // stream: true,
        messages,
        ...(Array.isArray(functions) && functions?.length > 0
          ? { functions }
          : {}),
      });

      // Right now, we only support one completion,
      // so we just take the first one in the list
      const completion = response.choices[0].message;
      const cost = this.getCost(response.usage);
      // treat function calls
      if (completion.function_call) {
        let functionArgs = {};
        try {
          functionArgs = JSON.parse(completion.function_call.arguments);
        } catch (error) {
          // call the complete function again in case it gets a json error
          return this.complete(
            [
              ...messages,
              {
                role: "function",
                name: completion.function_call.name,
                function_call: completion.function_call,
                content: error?.message,
              },
            ],
            functions
          );
        }

        // console.log(completion, { functionArgs })
        return {
          result: null,
          functionCall: {
            name: completion.function_call.name,
            arguments: functionArgs,
          },
          cost,
        };
      }

      return {
        result: completion.content,
        cost,
      };
    } catch (error) {
      // If invalid Auth error we need to abort because no amount of waiting
      // will make auth better.
      if (error instanceof OpenAI.AuthenticationError) throw error;

      if (
        error instanceof OpenAI.RateLimitError ||
        error instanceof OpenAI.InternalServerError ||
        error instanceof OpenAI.APIError // Also will catch AuthenticationError!!!
      ) {
        throw new RetryError(error.message);
      }

      throw error;
    }
  }

  /**
   * Get the cost of the completion.
   *
   * @param _usage The completion to get the cost for.
   * @returns The cost of the completion.
   * Stubbed since Groq has no cost basis.
   */
  getCost(_usage) {
    return 0;
  }
}

module.exports = GroqProvider;

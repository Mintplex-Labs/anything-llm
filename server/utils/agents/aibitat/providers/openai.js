const OpenAI = require("openai");
const Provider = require("./ai-provider.js");
const { RetryError } = require("../error.js");

/**
 * The agent provider for the OpenAI API.
 * By default, the model is set to 'gpt-3.5-turbo'.
 */
class OpenAIProvider extends Provider {
  model;
  static COST_PER_TOKEN = {
    "gpt-3.5-turbo": {
      input: 0.0015,
      output: 0.002,
    },
    "gpt-3.5-turbo-16k": {
      input: 0.003,
      output: 0.004,
    },
    "gpt-4": {
      input: 0.03,
      output: 0.06,
    },
    "gpt-4-turbo": {
      input: 0.01,
      output: 0.03,
    },
    "gpt-4o": {
      input: 0.005,
      output: 0.015,
    },
    "gpt-4-32k": {
      input: 0.06,
      output: 0.12,
    },
    "gpt-4o-mini": {
      input: 0.00015,
      output: 0.0006,
    },
  };

  constructor(config = {}) {
    const {
      options = {
        apiKey: process.env.OPEN_AI_KEY,
        maxRetries: 3,
      },
      model = "gpt-4o",
    } = config;

    const client = new OpenAI(options);

    super(client);

    this.model = model;
  }

  /**
   * Create a completion based on the received messages.
   *
   * @param messages A list of messages to send to the OpenAI API.
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
   * @param usage The completion to get the cost for.
   * @returns The cost of the completion.
   */
  getCost(usage) {
    if (!usage) {
      return Number.NaN;
    }

    // regex to remove the version number from the model
    const modelBase = this.model.replace(/-(\d{4})$/, "");

    if (!(modelBase in OpenAIProvider.COST_PER_TOKEN)) {
      return Number.NaN;
    }

    const costPerToken = OpenAIProvider.COST_PER_TOKEN?.[modelBase];
    const inputCost = (usage.prompt_tokens / 1000) * costPerToken.input;
    const outputCost = (usage.completion_tokens / 1000) * costPerToken.output;

    return inputCost + outputCost;
  }
}

module.exports = OpenAIProvider;

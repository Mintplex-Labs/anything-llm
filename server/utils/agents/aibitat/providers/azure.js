const { AzureOpenAI } = require("openai");
const Provider = require("./ai-provider.js");
const { RetryError } = require("../error.js");

/**
 * The agent provider for the Azure OpenAI API.
 */
class AzureOpenAiProvider extends Provider {
  model;

  constructor(config = { model: null }) {
    const client = new AzureOpenAI({
      apiKey: process.env.AZURE_OPENAI_KEY,
      endpoint: process.env.AZURE_OPENAI_ENDPOINT,
      apiVersion: "2024-12-01-preview",
    });
    super(client);
    this.model = config.model ?? process.env.OPEN_MODEL_PREF;
    this.verbose = true;
  }

  get supportsAgentStreaming() {
    return true;
  }

  /**
   * Create a completion based on the received messages.
   *
   * @param messages A list of messages to send to the OpenAI API.
   * @param functions
   * @returns The completion.
   */
  async complete(messages, functions = []) {
    try {
      const response = await this.client.chat.completions.create({
        model: this.model,
        stream: false,
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
          textResponse: null,
          functionCall: {
            name: completion.function_call.name,
            arguments: functionArgs,
          },
          cost,
        };
      }

      return {
        textResponse: completion.content,
        cost,
      };
    } catch (error) {
      // If invalid Auth error we need to abort because no amount of waiting
      // will make auth better.
      if (error instanceof AzureOpenAI.AuthenticationError) throw error;

      if (
        error instanceof AzureOpenAI.RateLimitError ||
        error instanceof AzureOpenAI.InternalServerError ||
        error instanceof AzureOpenAI.APIError // Also will catch AuthenticationError!!!
      ) {
        throw new RetryError(error.message);
      }

      throw error;
    }
  }

  /**
   * Get the cost of the completion.
   * Stubbed since Azure OpenAI has no public cost basis.
   *
   * @param _usage The completion to get the cost for.
   * @returns The cost of the completion.
   */
  getCost(_usage) {
    return 0;
  }
}

module.exports = AzureOpenAiProvider;

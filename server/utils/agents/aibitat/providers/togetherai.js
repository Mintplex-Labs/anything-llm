const OpenAI = require("openai");
const Provider = require("./ai-provider.js");
const { RetryError } = require("../error.js");

/**
 * The provider for the TogetherAI provider.
 */
class TogetherAIProvider extends Provider {
  model;

  constructor(_config = {}) {
    const model =
      process.env.TOGETHER_AI_MODEL_PREF ||
      "mistralai/Mistral-7B-Instruct-v0.1";
    const client = new OpenAI({
      baseURL: "https://api.together.xyz/v1",
      apiKey: process.env.TOGETHER_AI_API_KEY,
      maxRetries: 3,
      model,
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

  // TODO: Fix function calling for TogetherAI
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

      //   console.log("OUTPUT");
      //   console.log(response.choices[0].message);
      //   console.log(response.choices[0].message.tool_calls[0].function);

      // Right now, we only support one completion,
      // so we just take the first one in the list
      const completion = response.choices[0].content || "";
      const cost = this.getCost(response.usage);
      // treat function calls
      if (completion.function_call) {
        let functionArgs = {};
        try {
          functionArgs = JSON.parse(
            completion.tool_calls[0].function.arguments
          );
        } catch (error) {
          // call the complete function again in case it gets a json error
          return this.complete(
            [
              ...messages,
              {
                role: "function",
                name: completion.tool_calls[0].function.name,
                function_call: completion.tool_calls[0].function,
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
            name: completion.tool_calls[0].function.name,
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
      console.log({ error });
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
   * Stubbed since TogetherAI has no cost basis.
   */
  getCost(_usage) {
    return 0;
  }

  /**
   * Test if model supports function calling
   * @param model
   * @returns {boolean}
   *
   */

  supportsOpenAIFunctionCalling(model) {
    const supportedModels = [
      "mistralai/Mistral-7B-Instruct-v0.1",
      "mistralai/Mixtral-8x7B-Instruct-v0.1",
      "togethercomputer/CodeLlama-34b-Instruct",
    ];

    return supportedModels.includes(model);
  }
}

module.exports = TogetherAIProvider;

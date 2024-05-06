const { OpenAIClient, AzureKeyCredential } = require("@azure/openai");
const Provider = require("./ai-provider.js");
const { RetryError } = require("../error.js");

/**
 * The provider for the Azure OpenAI API.
 * By default, the model is set to 'gpt-3.5-turbo'.
 */
class AzureOpenAiProvider extends Provider {
  model;
  static COST_PER_TOKEN = {
    "gpt-4": {
      input: 0.03,
      output: 0.06,
    },
    "gpt-4-32k": {
      input: 0.06,
      output: 0.12,
    },
    "gpt-3.5-turbo": {
      input: 0.0015,
      output: 0.002,
    },
    "gpt-3.5-turbo-16k": {
      input: 0.003,
      output: 0.004,
    },
  };

  constructor(config = {}) {
    const { model = "gpt-3.5-turbo" } = config;

    if (!process.env.AZURE_OPENAI_ENDPOINT)
      throw new Error("No Azure API endpoint was set.");
    if (!process.env.AZURE_OPENAI_KEY)
      throw new Error("No Azure API key was set.");

    const client = new OpenAIClient(
      process.env.AZURE_OPENAI_ENDPOINT,
      new AzureKeyCredential(process.env.AZURE_OPENAI_KEY)
    );

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
      const response = await this.client.getChatCompletions(
        this.model,
        messages,
        {
          temperature: 0.7,
        }
      );

      const completion = response.choices[0].message;
      const cost = this.getCost(response.usage);

      if (completion.function_call) {
        let functionArgs = {};
        try {
          functionArgs = JSON.parse(completion.function_call.arguments);
        } catch (error) {
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

        return {
          result: null,
          functionCall: {
            name: completion.function_call.name,
            arguments: functionArgs,
          },
          cost,
        };
      }

      return { result: completion.content, cost };
    } catch (error) {
      if (error instanceof RetryError) {
        throw error;
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

    if (!(modelBase in AzureOpenAiProvider.COST_PER_TOKEN)) {
      return Number.NaN;
    }

    const costPerToken = AzureOpenAiProvider.COST_PER_TOKEN?.[modelBase];
    const inputCost = (usage.prompt_tokens / 1000) * costPerToken.input;
    const outputCost = (usage.completion_tokens / 1000) * costPerToken.output;

    return inputCost + outputCost;
  }
}

module.exports = AzureOpenAiProvider;

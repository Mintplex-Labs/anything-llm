const OpenAI = require("openai");
const { AimlApiLLM } = require("../../../AiProviders/aimlapi");
const Provider = require("./ai-provider.js");
const { RetryError } = require("../error.js");


class AimlApiProvider extends Provider {
  model;

  constructor(config = {}) {
    const { model = "gpt-3.5-turbo" } = config;
    const client = new OpenAI({
      baseURL: AimlApiLLM.BASE_URL,
      apiKey: process.env.AIML_LLM_API_KEY ?? null,
      maxRetries: 3,
      defaultHeaders: AimlApiLLM.HEADERS,
    });
    super(client);

    this.model = model;
    this.verbose = true;
  }

  async complete(messages, functions = []) {
    try {
      const response = await this.client.chat.completions.create({
        model: this.model,
        messages,
        ...(Array.isArray(functions) && functions.length > 0
          ? { functions }
          : {}),
      });

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

      return {
        result: completion.content,
        cost,
      };
    } catch (error) {
      if (error instanceof OpenAI.AuthenticationError) throw error;

      if (
        error instanceof OpenAI.RateLimitError ||
        error instanceof OpenAI.InternalServerError ||
        error instanceof OpenAI.APIError
      ) {
        throw new RetryError(error.message);
      }

      throw error;
    }
  }

  getCost(_usage) {
    return 0;
  }
}

module.exports = AimlApiProvider;

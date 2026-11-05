const AzureOpenAiProvider = require("../../../../../utils/agents/aibitat/providers/azure.js");

jest.mock("../../../../../utils/AiProviders/azureOpenAi", () => ({
  AzureOpenAiLLM: {
    formatBaseUrl: () => "https://example.openai.azure.com/openai/v1",
  },
}));

jest.mock("openai", () => {
  class AuthError extends Error {}
  class RateLimitError extends Error {}
  class InternalServerError extends Error {}
  class APIError extends Error {
    constructor(message, status) {
      super(message);
      this.status = status;
    }
  }
  const OpenAI = function OpenAI() {
    return {
      chat: { completions: { create: jest.fn() } },
      responses: { create: jest.fn() },
    };
  };
  OpenAI.AuthenticationError = AuthError;
  OpenAI.RateLimitError = RateLimitError;
  OpenAI.InternalServerError = InternalServerError;
  OpenAI.APIError = APIError;
  return { OpenAI };
});

describe("AzureOpenAiProvider Responses API fallback", () => {
  const originalKey = process.env.AZURE_OPENAI_KEY;
  const originalEndpoint = process.env.AZURE_OPENAI_ENDPOINT;
  const originalAgentApi = process.env.AZURE_OPENAI_AGENT_API;

  beforeEach(() => {
    process.env.AZURE_OPENAI_KEY = "test-key";
    process.env.AZURE_OPENAI_ENDPOINT = "https://example.openai.azure.com";
    delete process.env.AZURE_OPENAI_AGENT_API;
  });

  afterEach(() => {
    process.env.AZURE_OPENAI_KEY = originalKey;
    process.env.AZURE_OPENAI_ENDPOINT = originalEndpoint;
    if (originalAgentApi === undefined)
      delete process.env.AZURE_OPENAI_AGENT_API;
    else process.env.AZURE_OPENAI_AGENT_API = originalAgentApi;
  });

  function apiError(message, status = 400) {
    const { OpenAI } = require("openai");
    return new OpenAI.APIError(message, status);
  }

  it("retries on Responses when Chat Completions says tools need /v1/responses", async () => {
    const provider = new AzureOpenAiProvider({ model: "gpt-6-luna" });
    const chatCreate = jest
      .fn()
      .mockRejectedValueOnce(
        apiError(
          "Tool calling is only supported with the /v1/responses endpoint"
        )
      );
    const responsesCreate = jest.fn(async () => ({
      output: [
        {
          type: "function_call",
          call_id: "call_1",
          name: "select_category",
          arguments: '{"category":"legal"}',
        },
      ],
      usage: null,
    }));

    provider.client = {
      chat: { completions: { create: chatCreate } },
      responses: { create: responsesCreate },
    };
    provider.providerLog = () => {};

    const result = await provider.complete(
      [{ role: "user", content: "review this contract" }],
      [
        {
          name: "select_category",
          description: "Pick a category",
          parameters: {
            $schema: "http://json-schema.org/draft-07/schema#",
            type: "object",
            properties: { category: { type: "string" } },
            required: ["category"],
          },
        },
      ]
    );

    expect(chatCreate).toHaveBeenCalledTimes(1);
    expect(responsesCreate).toHaveBeenCalledTimes(1);
    expect(result.functionCall?.name).toBe("select_category");
    expect(result.functionCall?.arguments).toEqual({ category: "legal" });
  });

  it("retries when the 400 says function tools are not supported", async () => {
    const provider = new AzureOpenAiProvider({ model: "gpt-6-luna" });
    const chatCreate = jest
      .fn()
      .mockRejectedValueOnce(
        apiError("Function tools are not supported for this deployment")
      );
    const responsesCreate = jest.fn(async () => ({
      output: [
        {
          type: "function_call",
          call_id: "call_1",
          name: "select_category",
          arguments: '{"category":"none"}',
        },
      ],
      usage: null,
    }));

    provider.client = {
      chat: { completions: { create: chatCreate } },
      responses: { create: responsesCreate },
    };
    provider.providerLog = () => {};

    const result = await provider.complete(
      [{ role: "user", content: "hello" }],
      [
        {
          name: "select_category",
          description: "Pick a category",
          parameters: {
            type: "object",
            properties: { category: { type: "string" } },
            required: ["category"],
          },
        },
      ]
    );

    expect(responsesCreate).toHaveBeenCalledTimes(1);
    expect(result.functionCall?.arguments).toEqual({ category: "none" });
  });
});

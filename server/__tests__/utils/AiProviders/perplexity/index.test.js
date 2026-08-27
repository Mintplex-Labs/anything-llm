/* eslint-env jest */

jest.mock("openai", () => {
  const OpenAI = jest.fn().mockImplementation(() => ({
    chat: { completions: { create: jest.fn() } },
  }));
  OpenAI.OpenAI = OpenAI;
  return OpenAI;
});
jest.mock("../../../../utils/helpers/modelPricing", () => ({
  MODEL_PRICING: {},
}));

const OpenAI = require("openai");
const {
  PerplexityLLM,
} = require("../../../../utils/AiProviders/perplexity");
const PerplexityProvider = require("../../../../utils/agents/aibitat/providers/perplexity");

const ORIGINAL_ENV = process.env;

beforeEach(() => {
  process.env = { ...ORIGINAL_ENV, PERPLEXITY_API_KEY: "test-api-key" };
  OpenAI.mockClear();
});

afterAll(() => {
  process.env = ORIGINAL_ENV;
});

describe("Perplexity integration attribution", () => {
  test("adds the integration header to native chat requests", () => {
    new PerplexityLLM({});

    expect(OpenAI).toHaveBeenCalledWith(
      expect.objectContaining({
        defaultHeaders: { "X-Pplx-Integration": "anythingllm" },
      })
    );
  });

  test("adds the integration header to agent requests", () => {
    new PerplexityProvider();

    expect(OpenAI).toHaveBeenCalledWith(
      expect.objectContaining({
        defaultHeaders: { "X-Pplx-Integration": "anythingllm" },
      })
    );
  });
});

/* eslint-env jest */

const mockChatCreate = jest.fn();

jest.mock(
  "openai",
  () => ({
    OpenAI: jest.fn().mockImplementation(({ apiKey }) => ({
      chat: {
        completions: {
          create: (payload) => mockChatCreate(apiKey, payload),
        },
      },
    })),
  }),
  { virtual: true }
);
jest.mock("../../../../utils/EmbeddingEngines/native", () => ({
  NativeEmbedder: class NativeEmbedder {
    async embedTextInput() {
      return [];
    }
    async embedChunks() {
      return [];
    }
  },
}));
jest.mock("../../../../utils/helpers/chat/LLMPerformanceMonitor", () => ({
  LLMPerformanceMonitor: {
    measureAsyncFunction: async (promise) => ({
      output: await promise,
      duration: 1,
    }),
    measureStream: jest.fn(async ({ func }) => await func),
  },
}));
jest.mock("../../../../utils/helpers/chat/responses", () => ({
  formatChatHistory: jest.fn((history = []) => history),
  handleDefaultStreamResponseV2: jest.fn(),
}));
jest.mock("../../../../utils/http", () => ({
  safeJsonParse: jest.fn(() => []),
}));

describe("GeminiLLM", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    mockChatCreate.mockReset();
    process.env = {
      ...originalEnv,
      GEMINI_API_KEYS: "bad-llm,good-llm",
      GEMINI_LLM_MODEL_PREF: "gemini-2.0-flash-lite",
    };
    jest.spyOn(console, "log").mockImplementation(() => {});
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    process.env = originalEnv;
    jest.restoreAllMocks();
  });

  test("falls back to the next Gemini chat key after a retryable failure", async () => {
    mockChatCreate.mockImplementation(async (apiKey) => {
      if (apiKey === "bad-llm") {
        const error = new Error("quota exceeded");
        error.status = 429;
        throw error;
      }
      return {
        choices: [{ message: { content: "hello from fallback" } }],
        usage: { prompt_tokens: 1, completion_tokens: 2, total_tokens: 3 },
      };
    });

    const { GeminiLLM } = require("../../../../utils/AiProviders/gemini");
    const llm = new GeminiLLM({
      embedTextInput: jest.fn(),
      embedChunks: jest.fn(),
    });

    const response = await llm.getChatCompletion([{ role: "user", content: "hi" }], {
      temperature: 0.7,
    });

    expect(response.textResponse).toBe("hello from fallback");
    expect(mockChatCreate.mock.calls.map(([apiKey]) => apiKey)).toEqual([
      "bad-llm",
      "good-llm",
    ]);
    expect(process.env.GEMINI_API_KEY).toBe("good-llm");
  });
});
